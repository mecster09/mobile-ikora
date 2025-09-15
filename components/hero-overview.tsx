"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Shield, Sword, Gem, Edit, ArrowRight, Calculator } from "lucide-react"
import Link from "next/link"
import type { Hero } from "@/lib/types"
import { MAX_LEVELS } from "@/lib/hero-defaults"

interface HeroOverviewProps {
  hero: Hero
  onEdit: () => void
}

export function HeroOverview({ hero, onEdit }: HeroOverviewProps) {
  const getRarityInfo = () => {
    const rarityConfig = {
      legendary: { stars: 4, color: "text-purple-500" },
      mythic: { stars: 5, color: "text-orange-500" },
    }

    return rarityConfig[hero.rarity]
  }

  const getAbilityProgress = () => {
    const totalLevels = hero.relic.abilities.reduce((sum, ability) => sum + ability.level, 0)
    const maxLevels = hero.relic.abilities.length * MAX_LEVELS.ability
    return (totalLevels / maxLevels) * 100
  }

  const getWeaponProgress = () => {
    const totalProgress = hero.weapons.reduce((sum, weapon) => {
      const gearProgress = weapon.gearLevel / MAX_LEVELS.gearLevel
      const enhanceProgress = weapon.enhancement / MAX_LEVELS.enhancement
      return sum + (gearProgress + enhanceProgress) / 2
    }, 0)
    return (totalProgress / hero.weapons.length) * 100
  }

  const getArtifactProgress = () => {
    if (hero.artifacts.length === 0) return 0
    const totalLevels = hero.artifacts.reduce((sum, artifact) => sum + artifact.level, 0)
    const maxLevels = hero.artifacts.length * MAX_LEVELS.artifact
    return (totalLevels / maxLevels) * 100
  }

  const { stars, color } = getRarityInfo()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                {hero.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="capitalize">{hero.rarity}</span>
                <div className="flex">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${color} fill-current`} />
                  ))}
                </div>
                <Badge variant="secondary">Power: {hero.power}</Badge>
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Relic Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Abilities</span>
                  <span>{Math.round(getAbilityProgress())}%</span>
                </div>
                <Progress value={getAbilityProgress()} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Weapon Mastery:</span>
                  <div>
                    {hero.relic.weaponMastery}/{MAX_LEVELS.weaponMastery}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Relic Trait:</span>
                  <div>
                    {hero.relic.relicTrait}/{MAX_LEVELS.relicTrait}
                  </div>
                </div>
              </div>
              <Link href="/hero/relic">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Manage Relic
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sword className="h-5 w-5 text-accent" />
              Weapons ({hero.weapons.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{Math.round(getWeaponProgress())}%</span>
                </div>
                <Progress value={getWeaponProgress()} className="h-2" />
              </div>
              <div className="space-y-1 text-xs">
                {hero.weapons.map((weapon, index) => (
                  <div key={weapon.id} className="flex justify-between">
                    <span className="text-muted-foreground">{weapon.name}:</span>
                    <span>
                      GL{weapon.gearLevel} E{weapon.enhancement}
                      {weapon.type === "exotic" && " ⭐"}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/hero/weapons">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Manage Weapons
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Gem className="h-5 w-5 text-primary" />
              Artifacts ({hero.artifacts.length}/4)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round(getArtifactProgress())}%</span>
                </div>
                <Progress value={getArtifactProgress()} className="h-2" />
              </div>
              {hero.artifacts.length > 0 ? (
                <div className="space-y-1 text-xs">
                  {hero.artifacts.map((artifact) => (
                    <div key={artifact.id} className="flex justify-between">
                      <span className="text-muted-foreground">{artifact.name}:</span>
                      <span>Level {artifact.level}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No artifacts equipped</p>
              )}
              <Link href="/hero/artifacts">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Manage Artifacts
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Calculator className="h-5 w-5" />
            Upgrade Cost Calculator
          </CardTitle>
          <CardDescription>Calculate total materials needed for all your planned upgrades</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/hero/calculator">
            <Button className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Open Cost Calculator
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
