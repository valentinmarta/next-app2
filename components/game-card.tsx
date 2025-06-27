import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Clock, Users } from "lucide-react"
import type { BoardGame } from "@/lib/types"

interface GameCardProps {
  game: BoardGame
}

export function GameCard({ game }: GameCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800"
      case "Medio":
        return "bg-yellow-100 text-yellow-800"
      case "Difícil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={game.image || "/placeholder.svg"}
            alt={game.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
          </div>
          {!game.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                No Disponible
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{game.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {game.players}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {game.duration}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button className="w-full" disabled={!game.available} variant={game.available ? "default" : "secondary"}>
          {game.available ? "Reservar Ahora" : "No Disponible"}
        </Button>
      </CardFooter>
    </Card>
  )
}
