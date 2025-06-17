import type { CreateReservationData, Pizza, Reservation } from "@/types"
import { ReservationStatus } from "@/types"
import { MOCK_PIZZAS } from "./mock-data"
import { localStorageService } from "./local-storage"

// Initialize pizzas in localStorage if not already there
if (typeof window !== "undefined") {
  localStorageService.initializePizzas(MOCK_PIZZAS)
}

const DELIVERY_FEE = 5.0

export const mockEmailService = {
  sendReservationConfirmation: async (reservation: Reservation) => {
    const pizzasList = reservation.pizzas
      .map((item) => `${item.quantity}x ${item.pizza.name} ($${item.pizza.price})`)
      .join(", ")

    console.log("📧 Email de confirmación enviado:", {
      to: reservation.customerEmail,
      customer: reservation.customerName,
      pizzas: pizzasList,
      total: reservation.total,
      deliveryType: reservation.deliveryType,
      time: reservation.reservationTime,
    })

    if (typeof window !== "undefined") {
      alert(
        `✅ Reserva confirmada para ${reservation.customerName}\nPizzas: ${pizzasList}\nTotal: $${reservation.total}`,
      )
    }
  },

  sendStatusUpdate: async (reservation: Reservation, status: string, message: string) => {
    console.log("📧 Email de actualización enviado:", {
      to: reservation.customerEmail,
      customer: reservation.customerName,
      status: message,
      orderId: reservation.id,
    })

    if (typeof window !== "undefined") {
      alert(`📬 ${message} - Email enviado a ${reservation.customerEmail}`)
    }
  },
}

export const mockReservationService = {
  createReservation: async (
    data: CreateReservationData,
  ): Promise<{ success: boolean; reservation?: Reservation; error?: string }> => {
    try {
      // Calculate total
      const pizzasTotal = data.pizzas.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0)
      const deliveryFee = data.deliveryType === "delivery" ? DELIVERY_FEE : 0
      const total = pizzasTotal + deliveryFee

      const reservation: Reservation = {
        id: Date.now().toString(),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        deliveryType: data.deliveryType,
        address: data.address,
        pizzas: data.pizzas,
        total,
        comments: data.comments,
        reservationTime: new Date(),
        status: ReservationStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save to localStorage
      localStorageService.saveReservation(reservation)

      // Send confirmation email (mock)
      await mockEmailService.sendReservationConfirmation(reservation)

      return { success: true, reservation }
    } catch (error) {
      console.error("Error creating reservation:", error)
      return { success: false, error: "Error al crear la reserva" }
    }
  },

  updateReservationStatus: async (
    reservationId: string,
    status: ReservationStatus,
  ): Promise<{ success: boolean; reservation?: Reservation; error?: string }> => {
    try {
      const reservations = localStorageService.getReservations()
      const reservation = reservations.find((r) => r.id === reservationId)

      if (!reservation) {
        return { success: false, error: "Reserva no encontrada" }
      }

      // Update reservation
      localStorageService.updateReservation(reservationId, { status, updatedAt: new Date() })

      // Get updated reservation
      const updatedReservations = localStorageService.getReservations()
      const updatedReservation = updatedReservations.find((r) => r.id === reservationId)!

      // Send status update email (mock)
      const statusMessages = {
        PREPARING: "Tu pedido está siendo preparado",
        READY_FOR_PICKUP: "Tu pedido está listo para retirar",
        OUT_FOR_DELIVERY: "Tu pedido está en camino",
        CANCELLED: "Tu pedido ha sido cancelado",
      }

      const message = statusMessages[status as keyof typeof statusMessages]
      if (message) {
        await mockEmailService.sendStatusUpdate(updatedReservation, status, message)
      }

      return { success: true, reservation: updatedReservation }
    } catch (error) {
      console.error("Error updating reservation status:", error)
      return { success: false, error: "Error al actualizar el estado" }
    }
  },

  getReservations: (): Reservation[] => {
    return localStorageService.getReservations().filter((r) => r.status !== ReservationStatus.COMPLETED)
  },
}

export const mockPizzaService = {
  getPizzas: (): Pizza[] => {
    if (typeof window === "undefined") {
      return MOCK_PIZZAS
    }

    // Initialize pizzas if localStorage is empty
    const stored = localStorageService.getPizzas()
    if (stored.length === 0) {
      localStorageService.initializePizzas(MOCK_PIZZAS)
      return MOCK_PIZZAS
    }

    return stored
  },

  getPizza: (id: string): Pizza | undefined => {
    const pizzas = this.getPizzas()
    return pizzas.find((p) => p.id === id)
  },

  createPizza: (pizza: Omit<Pizza, "id">): Pizza => {
    const newPizza = {
      ...pizza,
      id: Date.now().toString(),
    }
    localStorageService.savePizza(newPizza)
    return newPizza
  },

  updatePizza: (id: string, updates: Partial<Pizza>): Pizza | undefined => {
    const pizzas = localStorageService.getPizzas()
    const pizza = pizzas.find((p) => p.id === id)

    if (!pizza) return undefined

    const updatedPizza = { ...pizza, ...updates }
    localStorageService.updatePizza(id, updates)
    return updatedPizza
  },

  deletePizza: (id: string): boolean => {
    const pizzas = localStorageService.getPizzas()
    const pizzaExists = pizzas.some((p) => p.id === id)

    if (!pizzaExists) return false

    localStorageService.deletePizza(id)
    return true
  },
}
