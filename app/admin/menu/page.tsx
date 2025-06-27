// app/admin/menu/page.tsx

import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminMenuPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { category: true },
  });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-danger mb-0">Gestionar Menú y Stock</h1>
        <Link href="/admin/menu/new" className="btn btn-danger">
          <i className="bi bi-plus-circle me-2"></i>
          Añadir Nuevo Producto
        </Link>
      </div>
      <p className="text-muted">
        Aquí puedes ver, editar, crear y eliminar los productos de tu menú.
      </p>
      <div className="table-responsive">
        {/* ... El resto de tu tabla sigue aquí ... */}
        <table className="table table-hover align-middle">
          {/* ... tu thead ... */}
          <tbody className="table-group-divider">
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Image
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded"
                    style={{ objectFit: "cover" }}
                  />
                </td>
                <td className="fw-bold">{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className="badge bg-secondary">{product.category.name}</span>
                </td>
                <td>{product.stock} unidades</td>
                <td>
                  <Link href={`/admin/menu/edit/${product.id}`} className="btn btn-sm btn-outline-primary me-2">
                    Editar
                  </Link>
                  <DeleteButton productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}