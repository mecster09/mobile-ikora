"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sword, Plus, Minus, Settings, Zap, Star, Trash2 } from "lucide-react"
import type { Hero, Weapon, WeaponType, WeaponMod, UpgradeCost } from "@/lib/types"
import { MAX_LEVELS } from "@/lib/hero-defaults"
import { getUpgradeCostsToLevel, calculateTotalMaterials } from "@/lib/csv-data"

interface WeaponUpgradePanelProps {
  hero: Hero
  onHeroUpdate: (updatedHero: Hero) => void
}

interface UpgradePreview {
  weaponId: string
  path: string
  fromLevel: number
  toLevel: number
  costs: UpgradeCost[]
  totalMaterials: Record<string, number>
}

export function WeaponUpgradePanel({ hero, onHeroUpdate }: WeaponUpgradePanelProps) {
  const [upgradePreview, setUpgradePreview] = useState<UpgradePreview | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const updateWeapon = (weaponId: string, updates: Partial<Weapon>) => {
    const updatedHero = { ...hero }
    const weaponIndex = updatedHero.weapons.findIndex((w) => w.id === weaponId)
    if (weaponIndex !== -1) {
      updatedHero.weapons[weaponIndex] = { ...updatedHero.weapons[weaponIndex], ...updates }
      onHeroUpdate(updatedHero)
    }
  }

  const addMod = (weaponId: string) => {
    const weapon = hero.weapons.find((w) => w.id === weaponId)
    if (!weapon || !weapon.mods) return

    if (weapon.mods.length < 3) {
      const newMod: WeaponMod = {
        id: `mod-${Date.now()}`,
        name: `Mod ${weapon.mods.length + 1}`,
        level: 0,
      }
      updateWeapon(weaponId, { mods: [...weapon.mods, newMod] })
    }
  }

  const updateMod = (weaponId: string, modId: string, updates: Partial<WeaponMod>) => {
    const weapon = hero.weapons.find((w) => w.id === weaponId)
    if (!weapon || !weapon.mods) return

    const updatedMods = weapon.mods.map((mod) => (mod.id === modId ? { ...mod, ...updates } : mod))
    updateWeapon(weaponId, { mods: updatedMods })
  }

  const removeMod = (weaponId: string, modId: string) => {
    const weapon = hero.weapons.find((w) => w.id === weaponId)
    if (!weapon || !weapon.mods) return

    const updatedMods = weapon.mods.filter((mod) => mod.id !== modId)
    updateWeapon(weaponId, { mods: updatedMods })
  }

  const calculateUpgradeCost = async (weaponId: string, path: string, fromLevel: number, toLevel: number) => {
    if (fromLevel >= toLevel) {
      setUpgradePreview(null)
      return
    }

    setIsCalculating(true)
    try {
      const costs = await getUpgradeCostsToLevel(path, fromLevel, toLevel)
      const totalMaterials = calculateTotalMaterials(costs)

      setUpgradePreview({
        weaponId,
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

  const getGearLevelProgress = (gearLevel: number) => (gearLevel / MAX_LEVELS.gearLevel) * 100
  const getEnhancementProgress = (enhancement: number) => (enhancement / MAX_LEVELS.enhancement) * 100
  const getModProgress = (level: number) => (level / MAX_LEVELS.mod) * 100

  const canHaveMods = (weapon: Weapon) =>
    hero.rarity === "mythic" && (weapon.type === "normal" || weapon.type === "exotic")
  const canHaveRefinement = (weapon: Weapon) => weapon.type === "exotic"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sword className="h-6 w-6 text-accent" />
            Weapon Upgrades
          </CardTitle>
          <CardDescription>Manage gear levels, enhancements, mods, and refinement for your weapons</CardDescription>
        </CardHeader>
      </Card>

      {hero.weapons.map((weapon, weaponIndex) => (
        <Card key={weapon.id} className="border-l-4 border-l-accent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sword className="h-5 w-5 text-accent" />
                  {weapon.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={weapon.type === "exotic" ? "default" : "secondary"}>
                    {weapon.type === "exotic" ? "Exotic" : "Normal"}
                  </Badge>
                  {weapon.type === "exotic" && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor={`weapon-type-${weapon.id}`}>Type:</Label>
                <Select
                  value={weapon.type}
                  onValueChange={(value: WeaponType) => updateWeapon(weapon.id, { type: value })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="exotic">Exotic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Gear Level */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">Gear Level</h4>
                  <Badge variant="secondary">Level {weapon.gearLevel}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateWeapon(weapon.id, { gearLevel: Math.max(0, weapon.gearLevel - 5) })}
                    disabled={weapon.gearLevel <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateWeapon(weapon.id, { gearLevel: Math.min(MAX_LEVELS.gearLevel, weapon.gearLevel + 5) })
                    }
                    disabled={weapon.gearLevel >= MAX_LEVELS.gearLevel}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress (0 → {MAX_LEVELS.gearLevel})</span>
                  <span>{Math.round(getGearLevelProgress(weapon.gearLevel))}%</span>
                </div>
                <Progress value={getGearLevelProgress(weapon.gearLevel)} className="h-2" />
              </div>

              <Slider
                value={[weapon.gearLevel]}
                onValueChange={([value]) => updateWeapon(weapon.id, { gearLevel: value })}
                max={MAX_LEVELS.gearLevel}
                min={0}
                step={5}
                className="w-full"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => calculateUpgradeCost(weapon.id, "gear level", weapon.gearLevel, weapon.gearLevel + 5)}
                disabled={weapon.gearLevel >= MAX_LEVELS.gearLevel || isCalculating}
              >
                {isCalculating ? "Calculating..." : "Preview Next Level Cost"}
              </Button>
            </div>

            {/* Enhancement */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="font-medium">Enhancement</h4>
                  <Badge variant="secondary">Level {weapon.enhancement}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateWeapon(weapon.id, { enhancement: Math.max(0, weapon.enhancement - 1) })}
                    disabled={weapon.enhancement <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateWeapon(weapon.id, { enhancement: Math.min(MAX_LEVELS.enhancement, weapon.enhancement + 1) })
                    }
                    disabled={weapon.enhancement >= MAX_LEVELS.enhancement}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress (0 → {MAX_LEVELS.enhancement})</span>
                  <span>{Math.round(getEnhancementProgress(weapon.enhancement))}%</span>
                </div>
                <Progress value={getEnhancementProgress(weapon.enhancement)} className="h-2" />
              </div>

              <Slider
                value={[weapon.enhancement]}
                onValueChange={([value]) => updateWeapon(weapon.id, { enhancement: value })}
                max={MAX_LEVELS.enhancement}
                min={0}
                step={1}
                className="w-full"
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  calculateUpgradeCost(weapon.id, "enhancement", weapon.enhancement, weapon.enhancement + 1)
                }
                disabled={weapon.enhancement >= MAX_LEVELS.enhancement || isCalculating}
              >
                {isCalculating ? "Calculating..." : "Preview Next Level Cost"}
              </Button>
            </div>

            {/* Mods (Mythic only) */}
            {canHaveMods(weapon) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Mods ({weapon.mods?.length || 0}/3)
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addMod(weapon.id)}
                    disabled={(weapon.mods?.length || 0) >= 3}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Mod
                  </Button>
                </div>

                {weapon.mods?.map((mod, modIndex) => (
                  <Card key={mod.id} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Input
                              value={mod.name}
                              onChange={(e) => updateMod(weapon.id, mod.id, { name: e.target.value })}
                              className="w-32"
                            />
                            <Badge variant="secondary">Level {mod.level}</Badge>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => removeMod(weapon.id, mod.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress (0 → {MAX_LEVELS.mod})</span>
                            <span>{Math.round(getModProgress(mod.level))}%</span>
                          </div>
                          <Progress value={getModProgress(mod.level)} className="h-2" />
                        </div>

                        <Slider
                          value={[mod.level]}
                          onValueChange={([value]) => updateMod(weapon.id, mod.id, { level: value })}
                          max={MAX_LEVELS.mod}
                          min={0}
                          step={1}
                          className="w-full"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            calculateUpgradeCost(weapon.id, `mod ${modIndex + 1}`, mod.level, mod.level + 1)
                          }
                          disabled={mod.level >= MAX_LEVELS.mod || isCalculating}
                        >
                          {isCalculating ? "Calculating..." : "Preview Next Level Cost"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Refinement (Exotic only) */}
            {canHaveRefinement(weapon) && (
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Refinement
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Catalyst */}
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Catalyst</h5>
                          <Badge variant="secondary">Level {weapon.refinement?.catalyst || 0}</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress (0 → {MAX_LEVELS.catalyst})</span>
                            <span>{Math.round(((weapon.refinement?.catalyst || 0) / MAX_LEVELS.catalyst) * 100)}%</span>
                          </div>
                          <Progress
                            value={((weapon.refinement?.catalyst || 0) / MAX_LEVELS.catalyst) * 100}
                            className="h-2"
                          />
                        </div>

                        <Slider
                          value={[weapon.refinement?.catalyst || 0]}
                          onValueChange={([value]) =>
                            updateWeapon(weapon.id, {
                              refinement: {
                                ...weapon.refinement,
                                catalyst: value,
                                boost: weapon.refinement?.boost || 0,
                              },
                            })
                          }
                          max={MAX_LEVELS.catalyst}
                          min={0}
                          step={1}
                          className="w-full"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            calculateUpgradeCost(
                              weapon.id,
                              "catalyst",
                              weapon.refinement?.catalyst || 0,
                              (weapon.refinement?.catalyst || 0) + 1,
                            )
                          }
                          disabled={(weapon.refinement?.catalyst || 0) >= MAX_LEVELS.catalyst || isCalculating}
                        >
                          {isCalculating ? "Calculating..." : "Preview Next Level Cost"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Boost */}
                  <Card className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Boost</h5>
                          <Badge variant="secondary">Level {weapon.refinement?.boost || 0}</Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress (0 → {MAX_LEVELS.boost})</span>
                            <span>{Math.round(((weapon.refinement?.boost || 0) / MAX_LEVELS.boost) * 100)}%</span>
                          </div>
                          <Progress
                            value={((weapon.refinement?.boost || 0) / MAX_LEVELS.boost) * 100}
                            className="h-2"
                          />
                        </div>

                        <Slider
                          value={[weapon.refinement?.boost || 0]}
                          onValueChange={([value]) =>
                            updateWeapon(weapon.id, {
                              refinement: {
                                ...weapon.refinement,
                                boost: value,
                                catalyst: weapon.refinement?.catalyst || 0,
                              },
                            })
                          }
                          max={MAX_LEVELS.boost}
                          min={0}
                          step={1}
                          className="w-full"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            calculateUpgradeCost(
                              weapon.id,
                              "boost",
                              weapon.refinement?.boost || 0,
                              (weapon.refinement?.boost || 0) + 1,
                            )
                          }
                          disabled={(weapon.refinement?.boost || 0) >= MAX_LEVELS.boost || isCalculating}
                        >
                          {isCalculating ? "Calculating..." : "Preview Next Level Cost"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Upgrade Cost Preview */}
      {upgradePreview && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Upgrade Cost Preview</CardTitle>
            <CardDescription>
              {hero.weapons.find((w) => w.id === upgradePreview.weaponId)?.name} - {upgradePreview.path} (Level{" "}
              {upgradePreview.fromLevel} → {upgradePreview.toLevel})
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
