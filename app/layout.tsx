// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css"; // El CSS está bien aquí
import Providers from "@/components/Providers";
import Script from "next/script"; // <-- IMPORTANTE: Importamos el componente Script

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
        
        {/* AÑADIMOS EL SCRIPT DE BOOTSTRAP AQUÍ, AL FINAL DEL BODY */}
        {/* Esto asegura que toda la página se cargue antes de que el script se ejecute */}
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" 
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}