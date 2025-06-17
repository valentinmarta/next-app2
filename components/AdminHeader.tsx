"use client"

import { mockAuthService } from "@/config/auth"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

interface AdminHeaderProps {
  user: any
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = () => {
    mockAuthService.signOut()
    router.push("/")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
      <div className="container">
        <Link href="/admin" className="navbar-brand">
          🍕 Admin Panel
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarAdmin">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarAdmin">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/admin" className={`nav-link ${pathname === "/admin" ? "active" : ""}`}>
                <i className="bi bi-list-check me-1"></i>
                Reservas
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/menu" className={`nav-link ${pathname === "/admin/menu" ? "active" : ""}`}>
                <i className="bi bi-pizza me-1"></i>
                Menú
              </Link>
            </li>
          </ul>

          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i className="bi bi-person-circle me-1"></i>
                {user?.name || "Admin"}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link href="/" className="dropdown-item">
                    <i className="bi bi-house me-2"></i>
                    Ver Sitio Principal
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleSignOut}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
