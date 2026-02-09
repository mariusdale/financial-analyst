"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "./search-bar";
import { UserMenu } from "./user-menu";
import { TrendingUp, LayoutDashboard, Filter, Calculator } from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/screener", label: "Screener", icon: Filter },
  { href: "/valuation", label: "DCF Valuation", icon: Calculator },
];

export function Navbar() {
  const pathname = usePathname();

  // Don't show navbar on login page
  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight shrink-0">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <span className="hidden sm:inline">FinAnalyst</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <SearchBar />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
