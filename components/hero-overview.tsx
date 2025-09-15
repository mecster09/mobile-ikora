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
      legendary: { stars: 4, color: "text-purple-400", glow: "legendary-glow" },
      mythic: { stars: 5, color: "text-orange-400", glow: "mythic-glow" },
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

  const { stars, color, glow } = getRarityInfo()

  return (
    <div className="space-y-6">
      <Card className="destiny-card destiny-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="relative">
                  <Shield className={`h-8 w-8 text-accent ${glow}`} />
                  <div className="absolute inset-0 h-8 w-8 border border-accent/30 rotate-45 -z-10"></div>
                </div>
                <span className="tracking-wide">{hero.name}</span>
              </CardTitle>
              <CardDescription className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <span className="capitalize text-base font-medium">{hero.rarity}</span>
                  <div className="flex">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${color} fill-current ${glow}`} />
                    ))}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 font-mono">
                  POWER ◆ {hero.power}
                </Badge>
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onEdit} className="destiny-button bg-transparent">
              <Edit className="h-4 w-4 mr-2" />
              EDIT
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="destiny-card hover:destiny-glow transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-primary">
              <div className="relative">
                <Shield className="h-6 w-6" />
                <div className="absolute inset-0 h-6 w-6 border border-primary/30 rotate-45 -z-10"></div>
              </div>
              RELIC PROGRESS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-muted-foreground">ABILITIES</span>
                  <span className="text-accent">{Math.round(getAbilityProgress())}%</span>
                </div>
                <Progress value={getAbilityProgress()} className="h-3 bg-muted/30" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-muted-foreground block">WEAPON MASTERY</span>
                  <div className="text-accent font-bold">
                    {hero.relic.weaponMastery}/{MAX_LEVELS.weaponMastery}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground block">RELIC TRAIT</span>
                  <div className="text-accent font-bold">
                    {hero.relic.relicTrait}/{MAX_LEVELS.relicTrait}
                  </div>
                </div>
              </div>
              <Link href="/hero/relic">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 destiny-button group-hover:destiny-glow bg-transparent"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  MANAGE RELIC
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="destiny-card hover:destiny-glow transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-accent">
              <div className="relative">
                <Sword className="h-6 w-6" />
                <div className="absolute inset-0 h-6 w-6 border border-accent/30 rotate-45 -z-10"></div>
              </div>
              WEAPONS ({hero.weapons.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-muted-foreground">OVERALL PROGRESS</span>
                  <span className="text-accent">{Math.round(getWeaponProgress())}%</span>
                </div>
                <Progress value={getWeaponProgress()} className="h-3 bg-muted/30" />
              </div>
              <div className="space-y-2 text-xs font-mono">
                {hero.weapons.map((weapon, index) => (
                  <div
                    key={weapon.id}
                    className="flex justify-between items-center p-2 bg-muted/20 rounded border border-muted/30"
                  >
                    <span className="text-muted-foreground">{weapon.name}:</span>
                    <span className="text-accent font-bold">
                      GL{weapon.gearLevel} E{weapon.enhancement}
                      {weapon.type === "exotic" && <span className="text-yellow-400 ml-1">◆</span>}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/hero/weapons">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 destiny-button group-hover:destiny-glow bg-transparent"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  MANAGE WEAPONS
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="destiny-card hover:destiny-glow transition-all duration-300 group">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-primary">
              <div className="relative">
                <Gem className="h-6 w-6" />
                <div className="absolute inset-0 h-6 w-6 border border-primary/30 rotate-45 -z-10"></div>
              </div>
              ARTIFACTS ({hero.artifacts.length}/4)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-muted-foreground">PROGRESS</span>
                  <span className="text-accent">{Math.round(getArtifactProgress())}%</span>
                </div>
                <Progress value={getArtifactProgress()} className="h-3 bg-muted/30" />
              </div>
              {hero.artifacts.length > 0 ? (
                <div className="space-y-2 text-xs font-mono">
                  {hero.artifacts.map((artifact) => (
                    <div
                      key={artifact.id}
                      className="flex justify-between items-center p-2 bg-muted/20 rounded border border-muted/30"
                    >
                      <span className="text-muted-foreground">{artifact.name}:</span>
                      <span className="text-accent font-bold">LEVEL {artifact.level}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-mono text-center py-4 border border-dashed border-muted/30 rounded">
                  NO ARTIFACTS EQUIPPED
                </p>
              )}
              <Link href="/hero/artifacts">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 destiny-button group-hover:destiny-glow bg-transparent"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  MANAGE ARTIFACTS
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="destiny-card border-accent/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-accent text-xl">
            <div className="relative">
              <Calculator className="h-7 w-7" />
              <div className="absolute inset-0 h-7 w-7 border border-accent/30 rotate-45 -z-10"></div>
            </div>
            UPGRADE COST CALCULATOR
          </CardTitle>
          <CardDescription className="text-base">
            Calculate total materials needed for all your planned upgrades
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Link href="/hero/calculator">
            <Button className="w-full destiny-button text-lg py-6">
              <Calculator className="h-5 w-5 mr-3" />
              OPEN COST CALCULATOR
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
