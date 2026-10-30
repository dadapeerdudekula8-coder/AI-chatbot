"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  ArrowRight,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { CreateTicketModal } from "@/components/tickets/create-ticket-modal";
import { useRouter } from "next/navigation";

export interface TicketSummaryItem {
  id: string;
  number: number;
  subject: string;
  status: string;
  priority: string;
  category: string;
  updatedAt: Date | string;
  agent?: { name: string | null; email: string } | null;
  _count?: { comments: number };
}

export function TicketOverview({ tickets }: { tickets: TicketSummaryItem[] }) {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "URGENT":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "HIGH":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "MEDIUM":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Support Tickets Overview</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Track resolution progress and agent communication
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Ticket</span>
            </button>
            <Link
              href="/tickets"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-border hover:bg-muted text-foreground transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Ticket className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">No support tickets found</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              If you need dedicated assistance with order changes, returns, or technical issues, open a ticket.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:opacity-90 transition shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Create Your First Ticket
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                  <th className="pb-3 font-medium">ID</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium hidden md:table-cell">Priority</th>
                  <th className="pb-3 font-medium hidden lg:table-cell">Updated</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    <td className="py-3 font-mono font-bold text-foreground">
                      #{ticket.number}
                    </td>
                    <td className="py-3 font-medium text-foreground max-w-[200px] truncate">
                      {ticket.subject}
                    </td>
                    <td className="py-3 text-muted-foreground hidden sm:table-cell">
                      {ticket.category}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 hidden md:table-cell">
                      <span
                        className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground hidden lg:table-cell">
                      {formatRelativeTime(new Date(ticket.updatedAt))}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/tickets`}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs"
                      >
                        Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
