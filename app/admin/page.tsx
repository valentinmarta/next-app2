"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { mockAuthService } from "@/config/auth"
import { mockReservationService } from "@/lib/mock-services"
import { ReservationList } from "@/components/ReservationList"
import { AdminHeader } from "@/components/AdminHeader"
import type { Reservation } from "@/types"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = mockAuthService.getSession()
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login")
      return
    }

    setUser(currentUser)
    loadReservations()
  }, [router])

  const loadReservations = () => {
    const reservations = mockReservationService.getReservations()
    setReservations(reservations)
    setLoading(false)
  }

  const handleReservationUpdate = () => {
    loadReservations() // Reload reservations after update
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
              <h2>Panel de Administración</h2>
              <span className="badge bg-primary fs-6">{reservations.length} reservas pendientes</span>
            </div>

            <div className="card shadow-sm">
              <div className="card-header bg-danger text-white">
                <h5 className="mb-0">Reservas Activas</h5>
              </div>
              <div className="card-body">
                <ReservationList reservations={reservations} onUpdate={handleReservationUpdate} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
