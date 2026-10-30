"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  PlusCircle,
  MessageSquare,
  Clock,
  ChevronRight,
} from "lucide-react";
import { CreateTicketModal } from "@/components/tickets/create-ticket-modal";
import { TiltCard } from "@/components/3d/tilt-card";

export function QuickActions3D() {
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);

  const actions = [
    {
      title: "Start AI Chat",
      desc: "Instant grounded answers using 768-dim RAG vector intelligence.",
      icon: Bot,
      href: "/chat",
      gradient: "from-cyan-500 to-blue-600",
      glowColor: "cyan" as const,
      isAction: false,
      tag: "INSTANT",
    },
    {
      title: "Create Support Ticket",
      desc: "Open a priority request for human agent investigation & resolution.",
      icon: PlusCircle,
      onClick: () => setShowCreateTicketModal(true),
      gradient: "from-violet-500 to-purple-600",
      glowColor: "violet" as const,
      isAction: true,
      tag: "HUMAN DESK",
    },
    {
      title: "View Conversations",
      desc: "Review past AI dialogues, code snippets, and verified sources.",
      icon: MessageSquare,
      href: "/conversations",
      gradient: "from-teal-500 to-emerald-600",
      glowColor: "emerald" as const,
      isAction: false,
      tag: "HISTORY",
    },
    {
      title: "Track Open Tickets",
      desc: "Check real-time agent updates, comments, and priority statuses.",
      icon: Clock,
      href: "/tickets?status=OPEN",
      gradient: "from-amber-500 to-rose-600",
      glowColor: "amber" as const,
      isAction: false,
      tag: "ACTIVE",
    },
  ];

  return (
    <>
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">
              3D Command Shortcuts
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
              DIRECT ACCESS
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Select Action</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((act, i) => {
            const Icon = act.icon;
            const content = (
              <div
                style={{ transformStyle: "preserve-3d" }}
                className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[#0a1124]/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 text-left w-full h-full relative group overflow-hidden"
              >
                {/* 3D Floating Icon */}
                <div
                  style={{ transform: "translateZ(20px)" }}
                  className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${act.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 drop-shadow-sm" />
                </div>

                {/* Text Content */}
                <div style={{ transform: "translateZ(25px)" }} className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {act.title}
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/10">
                      {act.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {act.desc}
                  </p>
                </div>

                <div
                  style={{ transform: "translateZ(15px)" }}
                  className="self-center p-1 rounded-lg text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );

            return (
              <TiltCard key={i} glowColor={act.glowColor} maxTilt={6}>
                {act.isAction ? (
                  <button
                    type="button"
                    onClick={act.onClick}
                    className="w-full text-left focus:outline-none"
                  >
                    {content}
                  </button>
                ) : (
                  <Link href={act.href!} className="block focus:outline-none">
                    {content}
                  </Link>
                )}
              </TiltCard>
            );
          })}
        </div>
      </div>

      {showCreateTicketModal && (
        <CreateTicketModal
          onClose={() => setShowCreateTicketModal(false)}
          onCreated={() => {
            setShowCreateTicketModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
