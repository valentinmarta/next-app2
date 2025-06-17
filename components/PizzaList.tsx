"use client"

import type { Pizza } from "@/types"
import Image from "next/image"

interface PizzaListProps {
  pizzas: Pizza[]
  onEdit: (pizza: Pizza) => void
  onDelete: (id: string) => void
}

export function PizzaList({ pizzas, onEdit, onDelete }: PizzaListProps) {
  if (pizzas.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <h5>No hay pizzas en el menú</h5>
          <p>Agrega pizzas para que aparezcan aquí</p>
        </div>
      </div>
    )
  }

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
              <p className="card-text flex-grow-1 small">{pizza.description}</p>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="h5 text-success mb-0">${pizza.price.toFixed(2)}</span>
                <span className={`badge ${pizza.available ? "bg-success" : "bg-danger"}`}>
                  {pizza.available ? "Disponible" : "No disponible"}
                </span>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-primary flex-fill" onClick={() => onEdit(pizza)}>
                  <i className="bi bi-pencil me-1"></i>
                  Editar
                </button>
                <button className="btn btn-sm btn-danger flex-fill" onClick={() => onDelete(pizza.id)}>
                  <i className="bi bi-trash me-1"></i>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
