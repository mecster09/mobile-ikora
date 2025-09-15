"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gem, Plus, Minus, Trash2 } from "lucide-react"
import type { Hero, Artifact, UpgradeCost } from "@/lib/types"
import { MAX_LEVELS, createDefaultArtifact } from "@/lib/hero-defaults"
import { getUpgradeCostsToLevel, calculateTotalMaterials } from "@/lib/csv-data"

interface ArtifactUpgradePanelProps {
  hero: Hero
  onHeroUpdate: (updatedHero: Hero) => void
}

interface UpgradePreview {
  artifactId: string
  path: string
  fromLevel: number
  toLevel: number
  costs: UpgradeCost[]
  totalMaterials: Record<string, number>
}

export function ArtifactUpgradePanel({ hero, onHeroUpdate }: ArtifactUpgradePanelProps) {
  const [upgradePreview, setUpgradePreview] = useState<UpgradePreview | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const addArtifact = () => {
    if (hero.artifacts.length >= 4) return

    const newArtifact = createDefaultArtifact(`artifact-${Date.now()}`, `Artifact ${hero.artifacts.length + 1}`)
    const updatedHero = { ...hero }
    updatedHero.artifacts = [...updatedHero.artifacts, newArtifact]
    onHeroUpdate(updatedHero)
  }

  const updateArtifact = (artifactId: string, updates: Partial<Artifact>) => {
    const updatedHero = { ...hero }
    const artifactIndex = updatedHero.artifacts.findIndex((a) => a.id === artifactId)
    if (artifactIndex !== -1) {
      updatedHero.artifacts[artifactIndex] = { ...updatedHero.artifacts[artifactIndex], ...updates }
      onHeroUpdate(updatedHero)
    }
  }

  const removeArtifact = (artifactId: string) => {
    const updatedHero = { ...hero }
    updatedHero.artifacts = updatedHero.artifacts.filter((a) => a.id !== artifactId)
    onHeroUpdate(updatedHero)
  }

  const calculateUpgradeCost = async (
    artifactId: string,
    artifactIndex: number,
    fromLevel: number,
    toLevel: number,
  ) => {
    if (fromLevel >= toLevel) {
      setUpgradePreview(null)
      return
    }

    setIsCalculating(true)
    try {
      const path = `artifact ${artifactIndex + 1}`
      const costs = await getUpgradeCostsToLevel(path, fromLevel, toLevel)
      const totalMaterials = calculateTotalMaterials(costs)

      setUpgradePreview({
        artifactId,
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

  const getArtifactProgress = (level: number) => (level / MAX_LEVELS.artifact) * 100

  const getOverallProgress = () => {
    if (hero.artifacts.length === 0) return 0
    const totalLevels = hero.artifacts.reduce((sum, artifact) => sum + artifact.level, 0)
    const maxLevels = hero.artifacts.length * MAX_LEVELS.artifact
    return (totalLevels / maxLevels) * 100
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gem className="h-6 w-6 text-primary" />
                Artifact Upgrades
              </CardTitle>
              <CardDescription>Manage up to 4 artifacts (levels 0 → {MAX_LEVELS.artifact})</CardDescription>
            </div>
            <Button onClick={addArtifact} disabled={hero.artifacts.length >= 4}>
              <Plus className="h-4 w-4 mr-2" />
              Add Artifact ({hero.artifacts.length}/4)
            </Button>
          </div>
        </CardHeader>
        {hero.artifacts.length > 0 && (
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(getOverallProgress())}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-3" />
            </div>
          </CardContent>
        )}
      </Card>

      {hero.artifacts.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Gem className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Artifacts Equipped</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add up to 4 artifacts to enhance your hero's capabilities
            </p>
            <Button onClick={addArtifact}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Artifact
            </Button>
          </CardContent>
        </Card>
      )}

      {hero.artifacts.map((artifact, artifactIndex) => (
        <Card key={artifact.id} className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gem className="h-5 w-5 text-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`artifact-name-${artifact.id}`} className="sr-only">
                      Artifact Name
                    </Label>
                    <Input
                      id={`artifact-name-${artifact.id}`}
                      value={artifact.name}
                      onChange={(e) => updateArtifact(artifact.id, { name: e.target.value })}
                      className="font-medium text-lg border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                      placeholder="Artifact Name"
                    />
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    Level {artifact.level}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => removeArtifact(artifact.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Artifact Level</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateArtifact(artifact.id, { level: Math.max(0, artifact.level - 1) })}
                    disabled={artifact.level <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateArtifact(artifact.id, { level: Math.min(MAX_LEVELS.artifact, artifact.level + 1) })
                    }
                    disabled={artifact.level >= MAX_LEVELS.artifact}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress (0 → {MAX_LEVELS.artifact})</span>
                  <span>{Math.round(getArtifactProgress(artifact.level))}%</span>
                </div>
                <Progress value={getArtifactProgress(artifact.level)} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Target Level</span>
                  <span>
                    {artifact.level} → {MAX_LEVELS.artifact}
                  </span>
                </div>
                <Slider
                  value={[artifact.level]}
                  onValueChange={([value]) => updateArtifact(artifact.id, { level: value })}
                  max={MAX_LEVELS.artifact}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => calculateUpgradeCost(artifact.id, artifactIndex, artifact.level, artifact.level + 1)}
                  disabled={artifact.level >= MAX_LEVELS.artifact || isCalculating}
                >
                  {isCalculating ? "Calculating..." : "Preview Next Level"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => calculateUpgradeCost(artifact.id, artifactIndex, artifact.level, MAX_LEVELS.artifact)}
                  disabled={artifact.level >= MAX_LEVELS.artifact || isCalculating}
                >
                  {isCalculating ? "Calculating..." : "Preview Max Level"}
                </Button>
              </div>
            </div>

            {/* Artifact Stats Preview */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h5 className="font-medium mb-2">Artifact Stats</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Level:</span>
                  <div className="font-medium">{artifact.level}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Max Level:</span>
                  <div className="font-medium">{MAX_LEVELS.artifact}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Progress:</span>
                  <div className="font-medium">{Math.round(getArtifactProgress(artifact.level))}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Remaining:</span>
                  <div className="font-medium">{MAX_LEVELS.artifact - artifact.level} levels</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Upgrade Cost Preview */}
      {upgradePreview && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="text-lg text-accent">Upgrade Cost Preview</CardTitle>
            <CardDescription>
              {hero.artifacts.find((a) => a.id === upgradePreview.artifactId)?.name} - {upgradePreview.path} (Level{" "}
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

      {/* Quick Actions */}
      {hero.artifacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Batch operations for all artifacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updatedHero = { ...hero }
                  updatedHero.artifacts = updatedHero.artifacts.map((artifact) => ({ ...artifact, level: 0 }))
                  onHeroUpdate(updatedHero)
                }}
              >
                Reset All to Level 0
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updatedHero = { ...hero }
                  updatedHero.artifacts = updatedHero.artifacts.map((artifact) => ({
                    ...artifact,
                    level: MAX_LEVELS.artifact,
                  }))
                  onHeroUpdate(updatedHero)
                }}
              >
                Max All Artifacts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updatedHero = { ...hero }
                  updatedHero.artifacts = []
                  onHeroUpdate(updatedHero)
                }}
                disabled={hero.artifacts.length === 0}
              >
                Remove All Artifacts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
