"use client";
import { useState } from "react";
import {
  Brain,
  Zap,
  ShieldAlert,
  LifeBuoy,
  Users2,
  LineChart,
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export function LandingFeatures3D() {
  const FEATURES = [
    {
      title: "Hybrid Vector RAG",
      desc: "Combines 768-dimensional dense Gemini embeddings with keyword search for 99.4% factual recall across your documents.",
      icon: Brain,
      tag: "Gemini 1.5 + RAG",
      color: "from-cyan-500 to-blue-600",
      glowColor: "rgba(6, 182, 212, 0.35)",
      borderColor: "border-cyan-500/30 hover:border-cyan-400",
      accentBg: "bg-cyan-500/10 text-cyan-400",
      spec: "768 float vectors",
    },
    {
      title: "Sub-Second Streaming",
      desc: "Instantaneous first-token generation using Server-Sent Events (SSE). Customers experience smooth, word-by-word streaming.",
      icon: Zap,
      tag: "Real-Time SSE",
      color: "from-purple-500 to-indigo-600",
      glowColor: "rgba(168, 85, 247, 0.35)",
      borderColor: "border-purple-500/30 hover:border-purple-400",
      accentBg: "bg-purple-500/10 text-purple-400",
      spec: "< 400ms TTFB",
    },
    {
      title: "Zero Hallucinations",
      desc: "Every AI response is strictly grounded against your verified FAQs and uploaded PDFs. Sources are cited directly in chat.",
      icon: CheckCircle,
      tag: "Source Verified",
      color: "from-emerald-500 to-teal-600",
      glowColor: "rgba(16, 185, 129, 0.35)",
      borderColor: "border-emerald-500/30 hover:border-emerald-400",
      accentBg: "bg-emerald-500/10 text-emerald-400",
      spec: "Cosine Sim >= 0.70",
    },
    {
      title: "1-Click Ticket Escalation",
      desc: "When inquiries require human judgment, users escalate directly from chat. Conversation transcripts auto-populate ticket details.",
      icon: LifeBuoy,
      tag: "Smart Escalation",
      color: "from-amber-500 to-rose-600",
      glowColor: "rgba(245, 158, 11, 0.35)",
      borderColor: "border-amber-500/30 hover:border-amber-400",
      accentBg: "bg-amber-500/10 text-amber-400",
      spec: "Urgent 1h SLA",
    },
    {
      title: "Multi-Role RBAC Security",
      desc: "Enterprise-grade authorization matrix. Separate portals for Customers, Agents, and Administrators with NextAuth v5 JWT sessions.",
      icon: Users2,
      tag: "Enterprise Auth",
      color: "from-pink-500 to-violet-600",
      glowColor: "rgba(236, 72, 153, 0.35)",
      borderColor: "border-pink-500/30 hover:border-pink-400",
      accentBg: "bg-pink-500/10 text-pink-400",
      spec: "bcrypt (12 rounds)",
    },
    {
      title: "Real-Time Analytics & CSAT",
      desc: "Monitor AI resolution rates, customer feedback ratings, token consumption, and agent inbox turnaround in real-time dashboards.",
      icon: LineChart,
      tag: "Live Metrics",
      color: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.35)",
      borderColor: "border-blue-500/30 hover:border-blue-400",
      accentBg: "bg-blue-500/10 text-blue-400",
      spec: "Recharts Visualizer",
    },
  ];

  return (
    <section className="py-28 bg-slate-950 text-white relative overflow-hidden">
      {/* 3D Background Lighting Grid */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Extreme Accuracy & Speed</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Architected With{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Vibrant 3D Depth
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Every component is engineered for production reliability: from vector indexing
            to sub-second streaming answers and multi-role audit logging.
          </p>
        </div>

        {/* 3D Perspective Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`group relative rounded-3xl border bg-slate-900/70 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${f.borderColor}`}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Glowing Aura on Hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 blur-xl"
                  style={{
                    backgroundColor: f.glowColor,
                  }}
                />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-200`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-current ${f.accentBg}`}
                    >
                      {f.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-2.5 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 font-medium">
                      Spec: <span className="text-white">{f.spec}</span>
                    </span>
                    <Link
                      href="/specifications"
                      className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D Call to Action Banner */}
        <div className="mt-20 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-12 relative overflow-hidden shadow-3d-cyan">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
              ⚡ Live Platform Ready
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
              Experience the 3D SupportAI Engine Right Now
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Log in to the Customer Portal, Agent Inbox, or Admin Command Center to experience
              real-time AI grounded assistance.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/chat"
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition shadow-lg"
              >
                Launch AI Chat Now
              </Link>
              <Link
                href="/specifications"
                className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm transition"
              >
                View 3D Architecture
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
