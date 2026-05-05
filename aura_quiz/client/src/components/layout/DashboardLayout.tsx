import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, BookOpen, PlusCircle, BarChart3, Settings, LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import logo from "@/assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: BookOpen, label: "My Quizzes", href: "/dashboard/quizzes" },
  { icon: PlusCircle, label: "Create Quiz", href: "/dashboard/create" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <Link href="/">
          <a className="flex items-center gap-2 mb-8">
            <img src={logo} alt="Aura Logo" className="h-8 w-8 object-contain" />
            <span className="font-display font-bold text-2xl tracking-tight">Aura</span>
          </a>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-2">
        <Link href="/dashboard/settings">
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-medium">
            <Settings className="h-5 w-5" />
            Settings
          </a>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all font-medium">
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="font-display font-bold text-xl hidden sm:block">
              {navItems.find(item => item.href === location)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">Alex Morgan</p>
                <p className="text-xs text-muted-foreground">Pro Member</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src="https://i.pravatar.cc/150?img=11" />
                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
