"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, GamepadIcon, User, LogOut } from "lucide-react"
import { useApp } from "@/lib/context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useApp()

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <GamepadIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">GameRent</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <Link href="#games" className="text-gray-700 hover:text-blue-600 transition-colors">
              Juegos
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              Nosotros
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contacto
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                Inicio
              </Link>
              <Link href="#games" className="text-gray-700 hover:text-blue-600 transition-colors">
                Juegos
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                Nosotros
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contacto
              </Link>
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={logout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
