"use client";
import React from "react";
import Link from "next/link";
import {
  MessageCircle,
  Ticket,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export interface ConversationSummaryItem {
  id: string;
  title: string;
  updatedAt: Date | string;
  _count?: { messages: number };
}

export interface TicketSummaryItem {
  id: string;
  number: number;
  subject: string;
  status: string;
  updatedAt: Date | string;
}

export function RecentActivity3D({
  conversations,
  tickets,
}: {
  conversations: ConversationSummaryItem[];
  tickets: TicketSummaryItem[];
}) {
  const allActivities = [
    ...conversations.map((c) => ({
      type: "CONVERSATION" as const,
      id: c.id,
      title: c.title,
      date: new Date(c.updatedAt),
      meta: `${c._count?.messages || 0} messages exchanged`,
      href: `/chat?c=${c.id}`,
    })),
    ...tickets.map((t) => ({
      type: "TICKET" as const,
      id: t.id,
      title: `Ticket #${t.number}: ${t.subject}`,
      date: new Date(t.updatedAt),
      meta: `Status: ${t.status.replace(/_/g, " ")}`,
      href: `/tickets`,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#090f22]/80 backdrop-blur-2xl p-5 sm:p-6 space-y-4 shadow-xl shadow-black/40 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">
              Recent Activity Feed
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime audit log of your chat sessions and ticket updates
          </p>
        </div>
        <Link
          href="/conversations"
          className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
        >
          <span>All Dialogues</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {allActivities.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs">
          No recent activity recorded yet. Start a conversation with the AI assistant above.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-cyan-500/50 before:via-violet-500/30 before:to-transparent">
          {allActivities.map((act, idx) => {
            const isChat = act.type === "CONVERSATION";
            return (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <span
                  className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center border shadow-xs transition-transform group-hover:scale-125 ${
                    isChat
                      ? "bg-[#0c1a35] border-cyan-400/80 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                      : "bg-[#181135] border-violet-400/80 text-violet-300 shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                  }`}
                >
                  {isChat ? (
                    <MessageCircle className="w-2.5 h-2.5" />
                  ) : (
                    <Ticket className="w-2.5 h-2.5" />
                  )}
                </span>

                {/* Activity Content */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                  <div className="min-w-0">
                    <Link
                      href={act.href}
                      className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors block truncate max-w-sm sm:max-w-md"
                    >
                      {act.title}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {act.meta}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono flex-shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(act.date)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
