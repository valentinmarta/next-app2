// app/admin/layout.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/AdminHeader"; // Asegúrate que la ruta sea correcta

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Seguridad Centralizada
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // 2. Estructura Visual
  return (
    <div>
      <AdminHeader />
      <main>
        {children} {/* Aquí se renderizará la página actual */}
      </main>
    </div>
  );
}