'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { MonsterCard } from '../_components/MonsterCard'
import { faker } from '@faker-js/faker';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

type Monster = {
  name: string
  attack: number
  defense: number
  speed: number
  hp: number
  image_url: string
}

type BattleLog = {
  attacker: string
  defender: string
  damage: number
  remainingHp: number
}

function Battle() {
  const [playerMonster, setPlayerMonster] = useState<Monster | null>(null)
  const [computerMonster, setComputerMonster] = useState<Monster | null>(null)
  const [battleLogs, setBattleLogs] = useState<BattleLog[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const playerMonsterData = searchParams.get('playerMonster')
    
    if (playerMonsterData) {
      const player = JSON.parse(decodeURIComponent(playerMonsterData)) as Monster
      setPlayerMonster(player)
      
      const computer = createRandomMonster()
      setComputerMonster(computer)
      
      startBattle(player, computer)
    }
  }, [searchParams])

  function createRandomMonster(): Monster {
    const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)
    
    return {
      name: faker.person.fullName(),
      attack: randomInt(1, 100),
      defense: randomInt(1, 100),
      speed: randomInt(1, 100),
      hp: randomInt(1, 100),
      image_url: `https://picsum.photos/seed/${randomInt(1, 1000)}/200/200`
    }
  }

  const startBattle = (player: Monster, computer: Monster) => {
    let currentPlayer = { ...player }
    let currentComputer = { ...computer }
    const logs: BattleLog[] = []

    while (currentPlayer.hp > 0 && currentComputer.hp > 0) {
      let attacker: Monster
      let defender: Monster

      if (currentPlayer.speed > currentComputer.speed || 
         (currentPlayer.speed === currentComputer.speed && currentPlayer.attack >= currentComputer.attack)) {
        attacker = currentPlayer
        defender = currentComputer
      } else {
        attacker = currentComputer
        defender = currentPlayer
      }

      const damage = Math.max(1, attacker.attack - defender.defense);
      defender.hp = Math.max(0, defender.hp - damage)

      logs.push({
        attacker: attacker.name,
        defender: defender.name,
        damage: damage,
        remainingHp: defender.hp
      })

      if (defender.hp === 0) {
        const winnerName = attacker.name
        setWinner(winnerName)
        setShowConfetti(winnerName === player.name);
        break;
      }
      
      [currentPlayer, currentComputer] = [currentComputer, currentPlayer]
    }

    setBattleLogs(logs)
    setPlayerMonster({ ...player, hp: currentPlayer.hp })
    setComputerMonster({ ...computer, hp: currentComputer.hp })
  }

  if (!playerMonster || !computerMonster) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 p-4">
      {showConfetti && <Confetti />}
      <h1 className="mb-8 text-4xl font-bold text-white">Arena de Batalha</h1>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <MonsterCard monster={playerMonster} />
        <MonsterCard monster={computerMonster} />
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Log de Batalha</CardTitle>
          <CardDescription>Acompanhe o desenrolar da batalha!</CardDescription>
        </CardHeader>
        <CardContent className="max-h-60 overflow-y-auto">
          {battleLogs.map((log, index) => (
            <p key={index} className="mb-2">
              {log.attacker} ataca {log.defender} causando {log.damage} de dano. 
              {log.defender} fica com {log.remainingHp} HP restantes.
            </p>
          ))}
        </CardContent>
        <CardFooter>
          {winner && (
            <p className="text-xl font-bold">
              {winner} vence a batalha!
              {winner === playerMonster.name && " Parabéns!"}
            </p>
          )}
        </CardFooter>
      </Card>
      <Button onClick={() => window.location.href = '/'} className="mt-4">
        Iniciar Nova Batalha
      </Button>
    </div>
  )
}

export default function BattleContent() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <Battle />
    </Suspense>
  )
}



