// prisma/createAdmin.ts

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt'; // Importamos la función para encriptar

const prisma = new PrismaClient();

async function main() {
  // --- Define aquí los datos de tu administrador ---
  const adminEmail = 'admin@ventasJuegos.com';
  const adminPassword = 'momo'; // Esta es la contraseña que usarás para iniciar sesión
  // ------------------------------------------------

  console.log(`Verificando si el usuario ${adminEmail} ya existe...`);
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  // Si el usuario ya existe, no hacemos nada para evitar duplicados.
  if (existingAdmin) {
    console.log(`El usuario ${adminEmail} ya existe. No se hará nada.`);
    return;
  }

  console.log('El usuario no existe, procediendo a crearlo...');
  
  // 1. Encriptamos la contraseña antes de guardarla.
  // El '12' es el "cost factor", un número estándar para un buen nivel de encriptación.
  const hashedPassword = await hash(adminPassword, 12);

  // 2. Creamos el usuario admin en la base de datos
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Admin',
      password: hashedPassword, // ¡Guardamos la contraseña YA ENCRIPTADA!
      role: 'ADMIN', // ¡Muy importante! Asignamos el rol de ADMIN
    },
  });

  console.log('¡Usuario administrador creado exitosamente!');
  console.log(adminUser);
}

// Ejecutamos la función principal y manejamos posibles errores.
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Nos aseguramos de cerrar la conexión a la base de datos.
    await prisma.$disconnect();
  });