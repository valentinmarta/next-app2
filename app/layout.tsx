// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Providers from "@/components/Providers";
import Script from "next/script"; // Importamos el componente Script

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pizzeria App",
  description: "La mejor pizzería de la ciudad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        
        {/* Colocamos el script de Bootstrap aquí, justo antes de cerrar el body. */}
        {/* Esto asegura que se carga después de que la página es interactiva. */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" 
          crossOrigin="anonymous"
          strategy="lazyOnload" // Estrategia para cargar cuando el navegador esté libre
        />
      </body>
    </html>
  );
}