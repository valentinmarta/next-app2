"use client"

import { useState } from "react"
import { mockReservationService } from "@/lib/mock-services"
import { type Reservation, ReservationStatus } from "@/types"

interface StatusButtonProps {
  reservation: Reservation
  onUpdate?: () => void
}

export function StatusButton({ reservation, onUpdate }: StatusButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async (newStatus: ReservationStatus) => {
    setLoading(true)
    try {
      await mockReservationService.updateReservationStatus(reservation.id, newStatus)
      onUpdate?.() // Call the update callback
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getNextActions = () => {
    switch (reservation.status) {
      case ReservationStatus.PENDING:
        return [
          { status: ReservationStatus.READY_FOR_PICKUP, label: "Marcar Listo", class: "btn-info" },
          { status: ReservationStatus.CANCELLED, label: "Cancelar", class: "btn-danger" },
        ]
      case ReservationStatus.READY_FOR_PICKUP:
        return [
          { status: ReservationStatus.OUT_FOR_DELIVERY, label: "Enviar", class: "btn-primary" },
          { status: ReservationStatus.COMPLETED, label: "Completar", class: "btn-success" },
        ]
      case ReservationStatus.OUT_FOR_DELIVERY:
        return [{ status: ReservationStatus.COMPLETED, label: "Completar", class: "btn-success" }]
      default:
        return []
    }
  }

  const actions = getNextActions()

  if (actions.length === 0) {
    return <span className="text-muted">Sin acciones</span>
  }

  return (
    <div className="btn-group-vertical" role="group">
      {actions.map((action) => (
        <button
          key={action.status}
          type="button"
          className={`btn btn-sm ${action.class}`}
          onClick={() => handleStatusUpdate(action.status)}
          disabled={loading}
        >
          {loading ? "Actualizando..." : action.label}
        </button>
      ))}
    </div>
  )
}
