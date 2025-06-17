export interface Pizza {
  id: string
  name: string
  description: string
  price: number
  image: string
  available: boolean
}

export interface PizzaSelection {
  pizza: Pizza
  quantity: number
}

export interface Reservation {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryType: "pickup" | "delivery"
  address?: string
  pizzas: PizzaSelection[]
  total: number
  comments?: string
  reservationTime: Date
  status: ReservationStatus
  createdAt: Date
  updatedAt: Date
}

export enum ReservationStatus {
  PENDING = "PENDING",
  PREPARING = "PREPARING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface CreateReservationData {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryType: "pickup" | "delivery"
  address?: string
  pizzas: PizzaSelection[]
  comments?: string
}
