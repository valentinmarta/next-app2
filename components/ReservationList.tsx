import type { Reservation } from "@/types"
import { ReservationCard } from "./ReservationCard"

interface ReservationListProps {
  reservations: Reservation[]
  onUpdate?: () => void
}

export function ReservationList({ reservations, onUpdate }: ReservationListProps) {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <h5>No hay reservas pendientes</h5>
          <p>Las nuevas reservas aparecerán aquí</p>
        </div>
      </div>
    )
  }

  return (
    <div className="row">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="col-12 mb-4">
          <ReservationCard reservation={reservation} onUpdate={onUpdate} />
        </div>
      ))}
    </div>
  )
}
