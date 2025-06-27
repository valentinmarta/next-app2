// components/ReservationList.tsx

// 1. Importamos el tipo real de la orden, no el 'Reservation' genérico
import type { Order, OrderItem, Product } from "@prisma/client";
import { ReservationCard } from "./ReservationCard";

type OrderWithDetails = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

// 2. Quitamos 'onUpdate' de las props
interface ReservationListProps {
  reservations: OrderWithDetails[];
}

export function ReservationList({ reservations }: ReservationListProps) {
  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <h5>No hay reservas pendientes</h5>
          <p>Las nuevas reservas aparecerán aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vstack gap-3">
      {reservations.map((reservation) => (
        // 3. Ya no pasamos la prop 'onUpdate'
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </div>
  );
}
