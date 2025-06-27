// app/admin/menu/new/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductEditForm from "@/components/ProductEditForm"; // ¡Reutilizamos el mismo formulario!

export default async function NewProductPage() {
  // Seguridad
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Obtenemos las categorías para el selector, igual que en la página de edición
  const categories = await prisma.category.findMany();

  // Creamos un objeto 'producto' vacío con la estructura necesaria
  const blankProduct = {
    id: "", // El ID está vacío, así nuestro formulario sabrá que es para 'Crear'
    name: "",
    description: "",
    price: 0,
    image: "",
    stock: 0,
    categoryId: categories[0]?.id || "", // Seleccionamos la primera categoría por defecto
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-danger">Añadir Nuevo Producto</h1>
      {/* Pasamos el producto en blanco y las categorías al mismo formulario de antes */}
      <ProductEditForm product={blankProduct} categories={categories} />
    </div>
  );
}