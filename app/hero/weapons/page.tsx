"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { WeaponUpgradePanel } from "@/components/weapon-upgrade-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Hero } from "@/lib/types"
import { createNewHero } from "@/lib/hero-defaults"

export default function WeaponsPage() {
  // For demo purposes, create a sample mythic hero to show all features
  const [hero, setHero] = useState<Hero>(() => {
    const sampleHero = createNewHero("Sample Mythic Hero", "mythic")
    // Initialize mods for mythic hero
    sampleHero.weapons[0].mods = []
    sampleHero.weapons[1].type = "exotic"
    sampleHero.weapons[1].refinement = { catalyst: 0, boost: 0 }
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
            <h1 className="text-3xl font-bold">{hero.name} - Weapon Upgrades</h1>
            <p className="text-muted-foreground">Manage gear levels, enhancements, mods, and refinement</p>
          </div>
        </div>

        <WeaponUpgradePanel hero={hero} onHeroUpdate={handleHeroUpdate} />
      </main>
    </div>
  )
}
