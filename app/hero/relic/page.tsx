"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { RelicUpgradePanel } from "@/components/relic-upgrade-panel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Hero } from "@/lib/types"
import { createNewHero } from "@/lib/hero-defaults"

export default function RelicPage() {
  // For demo purposes, create a sample hero
  // In a real app, this would come from state management or URL params
  const [hero, setHero] = useState<Hero>(() => createNewHero("Sample Hero", "legendary"))

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
            <h1 className="text-3xl font-bold">{hero.name} - Relic Upgrades</h1>
            <p className="text-muted-foreground">Manage abilities, weapon mastery, and relic traits</p>
          </div>
        </div>

        <RelicUpgradePanel hero={hero} onHeroUpdate={handleHeroUpdate} />
      </main>
    </div>
  )
}
