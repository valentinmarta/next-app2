// app/actions/reservations.ts
"use server";

import prisma from "@/lib/prisma";
// Asegúrate de que PrismaClient esté importado aquí
import type { Product, PrismaClient } from "@prisma/client";

// Definimos la estructura de un item en el carrito
interface CartItem {
  product: Product;
  quantity: number;
}

// Definimos la estructura de los datos que recibiremos del formulario
interface ReservationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: "pickup" | "delivery";
  address?: string;
  comments?: string;
  cart: CartItem[];
}

const DELIVERY_FEE = 5.00;

export async function createReservation(data: ReservationData) {
  try {
    // 1. Calcular el total en el servidor (más seguro)
    const subTotal = data.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const total = data.deliveryType === "delivery" ? subTotal + DELIVERY_FEE : subTotal;

    // 2. Usar una transacción de Prisma para asegurar la integridad de los datos
    const newOrder = await prisma.$transaction(async (tx: PrismaClient) => {
      // a) Creamos la orden principal
      const order = await tx.order.create({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          deliveryType: data.deliveryType,
          address: data.address,
          comments: data.comments,
          total: total,
          // b) Creamos los items del pedido y los conectamos a la orden
          items: {
            create: data.cart.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
            })),
          },
        },
      });

      // c) (Recomendado) Actualizamos el stock de cada producto
      for (const item of data.cart) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    // Si todo va bien, devolvemos éxito
    return { success: true, order: newOrder };

  } catch (error) {
    console.error("Error al crear la reserva:", error);
    return { success: false, error: "No se pudo crear la reserva. Inténtalo de nuevo." };
  }
}

// =======================================================
// NUEVA FUNCIÓN AÑADIDA
// =======================================================
/**
 * Actualiza el estado de una orden en la base de datos.
 * @param orderId El ID de la orden a actualizar.
 * @param newStatus El nuevo estado para la orden.
 */
export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    // Aquí se podría añadir una validación de seguridad para asegurar que solo un admin puede llamar a esta función.
    // Por ahora, confiamos en que la página que la llama ya está protegida.

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus,
      },
    });
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error al actualizar el estado de la orden:", error);
    return { success: false, error: "No se pudo actualizar el estado." };
  }
}
