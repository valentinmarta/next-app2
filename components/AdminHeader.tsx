// components/AdminHeader.tsx
"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BoxArrowRight, PersonCircle } from "react-bootstrap-icons";

export function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm sticky-top">
      <div className="container-fluid">
        <Link href="/admin" className="navbar-brand">
          🍕 Admin Panel
        </Link>
        
        {/* Botón Toggler para móvil. Apunta al ID 'navbarAdminContent' */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarAdminContent"
          aria-controls="navbarAdminContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Este es el contenedor que se colapsa. Su ID coincide con 'data-bs-target' */}
        <div className="collapse navbar-collapse" id="navbarAdminContent">
          {/* me-auto empuja esta lista a la izquierda */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                href="/admin"
                className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
              >
                Estadísticas
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/admin/menu"
                className={`nav-link ${pathname.startsWith("/admin/menu") ? "active" : ""}`}
              >
                Menú
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/admin/reservations"
                className="nav-link disabled"
                aria-disabled="true"
              >
                Reservas
              </Link>
            </li>
          </ul>

          {/* Menú desplegable del usuario a la derecha */}
          <ul className="navbar-nav">
             {session?.user && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle text-white"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <PersonCircle className="me-1" />
                  {session.user.name || "Admin"}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={handleSignOut}>
                      <BoxArrowRight className="me-2" />
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}