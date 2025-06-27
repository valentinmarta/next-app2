// components/ReservationModal.tsx
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { createReservation } from "@/app/actions/reservations";
import type { Product } from "@prisma/client";

// Estructura para un item en el carrito
interface CartItem {
  product: Product;
  quantity: number;
}

// Props que espera el componente
interface ReservationModalProps {
  pizzas: Product[];
}

export function ReservationModal({ pizzas = [] }: ReservationModalProps) {
  // --- ESTADOS DEL FORMULARIO ---
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [comments, setComments] = useState("");
  
  // Estados para la UI
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const DELIVERY_FEE = 5.0;

  // --- LÓGICA DEL CARRITO ---
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } // No se puede pedir más que el stock
            : item
        );
      }
      if (product.stock > 0) {
        return [...prevCart, { product, quantity: 1 }];
      }
      return prevCart; // No añadir si no hay stock
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const productInCart = cart.find(item => item.product.id === productId)?.product;
    if (!productInCart) return;

    if (newQuantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.min(newQuantity, productInCart.stock) } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    const subTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return deliveryType === "delivery" ? subTotal + DELIVERY_FEE : subTotal;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = "El nombre es obligatorio";
    if (!customerEmail.trim() || !/\S+@\S+\.\S+/.test(customerEmail)) newErrors.customerEmail = "El email no es válido";
    if (!customerPhone.trim()) newErrors.customerPhone = "El teléfono es obligatorio";
    if (deliveryType === "delivery" && !address.trim()) newErrors.address = "La dirección es obligatoria";
    if (cart.length === 0) newErrors.pizzas = "Debes seleccionar al menos un producto";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setDeliveryType("pickup");
    setAddress("");
    setCart([]);
    setComments("");
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMessage("");
    const result = await createReservation({
      customerName,
      customerEmail,
      customerPhone,
      deliveryType,
      address: deliveryType === "delivery" ? address : undefined,
      cart,
      comments: comments || undefined,
    });
    if (result.success) {
      setMessage("¡Reserva creada exitosamente!");
      resetForm();
    } else {
      setMessage(result.error || "Error al crear la reserva");
    }
    setLoading(false);
  };

  return (
    <div className="modal fade" id="reservationModal" tabIndex={-1} aria-labelledby="reservationModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title" id="reservationModalLabel">Hacer Reserva</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {message && (
                <div className={`alert ${message.includes("exitosamente") ? "alert-success" : "alert-danger"}`}>{message}</div>
              )}

              {/* === SECCIÓN DE INFORMACIÓN DEL CLIENTE === */}
              <h6 className="text-danger mb-3">Información del Cliente</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerName" className="form-label">Nombre Completo *</label>
                  <input type="text" className={`form-control ${errors.customerName ? "is-invalid" : ""}`} id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                  {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="customerEmail" className="form-label">Email *</label>
                  <input type="email" className={`form-control ${errors.customerEmail ? "is-invalid" : ""}`} id="customerEmail" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                  {errors.customerEmail && <div className="invalid-feedback">{errors.customerEmail}</div>}
                </div>
                <div className="col-md-12 mb-3">
                  <label htmlFor="customerPhone" className="form-label">Teléfono *</label>
                  <input type="tel" className={`form-control ${errors.customerPhone ? "is-invalid" : ""}`} id="customerPhone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                  {errors.customerPhone && <div className="invalid-feedback">{errors.customerPhone}</div>}
                </div>
              </div>

              {/* === SECCIÓN TIPO DE ENTREGA === */}
              <h6 className="text-danger mb-3">Tipo de Entrega *</h6>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="deliveryType" id="pickup" value="pickup" checked={deliveryType === "pickup"} onChange={(e) => setDeliveryType(e.target.value as "pickup" | "delivery")} />
                    <label className="form-check-label" htmlFor="pickup">Retiro en el local</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="deliveryType" id="delivery" value="delivery" checked={deliveryType === "delivery"} onChange={(e) => setDeliveryType(e.target.value as "pickup" | "delivery")} />
                    <label className="form-check-label" htmlFor="delivery">Envío a domicilio (+$5.00)</label>
                  </div>
                </div>
              </div>
              {deliveryType === "delivery" && (
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Dirección de Entrega *</label>
                  <textarea className={`form-control ${errors.address ? "is-invalid" : ""}`} id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2}></textarea>
                  {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>
              )}

              {/* === SECCIÓN DE SELECCIÓN DE PRODUCTOS === */}
              <h6 className="text-danger mb-3">Selección de Pizzas *</h6>
              {errors.pizzas && <div className="alert alert-danger p-2">{errors.pizzas}</div>}
              <div className="row mb-3">
                {pizzas.map((product) => (
                  <div key={product.id} className="col-md-6 col-lg-4 mb-2">
                    <div className="card h-100">
                      <div className="card-body p-2 text-center">
                        <h6 className="card-title mb-1">{product.name}</h6>
                        <p className="card-text small text-muted">${product.price.toFixed(2)}</p>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                          {product.stock === 0 ? "Sin Stock" : "Agregar"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* === SECCIÓN DEL CARRITO (LO QUE FALTABA) === */}
              {cart.length > 0 && (
                <div className="mb-3 border rounded p-3 bg-light">
                  <h6>Tu Pedido:</h6>
                  {cart.map((item) => (
                    <div key={item.product.id} className="d-flex justify-content-between align-items-center mb-2">
                      <span>{item.product.name}</span>
                      <div className="d-flex align-items-center gap-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  ))}
                  <hr/>
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* === SECCIÓN DE COMENTARIOS === */}
              <div className="mb-3">
                <label htmlFor="comments" className="form-label">Comentarios (opcional)</label>
                <textarea className="form-control" id="comments" rows={2} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Ej: sin aceitunas, etc."></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" className="btn btn-danger" disabled={loading || cart.length === 0}>
                {loading ? "Procesando..." : "Confirmar Reserva"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
