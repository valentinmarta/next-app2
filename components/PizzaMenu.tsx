// components/PizzaMenu.tsx

// 1. Importamos los tipos directamente desde Prisma. ¡Esta es la fuente de la verdad!
import type { Product } from "@prisma/client";
import Image from "next/image";

// 2. Actualizamos la interfaz para que espere una lista de 'Product'
interface PizzaMenuProps {
  products: Product[];
}

export function PizzaMenu({ products }: PizzaMenuProps) {
  return (
    <div className="row">
      {/* 3. Cambiamos el nombre de la variable en el map para mayor claridad */}
      {products.map((product) => (
        <div key={product.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={200}
              className="card-img-top"
              style={{ objectFit: "cover", height: "200px" }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-danger">{product.name}</h5>
              <p className="card-text flex-grow-1">{product.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                {/* 4. Los datos ahora vienen del objeto 'product' */}
                <span className="h5 text-success mb-0">${product.price.toFixed(2)}</span>
                <button
                  className="btn btn-outline-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#reservationModal"
                  // Estos atributos siguen funcionando igual
                  data-pizza-id={product.id}
                  data-pizza-name={product.name}
                >
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}