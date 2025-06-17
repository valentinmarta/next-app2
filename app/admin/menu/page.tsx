"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { mockAuthService } from "@/config/auth"
import { mockPizzaService } from "@/lib/mock-services"
import { AdminHeader } from "@/components/AdminHeader"
import { PizzaList } from "@/components/PizzaList"
import { PizzaForm } from "@/components/PizzaForm"
import type { Pizza } from "@/types"

export default function AdminMenuPage() {
  const [user, setUser] = useState<any>(null)
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = mockAuthService.getSession()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadPizzas()
  }, [router])

  const loadPizzas = () => {
    try {
      const allPizzas = mockPizzaService.getPizzas()
      setPizzas(allPizzas)
    } catch (error) {
      console.error("Error loading pizzas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setEditingPizza(null)
    setShowForm(true)
  }

  const handleEdit = (pizza: Pizza) => {
    setEditingPizza(pizza)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta pizza?")) {
      const success = mockPizzaService.deletePizza(id)
      if (success) {
        loadPizzas()
        alert("Pizza eliminada correctamente")
      } else {
        alert("Error al eliminar la pizza")
      }
    }
  }

  const handleSave = (pizzaData: Pizza | Omit<Pizza, "id">) => {
    try {
      if ("id" in pizzaData) {
        // Update existing pizza
        const updated = mockPizzaService.updatePizza(pizzaData.id, pizzaData)
        if (updated) {
          alert("Pizza actualizada correctamente")
        } else {
          alert("Error al actualizar la pizza")
          return
        }
      } else {
        // Create new pizza
        mockPizzaService.createPizza(pizzaData)
        alert("Pizza creada correctamente")
      }

      setShowForm(false)
      setEditingPizza(null)
      loadPizzas()
    } catch (error) {
      console.error("Error saving pizza:", error)
      alert("Error al guardar la pizza")
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPizza(null)
  }

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-vh-100 bg-light">
      <AdminHeader user={user} />

      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Gestión del Menú</h2>
              {!showForm && (
                <button className="btn btn-success" onClick={handleAddNew}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Agregar Nueva Pizza
                </button>
              )}
            </div>

            {showForm ? (
              <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">{editingPizza ? "Editar Pizza" : "Agregar Nueva Pizza"}</h5>
                </div>
                <div className="card-body">
                  <PizzaForm pizza={editingPizza} onSave={handleSave} onCancel={handleCancel} />
                </div>
              </div>
            ) : (
              <div className="card shadow-sm">
                <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Menú Actual</h5>
                  <span className="badge bg-light text-dark">{pizzas.length} pizzas</span>
                </div>
                <div className="card-body">
                  <PizzaList pizzas={pizzas} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
