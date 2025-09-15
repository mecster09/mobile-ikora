"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, Zap, Shield, Sword, Gem, RefreshCw } from "lucide-react"
import type { Hero } from "@/lib/types"
import {
  calculateMaxUpgradePlan,
  calculateUpgradePlan,
  groupTargetsByCategory,
  calculateUpgradeProgress,
  type UpgradePlan,
} from "@/lib/upgrade-calculator"

interface CostCalculatorProps {
  hero: Hero
}

export function CostCalculator({ hero }: CostCalculatorProps) {
  const [upgradePlan, setUpgradePlan] = useState<UpgradePlan | null>(null)
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set())
  const [isCalculating, setIsCalculating] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")

  const calculateMaxPlan = async () => {
    setIsCalculating(true)
    try {
      const plan = await calculateMaxUpgradePlan(hero)
      setUpgradePlan(plan)
      // Select all targets by default
      const targetKeys = plan.targets.map((t, i) => `${t.category}-${t.path}-${i}`)
      setSelectedTargets(new Set(targetKeys))
    } catch (error) {
      console.error("Error calculating upgrade plan:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const calculateSelectedPlan = async () => {
    if (!upgradePlan || selectedTargets.size === 0) return

    setIsCalculating(true)
    try {
      const selectedTargetsList = upgradePlan.targets.filter((_, i) => {
        const key = `${upgradePlan.targets[i].category}-${upgradePlan.targets[i].path}-${i}`
        return selectedTargets.has(key)
      })

      const plan = await calculateUpgradePlan(selectedTargetsList)
      setUpgradePlan(plan)
    } catch (error) {
      console.error("Error calculating selected upgrade plan:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const toggleTarget = (targetIndex: number) => {
    if (!upgradePlan) return

    const key = `${upgradePlan.targets[targetIndex].category}-${upgradePlan.targets[targetIndex].path}-${targetIndex}`
    const newSelected = new Set(selectedTargets)

    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }

    setSelectedTargets(newSelected)
  }

  const selectAllInCategory = (category: string, select: boolean) => {
    if (!upgradePlan) return

    const newSelected = new Set(selectedTargets)

    upgradePlan.targets.forEach((target, index) => {
      const key = `${target.category}-${target.path}-${index}`
      if (target.category === category) {
        if (select) {
          newSelected.add(key)
        } else {
          newSelected.delete(key)
        }
      }
    })

    setSelectedTargets(newSelected)
  }

  useEffect(() => {
    calculateMaxPlan()
  }, [hero])

  useEffect(() => {
    if (selectedTargets.size > 0) {
      calculateSelectedPlan()
    }
  }, [selectedTargets])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "relic":
        return <Shield className="h-4 w-4" />
      case "weapon":
        return <Sword className="h-4 w-4" />
      case "artifact":
        return <Gem className="h-4 w-4" />
      default:
        return <Calculator className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "relic":
        return "text-primary"
      case "weapon":
        return "text-accent"
      case "artifact":
        return "text-primary"
      default:
        return "text-foreground"
    }
  }

  if (!upgradePlan) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Calculating upgrade costs...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const groupedTargets = groupTargetsByCategory(upgradePlan.targets)
  const overallProgress = calculateUpgradeProgress(upgradePlan.targets)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            Upgrade Cost Calculator
          </CardTitle>
          <CardDescription>
            Calculate materials needed for your hero upgrades ({upgradePlan.targets.length} upgrades available)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            <div className="flex gap-2">
              <Button onClick={calculateMaxPlan} disabled={isCalculating}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isCalculating ? "animate-spin" : ""}`} />
                Recalculate All
              </Button>
              <Button variant="outline" onClick={() => setSelectedTargets(new Set())}>
                Clear Selection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="targets">Upgrade Targets</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Summary</CardTitle>
              <CardDescription>Overview of selected upgrades and total costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedTargets.size}</div>
                  <div className="text-sm text-muted-foreground">Selected Upgrades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {Object.keys(upgradePlan.materialSummary).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Material Types</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Object.values(upgradePlan.materialSummary).reduce((sum, amount) => sum + amount, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Materials</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(groupedTargets).map(([category, targets]) => {
              const categorySelected = targets.filter((_, i) => {
                const globalIndex = upgradePlan.targets.indexOf(targets[i])
                const key = `${category}-${targets[i].path}-${globalIndex}`
                return selectedTargets.has(key)
              }).length

              return (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-base flex items-center gap-2 ${getCategoryColor(category)}`}>
                      {getCategoryIcon(category)}
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Selected</span>
                        <span>
                          {categorySelected}/{targets.length}
                        </span>
                      </div>
                      <Progress value={(categorySelected / targets.length) * 100} className="h-2" />
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectAllInCategory(category, true)}
                          className="flex-1"
                        >
                          Select All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectAllInCategory(category, false)}
                          className="flex-1"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="targets" className="space-y-4">
          {Object.entries(groupedTargets).map(([category, targets]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${getCategoryColor(category)}`}>
                  {getCategoryIcon(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)} Upgrades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {targets.map((target, localIndex) => {
                    const globalIndex = upgradePlan.targets.indexOf(target)
                    const key = `${category}-${target.path}-${globalIndex}`
                    const isSelected = selectedTargets.has(key)

                    return (
                      <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleTarget(globalIndex)} />
                        <div className="flex-1">
                          <div className="font-medium">{target.itemName}</div>
                          <div className="text-sm text-muted-foreground">
                            Level {target.currentLevel} → {target.targetLevel}
                          </div>
                        </div>
                        <Badge variant="secondary">{target.targetLevel - target.currentLevel} levels</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Required Materials</CardTitle>
              <CardDescription>Total materials needed for selected upgrades</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(upgradePlan.materialSummary).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(upgradePlan.materialSummary)
                    .sort(([, a], [, b]) => b - a)
                    .map(([material, amount]) => (
                      <div key={material} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span className="font-medium text-sm">{material}</span>
                        <Badge variant="secondary" className="ml-2">
                          {amount.toLocaleString()}
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No materials required for selected upgrades</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
