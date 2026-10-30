"use client";
import { useState } from "react";
import { Inbox, User, Clock, AlertCircle } from "lucide-react";
import { cn, formatRelativeTime, getTicketStatusColor, getTicketPriorityColor, truncateText } from "@/lib/utils";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, TICKET_CATEGORY_LABELS } from "@/lib/constants";

interface Ticket {
  id: string;
  number: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  customer: { id: string; name: string | null; email: string };
  agent: { id: string; name: string | null; email: string } | null;
  _count: { comments: number };
}

export function AgentInboxClient({
  initialTickets,
  agentId,
  agentRole,
}: {
  initialTickets: Ticket[];
  agentId: string;
  agentRole: string;
}) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState<"all" | "mine" | "unassigned">("all");
  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const displayed = tickets.filter((t) => {
    if (filter === "mine") return t.agent?.id === agentId;
    if (filter === "unassigned") return !t.agent;
    return true;
  });

  const claimTicket = async (ticketId: string) => {
    await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    });
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, agent: { id: agentId, name: "You", email: "" } } : t))
    );
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    setSubmitting(true);
    await fetch(`/api/tickets/${selected.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: reply.trim(), isInternal }),
    });
    setReply("");
    setSubmitting(false);
  };

  const updateStatus = async (status: string) => {
    if (!selected) return;
    await fetch(`/api/tickets/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setTickets((prev) =>
      prev.map((t) => (t.id === selected.id ? { ...t, status } : t))
    );
    setSelected((prev) => (prev ? { ...prev, status } : null));
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Ticket list */}
      <div className="flex flex-col w-80 border-r border-border bg-muted/20 overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Inbox className="w-5 h-5" /> Agent Inbox
          </h2>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(["all", "mine", "unassigned"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize",
                  filter === f
                    ? "bg-background shadow text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {displayed.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No tickets
            </div>
          )}
          {displayed.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={cn(
                "w-full text-left px-4 py-4 border-b border-border transition-colors",
                selected?.id === t.id
                  ? "bg-primary/5 border-l-2 border-l-primary"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground font-mono">#{t.number}</span>
                <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getTicketPriorityColor(t.priority))}>
                  {TICKET_PRIORITY_LABELS[t.priority]}
                </span>
              </div>
              <div className="font-medium text-sm truncate mb-1">{t.subject}</div>
              <div className="flex items-center justify-between">
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium", getTicketStatusColor(t.status))}>
                  {TICKET_STATUS_LABELS[t.status]}
                </span>
                <span className="text-[10px] text-muted-foreground">{formatRelativeTime(t.updatedAt)}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <User className="w-3 h-3" />
                {t.customer.name || t.customer.email}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm text-muted-foreground">#{selected.number}</span>
                <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getTicketStatusColor(selected.status))}>
                  {TICKET_STATUS_LABELS[selected.status]}
                </span>
              </div>
              <h2 className="text-xl font-bold">{selected.subject}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {selected.customer.name || selected.customer.email} · {TICKET_CATEGORY_LABELS[selected.category]}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {!selected.agent && (
                <button
                  onClick={() => claimTicket(selected.id)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  Claim Ticket
                </button>
              )}
              <div className="flex gap-1 flex-wrap justify-end">
                {["IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition",
                      selected.status === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {TICKET_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.description}</p>
            </div>
          </div>

          <div className="p-6 border-t border-border">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-3"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded"
                />
                Internal note only
              </label>
              <button
                onClick={sendReply}
                disabled={!reply.trim() || submitting}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {isInternal ? "Add Note" : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
          <div>
            <Inbox className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Select a ticket to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
