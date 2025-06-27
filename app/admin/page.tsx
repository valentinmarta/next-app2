// app/admin/page.tsx

// ¡No hay importaciones de seguridad ni de layout!
// ¡No hay 'async' si no se obtienen datos aquí!

export default function AdminDashboardPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Panel de Estadísticas</h1>
      <p className="lead">
        ¡Bienvenido al panel de administrador, <strong>{/* Aquí podrías poner session.user.name si lo necesitaras */}</strong>!
      </p>
      <p>
        Esta será la página principal de estadísticas. Usa la barra de navegación de arriba para gestionar el menú.
      </p>
    </div>
  );
}