"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  ArrowRight,
  PlusCircle,
  Clock,
  User,
  MessageSquare,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { CreateTicketModal } from "@/components/tickets/create-ticket-modal";
import type { TicketSummaryItem } from "./ticket-overview";

export function TicketOverview3D({ tickets }: { tickets: TicketSummaryItem[] }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]";
      case "IN_PROGRESS":
      case "WAITING_FOR_CUSTOMER":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]";
      case "RESOLVED":
      case "CLOSED":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      default:
        return "bg-slate-500/10 text-slate-300 border-slate-500/30";
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "URGENT":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      case "HIGH":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "MEDIUM":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#090f22]/80 backdrop-blur-2xl p-5 sm:p-6 space-y-4 shadow-xl shadow-black/40 relative overflow-hidden">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Support Tickets Overview
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 border border-violet-500/30">
                LIVE QUEUE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active engineering tickets and real-time agent updates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 transition shadow-md shadow-cyan-500/20 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Ticket</span>
            </button>
            <Link
              href="/tickets"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.04] text-slate-200 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-slate-400 shadow-inner">
              <Ticket className="w-7 h-7 text-cyan-400/80" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">No tickets created yet</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Need specialized assistance beyond our AI answers? Open a ticket to connect directly with human specialists.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/15 text-white transition shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Your First Ticket</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      #{t.number}
                    </span>
                    <span className="text-xs font-semibold text-white truncate max-w-[280px] sm:max-w-md group-hover:text-cyan-300 transition-colors">
                      {t.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        t.status
                      )}`}
                    >
                      {t.status.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(
                        t.priority
                      )}`}
                    >
                      {t.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="font-mono uppercase text-slate-500">
                      Category: <span className="text-slate-300">{t.category}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {formatRelativeTime(new Date(t.updatedAt))}
                    </span>
                    {t.agent && (
                      <>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-cyan-300">
                          <User className="w-3 h-3" />
                          {t.agent.name || "Agent"}
                        </span>
                      </>
                    )}
                    {t._count && t._count.comments > 0 && (
                      <>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <MessageSquare className="w-3 h-3" />
                          {t._count.comments}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Link
                  href={`/tickets`}
                  className="self-end sm:self-center inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:text-white hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
