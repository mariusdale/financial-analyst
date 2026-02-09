"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronDown } from "lucide-react";

interface UserData {
  id: string;
  username: string;
  name: string;
}

export function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setUser(data.user))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2 text-sm"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">{user.name}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 rounded-lg border bg-popover shadow-lg z-50">
          <div className="px-3 py-2 border-b">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
