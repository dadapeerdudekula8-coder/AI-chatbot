"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  ChevronDown,
  Ticket,
  MessageCircle,
  Layers,
  LogOut,
  Calendar,
} from "lucide-react";
import type { UserRole } from "@/types";
import { SignOutDialog } from "./signout-dialog";

export function DashboardHeader({
  userName,
  userEmail,
  userRole,
}: {
  userName: string;
  userEmail: string;
  userRole: UserRole;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/chat?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const initials = (userName || userEmail || "U").slice(0, 2).toUpperCase();

  return (
    <header className="border-b border-border/80 bg-background/95 backdrop-blur-md sticky top-0 z-20">
      <div className="px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Greeting */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {userName || "there"}!
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
              <Calendar className="w-3 h-3 text-primary" />
              {todayFormatted}
            </span>
          </div>
        </div>

        {/* Right: Search, Ask AI CTA, Profile Dropdown */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden sm:flex items-center"
          >
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or ask AI..."
              className="pl-9 pr-8 py-1.5 text-xs rounded-xl border border-border bg-muted/40 hover:bg-muted/70 focus:bg-background focus:ring-2 focus:ring-primary focus:outline-none w-48 lg:w-64 transition-all"
            />
            <kbd className="absolute right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-muted-foreground bg-background border border-border pointer-events-none">
              ↵
            </kbd>
          </form>

          {/* Ask AI CTA Button */}
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-sm hover:shadow shadow-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Ask AI</span>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl border border-border hover:bg-muted/70 transition-all focus:outline-none"
              aria-label="User profile options"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                {initials}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background shadow-xl p-1.5 space-y-1 text-xs animate-scale-in z-50">
                <div className="p-2.5 border-b border-border/80">
                  <div className="font-bold text-foreground truncate">{userName}</div>
                  <div className="text-muted-foreground text-[11px] truncate">{userEmail}</div>
                  <div className="mt-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {userRole}
                    </span>
                  </div>
                </div>

                <Link
                  href="/conversations"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>My Conversations</span>
                </Link>

                <Link
                  href="/tickets"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                >
                  <Ticket className="w-3.5 h-3.5 text-indigo-500" />
                  <span>My Support Tickets</span>
                </Link>

                <Link
                  href="/specifications"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-teal-500" />
                  <span>Architecture & Specs</span>
                </Link>

                <div className="border-t border-border/80 pt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowSignOut(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SignOutDialog
        isOpen={showSignOut}
        onClose={() => setShowSignOut(false)}
      />
    </header>
  );
}
