"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Bot, Sparkles, Layers } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function LandingNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-white">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-3d-cyan">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="tracking-tight">{APP_NAME}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            3D AI
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/chat"
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" /> Live Chat
          </Link>
          <Link
            href="/specifications"
            className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Layers className="w-4 h-4 text-purple-400" /> Specifications
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            FAQs
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-3d-cyan"
          >
            Get Started Free
          </Link>
        </div>
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 p-5 flex flex-col gap-4 text-sm font-medium">
          <Link href="/chat" onClick={() => setOpen(false)} className="text-cyan-400">
            Live AI Chat
          </Link>
          <Link href="/specifications" onClick={() => setOpen(false)} className="text-purple-400">
            3D Specifications & API
          </Link>
          <Link href="#faq" onClick={() => setOpen(false)} className="text-slate-300">
            FAQs
          </Link>
          <Link href="/login" onClick={() => setOpen(false)} className="text-slate-300">
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-center font-bold"
          >
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}
