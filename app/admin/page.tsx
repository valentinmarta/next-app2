"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Save, Settings, GamepadIcon } from "lucide-react"
import { useApp } from "@/lib/context"
import type { BoardGame } from "@/lib/types"

export default function AdminPage() {
  const { games, siteContent, isAuthenticated, updateGames, updateSiteContent } = useApp()
  const router = useRouter()
  const [editingGame, setEditingGame] = useState<BoardGame | null>(null)
  const [isAddingGame, setIsAddingGame] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const handleSaveGame = (gameData: Partial<BoardGame>) => {
    if (editingGame) {
      // Edit existing game
      const updatedGames = games.map((game) => (game.id === editingGame.id ? { ...game, ...gameData } : game))
      updateGames(updatedGames)
      setEditingGame(null)
    } else if (isAddingGame) {
      // Add new game
      const newGame: BoardGame = {
        id: Date.now().toString(),
        name: gameData.name || "",
        image: gameData.image || "/placeholder.svg?height=300&width=400",
        description: gameData.description || "",
        players: gameData.players || "",
        duration: gameData.duration || "",
        difficulty: gameData.difficulty || "Fácil",
        available: gameData.available ?? true,
      }
      updateGames([...games, newGame])
      setIsAddingGame(false)
    }
    setSaveMessage("Juego guardado correctamente")
    setTimeout(() => setSaveMessage(""), 3000)
  }

  const handleDeleteGame = (gameId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este juego?")) {
      const updatedGames = games.filter((game) => game.id !== gameId)
      updateGames(updatedGames)
      setSaveMessage("Juego eliminado correctamente")
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const handleSaveContent = (contentData: any) => {
    updateSiteContent(contentData)
    setSaveMessage("Contenido guardado correctamente")
    setTimeout(() => setSaveMessage(""), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administrador</h1>
          <p className="text-gray-600">Gestiona los juegos y el contenido de tu sitio web</p>
        </div>

        {saveMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">{saveMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="games" className="flex items-center">
              <GamepadIcon className="h-4 w-4 mr-2" />
              Gestión de Juegos
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Contenido del Sitio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Juegos de Mesa</h2>
              <Button onClick={() => setIsAddingGame(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Juego
              </Button>
            </div>

            {(isAddingGame || editingGame) && (
              <GameForm
                game={editingGame}
                onSave={handleSaveGame}
                onCancel={() => {
                  setIsAddingGame(false)
                  setEditingGame(null)
                }}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card key={game.id} className="relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{game.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingGame(game)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteGame(game.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={game.available ? "default" : "secondary"}>
                        {game.available ? "Disponible" : "No disponible"}
                      </Badge>
                      <Badge variant="outline">{game.difficulty}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{game.description}</p>
                    <div className="text-xs text-gray-500">
                      <p>
                        {game.players} • {game.duration}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentForm content={siteContent} onSave={handleSaveContent} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function GameForm({
  game,
  onSave,
  onCancel,
}: {
  game: BoardGame | null
  onSave: (data: Partial<BoardGame>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: game?.name || "",
    image: game?.image || "",
    description: game?.description || "",
    players: game?.players || "",
    duration: game?.duration || "",
    difficulty: game?.difficulty || "Fácil",
    available: game?.available ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{game ? "Editar Juego" : "Agregar Nuevo Juego"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Juego</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">URL de la Imagen</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/placeholder.svg?height=300&width=400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="players">Jugadores</Label>
              <Input
                id="players"
                value={formData.players}
                onChange={(e) => setFormData({ ...formData, players: e.target.value })}
                placeholder="2-4 jugadores"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30-60 min"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fácil">Fácil</SelectItem>
                  <SelectItem value="Medio">Medio</SelectItem>
                  <SelectItem value="Difícil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
            <Label htmlFor="available">Disponible para alquiler</Label>
          </div>

          <div className="flex space-x-4">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ContentForm({
  content,
  onSave,
}: {
  content: any
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState(content)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Contenido del Sitio</CardTitle>
        <CardDescription>Modifica los textos y información que aparecen en la página principal</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sección Hero</h3>
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Título Principal</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Subtítulo</Label>
              <Input
                id="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroDescription">Descripción</Label>
              <Textarea
                id="heroDescription"
                value={formData.heroDescription}
                onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sección Sobre Nosotros</h3>
            <div className="space-y-2">
              <Label htmlFor="aboutTitle">Título</Label>
              <Input
                id="aboutTitle"
                value={formData.aboutTitle}
                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aboutDescription">Descripción</Label>
              <Textarea
                id="aboutDescription"
                value={formData.aboutDescription}
                onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.contactInfo.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, email: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.contactInfo.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, address: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
