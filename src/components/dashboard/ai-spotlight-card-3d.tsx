"use client";
import React from "react";
import Link from "next/link";
import { Bot, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { AIAssistantCore } from "@/components/3d/ai-assistant-core";

export function AIAssistantSpotlightCard3D() {
  const SAMPLE_QUESTIONS = [
    { label: "📦 How do I track my active order?", q: "How do I track my active order?" },
    { label: "🔄 What is the return & refund policy?", q: "What is your 30-day return policy and how do refunds work?" },
    { label: "💳 What payment methods are supported?", q: "What payment methods do you accept and is checkout secure?" },
  ];

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#0a1228]/90 via-[#070d1e]/90 to-[#040814]/95 p-6 space-y-5 shadow-xl shadow-cyan-950/20 relative overflow-hidden backdrop-blur-2xl">
      {/* 3D Emissive Corner Glow */}
      <div className="absolute -top-10 -right-10 w-44 h-44 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Mini 3D Core */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Bot className="w-6 h-6 drop-shadow-md" />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070d1e] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Quantum AI Core
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Vector Grounded &bull; 24/7/365
            </p>
          </div>
        </div>
      </div>

      {/* Mini 3D Interactive Canvas embedded inside the spotlight card */}
      <div className="relative w-full h-36 flex items-center justify-center rounded-xl bg-[#040814]/60 border border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <AIAssistantCore size={140} className="w-36 h-36" />
        <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-400 px-2">
          <span>LATENCY: &lt;380ms</span>
          <span className="text-cyan-300">RAG: ONLINE</span>
        </div>
      </div>

      {/* Capabilities */}
      <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
        <p>
          Grounds every response directly in your verified documentation and SQLite/pgvector knowledge embeddings.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Grounded RAG
          </span>
          <span className="flex items-center gap-1.5 text-slate-200">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Fast TTFB
          </span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-semibold text-slate-400 font-mono uppercase tracking-wider">
          Direct Neural Queries:
        </div>
        <div className="space-y-1.5">
          {SAMPLE_QUESTIONS.map((item, idx) => (
            <Link
              key={idx}
              href={`/chat?q=${encodeURIComponent(item.q)}`}
              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] hover:bg-cyan-500/10 border border-white/[0.08] hover:border-cyan-400/30 text-xs text-slate-300 hover:text-white transition-all group"
            >
              <span className="truncate pr-2">{item.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-white/10">
        <Link
          href="/chat"
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          <span>Open Full 3D AI Console</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
