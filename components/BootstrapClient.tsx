// components/BootstrapClient.tsx
"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Esta línea importa el paquete completo de JavaScript de Bootstrap (que incluye Popper.js)
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez en el cliente

  // Este componente no renderiza nada visualmente, solo carga el script.
  return null;
}