"use client"

import type React from "react"
import { useState } from "react"
import { createReservation } from "@/app/actions/reservations"
import type { Pizza, PizzaSelection } from "@/types"

interface ReservationModalProps {
  pizzas: Pizza[]
}

export function ReservationModal({ pizzas }: ReservationModalProps) {
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup")
  const [address, setAddress] = useState("")
  const [selectedPizzas, setSelectedPizzas] = useState<PizzaSelection[]>([])
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const DELIVERY_FEE = 5.0

  const addPizza = (pizza: Pizza) => {
    const existingIndex = selectedPizzas.findIndex((item) => item.pizza.id === pizza.id)
    if (existingIndex >= 0) {
      const updated = [...selectedPizzas]
      updated[existingIndex].quantity += 1
      setSelectedPizzas(updated)
    } else {
      setSelectedPizzas([...selectedPizzas, { pizza, quantity: 1 }])
    }
  }

  const removePizza = (pizzaId: string) => {
    setSelectedPizzas(selectedPizzas.filter((item) => item.pizza.id !== pizzaId))
  }

  const updateQuantity = (pizzaId: string, quantity: number) => {
    if (quantity <= 0) {
      removePizza(pizzaId)
      return
    }

    const updated = selectedPizzas.map((item) => (item.pizza.id === pizzaId ? { ...item, quantity } : item))
    setSelectedPizzas(updated)
  }

  const calculateTotal = () => {
    const pizzasTotal = selectedPizzas.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0)
    const deliveryFee = deliveryType === "delivery" ? DELIVERY_FEE : 0
    return pizzasTotal + deliveryFee
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!customerName.trim()) newErrors.customerName = "El nombre es obligatorio"
    if (!customerEmail.trim()) newErrors.customerEmail = "El email es obligatorio"
    if (!customerPhone.trim()) newErrors.customerPhone = "El teléfono es obligatorio"
    if (deliveryType === "delivery" && !address.trim())
      newErrors.address = "La dirección es obligatoria para envío a domicilio"
    if (selectedPizzas.length === 0) newErrors.pizzas = "Debes seleccionar al menos una pizza"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)
    setMessage("")

    try {
      const result = await createReservation({
        customerName,
        customerEmail,
        customerPhone,
        deliveryType,
        address: deliveryType === "delivery" ? address : undefined,
        pizzas: selectedPizzas,
        comments: comments || undefined,
      })

      if (result.success) {
        setMessage("¡Reserva creada exitosamente! Te hemos enviado un email de confirmación.")
        // Reset form
        setCustomerName("")
        setCustomerEmail("")
        setCustomerPhone("")
        setDeliveryType("pickup")
        setAddress("")
        setSelectedPizzas([])
        setComments("")
        setErrors({})
      } else {
        setMessage(result.error || "Error al crear la reserva")
      }
    } catch (error) {
      setMessage("Error al crear la reserva")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal fade" id="reservationModal" tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Hacer Reserva</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {message && (
                <div className={`alert ${message.includes("exitosamente") ? "alert-success" : "alert-danger"}`}>
                  {message}
                </div>
              )}

              {/* Customer Information */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="text-danger mb-3">Información del Cliente</h6>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerName" className="form-label">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerEmail" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.customerEmail ? "is-invalid" : ""}`}
                    id="customerEmail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                  {errors.customerEmail && <div className="invalid-feedback">{errors.customerEmail}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerPhone" className="form-label">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${errors.customerPhone ? "is-invalid" : ""}`}
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                  {errors.customerPhone && <div className="invalid-feedback">{errors.customerPhone}</div>}
                </div>
              </div>

              {/* Delivery Type */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="text-danger mb-3">Tipo de Entrega *</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="deliveryType"
                          id="pickup"
                          value="pickup"
                          checked={deliveryType === "pickup"}
                          onChange={(e) => setDeliveryType(e.target.value as "pickup" | "delivery")}
                        />
                        <label className="form-check-label" htmlFor="pickup">
                          Retiro en el local
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="deliveryType"
                          id="delivery"
                          value="delivery"
                          checked={deliveryType === "delivery"}
                          onChange={(e) => setDeliveryType(e.target.value as "pickup" | "delivery")}
                        />
                        <label className="form-check-label" htmlFor="delivery">
                          Envío a domicilio (+$5.00)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address (only if delivery) */}
              {deliveryType === "delivery" && (
                <div className="mb-4">
                  <label htmlFor="address" className="form-label">
                    Dirección de Entrega *
                  </label>
                  <textarea
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    id="address"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ingresa tu dirección completa"
                  ></textarea>
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
              )}

              {/* Pizza Selection */}
              <div className="mb-4">
                <h6 className="text-danger mb-3">Selección de Pizzas *</h6>
                {errors.pizzas && <div className="alert alert-danger">{errors.pizzas}</div>}

                <div className="row mb-3">
                  {pizzas
                    .filter((pizza) => pizza.available)
                    .map((pizza) => (
                      <div key={pizza.id} className="col-md-6 col-lg-4 mb-2">
                        <div className="card h-100">
                          <div className="card-body p-2">
                            <h6 className="card-title">{pizza.name}</h6>
                            <p className="card-text small">${pizza.price}</p>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => addPizza(pizza)}
                            >
                              Agregar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Selected Pizzas */}
                {selectedPizzas.length > 0 && (
                  <div className="border rounded p-3 bg-light">
                    <h6>Pizzas Seleccionadas:</h6>
                    {selectedPizzas.map((item) => (
                      <div key={item.pizza.id} className="d-flex justify-content-between align-items-center mb-2">
                        <span>
                          {item.pizza.name} - ${item.pizza.price}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(item.pizza.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => updateQuantity(item.pizza.id, item.quantity + 1)}
                          >
                            +
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={() => removePizza(item.pizza.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments */}
              <div className="mb-4">
                <label htmlFor="comments" className="form-label">
                  Comentarios (opcional)
                </label>
                <textarea
                  className="form-control"
                  id="comments"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Ej: sin aceitunas, extra queso, etc."
                ></textarea>
              </div>

              {/* Total */}
              {selectedPizzas.length > 0 && (
                <div className="alert alert-info">
                  <div className="d-flex justify-content-between">
                    <span>Subtotal pizzas:</span>
                    <span>
                      ${selectedPizzas.reduce((sum, item) => sum + item.pizza.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                  {deliveryType === "delivery" && (
                    <div className="d-flex justify-content-between">
                      <span>Costo de envío:</span>
                      <span>${DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? "Creando..." : "Confirmar Reserva"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
