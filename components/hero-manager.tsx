"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Star, Trash2, RefreshCw, Plus, Clock } from "lucide-react"
import type { Hero } from "@/lib/types"
import { getSavedHeroes, loadHero, deleteHero, clearAllHeroData, type SavedHero } from "@/lib/hero-storage"

interface HeroManagerProps {
  onHeroSelected: (hero: Hero) => void
  onCreateNew: () => void
}

export function HeroManager({ onHeroSelected, onCreateNew }: HeroManagerProps) {
  const [savedHeroes, setSavedHeroes] = useState<SavedHero[]>([])

  useEffect(() => {
    setSavedHeroes(getSavedHeroes())
  }, [])

  const handleLoadHero = (heroId: string) => {
    const hero = loadHero(heroId)
    if (hero) {
      onHeroSelected(hero)
    }
  }

  const handleDeleteHero = (heroId: string) => {
    deleteHero(heroId)
    setSavedHeroes(getSavedHeroes())
  }

  const handleStartFresh = () => {
    clearAllHeroData()
    setSavedHeroes([])
  }

  const getRarityInfo = (rarity: string) => {
    const rarityConfig = {
      legendary: { stars: 4, color: "text-purple-500", bgColor: "bg-purple-500/10" },
      mythic: { stars: 5, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    }
    return rarityConfig[rarity as keyof typeof rarityConfig] || rarityConfig.legendary
  }

  const formatLastModified = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-balance mb-4">Hero Manager</h1>
        <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
          Load a previous hero or start fresh with a new one
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onCreateNew} size="lg" className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Hero
        </Button>

        {savedHeroes.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="h-5 w-5" />
                Start Fresh
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start Fresh</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all saved hero data from your session. Game data (materials and upgrade costs) will
                  not be affected. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleStartFresh}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete All Heroes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {savedHeroes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Saved Heroes ({savedHeroes.length})
            </CardTitle>
            <CardDescription>Load a previously created hero to continue tracking upgrades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {savedHeroes
                .sort((a, b) => b.lastModified - a.lastModified)
                .map((savedHero) => {
                  const rarityInfo = getRarityInfo(savedHero.rarity)
                  return (
                    <div
                      key={savedHero.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{savedHero.name}</h3>
                            <div className="flex">
                              {Array.from({ length: rarityInfo.stars }).map((_, i) => (
                                <Star key={i} className={`h-4 w-4 ${rarityInfo.color} fill-current`} />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className={rarityInfo.bgColor}>
                              {savedHero.rarity}
                            </Badge>
                            <span>•</span>
                            <span>Power: {savedHero.hero.power}</span>
                            <span>•</span>
                            <span>{formatLastModified(savedHero.lastModified)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleLoadHero(savedHero.id)} size="sm">
                          Load Hero
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Hero</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{savedHero.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteHero(savedHero.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {savedHeroes.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved heroes found</p>
              <p className="text-sm">Create your first hero to get started</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
