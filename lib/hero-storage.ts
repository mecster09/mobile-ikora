import type { Hero } from "./types"

const STORAGE_KEY = "destiny-rising-heroes"
const CURRENT_HERO_KEY = "destiny-rising-current-hero"

export interface SavedHero {
  id: string
  name: string
  rarity: string
  lastModified: number
  hero: Hero
}

/**
 * Save a hero to session storage
 */
export function saveHero(hero: Hero): void {
  try {
    const savedHeroes = getSavedHeroes()
    const existingIndex = savedHeroes.findIndex((saved) => saved.id === hero.id)

    const savedHero: SavedHero = {
      id: hero.id,
      name: hero.name,
      rarity: hero.rarity,
      lastModified: Date.now(),
      hero,
    }

    if (existingIndex >= 0) {
      savedHeroes[existingIndex] = savedHero
    } else {
      savedHeroes.push(savedHero)
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(savedHeroes))
    sessionStorage.setItem(CURRENT_HERO_KEY, JSON.stringify(hero))
  } catch (error) {
    console.error("Failed to save hero:", error)
  }
}

/**
 * Get all saved heroes from session storage
 */
export function getSavedHeroes(): SavedHero[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to load saved heroes:", error)
    return []
  }
}

/**
 * Get the current hero from session storage
 */
export function getCurrentHero(): Hero | null {
  try {
    const stored = sessionStorage.getItem(CURRENT_HERO_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error("Failed to load current hero:", error)
    return null
  }
}

/**
 * Load a specific hero by ID
 */
export function loadHero(heroId: string): Hero | null {
  try {
    const savedHeroes = getSavedHeroes()
    const savedHero = savedHeroes.find((saved) => saved.id === heroId)

    if (savedHero) {
      sessionStorage.setItem(CURRENT_HERO_KEY, JSON.stringify(savedHero.hero))
      return savedHero.hero
    }

    return null
  } catch (error) {
    console.error("Failed to load hero:", error)
    return null
  }
}

/**
 * Delete a specific hero by ID
 */
export function deleteHero(heroId: string): void {
  try {
    const savedHeroes = getSavedHeroes()
    const filteredHeroes = savedHeroes.filter((saved) => saved.id !== heroId)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHeroes))

    // If we're deleting the current hero, clear it
    const currentHero = getCurrentHero()
    if (currentHero && currentHero.id === heroId) {
      sessionStorage.removeItem(CURRENT_HERO_KEY)
    }
  } catch (error) {
    console.error("Failed to delete hero:", error)
  }
}

/**
 * Clear all hero data (start fresh)
 */
export function clearAllHeroData(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(CURRENT_HERO_KEY)
  } catch (error) {
    console.error("Failed to clear hero data:", error)
  }
}

/**
 * Check if session storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = "__storage_test__"
    sessionStorage.setItem(test, test)
    sessionStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}
