// app/admin/menu/edit/[id]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductEditForm from "@/components/ProductEditForm"; // Un nuevo componente que crearemos ahora

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  // Seguridad
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const productId = params.id;

  // Buscamos los datos del producto específico que se va a editar
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  // También buscamos TODAS las categorías para poder mostrarlas en un selector
  const categories = await prisma.category.findMany();

  // Si no se encuentra el producto, mostramos un error o redirigimos
  if (!product) {
    return (
      <div className="container py-5">
        <h1>Producto no encontrado</h1>
        <p>El producto que intentas editar no existe.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-danger">Editar Producto</h1>
      {/* Pasamos los datos al componente del formulario */}
      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}