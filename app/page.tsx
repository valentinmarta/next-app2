"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GameCard } from "@/components/game-card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/context"
import { ArrowRight, Star, Users, Clock, Phone, Mail, MapPin } from "lucide-react"

export default function HomePage() {
  const { games, siteContent } = useApp()
  const availableGames = games.filter((game) => game.available)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">{siteContent.heroTitle}</h1>
            <p className="text-xl md:text-2xl mb-4 animate-fade-in-delay-1">{siteContent.heroSubtitle}</p>
            <p className="text-lg mb-8 max-w-3xl mx-auto animate-fade-in-delay-2">{siteContent.heroDescription}</p>
            <Button size="lg" className="animate-fade-in-delay-3 bg-white text-blue-600 hover:bg-gray-100">
              Ver Juegos Disponibles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{games.length}+</h3>
              <p className="text-gray-600">Juegos Disponibles</p>
            </div>
            <div className="p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Clientes Satisfechos</p>
            </div>
            <div className="p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">24/7</h3>
              <p className="text-gray-600">Soporte Disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Juegos Disponibles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explora nuestra colección cuidadosamente seleccionada de juegos de mesa para todas las edades y gustos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {availableGames.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No hay juegos disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{siteContent.aboutTitle}</h2>
              <p className="text-lg text-gray-600 mb-6">{siteContent.aboutDescription}</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <Star className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Juegos de alta calidad</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">Para todas las edades</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Alquiler flexible</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src="/placeholder.svg?height=400&width=600" alt="Sobre nosotros" className="rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contáctanos</h2>
            <p className="text-xl text-gray-600">¿Tienes preguntas? Estamos aquí para ayudarte.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">{siteContent.contactInfo.phone}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-600">{siteContent.contactInfo.email}</p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Dirección</h3>
              <p className="text-gray-600">{siteContent.contactInfo.address}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
