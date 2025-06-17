"use client"

import { useState } from "react"
import { mockReservationService } from "@/lib/mock-services"
import { type Reservation, ReservationStatus } from "@/types"

interface ReservationCardProps {
  reservation: Reservation
  onUpdate?: () => void
}

export function ReservationCard({ reservation, onUpdate }: ReservationCardProps) {
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleStatusUpdate = async (newStatus: ReservationStatus) => {
    setLoading(true)
    try {
      await mockReservationService.updateReservationStatus(reservation.id, newStatus)
      onUpdate?.()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: "bg-warning text-dark",
      PREPARING: "bg-info",
      READY_FOR_PICKUP: "bg-success",
      OUT_FOR_DELIVERY: "bg-primary",
      COMPLETED: "bg-success",
      CANCELLED: "bg-danger",
    }
    return badges[status as keyof typeof badges] || "bg-secondary"
  }

  const getStatusText = (status: string) => {
    const texts = {
      PENDING: "Pendiente",
      PREPARING: "Preparando",
      READY_FOR_PICKUP: "Listo para retirar",
      OUT_FOR_DELIVERY: "En camino",
      COMPLETED: "Completado",
      CANCELLED: "Cancelado",
    }
    return texts[status as keyof typeof texts] || status
  }

  const getAvailableActions = () => {
    const actions = []

    switch (reservation.status) {
      case ReservationStatus.PENDING:
        actions.push({
          status: ReservationStatus.PREPARING,
          label: "Comenzar preparación",
          class: "btn-info",
          icon: "🍳",
        })
        actions.push({
          status: ReservationStatus.CANCELLED,
          label: "Cancelar pedido",
          class: "btn-danger",
          icon: "❌",
        })
        break

      case ReservationStatus.PREPARING:
        if (reservation.deliveryType === "pickup") {
          actions.push({
            status: ReservationStatus.READY_FOR_PICKUP,
            label: "Listo para retirar",
            class: "btn-success",
            icon: "✅",
          })
        } else {
          actions.push({
            status: ReservationStatus.OUT_FOR_DELIVERY,
            label: "Enviar a domicilio",
            class: "btn-primary",
            icon: "🚚",
          })
        }
        break

      case ReservationStatus.READY_FOR_PICKUP:
        actions.push({
          status: ReservationStatus.COMPLETED,
          label: "Marcar como entregado",
          class: "btn-success",
          icon: "✅",
        })
        break

      case ReservationStatus.OUT_FOR_DELIVERY:
        actions.push({
          status: ReservationStatus.COMPLETED,
          label: "Marcar como entregado",
          class: "btn-success",
          icon: "✅",
        })
        break
    }

    return actions
  }

  const actions = getAvailableActions()

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">
              <strong>{reservation.customerName}</strong>
              <span className={`badge ms-2 ${getStatusBadge(reservation.status)}`}>
                {getStatusText(reservation.status)}
              </span>
            </h6>
            <small className="text-muted">
              Pedido #{reservation.id} - {new Date(reservation.createdAt).toLocaleString("es-ES")}
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold text-success">${reservation.total.toFixed(2)}</span>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Ocultar" : "Ver detalles"}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="card-body">
          <div className="row">
            {/* Customer Info */}
            <div className="col-md-6 mb-3">
              <h6 className="text-danger">Información del Cliente</h6>
              <p className="mb-1">
                <strong>Email:</strong> {reservation.customerEmail}
              </p>
              <p className="mb-1">
                <strong>Teléfono:</strong> {reservation.customerPhone}
              </p>
              <p className="mb-1">
                <strong>Tipo de entrega:</strong>
                <span className={`badge ms-1 ${reservation.deliveryType === "delivery" ? "bg-primary" : "bg-info"}`}>
                  {reservation.deliveryType === "delivery" ? "Envío a domicilio" : "Retiro en local"}
                </span>
              </p>
              {reservation.address && (
                <p className="mb-1">
                  <strong>Dirección:</strong> {reservation.address}
                </p>
              )}
            </div>

            {/* Order Details */}
            <div className="col-md-6 mb-3">
              <h6 className="text-danger">Detalles del Pedido</h6>
              {reservation.pizzas.map((item, index) => (
                <div key={index} className="d-flex justify-content-between mb-1">
                  <span>
                    {item.quantity}x {item.pizza.name}
                  </span>
                  <span>${(item.pizza.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {reservation.deliveryType === "delivery" && (
                <div className="d-flex justify-content-between mb-1">
                  <span>Costo de envío</span>
                  <span>$5.00</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${reservation.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          {reservation.comments && (
            <div className="mb-3">
              <h6 className="text-danger">Comentarios</h6>
              <p className="text-muted">{reservation.comments}</p>
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && (
            <div className="border-top pt-3">
              <h6 className="text-danger mb-3">Acciones</h6>
              <div className="d-flex flex-wrap gap-2">
                {actions.map((action) => (
                  <button
                    key={action.status}
                    type="button"
                    className={`btn ${action.class}`}
                    onClick={() => handleStatusUpdate(action.status)}
                    disabled={loading}
                  >
                    {action.icon} {loading ? "Actualizando..." : action.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
