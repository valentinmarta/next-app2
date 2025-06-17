import type { Pizza } from "@/types"
import Image from "next/image"

interface PizzaMenuProps {
  pizzas: Pizza[]
}

export function PizzaMenu({ pizzas }: PizzaMenuProps) {
  return (
    <div className="row">
      {pizzas.map((pizza) => (
        <div key={pizza.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100 shadow-sm">
            <Image
              src={pizza.image || "/placeholder.svg"}
              alt={pizza.name}
              width={300}
              height={200}
              className="card-img-top"
              style={{ objectFit: "cover", height: "200px" }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-danger">{pizza.name}</h5>
              <p className="card-text flex-grow-1">{pizza.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="h5 text-success mb-0">${pizza.price}</span>
                <button
                  className="btn btn-outline-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#reservationModal"
                  data-pizza-id={pizza.id}
                  data-pizza-name={pizza.name}
                >
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
