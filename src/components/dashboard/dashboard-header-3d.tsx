"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Ticket,
  MessageCircle,
  Layers,
  LogOut,
  Calendar,
  Bot,
} from "lucide-react";
import type { UserRole } from "@/types";
import { SignOutDialog } from "./signout-dialog";

export function DashboardHeader3D({
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
    <header className="border-b border-white/10 bg-[#070d1e]/80 backdrop-blur-2xl sticky top-0 z-30 shadow-lg shadow-black/40">
      {/* Top subtle cyan laser border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Greeting */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Link href="/" className="hover:text-cyan-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-cyan-300 font-semibold">Dashboard</span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Quantum Link Active
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-cyan-300">{userName || "there"}</span>!
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-300 bg-white/[0.04] border border-white/10">
              <Calendar className="w-3 h-3 text-cyan-400" />
              {todayFormatted}
            </span>
          </div>
        </div>

        {/* Right: Quick Search, Ask AI CTA, Profile Dropdown */}
        <div className="flex items-center gap-3">
          {/* Cyber Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query knowledge base..."
              className="pl-9 pr-8 py-1.5 text-xs rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] focus:bg-[#070d1e] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-400 w-44 lg:w-60 transition-all font-mono"
            />
            <kbd className="absolute right-2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/[0.06] border border-white/10 pointer-events-none">
              ↵
            </kbd>
          </form>

          {/* Ask AI CTA Button */}
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Launch AI</span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-colors focus:outline-none"
              aria-expanded={dropdownOpen}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  dropdownOpen ? "rotate-180 text-white" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090f22]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-white/10">
                  <div className="text-xs font-bold text-white truncate">
                    {userName}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate font-mono">
                    {userEmail}
                  </div>
                  <div className="mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/chat"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>AI Console</span>
                  </Link>

                  <Link
                    href="/conversations"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-violet-400" />
                    <span>My Dialogues</span>
                  </Link>

                  <Link
                    href="/tickets"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span>Support Tickets</span>
                  </Link>

                  <Link
                    href="/specifications"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Specifications</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowSignOut(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSignOut && (
        <SignOutDialog
          isOpen={showSignOut}
          onClose={() => setShowSignOut(false)}
        />
      )}
    </header>
  );
}
