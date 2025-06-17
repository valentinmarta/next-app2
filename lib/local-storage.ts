import type { Pizza, Reservation } from "@/types"

const RESERVATIONS_KEY = "pizzeria_reservations"
const AUTH_KEY = "pizzeria_auth"
const PIZZAS_KEY = "pizzeria_pizzas"

export const localStorageService = {
  // Reservations
  getReservations(): Reservation[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(RESERVATIONS_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveReservation(reservation: Reservation): void {
    if (typeof window === "undefined") return
    const reservations = this.getReservations()
    reservations.push(reservation)
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations))
  },

  updateReservation(id: string, updates: Partial<Reservation>): void {
    if (typeof window === "undefined") return
    const reservations = this.getReservations()
    const index = reservations.findIndex((r) => r.id === id)
    if (index !== -1) {
      reservations[index] = { ...reservations[index], ...updates }
      localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations))
    }
  },

  // Pizzas
  getPizzas(): Pizza[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(PIZZAS_KEY)
    return stored ? JSON.parse(stored) : []
  },

  initializePizzas(initialPizzas: Pizza[]): void {
    if (typeof window === "undefined") return
    // Only initialize if no pizzas exist yet
    if (!localStorage.getItem(PIZZAS_KEY)) {
      localStorage.setItem(PIZZAS_KEY, JSON.stringify(initialPizzas))
    }
  },

  savePizza(pizza: Pizza): void {
    if (typeof window === "undefined") return
    const pizzas = this.getPizzas()
    pizzas.push(pizza)
    localStorage.setItem(PIZZAS_KEY, JSON.stringify(pizzas))
  },

  updatePizza(id: string, updates: Partial<Pizza>): void {
    if (typeof window === "undefined") return
    const pizzas = this.getPizzas()
    const index = pizzas.findIndex((p) => p.id === id)
    if (index !== -1) {
      pizzas[index] = { ...pizzas[index], ...updates }
      localStorage.setItem(PIZZAS_KEY, JSON.stringify(pizzas))
    }
  },

  deletePizza(id: string): void {
    if (typeof window === "undefined") return
    const pizzas = this.getPizzas()
    const filteredPizzas = pizzas.filter((p) => p.id !== id)
    localStorage.setItem(PIZZAS_KEY, JSON.stringify(filteredPizzas))
  },

  // Auth
  setAuth(user: any): void {
    if (typeof window === "undefined") return
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  },

  getAuth(): any {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(AUTH_KEY)
    return stored ? JSON.parse(stored) : null
  },

  clearAuth(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(AUTH_KEY)
  },
}
