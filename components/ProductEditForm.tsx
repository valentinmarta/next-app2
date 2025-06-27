// components/ProductEditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Definimos los tipos para las props
interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  categoryId: string;
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

export default function ProductEditForm({ product, categories }: ProductEditFormProps) {
  const [formData, setFormData] = useState(product);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Determinamos si estamos en modo edición o creación
    const isEditMode = !!product.id; 

    // Definimos el endpoint y el método de la API según el modo
    const endpoint = isEditMode ? `/api/products/${product.id}` : '/api/products';
    const method = isEditMode ? 'PATCH' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al guardar el producto.");

      alert(`¡Producto ${isEditMode ? 'actualizado' : 'creado'} con éxito!`);
      router.push('/admin/menu');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("No se pudieron guardar los cambios.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nombre del Producto</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">Descripción</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-control" required />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="price" className="form-label">Precio</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="form-control" required step="0.01" />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="stock" className="form-label">Stock</label>
          <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} className="form-control" required min="0"/>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="categoryId" className="form-label">Categoría</label>
        <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} className="form-select" required>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="image" className="form-label">URL de la Imagen</label>
        <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} className="form-control" />
      </div>

      <button type="submit" className="btn btn-danger" disabled={isLoading}>
        {isLoading ? 'Guardando...' : (product.id ? 'Guardar Cambios' : 'Crear Producto')}
      </button>
    </form>
  );
}