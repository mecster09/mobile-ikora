"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Shield, Plus, Minus, Target, Zap } from "lucide-react"
import type { Hero, UpgradeCost } from "@/lib/types"
import { MAX_LEVELS } from "@/lib/hero-defaults"
import { getUpgradeCostsToLevel, calculateTotalMaterials } from "@/lib/csv-data"

interface RelicUpgradePanelProps {
  hero: Hero
  onHeroUpdate: (updatedHero: Hero) => void
}

interface UpgradePreview {
  path: string
  fromLevel: number
  toLevel: number
  costs: UpgradeCost[]
  totalMaterials: Record<string, number>
}

export function RelicUpgradePanel({ hero, onHeroUpdate }: RelicUpgradePanelProps) {
  const [upgradePreview, setUpgradePreview] = useState<UpgradePreview | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const updateAbilityLevel = (abilityIndex: number, newLevel: number) => {
    const updatedHero = { ...hero }
    updatedHero.relic.abilities[abilityIndex].level = newLevel
    onHeroUpdate(updatedHero)
  }

  const updateWeaponMastery = (newLevel: number) => {
    const updatedHero = { ...hero }
    updatedHero.relic.weaponMastery = newLevel
    onHeroUpdate(updatedHero)
  }

  const updateRelicTrait = (newLevel: number) => {
    const updatedHero = { ...hero }
    updatedHero.relic.relicTrait = newLevel
    onHeroUpdate(updatedHero)
  }

  const calculateUpgradeCost = async (path: string, fromLevel: number, toLevel: number) => {
    if (fromLevel >= toLevel) {
      setUpgradePreview(null)
      return
    }

    setIsCalculating(true)
    try {
      const costs = await getUpgradeCostsToLevel(path, fromLevel, toLevel)
      const totalMaterials = calculateTotalMaterials(costs)

      setUpgradePreview({
        path,
        fromLevel,
        toLevel,
        costs,
        totalMaterials,
      })
    } catch (error) {
      console.error("Error calculating upgrade cost:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const getAbilityProgress = (level: number) => (level / MAX_LEVELS.ability) * 100
  const getWeaponMasteryProgress = () => (hero.relic.weaponMastery / MAX_LEVELS.weaponMastery) * 100
  const getRelicTraitProgress = () => (hero.relic.relicTrait / MAX_LEVELS.relicTrait) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Relic Upgrades
          </CardTitle>
          <CardDescription>Manage your hero's abilities, weapon mastery, and relic traits</CardDescription>
        </CardHeader>
      </Card>

      {/* Abilities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Abilities
          </CardTitle>
          <CardDescription>Level up your three core abilities (1 → {MAX_LEVELS.ability})</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hero.relic.abilities.map((ability, index) => (
            <div key={ability.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">{ability.name}</h4>
                  <Badge variant="secondary">Level {ability.level}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateAbilityLevel(index, Math.max(1, ability.level - 1))}
                    disabled={ability.level <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateAbilityLevel(index, Math.min(MAX_LEVELS.ability, ability.level + 1))}
                    disabled={ability.level >= MAX_LEVELS.ability}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(getAbilityProgress(ability.level))}%</span>
                </div>
                <Progress value={getAbilityProgress(ability.level)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target Level</span>
                  <span>{ability.level} → ?</span>
                </div>
                <Slider
                  value={[ability.level]}
                  onValueChange={([value]) => updateAbilityLevel(index, value)}
                  max={MAX_LEVELS.ability}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const abilityPaths = ["signature 1", "signature 2", "super"]
                  calculateUpgradeCost(abilityPaths[index], ability.level, ability.level + 1)
                }}
                disabled={ability.level >= MAX_LEVELS.ability || isCalculating}
              >
                {isCalculating ? "Calculating..." : "Preview Next Level Cost"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weapon Mastery Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Weapon Mastery
          </CardTitle>
          <CardDescription>Enhance weapon effectiveness (0 → {MAX_LEVELS.weaponMastery})</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="font-medium">Mastery Level</h4>
              <Badge variant="secondary">Level {hero.relic.weaponMastery}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateWeaponMastery(Math.max(0, hero.relic.weaponMastery - 1))}
                disabled={hero.relic.weaponMastery <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateWeaponMastery(Math.min(MAX_LEVELS.weaponMastery, hero.relic.weaponMastery + 1))}
                disabled={hero.relic.weaponMastery >= MAX_LEVELS.weaponMastery}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getWeaponMasteryProgress())}%</span>
            </div>
            <Progress value={getWeaponMasteryProgress()} className="h-2" />
          </div>

          <div className="space-y-2">
            <Slider
              value={[hero.relic.weaponMastery]}
              onValueChange={([value]) => updateWeaponMastery(value)}
              max={MAX_LEVELS.weaponMastery}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              calculateUpgradeCost("weapon mastery", hero.relic.weaponMastery, hero.relic.weaponMastery + 1)
            }
            disabled={hero.relic.weaponMastery >= MAX_LEVELS.weaponMastery || isCalculating}
          >
            {isCalculating ? "Calculating..." : "Preview Next Level Cost"}
          </Button>
        </CardContent>
      </Card>

      {/* Relic Trait Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Relic Trait
          </CardTitle>
          <CardDescription>Unlock special relic abilities (0 → {MAX_LEVELS.relicTrait})</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h4 className="font-medium">Trait Level</h4>
              <Badge variant="secondary">Level {hero.relic.relicTrait}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRelicTrait(Math.max(0, hero.relic.relicTrait - 1))}
                disabled={hero.relic.relicTrait <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateRelicTrait(Math.min(MAX_LEVELS.relicTrait, hero.relic.relicTrait + 1))}
                disabled={hero.relic.relicTrait >= MAX_LEVELS.relicTrait}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(getRelicTraitProgress())}%</span>
            </div>
            <Progress value={getRelicTraitProgress()} className="h-2" />
          </div>

          <div className="space-y-2">
            <Slider
              value={[hero.relic.relicTrait]}
              onValueChange={([value]) => updateRelicTrait(value)}
              max={MAX_LEVELS.relicTrait}
              min={0}
              step={1}
              className="w-full"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => calculateUpgradeCost("relic trait", hero.relic.relicTrait, hero.relic.relicTrait + 1)}
            disabled={hero.relic.relicTrait >= MAX_LEVELS.relicTrait || isCalculating}
          >
            {isCalculating ? "Calculating..." : "Preview Next Level Cost"}
          </Button>
        </CardContent>
      </Card>

      {/* Upgrade Cost Preview */}
      {upgradePreview && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Upgrade Cost Preview</CardTitle>
            <CardDescription>
              {upgradePreview.path} (Level {upgradePreview.fromLevel} → {upgradePreview.toLevel})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-medium">Required Materials:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(upgradePreview.totalMaterials).map(([material, amount]) => (
                  <div key={material} className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{material}</span>
                    <Badge variant="secondary">{amount}</Badge>
                  </div>
                ))}
              </div>
              {Object.keys(upgradePreview.totalMaterials).length === 0 && (
                <p className="text-sm text-muted-foreground">No materials required for this upgrade.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
