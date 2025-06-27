// app/api/products/route.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Función para manejar peticiones POST (crear un nuevo recurso)
export async function POST(request: Request) {
  // 1. Seguridad: Verificamos la sesión y el rol
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return new NextResponse("No autorizado", { status: 401 });
  }

  try {
    const body = await request.json();

    // 2. Validación (similar a la que hicimos antes)
    if (!body.name || !body.price || !body.categoryId) {
      return new NextResponse("Faltan campos obligatorios", { status: 400 });
    }
    if (body.stock !== undefined && body.stock < 0) {
      return new NextResponse("El stock no puede ser negativo", { status: 400 });
    }

    // 3. Lógica de la Base de Datos: Creamos el nuevo producto
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
        image: body.image,
        categoryId: body.categoryId,
      },
    });

    // 4. Respuesta: Devolvemos el producto recién creado con un estado 201 (Created)
    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error("Error al crear el producto:", error);
    return new NextResponse("Error interno del servidor", { status: 500 });
  }
}