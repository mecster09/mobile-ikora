"use client"

import { useCSVData } from "@/hooks/use-csv-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export function DataStatus() {
  const { materials, upgradeCosts, isLoading, error, refetch } = useCSVData()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading Game Data
          </CardTitle>
          <CardDescription>Fetching materials and upgrade costs from game database...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            Data Loading Error
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Loading
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-4 w-4" />
          Game Data Loaded
        </CardTitle>
        <CardDescription>
          Successfully loaded {materials.length} materials and {upgradeCosts.length} upgrade cost entries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Materials:</span> {materials.length}
          </div>
          <div>
            <span className="font-medium">Upgrade Costs:</span> {upgradeCosts.length}
          </div>
        </div>
        <Button onClick={refetch} variant="outline" size="sm" className="mt-4 bg-transparent">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </CardContent>
    </Card>
  )
}
