import type { Material, UpgradeCost } from "./types"

// CSV URLs provided by the user
const CSV_URLS = {
  materials: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dr-materials-dwkuCv5yclQBKEFn0SiG1QdhkTO5IX.csv",
  upgrades: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dr-upgrade-79vLkVWsfGIfmSX8V4KN2VUQfUeG5D.csv",
}

// Cache for CSV data to avoid repeated fetches
let materialsCache: Material[] | null = null
let upgradesCache: UpgradeCost[] | null = null

/**
 * Parse CSV text into array of objects
 */
function parseCSV<T>(csvText: string, headers: string[]): T[] {
  const lines = csvText.trim().split("\n")
  const dataLines = lines.slice(1) // Skip header row

  return dataLines.map((line) => {
    const values = line.split(",").map((val) => val.trim().replace(/^"|"$/g, ""))
    const obj: any = {}

    headers.forEach((header, index) => {
      const value = values[index] || ""

      // Convert numeric fields
      if (header === "level" || header === "amount") {
        obj[header] = Number.parseInt(value) || 0
      } else {
        obj[header] = value
      }
    })

    return obj as T
  })
}

/**
 * Fetch and parse materials CSV
 */
export async function fetchMaterials(): Promise<Material[]> {
  if (materialsCache) {
    return materialsCache
  }

  try {
    const response = await fetch(CSV_URLS.materials)
    if (!response.ok) {
      throw new Error(`Failed to fetch materials: ${response.statusText}`)
    }

    const csvText = await response.text()
    materialsCache = parseCSV<Material>(csvText, ["material"])

    return materialsCache
  } catch (error) {
    console.error("Error fetching materials:", error)
    throw new Error("Failed to load materials data")
  }
}

/**
 * Fetch and parse upgrade costs CSV
 */
export async function fetchUpgradeCosts(): Promise<UpgradeCost[]> {
  if (upgradesCache) {
    return upgradesCache
  }

  try {
    const response = await fetch(CSV_URLS.upgrades)
    if (!response.ok) {
      throw new Error(`Failed to fetch upgrade costs: ${response.statusText}`)
    }

    const csvText = await response.text()
    upgradesCache = parseCSV<UpgradeCost>(csvText, ["path", "material", "level", "amount"])

    return upgradesCache
  } catch (error) {
    console.error("Error fetching upgrade costs:", error)
    throw new Error("Failed to load upgrade costs data")
  }
}

/**
 * Get upgrade cost for a specific path and level
 */
export async function getUpgradeCost(path: string, level: number): Promise<UpgradeCost[]> {
  const upgradeCosts = await fetchUpgradeCosts()

  return upgradeCosts.filter((cost) => cost.path === path && cost.level === level)
}

/**
 * Get all upgrade costs for a specific path up to a target level
 */
export async function getUpgradeCostsToLevel(path: string, fromLevel: number, toLevel: number): Promise<UpgradeCost[]> {
  const upgradeCosts = await fetchUpgradeCosts()

  return upgradeCosts.filter((cost) => cost.path === path && cost.level > fromLevel && cost.level <= toLevel)
}

/**
 * Validate that a material exists in the materials list
 */
export async function validateMaterial(materialName: string): Promise<boolean> {
  const materials = await fetchMaterials()
  return materials.some((material) => material.material === materialName)
}

/**
 * Get all available materials
 */
export async function getAllMaterials(): Promise<string[]> {
  const materials = await fetchMaterials()
  return materials.map((material) => material.material)
}

/**
 * Calculate total materials needed for multiple upgrades
 */
export function calculateTotalMaterials(upgradeCosts: UpgradeCost[]): Record<string, number> {
  const totals: Record<string, number> = {}

  upgradeCosts.forEach((cost) => {
    if (totals[cost.material]) {
      totals[cost.material] += cost.amount
    } else {
      totals[cost.material] = cost.amount
    }
  })

  return totals
}

/**
 * Clear cache (useful for testing or forcing refresh)
 */
export function clearCache(): void {
  materialsCache = null
  upgradesCache = null
}
