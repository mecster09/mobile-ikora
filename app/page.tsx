import { Header } from "@/components/header"
import { DataStatus } from "@/components/data-status"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Sword, Gem, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-balance mb-4">Hero Upgrade Tracker</h1>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Track your hero progression, manage upgrade materials, and optimize your builds in Destiny Rising
          </p>
        </div>

        <div className="mb-8">
          <DataStatus />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle>Relic System</CardTitle>
              <CardDescription>Track abilities, weapon mastery, and relic traits</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Sword className="h-8 w-8 mx-auto text-accent mb-2" />
              <CardTitle>Weapons</CardTitle>
              <CardDescription>Manage gear levels, enhancements, and mods</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Gem className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle>Artifacts</CardTitle>
              <CardDescription>Level up to 4 artifacts for your hero</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 mx-auto text-accent mb-2" />
              <CardTitle>Materials</CardTitle>
              <CardDescription>Calculate upgrade costs and track resources</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/hero">
            <Button size="lg" className="text-lg px-8 py-3 destiny-button">
              Start Tracking Your Hero
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
