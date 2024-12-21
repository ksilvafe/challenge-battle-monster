import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-600">
      <h1 className="mb-8 text-6xl font-bold text-white text-center">Batalha de Monstros</h1>
      <Link href="/create-monster">
        <Button size="lg" className="px-8 py-6 text-2xl">
          Play Game
        </Button>
      </Link>
    </div>
  );
}
