"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Pizza } from "@/types"

interface PizzaFormProps {
  pizza: Pizza | null
  onSave: (pizza: Pizza | Omit<Pizza, "id">) => void
  onCancel: () => void
}

export function PizzaForm({ pizza, onSave, onCancel }: PizzaFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [available, setAvailable] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form with pizza data when editing
  useEffect(() => {
    if (pizza) {
      setName(pizza.name)
      setDescription(pizza.description)
      setPrice(pizza.price.toString())
      setImage(pizza.image)
      setAvailable(pizza.available)
    } else {
      // Reset form for new pizza
      setName("")
      setDescription("")
      setPrice("")
      setImage("/placeholder.svg?height=200&width=300")
      setAvailable(true)
    }
    setErrors({})
  }, [pizza])

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!description.trim()) {
      newErrors.description = "La descripción es obligatoria"
    }

    if (!price.trim()) {
      newErrors.price = "El precio es obligatorio"
    } else {
      const priceNum = Number.parseFloat(price)
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = "El precio debe ser un número positivo"
      }
    }

    if (!image.trim()) {
      newErrors.image = "La URL de la imagen es obligatoria"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    const pizzaData = {
      ...(pizza ? { id: pizza.id } : {}),
      name: name.trim(),
      description: description.trim(),
      price: Number.parseFloat(price),
      image: image.trim(),
      available,
    }

    onSave(pizzaData as Pizza | Omit<Pizza, "id">)
  }

  return (
    <div className="row">
      <div className="col-md-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nombre de la Pizza *
            </label>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Pizza Margherita"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Descripción *
            </label>
            <textarea
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los ingredientes y características de la pizza"
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Precio *
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
              {errors.price && <div className="invalid-feedback">{errors.price}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              URL de la Imagen *
            </label>
            <input
              type="url"
              className={`form-control ${errors.image ? "is-invalid" : ""}`}
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
            <div className="form-text">
              Puedes usar "/placeholder.svg?height=200&width=300" para una imagen de prueba
            </div>
          </div>

          <div className="mb-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="available"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="available">
                Pizza disponible para pedidos
              </label>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              <i className="bi bi-x-circle me-1"></i>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-check-circle me-1"></i>
              {pizza ? "Actualizar Pizza" : "Crear Pizza"}
            </button>
          </div>
        </form>
      </div>

      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Vista Previa</h6>
          </div>
          <div className="card-body">
            {image && (
              <img
                src={image || "/placeholder.svg"}
                alt="Vista previa"
                className="img-fluid rounded mb-3"
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=150&width=200"
                }}
              />
            )}
            <h6 className="text-danger">{name || "Nombre de la pizza"}</h6>
            <p className="small text-muted">{description || "Descripción de la pizza"}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="h6 text-success">${price || "0.00"}</span>
              <span className={`badge ${available ? "bg-success" : "bg-danger"}`}>
                {available ? "Disponible" : "No disponible"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
