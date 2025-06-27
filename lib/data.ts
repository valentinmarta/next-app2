import type { BoardGame, SiteContent } from "./types"

export const initialGames: BoardGame[] = [
  {
    id: "1",
    name: "Catan",
    image: "/placeholder.svg?height=300&width=400",
    description: "Un juego de estrategia donde construyes asentamientos y ciudades en la isla de Catan.",
    players: "3-4 jugadores",
    duration: "60-90 min",
    difficulty: "Medio",
    available: true,
  },
  {
    id: "2",
    name: "Ticket to Ride",
    image: "/placeholder.svg?height=300&width=400",
    description: "Conecta ciudades construyendo rutas de tren a través de América del Norte.",
    players: "2-5 jugadores",
    duration: "30-60 min",
    difficulty: "Fácil",
    available: true,
  },
  {
    id: "3",
    name: "Wingspan",
    image: "/placeholder.svg?height=300&width=400",
    description: "Un juego de estrategia sobre aves donde construyes tu hábitat perfecto.",
    players: "1-5 jugadores",
    duration: "40-70 min",
    difficulty: "Medio",
    available: false,
  },
  {
    id: "4",
    name: "Azul",
    image: "/placeholder.svg?height=300&width=400",
    description: "Coloca azulejos de colores para crear hermosos mosaicos portugueses.",
    players: "2-4 jugadores",
    duration: "30-45 min",
    difficulty: "Fácil",
    available: true,
  },
  {
    id: "5",
    name: "Gloomhaven",
    image: "/placeholder.svg?height=300&width=400",
    description: "Un juego de aventuras tácticas con campaña persistente y combate estratégico.",
    players: "1-4 jugadores",
    duration: "60-120 min",
    difficulty: "Difícil",
    available: true,
  },
  {
    id: "6",
    name: "Splendor",
    image: "/placeholder.svg?height=300&width=400",
    description: "Conviértete en un comerciante de gemas del Renacimiento.",
    players: "2-4 jugadores",
    duration: "30 min",
    difficulty: "Fácil",
    available: true,
  },
]

export const initialSiteContent: SiteContent = {
  heroTitle: "Alquiler de Juegos de Mesa",
  heroSubtitle: "Diversión garantizada para toda la familia",
  heroDescription:
    "Descubre nuestra amplia colección de juegos de mesa. Perfectos para reuniones familiares, fiestas con amigos o noches de juego.",
  aboutTitle: "Sobre Nosotros",
  aboutDescription:
    "Somos apasionados de los juegos de mesa y queremos compartir esa pasión contigo. Ofrecemos una cuidada selección de los mejores juegos para que disfrutes sin necesidad de comprarlos.",
  contactInfo: {
    phone: "+34 123 456 789",
    email: "info@alquilerjuegos.com",
    address: "Calle Principal 123, Madrid",
  },
}
