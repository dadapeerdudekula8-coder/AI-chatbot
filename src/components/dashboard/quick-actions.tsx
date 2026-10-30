"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bot,
  PlusCircle,
  MessageSquare,
  Clock,
  ChevronRight,
} from "lucide-react";
import { CreateTicketModal } from "@/components/tickets/create-ticket-modal";

export function QuickActions() {
  const router = useRouter();
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);

  const actions = [
    {
      title: "Start AI Chat",
      desc: "Instant grounded answers using 768-dim RAG vector intelligence.",
      icon: Bot,
      href: "/chat",
      gradient: "from-blue-600 to-cyan-500",
      isAction: false,
    },
    {
      title: "Create Support Ticket",
      desc: "Open a priority request for human agent investigation & resolution.",
      icon: PlusCircle,
      onClick: () => setShowCreateTicketModal(true),
      gradient: "from-indigo-600 to-purple-600",
      isAction: true,
    },
    {
      title: "View My Conversations",
      desc: "Review past AI dialogues, code snippets, and verified solutions.",
      icon: MessageSquare,
      href: "/conversations",
      gradient: "from-teal-600 to-emerald-600",
      isAction: false,
    },
    {
      title: "Track Open Tickets",
      desc: "Check real-time agent updates, comments, and priority statuses.",
      icon: Clock,
      href: "/tickets?status=OPEN",
      gradient: "from-amber-600 to-rose-600",
      isAction: false,
    },
  ];

  return (
    <>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">Quick Actions</h3>
          <span className="text-xs text-muted-foreground">Direct shortcuts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {actions.map((act, i) => {
            const Icon = act.icon;
            if (act.isAction) {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={act.onClick}
                  className="group flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-200 text-left w-full hover:-translate-y-0.5"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                        {act.title}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {act.desc}
                    </p>
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={i}
                href={act.href!}
                className="group flex items-start gap-3.5 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                      {act.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {act.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {showCreateTicketModal && (
        <CreateTicketModal
          onClose={() => setShowCreateTicketModal(false)}
          onCreated={() => {
            setShowCreateTicketModal(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
