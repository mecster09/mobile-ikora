import { ThemeToggle } from "@/components/theme-toggle"
import { Shield } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/30 destiny-card backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <div className="relative">
            <Shield className="h-8 w-8 text-accent mr-3 destiny-glow" />
            <div className="absolute inset-0 h-8 w-8 border border-accent/50 rotate-45 -z-10"></div>
          </div>
          <div>
            <span className="font-bold text-xl tracking-wider text-accent">DESTINY</span>
            <span className="font-bold text-xl tracking-wider text-primary ml-1">RISING</span>
            <div className="text-xs text-muted-foreground tracking-widest">HERO TRACKER</div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
