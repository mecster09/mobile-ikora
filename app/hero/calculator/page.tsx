"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CostCalculator } from "@/components/cost-calculator"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Hero } from "@/lib/types"
import { createNewHero } from "@/lib/hero-defaults"

export default function CalculatorPage() {
  // For demo purposes, create a sample hero with some progress
  const [hero] = useState<Hero>(() => {
    const sampleHero = createNewHero("Sample Hero", "mythic")
    // Add some progress to show meaningful calculations
    sampleHero.relic.abilities[0].level = 5
    sampleHero.relic.abilities[1].level = 3
    sampleHero.relic.weaponMastery = 2
    sampleHero.weapons[0].gearLevel = 25
    sampleHero.weapons[0].enhancement = 3
    sampleHero.weapons[0].mods = [
      { id: "mod-1", name: "Power Mod", level: 2 },
      { id: "mod-2", name: "Speed Mod", level: 1 },
    ]
    sampleHero.weapons[1].type = "exotic"
    sampleHero.weapons[1].gearLevel = 15
    sampleHero.weapons[1].refinement = { catalyst: 1, boost: 0 }
    sampleHero.artifacts = [
      { id: "artifact-1", name: "Mystic Gem", level: 4 },
      { id: "artifact-2", name: "Power Crystal", level: 6 },
      { id: "artifact-3", name: "Speed Rune", level: 2 },
    ]
    return sampleHero
  })

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
            <h1 className="text-3xl font-bold">{hero.name} - Cost Calculator</h1>
            <p className="text-muted-foreground">Calculate materials needed for all your upgrades</p>
          </div>
        </div>

        <CostCalculator hero={hero} />
      </main>
    </div>
  )
}
