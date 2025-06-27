// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Crear categorías
  const pizza = await prisma.category.create({ data: { name: 'Pizzas' } })
  const burgers = await prisma.category.create({ data: { name: 'Hamburguesas' } })
  const pastas = await prisma.category.create({ data: { name: 'Pastas' } })

  console.log('Categories created.')

  // Crear productos
  await prisma.product.createMany({
    data: [
        { name: 'Pizza Siciliana', description: 'Una delicia picante', image: '/temporary/p1.png', price: 24, categoryId: pizza.id, stock: 10 },
        { name: 'Pizza Americana', description: 'Clásica con pepperoni', image: '/temporary/p2.png', price: 28, categoryId: pizza.id, stock: 15 },
        { name: 'Hamburguesa con Queso', description: 'Jugosa y sabrosa', image: '/temporary/p3.png', price: 20, categoryId: burgers.id, stock: 20 },
        { name: 'Pasta Carbonara', description: 'Cremosa y tradicional', image: '/temporary/p4.png', price: 22, categoryId: pastas.id, stock: 12 },
    ]
  })

  console.log('Products created.')
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })