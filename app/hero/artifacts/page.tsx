"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { ArtifactUpgradePanel } from "@/components/artifact-upgrade-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Hero } from "@/lib/types"
import { createNewHero } from "@/lib/hero-defaults"

export default function ArtifactsPage() {
  // For demo purposes, create a sample hero with some artifacts
  const [hero, setHero] = useState<Hero>(() => {
    const sampleHero = createNewHero("Sample Hero", "legendary")
    // Add a couple of sample artifacts
    sampleHero.artifacts = [
      { id: "artifact-1", name: "Mystic Gem", level: 3 },
      { id: "artifact-2", name: "Power Crystal", level: 7 },
    ]
    return sampleHero
  })

  const handleHeroUpdate = (updatedHero: Hero) => {
    setHero(updatedHero)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/hero">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hero
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{hero.name} - Artifact Upgrades</h1>
            <p className="text-muted-foreground">Manage up to 4 artifacts to enhance your hero</p>
          </div>
        </div>

        <ArtifactUpgradePanel hero={hero} onHeroUpdate={handleHeroUpdate} />
      </main>
    </div>
  )
}
