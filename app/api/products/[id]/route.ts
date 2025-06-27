// app/api/products/[id]/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Función para manejar peticiones PATCH (actualizaciones parciales)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const id = params.id;
  // Ahora el cuerpo puede tener CUALQUIER campo del producto
  const body = await request.json(); 
  // === INICIA LA VALIDACIÓN ===
  // Si el stock viene en el body y es menor que 0, devolvemos un error.
  if (body.stock !== undefined && body.stock < 0) {
    return new NextResponse("El stock no puede ser un número negativo", { status: 400 });
  }

  try {
    // Usamos desestructuración para crear un nuevo objeto 'updateData'
    // que contiene todo lo de 'body' EXCEPTO las propiedades 'id' y 'category'.
    const { id: productId, category, ...updateData } = body;

    const updatedProduct = await prisma.product.update({
      where: { id: id },
      // Ahora solo pasamos los datos que sí se pueden actualizar.
      data: updateData, 
    });
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Seguridad: Siempre verificamos la sesión y el rol primero
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("No autorizado", { status: 401 });
  }

  const id = params.id;

  try {
    // 2. Lógica de la Base de Datos: Eliminamos el producto por su ID
    await prisma.product.delete({
      where: { id: id },
    });

    // 3. Respuesta: Enviamos una confirmación de que todo salió bien
    return NextResponse.json({ message: "Producto eliminado" }, { status: 200 });

  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}