import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Monster = {
  name: string
  attack: number
  defense: number
  speed: number
  hp: number
  image_url: string
}

export function MonsterCard({ monster }: { monster: Monster }) {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>{monster.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img src={monster.image_url} alt={monster.name} className="w-full h-32 object-cover mb-4" />
        <div className="space-y-2">
          <div>Ataque: {monster.attack}</div>
          <div>Defesa: {monster.defense}</div>
          <div>Velocidade: {monster.speed}</div>
          <div>
            HP: {monster.hp}
            <Progress value={(monster.hp / 100) * 100} className="mt-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}