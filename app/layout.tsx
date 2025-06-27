import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/lib/context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GameRent - Alquiler de Juegos de Mesa",
  description: "Alquila los mejores juegos de mesa para toda la familia. Diversión garantizada.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
