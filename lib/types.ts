export interface BoardGame {
  id: string
  name: string
  image: string
  description: string
  players: string
  duration: string
  difficulty: "Fácil" | "Medio" | "Difícil"
  available: boolean
}

export interface SiteContent {
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  aboutTitle: string
  aboutDescription: string
  contactInfo: {
    phone: string
    email: string
    address: string
  }
}
