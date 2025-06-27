"use client"

import { GamepadIcon, Phone, Mail, MapPin } from "lucide-react"
import { useApp } from "@/lib/context"

export function Footer() {
  const { siteContent } = useApp()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <GamepadIcon className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">GameRent</span>
            </div>
            <p className="text-gray-300 mb-4">
              Tu destino para el alquiler de juegos de mesa. Diversión garantizada para toda la familia.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#games" className="text-gray-300 hover:text-white transition-colors">
                  Juegos
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-gray-300">{siteContent.contactInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-gray-300">{siteContent.contactInfo.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-gray-300">{siteContent.contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} GameRent. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
