import type { Hero, UpgradeCost } from "./types"
import { getUpgradeCostsToLevel, calculateTotalMaterials } from "./csv-data"
import { MAX_LEVELS } from "./hero-defaults"

export interface UpgradeTarget {
  category: "relic" | "weapon" | "artifact"
  subcategory: string
  itemId?: string
  itemName: string
  currentLevel: number
  targetLevel: number
  path: string
}

export interface UpgradePlan {
  targets: UpgradeTarget[]
  totalCosts: UpgradeCost[]
  materialSummary: Record<string, number>
  estimatedTime?: string
}

/**
 * Generate upgrade targets from hero's current state to maximum levels
 */
export function generateMaxUpgradeTargets(hero: Hero): UpgradeTarget[] {
  const targets: UpgradeTarget[] = []

  // Relic abilities
  hero.relic.abilities.forEach((ability, index) => {
    if (ability.level < MAX_LEVELS.ability) {
      const abilityPaths = ["signature 1", "signature 2", "super"]
      targets.push({
        category: "relic",
        subcategory: "ability",
        itemName: ability.name,
        currentLevel: ability.level,
        targetLevel: MAX_LEVELS.ability,
        path: abilityPaths[index],
      })
    }
  })

  // Weapon mastery
  if (hero.relic.weaponMastery < MAX_LEVELS.weaponMastery) {
    targets.push({
      category: "relic",
      subcategory: "weapon mastery",
      itemName: "Weapon Mastery",
      currentLevel: hero.relic.weaponMastery,
      targetLevel: MAX_LEVELS.weaponMastery,
      path: "weapon mastery",
    })
  }

  // Relic trait
  if (hero.relic.relicTrait < MAX_LEVELS.relicTrait) {
    targets.push({
      category: "relic",
      subcategory: "relic trait",
      itemName: "Relic Trait",
      currentLevel: hero.relic.relicTrait,
      targetLevel: MAX_LEVELS.relicTrait,
      path: "relic trait",
    })
  }

  // Weapons
  hero.weapons.forEach((weapon) => {
    // Gear level
    if (weapon.gearLevel < MAX_LEVELS.gearLevel) {
      targets.push({
        category: "weapon",
        subcategory: "gear level",
        itemId: weapon.id,
        itemName: `${weapon.name} - Gear Level`,
        currentLevel: weapon.gearLevel,
        targetLevel: MAX_LEVELS.gearLevel,
        path: "gear level",
      })
    }

    // Enhancement
    if (weapon.enhancement < MAX_LEVELS.enhancement) {
      targets.push({
        category: "weapon",
        subcategory: "enhancement",
        itemId: weapon.id,
        itemName: `${weapon.name} - Enhancement`,
        currentLevel: weapon.enhancement,
        targetLevel: MAX_LEVELS.enhancement,
        path: "enhancement",
      })
    }

    // Mods (for mythic heroes)
    if (hero.rarity === "mythic" && weapon.mods) {
      weapon.mods.forEach((mod, modIndex) => {
        if (mod.level < MAX_LEVELS.mod) {
          targets.push({
            category: "weapon",
            subcategory: "mod",
            itemId: weapon.id,
            itemName: `${weapon.name} - ${mod.name}`,
            currentLevel: mod.level,
            targetLevel: MAX_LEVELS.mod,
            path: `mod ${modIndex + 1}`,
          })
        }
      })
    }

    // Refinement (for exotic weapons)
    if (weapon.type === "exotic" && weapon.refinement) {
      if (weapon.refinement.catalyst < MAX_LEVELS.catalyst) {
        targets.push({
          category: "weapon",
          subcategory: "catalyst",
          itemId: weapon.id,
          itemName: `${weapon.name} - Catalyst`,
          currentLevel: weapon.refinement.catalyst,
          targetLevel: MAX_LEVELS.catalyst,
          path: "catalyst",
        })
      }

      if (weapon.refinement.boost < MAX_LEVELS.boost) {
        targets.push({
          category: "weapon",
          subcategory: "boost",
          itemId: weapon.id,
          itemName: `${weapon.name} - Boost`,
          currentLevel: weapon.refinement.boost,
          targetLevel: MAX_LEVELS.boost,
          path: "boost",
        })
      }
    }
  })

  // Artifacts
  hero.artifacts.forEach((artifact, artifactIndex) => {
    if (artifact.level < MAX_LEVELS.artifact) {
      targets.push({
        category: "artifact",
        subcategory: "level",
        itemId: artifact.id,
        itemName: artifact.name,
        currentLevel: artifact.level,
        targetLevel: MAX_LEVELS.artifact,
        path: `artifact ${artifactIndex + 1}`,
      })
    }
  })

  return targets
}

/**
 * Calculate upgrade plan for given targets
 */
export async function calculateUpgradePlan(targets: UpgradeTarget[]): Promise<UpgradePlan> {
  const allCosts: UpgradeCost[] = []

  for (const target of targets) {
    try {
      const costs = await getUpgradeCostsToLevel(target.path, target.currentLevel, target.targetLevel)
      allCosts.push(...costs)
    } catch (error) {
      console.error(`Error calculating costs for ${target.itemName}:`, error)
    }
  }

  const materialSummary = calculateTotalMaterials(allCosts)

  return {
    targets,
    totalCosts: allCosts,
    materialSummary,
  }
}

/**
 * Calculate upgrade plan to max all upgrades
 */
export async function calculateMaxUpgradePlan(hero: Hero): Promise<UpgradePlan> {
  const targets = generateMaxUpgradeTargets(hero)
  return calculateUpgradePlan(targets)
}

/**
 * Group upgrade targets by category
 */
export function groupTargetsByCategory(targets: UpgradeTarget[]): Record<string, UpgradeTarget[]> {
  return targets.reduce(
    (groups, target) => {
      if (!groups[target.category]) {
        groups[target.category] = []
      }
      groups[target.category].push(target)
      return groups
    },
    {} as Record<string, UpgradeTarget[]>,
  )
}

/**
 * Calculate progress percentage for upgrade targets
 */
export function calculateUpgradeProgress(targets: UpgradeTarget[]): number {
  if (targets.length === 0) return 100

  const totalProgress = targets.reduce((sum, target) => {
    const progress = target.currentLevel / target.targetLevel
    return sum + progress
  }, 0)

  return (totalProgress / targets.length) * 100
}
