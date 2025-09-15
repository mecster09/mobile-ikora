import type { Hero, HeroRarity, Weapon, Relic, Artifact } from "./types"

/**
 * Create default relic configuration
 */
export function createDefaultRelic(): Relic {
  return {
    abilities: [
      { id: "ability-1", name: "Signature 1", level: 1 },
      { id: "ability-2", name: "Signature 2", level: 1 },
      { id: "ability-3", name: "Super", level: 1 },
    ],
    weaponMastery: 0,
    relicTrait: 0,
  }
}

/**
 * Create default weapon configuration
 */
export function createDefaultWeapon(id: string, name: string): Weapon {
  return {
    id,
    name,
    type: "normal",
    gearLevel: 0,
    enhancement: 0,
  }
}

/**
 * Create default artifact configuration
 */
export function createDefaultArtifact(id: string, name: string): Artifact {
  return {
    id,
    name,
    level: 0,
  }
}

/**
 * Create a new hero with default configuration
 */
export function createNewHero(name: string, rarity: HeroRarity): Hero {
  const basePower = rarity === "legendary" ? 0 : 500

  return {
    id: `hero-${Date.now()}`,
    name,
    rarity,
    power: basePower,
    weapons: [createDefaultWeapon("weapon-1", "Primary Weapon"), createDefaultWeapon("weapon-2", "Secondary Weapon")],
    relic: createDefaultRelic(),
    artifacts: [],
  }
}

/**
 * Get maximum levels for different upgrade paths
 */
export const MAX_LEVELS = {
  ability: 18,
  weaponMastery: 5,
  relicTrait: 3,
  gearLevel: 80,
  enhancement: 10,
  mod: 10,
  catalyst: 3,
  boost: 7,
  artifact: 10,
} as const

/**
 * Get starting levels for different hero rarities
 */
export const STARTING_LEVELS = {
  legendary: {
    power: 0,
    abilities: 1,
  },
  mythic: {
    power: 500,
    abilities: 1,
  },
} as const
