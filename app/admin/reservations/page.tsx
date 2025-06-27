// app/admin/reservations/page.tsx
import prisma from "@/lib/prisma";
import { ReservationList } from "@/components/ReservationList";

export const dynamic = "force-dynamic"; // Asegura que la página siempre obtenga los datos más frescos

export default async function AdminReservationsPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-danger mb-0">Gestión de Reservas</h1>
      </div>
      <p className="text-muted">
        Aquí puedes ver y gestionar todos los pedidos recibidos.
      </p>
      
      <ReservationList reservations={orders} />
    </div>
  );
}
