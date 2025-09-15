"use client"

import { useState, useEffect } from "react"
import type { Material, UpgradeCost } from "@/lib/types"
import { fetchMaterials, fetchUpgradeCosts } from "@/lib/csv-data"

interface UseCSVDataReturn {
  materials: Material[]
  upgradeCosts: UpgradeCost[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch and manage CSV data
 */
export function useCSVData(): UseCSVDataReturn {
  const [materials, setMaterials] = useState<Material[]>([])
  const [upgradeCosts, setUpgradeCosts] = useState<UpgradeCost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [materialsData, upgradesData] = await Promise.all([fetchMaterials(), fetchUpgradeCosts()])

      setMaterials(materialsData)
      setUpgradeCosts(upgradesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    materials,
    upgradeCosts,
    isLoading,
    error,
    refetch: fetchData,
  }
}
