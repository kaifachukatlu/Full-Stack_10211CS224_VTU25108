import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full glass transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <a className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <img src={logo} alt="Aura Logo" className="h-8 w-8 object-contain" />
              <span className="font-display font-bold text-xl tracking-tight hidden sm:inline-block">Aura</span>
            </a>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-muted-foreground">
          <Link href="/"><a className="hover:text-foreground transition-colors">Features</a></Link>
          <Link href="/"><a className="hover:text-foreground transition-colors">Solutions</a></Link>
          <Link href="/"><a className="hover:text-foreground transition-colors">Pricing</a></Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-sm" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
