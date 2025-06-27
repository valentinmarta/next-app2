// components/DeleteButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteButtonProps {
  productId: string;
}

export default function DeleteButton({ productId }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // 1. Mostramos una ventana de confirmación nativa del navegador
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
    );

    // 2. Si el usuario no confirma, no hacemos nada
    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    try {
      // 3. Si confirma, llamamos a nuestra API de eliminación
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      // 4. Refrescamos los datos de la página para que la fila eliminada desaparezca
      router.refresh();
      
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className="btn btn-sm btn-outline-danger"
      disabled={isLoading}
    >
      {isLoading ? "..." : "Eliminar"}
    </button>
  );
}