"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Star, Shield } from "lucide-react"
import type { Hero, HeroRarity } from "@/lib/types"
import { createNewHero, STARTING_LEVELS } from "@/lib/hero-defaults"

interface HeroSetupFormProps {
  onHeroCreated: (hero: Hero) => void
  initialHero?: Hero
}

export function HeroSetupForm({ onHeroCreated, initialHero }: HeroSetupFormProps) {
  const [heroName, setHeroName] = useState(initialHero?.name || "")
  const [heroRarity, setHeroRarity] = useState<HeroRarity>(initialHero?.rarity || "legendary")
  const [isCreating, setIsCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!heroName.trim()) return

    setIsCreating(true)
    try {
      const hero = initialHero
        ? { ...initialHero, name: heroName.trim(), rarity: heroRarity }
        : createNewHero(heroName.trim(), heroRarity)
      onHeroCreated(hero)
    } finally {
      setIsCreating(false)
    }
  }

  const getRarityInfo = (rarity: HeroRarity) => {
    const info = STARTING_LEVELS[rarity]
    const rarityConfig = {
      legendary: { stars: 4, color: "text-purple-500", bgColor: "bg-purple-500/10" },
      mythic: { stars: 5, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    }

    return {
      ...rarityConfig[rarity],
      power: info.power,
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {initialHero ? "Edit Hero" : "Create Your Hero"}
        </CardTitle>
        <CardDescription>
          {initialHero
            ? "Update your hero's information"
            : "Set up your hero's basic information to start tracking upgrades"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="hero-name">Hero Name</Label>
            <Input
              id="hero-name"
              placeholder="Enter your hero's name"
              value={heroName}
              onChange={(e) => setHeroName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Hero Rarity</Label>
            <RadioGroup value={heroRarity} onValueChange={(value) => setHeroRarity(value as HeroRarity)}>
              <div className="grid grid-cols-1 gap-4">
                {(
                  [
                    ["legendary", "Legendary"],
                    ["mythic", "Mythic"],
                  ] as const
                ).map(([rarity, displayName]) => {
                  const info = getRarityInfo(rarity)
                  return (
                    <div key={rarity} className="flex items-center space-x-2">
                      <RadioGroupItem value={rarity} id={rarity} />
                      <Label
                        htmlFor={rarity}
                        className={`flex-1 cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                          heroRarity === rarity ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{displayName}</span>
                              <div className="flex">
                                {Array.from({ length: info.stars }).map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${info.color} fill-current`} />
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">Starting Power: {info.power}</div>
                          </div>
                          <Badge variant="secondary" className={info.bgColor}>
                            {info.stars}★
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  )
                })}
              </div>
            </RadioGroup>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Hero Configuration</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Starting Power:</span>
                <div className="font-medium">{getRarityInfo(heroRarity).power}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Abilities Level:</span>
                <div className="font-medium">1 (all 3 abilities)</div>
              </div>
              <div>
                <span className="text-muted-foreground">Weapon Slots:</span>
                <div className="font-medium">2 (max 1 Exotic)</div>
              </div>
              <div>
                <span className="text-muted-foreground">Artifact Slots:</span>
                <div className="font-medium">Up to 4</div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={!heroName.trim() || isCreating}>
            {isCreating
              ? initialHero
                ? "Updating Hero..."
                : "Creating Hero..."
              : initialHero
                ? "Update Hero"
                : "Create Hero"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
