"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { DataStatus } from "@/components/data-status"
import { HeroSetupForm } from "@/components/hero-setup-form"
import { HeroOverview } from "@/components/hero-overview"
import { HeroManager } from "@/components/hero-manager"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import type { Hero } from "@/lib/types"
import { getCurrentHero, saveHero, isStorageAvailable } from "@/lib/hero-storage"

export default function HeroPage() {
  const [currentHero, setCurrentHero] = useState<Hero | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showManager, setShowManager] = useState(false)
  const [storageAvailable] = useState(isStorageAvailable())

  useEffect(() => {
    if (storageAvailable) {
      const savedHero = getCurrentHero()
      if (savedHero) {
        setCurrentHero(savedHero)
      } else {
        setShowManager(true)
      }
    }
  }, [storageAvailable])

  const handleHeroCreated = (hero: Hero) => {
    setCurrentHero(hero)
    setIsEditing(false)
    setShowManager(false)
    if (storageAvailable) {
      saveHero(hero)
    }
  }

  const handleHeroSelected = (hero: Hero) => {
    setCurrentHero(hero)
    setShowManager(false)
  }

  const handleEditHero = () => {
    setIsEditing(true)
  }

  const handleBackToSetup = () => {
    setCurrentHero(null)
    setIsEditing(false)
    setShowManager(true)
  }

  const handleSaveHero = () => {
    if (currentHero && storageAvailable) {
      saveHero(currentHero)
    }
  }

  const handleShowManager = () => {
    setShowManager(true)
  }

  const handleCreateNew = () => {
    setCurrentHero(null)
    setIsEditing(false)
    setShowManager(false)
  }

  useEffect(() => {
    if (currentHero && storageAvailable && !isEditing) {
      saveHero(currentHero)
    }
  }, [currentHero, storageAvailable, isEditing])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {showManager ? (
          <HeroManager onHeroSelected={handleHeroSelected} onCreateNew={handleCreateNew} />
        ) : !currentHero || isEditing ? (
          <div className="space-y-6">
            {currentHero && (
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Overview
                </Button>
                <h1 className="text-2xl font-bold">Edit Hero</h1>
              </div>
            )}

            {!currentHero && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" onClick={handleShowManager}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Manager
                  </Button>
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-balance mb-4">Hero Setup</h1>
                  <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                    Create your hero profile to start tracking upgrades and materials
                  </p>
                </div>
              </div>
            )}

            <DataStatus />
            <HeroSetupForm onHeroCreated={handleHeroCreated} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Hero Dashboard</h1>
              <div className="flex items-center gap-2">
                {storageAvailable && (
                  <Button variant="outline" onClick={handleSaveHero}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                )}
                <Button variant="outline" onClick={handleShowManager}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Hero Manager
                </Button>
              </div>
            </div>

            <HeroOverview hero={currentHero} onEdit={handleEditHero} />
          </div>
        )}
      </main>
    </div>
  )
}
