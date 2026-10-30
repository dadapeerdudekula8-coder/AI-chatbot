"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Bot,
  Zap,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { AIAssistantCore, type AssistantCoreState } from "@/components/3d/ai-assistant-core";

const SUGGESTED_PROMPTS = [
  { label: "📦 Track order status", query: "How do I track my active order and delivery timeline?" },
  { label: "🔄 Return & refund policy", query: "What is your 30-day return policy and how do refunds work?" },
  { label: "💳 Payment & billing", query: "What payment methods do you accept and is checkout secure?" },
  { label: "⏱️ Shipping delivery times", query: "Do you offer international shipping and what are the delivery times?" },
  { label: "🔒 Reset my password", query: "How do I reset my account password?" },
];

export function WelcomeHero3D({ userName }: { userName: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [assistantState, setAssistantState] = useState<AssistantCoreState>("idle");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setAssistantState("thinking");
    setTimeout(() => {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    }, 350);
  };

  const handleChipClick = (promptQuery: string) => {
    setAssistantState("thinking");
    setTimeout(() => {
      router.push(`/chat?q=${encodeURIComponent(promptQuery)}`);
    }, 300);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c1427]/90 via-[#091024]/90 to-[#050914]/95 p-6 sm:p-8 lg:p-10 text-white shadow-2xl shadow-cyan-950/20 border border-cyan-500/20 backdrop-blur-2xl">
      {/* 3D Holographic Corner Glow Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Cybernetic Edge Lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        {/* Left Column: Command Center Text & Interactive Prompt (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Cyber Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="tracking-wide uppercase text-[11px] font-mono">
              QUANTUM AI CORE V2.4 &bull; 768-D RAG
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2.5">
            <h2 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight">
              <span className="text-white">Your Intelligent </span>
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Support Universe
              </span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-xl">
              Welcome to the 3D Intelligence Center, <span className="text-cyan-300 font-semibold">{userName}</span>.
              Query our grounded RAG knowledge engine in real time or escalate tickets to specialized human support.
            </p>
          </div>

          {/* Functional 3D AI Chat Input */}
          <form onSubmit={handleSearch} className="pt-1">
            <div
              className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border transition-all duration-300 shadow-xl ${
                assistantState === "thinking"
                  ? "border-cyan-400 ring-2 ring-cyan-400/40 bg-white/[0.1]"
                  : "border-white/15 hover:border-cyan-500/40 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/30"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <input
                type="text"
                value={query}
                onFocus={() => setAssistantState("hover")}
                onBlur={() => setAssistantState("idle")}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything (e.g. 'How do I reset password?' or 'Return policy')"
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none px-2"
              />
              <button
                type="submit"
                disabled={!query.trim()}
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 text-xs sm:text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 active:scale-95"
              >
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Suggested 3D Prompt Chips */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>FREQUENT QUERY CHIPS:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleChipClick(item.query)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 text-slate-200 hover:text-white transition-all shadow-sm hover:scale-[1.03] active:scale-[0.98] backdrop-blur-md"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 3D AI Assistant Hologram Portal (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
            {/* Holographic Concentric Ambient Rings */}
            <div className="absolute inset-2 rounded-full border border-cyan-500/20 animate-spin-slow pointer-events-none" style={{ animationDuration: "35s" }} />
            <div className="absolute inset-8 rounded-full border border-dashed border-violet-500/20 animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "25s" }} />
            <div className="absolute inset-16 rounded-full bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none blur-lg" />

            {/* Real 3D AI Assistant Canvas */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <AIAssistantCore
                state={assistantState}
                size={300}
                className="w-full h-full max-w-[300px] max-h-[300px]"
              />
            </div>

            {/* Orbiting Telemetry Badges */}
            <div className="absolute -bottom-2 sm:bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[280px] p-2.5 rounded-xl bg-[#0a1224]/80 backdrop-blur-xl border border-cyan-500/30 text-center shadow-lg z-20">
              <div className="flex items-center justify-around text-[10px] font-mono text-cyan-200">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" /> &lt; 380ms TTFB
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Vector RAG
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
