"use client";
import React from "react";
import Link from "next/link";
import { MessageCircle, Ticket, Clock, ThumbsUp, ArrowUpRight, Activity } from "lucide-react";
import { TiltCard } from "@/components/3d/tilt-card";

export interface DashboardStatsProps {
  convCount: number;
  ticketCount: number;
  openTickets: number;
  feedbackCount: number;
}

export function StatCards3D({
  convCount,
  ticketCount,
  openTickets,
  feedbackCount,
}: DashboardStatsProps) {
  const cards = [
    {
      label: "Total Conversations",
      value: convCount,
      subtext: "AI chat threads initiated",
      icon: MessageCircle,
      href: "/conversations",
      glowColor: "cyan" as const,
      gradient: "from-cyan-500 to-blue-600",
      accentBorder: "border-cyan-500/20",
      iconGlow: "shadow-[0_0_20px_rgba(6,182,212,0.4)]",
      telemetry: "768-D RAG",
    },
    {
      label: "Support Tickets",
      value: ticketCount,
      subtext: "Lifetime tickets created",
      icon: Ticket,
      href: "/tickets",
      glowColor: "violet" as const,
      gradient: "from-indigo-500 to-purple-600",
      accentBorder: "border-purple-500/20",
      iconGlow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
      telemetry: "TIER 1 & 2",
    },
    {
      label: "Open Tickets",
      value: openTickets,
      subtext: openTickets > 0 ? "Awaiting agent resolution" : "All issues resolved",
      icon: Clock,
      href: "/tickets?status=OPEN",
      glowColor: "amber" as const,
      gradient: "from-amber-500 to-orange-600",
      accentBorder: "border-amber-500/20",
      iconGlow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      telemetry: openTickets > 0 ? "ACTION REQ" : "OPTIMAL",
    },
    {
      label: "Helpful Ratings",
      value: feedbackCount,
      subtext: "Positive AI feedback submitted",
      icon: ThumbsUp,
      href: "/conversations",
      glowColor: "emerald" as const,
      gradient: "from-emerald-500 to-teal-600",
      accentBorder: "border-emerald-500/20",
      iconGlow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
      telemetry: "HIGH CSAT",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <TiltCard
            key={i}
            glowColor={card.glowColor}
            maxTilt={8}
            className="h-full"
          >
            <Link
              href={card.href}
              className={`block h-full p-5 sm:p-6 rounded-2xl bg-[#090f20]/80 backdrop-blur-xl border ${card.accentBorder} hover:border-opacity-60 transition-all duration-300 relative overflow-hidden group`}
            >
              {/* Subtle 3D background ambient light */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/[0.04] rounded-full blur-xl pointer-events-none" />

              {/* Top Row: 3D Floating Icon + Link Indicator */}
              <div
                style={{ transform: "translateZ(25px)" }}
                className="flex items-center justify-between mb-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white ${card.iconGlow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 drop-shadow-md" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10">
                    {card.telemetry}
                  </span>
                  <div className="p-1 rounded-lg text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Metric & Labels with physical 3D depth */}
              <div style={{ transform: "translateZ(30px)" }} className="space-y-1.5">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                  {card.value.toLocaleString()}
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {card.label}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {card.subtext}
                </div>
              </div>

              {/* Bottom Subtle Glowing Line */}
              <div
                style={{ transform: "translateZ(10px)" }}
                className="mt-4 pt-3 border-t border-white/[0.07] flex items-center justify-between text-[10px] text-slate-400"
              >
                <span className="flex items-center gap-1 font-mono">
                  <Activity className="w-3 h-3 text-cyan-400" /> Realtime sync
                </span>
                <span className="text-cyan-300 font-medium group-hover:underline">Explore &rarr;</span>
              </div>
            </Link>
          </TiltCard>
        );
      })}
    </div>
  );
}
