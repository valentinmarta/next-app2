"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { BoardGame, SiteContent } from "./types"
import { initialGames, initialSiteContent } from "./data"

interface AppContextType {
  games: BoardGame[]
  siteContent: SiteContent
  isAuthenticated: boolean
  updateGames: (games: BoardGame[]) => void
  updateSiteContent: (content: SiteContent) => void
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [games, setGames] = useState<BoardGame[]>(initialGames)
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    const savedGames = localStorage.getItem("boardGames")
    const savedContent = localStorage.getItem("siteContent")
    const savedAuth = localStorage.getItem("isAuthenticated")

    if (savedGames) {
      setGames(JSON.parse(savedGames))
    }
    if (savedContent) {
      setSiteContent(JSON.parse(savedContent))
    }
    if (savedAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const updateGames = (newGames: BoardGame[]) => {
    setGames(newGames)
    localStorage.setItem("boardGames", JSON.stringify(newGames))
  }

  const updateSiteContent = (content: SiteContent) => {
    setSiteContent(content)
    localStorage.setItem("siteContent", JSON.stringify(content))
  }

  const login = (username: string, password: string) => {
    // Hardcoded credentials
    if (username === "admin" && password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("isAuthenticated", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("isAuthenticated")
  }

  return (
    <AppContext.Provider
      value={{
        games,
        siteContent,
        isAuthenticated,
        updateGames,
        updateSiteContent,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
