'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { RefreshCw } from 'lucide-react'
import Image from 'next/image'

type MonsterFormData = {
  name: string
  attack: number
  defense: number
  speed: number
  hp: number
  image_url: string
}

export default function CreateMonster() {
  const router = useRouter()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<MonsterFormData>()
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const onSubmit = async (data: MonsterFormData) => {
    setIsLoading(true)
    
    // Simular um atraso de 1 segundo
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirecionar para a página de batalha com os dados do monstro
    const monsterData = encodeURIComponent(JSON.stringify(data))
    router.push(`/battle?playerMonster=${monsterData}`)
  }

  // Gera imagem do monstro aleatória
  const generateRandomImage = () => {
    const randomSeed = Math.floor(Math.random() * 1000)
    const newImageUrl = `https://picsum.photos/seed/${randomSeed}/200/200`
    setValue('image_url', newImageUrl)
    setPreviewImage(newImageUrl)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar seu monstro</CardTitle>
          <CardDescription>Escolha uma pontuaçaõ em uma escala de 0 a 100</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name", { required: "Nome do monstro é obrigatório" })} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="attack">Ataque</Label>
              <Input id="attack" type="number" {...register("attack", { required: "Ataque é obrigatório", min: 1 })} />
              {errors.attack && <p className="text-red-500 text-sm mt-1">{errors.attack.message}</p>}
            </div>
            <div>
              <Label htmlFor="defense">Defesa</Label>
              <Input id="defense" type="number" {...register("defense", { required: "Defesa é obrigatório", min: 1 })} />
              {errors.defense && <p className="text-red-500 text-sm mt-1">{errors.defense.message}</p>}
            </div>
            <div>
              <Label htmlFor="speed">Velocidade</Label>
              <Input id="speed" type="number" {...register("speed", { required: "Velocidade é obrigatório", min: 1 })} />
              {errors.speed && <p className="text-red-500 text-sm mt-1">{errors.speed.message}</p>}
            </div>
            <div>
              <Label htmlFor="hp">Vida</Label>
              <Input id="hp" type="number" {...register("hp", { required: "Vida é obrigatório", min: 1 })} />
              {errors.hp && <p className="text-red-500 text-sm mt-1">{errors.hp.message}</p>}
            </div>
            <div>
              <Label htmlFor="image_url">Imagem do Monstro</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="image_url" 
                  {...register("image_url", { required: "URL da imagem é obrigatória" })} 
                  placeholder="URL da imagem ou clique para gerar"
                />
                <Button type="button" onClick={generateRandomImage} variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>}
            </div>
            {previewImage && (
              <div className="mt-4">
                <Image 
                src={previewImage} 
                alt="Preview do monstro" 
                className="w-full h-48 object-cover rounded-md"
                layout="responsive"
                width={200}
                height={200} />
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit(onSubmit)} disabled={isLoading} className="w-full">
            {isLoading ? "Criando..." : "Criar Monstro & Iniciar Batalha"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

