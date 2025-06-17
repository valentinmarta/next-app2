import { mockPizzaService } from "@/lib/mock-services"
import { PizzaMenu } from "@/components/PizzaMenu"
import { ReservationModal } from "@/components/ReservationModal"
import Link from "next/link"

export default function HomePage() {
  // Get pizzas from mock service (server-side)
  const pizzas = mockPizzaService.getPizzas()

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
        <div className="container">
          <span className="navbar-brand h1 mb-0">🍕 Pizzería Deliciosa</span>
          <Link href="/login" className="btn btn-outline-light">
            Ingresar Admin
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-danger text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Las Mejores Pizzas de la Ciudad</h1>
          <p className="lead mb-4">Ingredientes frescos, masa artesanal y el mejor sabor</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="mb-4">Nuestro Menú</h2>
            <PizzaMenu pizzas={pizzas} />
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">¿Listo para ordenar?</h5>
                <p className="card-text">Selecciona tu pizza favorita y haz tu reserva</p>
                <button className="btn btn-danger btn-lg" data-bs-toggle="modal" data-bs-target="#reservationModal">
                  Reservar Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReservationModal pizzas={pizzas} />
    </div>
  )
}
