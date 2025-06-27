// components/ReservationCard.tsx
"use client";

import { useState } from "react";
// 1. Importamos useRouter para poder refrescar la página
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/actions/reservations";
import type { Order, OrderItem, Product } from "@prisma/client";

type OrderWithDetails = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

// 2. Ya no necesitamos la prop onUpdate
interface ReservationCardProps {
  reservation: OrderWithDetails;
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // 3. Inicializamos el router
  const router = useRouter();

  const DELIVERY_FEE = 5.00;

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const result = await updateOrderStatus(reservation.id, newStatus);
      if (result.success) {
        // 4. Si la actualización fue exitosa, refrescamos los datos de la ruta
        router.refresh();
      } else {
        alert(result.error || "No se pudo actualizar el estado.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // --- El resto de tus funciones de ayuda y el JSX siguen exactamente igual ---

  const getStatusBadge = (status: string) => {
    const badges: { [key: string]: string } = {
      PENDING: "bg-warning text-dark",
      PREPARING: "bg-info",
      COMPLETED: "bg-success",
      CANCELLED: "bg-danger",
      READY_FOR_PICKUP: "bg-success",
      OUT_FOR_DELIVERY: "bg-primary",
    };
    return badges[status] || "bg-secondary";
  };

  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      PENDING: "Pendiente",
      PREPARING: "Preparando",
      COMPLETED: "Completado",
      CANCELLED: "Cancelado",
      READY_FOR_PICKUP: "Listo para Retirar",
      OUT_FOR_DELIVERY: "En Camino",
    };
    return texts[status] || status;
  };

  const getAvailableActions = () => {
    const actions = [];
    switch (reservation.status) {
      case "PENDING":
        actions.push({ status: "PREPARING", label: "Comenzar preparación", class: "btn-info", icon: "🍳" });
        actions.push({ status: "CANCELLED", label: "Cancelar pedido", class: "btn-danger", icon: "❌" });
        break;
      case "PREPARING":
        if (reservation.deliveryType === "pickup") {
          actions.push({ status: "READY_FOR_PICKUP", label: "Listo para retirar", class: "btn-success", icon: "✅" });
        } else {
          actions.push({ status: "OUT_FOR_DELIVERY", label: "Enviar a domicilio", class: "btn-primary", icon: "🚚" });
        }
        break;
      case "READY_FOR_PICKUP":
      case "OUT_FOR_DELIVERY":
        actions.push({ status: "COMPLETED", label: "Marcar como entregado", class: "btn-success", icon: "✅" });
        break;
    }
    return actions;
  };

  const actions = getAvailableActions();

  return (
    <div className="card shadow-sm mb-3">
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
              Pedido #{reservation.id.slice(-6)} - {new Date(reservation.createdAt).toLocaleString("es-ES")}
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
              <p className="mb-1"><strong>Email:</strong> {reservation.customerEmail}</p>
              <p className="mb-1"><strong>Teléfono:</strong> {reservation.customerPhone}</p>
              <p className="mb-1">
                <strong>Tipo de entrega:</strong>
                <span className={`badge ms-1 ${reservation.deliveryType === "delivery" ? "bg-primary" : "bg-info"}`}>
                  {reservation.deliveryType === "delivery" ? "Envío a domicilio" : "Retiro en local"}
                </span>
              </p>
              {reservation.address && (
                <p className="mb-1"><strong>Dirección:</strong> {reservation.address}</p>
              )}
            </div>

            {/* Order Details */}
            <div className="col-md-6 mb-3">
              <h6 className="text-danger">Detalles del Pedido</h6>
              {reservation.items.map((item) => (
                <div key={item.id} className="d-flex justify-content-between mb-1">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {reservation.deliveryType === "delivery" && (
                <div className="d-flex justify-content-between mb-1">
                  <span>Costo de envío</span>
                  <span>${DELIVERY_FEE.toFixed(2)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>${reservation.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {reservation.comments && (
            <div className="mb-3">
              <h6 className="text-danger">Comentarios</h6>
              <p className="text-muted">{reservation.comments}</p>
            </div>
          )}

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
  );
}
