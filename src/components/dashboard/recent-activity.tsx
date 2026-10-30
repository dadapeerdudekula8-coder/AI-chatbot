"use client";
import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Ticket,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ConversationItem {
  id: string;
  title: string;
  updatedAt: Date | string;
  _count?: { messages: number };
}

interface TicketItem {
  id: string;
  number: number;
  subject: string;
  status: string;
  priority: string;
  category: string;
  updatedAt: Date | string;
}

export function RecentActivity({
  conversations,
  tickets,
}: {
  conversations: ConversationItem[];
  tickets: TicketItem[];
}) {
  const [filter, setFilter] = useState<"ALL" | "CHATS" | "TICKETS">("ALL");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "IN_PROGRESS":
      case "WAITING_FOR_CUSTOMER":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "RESOLVED":
      case "CLOSED":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "URGENT":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "HIGH":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const showConversations = filter === "ALL" || filter === "CHATS";
  const showTickets = filter === "ALL" || filter === "TICKETS";

  const hasActivity = conversations.length > 0 || tickets.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your latest AI dialogues and support tickets
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === "ALL"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("CHATS")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === "CHATS"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Chats ({conversations.length})
          </button>
          <button
            onClick={() => setFilter("TICKETS")}
            className={`px-3 py-1 rounded-lg transition-all ${
              filter === "TICKETS"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tickets ({tickets.length})
          </button>
        </div>
      </div>

      {!hasActivity ? (
        <div className="text-center py-12 px-4 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">No activity recorded yet</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You haven&apos;t started any conversations or created tickets. Ask the AI assistant or submit a ticket to get started!
          </p>
          <div className="pt-2">
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition shadow-xs"
            >
              Start First Conversation
            </Link>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {/* Recent Tickets */}
          {showTickets &&
            tickets.map((t) => (
              <Link
                key={`ticket-${t.id}`}
                href="/tickets"
                className="flex items-center justify-between py-3.5 px-2 hover:bg-muted/40 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-muted-foreground">
                        #{t.number}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {t.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                      <span>{t.category}</span>
                      <span>&bull;</span>
                      <span>{formatRelativeTime(new Date(t.updatedAt))}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span
                    className={`hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityBadge(
                      t.priority
                    )}`}
                  >
                    {t.priority}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      t.status
                    )}`}
                  >
                    {t.status.replace(/_/g, " ")}
                  </span>
                </div>
              </Link>
            ))}

          {/* Recent Conversations */}
          {showConversations &&
            conversations.map((c) => (
              <Link
                key={`conv-${c.id}`}
                href="/conversations"
                className="flex items-center justify-between py-3.5 px-2 hover:bg-muted/40 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {c._count?.messages || 0} messages &bull;{" "}
                      {formatRelativeTime(new Date(c.updatedAt))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground font-medium flex-shrink-0 ml-3">
                  <span className="hidden sm:inline">Open</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
