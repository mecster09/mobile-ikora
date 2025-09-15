// Data types based on the CSV schemas provided
export interface Material {
  material: string
}

export interface UpgradeCost {
  path: string
  material: string
  level: number
  amount: number
}

// Hero types and upgrade categories
export type HeroRarity = "legendary" | "mythic" // Removed "exotic" from HeroRarity type - only weapons/mods/artifacts can be exotic
export type WeaponType = "normal" | "exotic"

export interface Hero {
  id: string
  name: string
  rarity: HeroRarity
  power: number
  weapons: Weapon[]
  relic: Relic
  artifacts: Artifact[]
}

export interface Weapon {
  id: string
  name: string
  type: WeaponType
  gearLevel: number
  enhancement: number
  mods?: WeaponMod[]
  refinement?: WeaponRefinement
}

export interface WeaponMod {
  id: string
  name: string
  level: number
}

export interface WeaponRefinement {
  catalyst: number
  boost: number
}

export interface Relic {
  abilities: RelicAbility[]
  weaponMastery: number
  relicTrait: number
}

export interface RelicAbility {
  id: string
  name: string
  level: number
}

export interface Artifact {
  id: string
  name: string
  level: number
}

// Upgrade path types for CSV lookup
export type UpgradePath =
  | "signature 1"
  | "signature 2"
  | "super"
  | "weapon mastery"
  | "relic trait"
  | "gear level"
  | "enhancement"
  | "mod 1"
  | "mod 2"
  | "mod 3"
  | "catalyst"
  | "boost"
  | "artifact 1"
  | "artifact 2"
  | "artifact 3"
  | "artifact 4"
