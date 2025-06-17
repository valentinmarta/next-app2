import type { Pizza } from "@/types"

export const MOCK_PIZZAS: Pizza[] = [
  {
    id: "1",
    name: "Margherita",
    description: "Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: "2",
    name: "Pepperoni",
    description: "Salsa de tomate, mozzarella y pepperoni",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: "3",
    name: "Hawaiana",
    description: "Salsa de tomate, mozzarella, jamón y piña",
    price: 15.99,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: "4",
    name: "Cuatro Quesos",
    description: "Mozzarella, parmesano, gorgonzola y ricotta",
    price: 16.99,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: "5",
    name: "Vegetariana",
    description: "Salsa de tomate, mozzarella, pimientos, cebolla, champiñones y aceitunas",
    price: 13.99,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
  {
    id: "6",
    name: "Carnívora",
    description: "Salsa de tomate, mozzarella, pepperoni, salchicha, jamón y tocino",
    price: 18.99,
    image: "/placeholder.svg?height=200&width=300",
    available: true,
  },
]

// Mock admin user
export const MOCK_ADMIN = {
  email: "admin@pizzeria.com",
  password: "admin123",
  name: "Admin",
  role: "admin",
}
