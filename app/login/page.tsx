"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

// EL NUEVO CÓDIGO PARA REEMPLAZAR
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Usamos la función signIn de NextAuth
    const result = await signIn("credentials", {
      // 'credentials' le dice a NextAuth que use el proveedor de Email/Contraseña que configuramos.
      redirect: false, // ¡Muy importante! Evita que la página se recargue automáticamente.
      email: email,       // El email del estado del formulario.
      password: password, // La contraseña del estado del formulario.
    });

    // signIn nos devuelve un objeto 'result' que podemos inspeccionar.
    if (result?.ok) {
      // Si el login fue exitoso (result.ok es true), redirigimos al admin.
      router.push("/admin");
    } else {
      // Si hubo un error, NextAuth nos lo da en result.error.
      // Mostramos un mensaje genérico para más seguridad.
      setError("Email o contraseña incorrectos.");
    }

    setLoading(false);
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="text-danger">🍕 Admin Login</h2>
                  <p className="text-muted">Acceso para administradores</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn btn-danger w-100" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                  </button>
                </form>
          
                <div className="text-center my-3">
                    <p>O</p>
                    <button 
                        onClick={() => signIn('google', { callbackUrl: '/admin' })} 
                        className="btn btn-outline-dark w-100"
                    >
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" width="20" className="me-2"/>
                        Iniciar sesión con Google
                    </button>
                </div>
                <div className="text-center mt-3">
                  <Link href="/" className="text-decoration-none">
                    ← Volver al inicio
                  </Link>
                </div>

                <div className="mt-4 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Demo:</strong>
                    <br />
                    Email: admin@pizzeria.com
                    <br />
                    Contraseña: admin123
                  </small>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
