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
    <header className="navbar navbar-dark bg-danger shadow-sm py-2">
      <div className="container-fluid">
        {/* Usamos Flexbox de Bootstrap para el control total del layout */}
        <div className="d-flex justify-content-between align-items-center w-100">

          {/* ---- GRUPO IZQUIERDO: Título y Enlaces ---- */}
          <div className="d-flex align-items-center">
            <Link href="/admin" className="navbar-brand me-4">
              🍕 Admin Panel
            </Link>
            
            {/* Contenedor de enlaces que siempre estarán visibles */}
            <div className="d-flex gap-3">
              <Link
                href="/admin"
                className={`nav-link text-white ${pathname === "/admin" ? "fw-bold" : ""}`}
              >
                Estadísticas
              </Link>
              <Link
                href="/admin/menu"
                className={`nav-link text-white ${pathname.startsWith("/admin/menu") ? "fw-bold" : ""}`}
              >
                Menú
              </Link>
              <Link href="/admin/reservations" className={`nav-link ${pathname.startsWith("/admin/reservations") ? "active" : ""}`}>
                Reservas
              </Link>
            </div>
          </div>

          {/* ---- GRUPO DERECHO: Menú de Usuario ---- */}
          <div>
            {session?.user && (
              <div className="dropdown">
                {/* Este botón 'dropdown' NECESITA el JS de Bootstrap para funcionar */}
                <a
                  className="nav-link dropdown-toggle text-white d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <PersonCircle className="me-2" />
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
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}