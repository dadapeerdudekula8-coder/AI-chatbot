"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Loader2, Ticket } from "lucide-react";
import { cn, formatRelativeTime, getTicketStatusColor, getTicketPriorityColor, truncateText } from "@/lib/utils";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, TICKET_CATEGORY_LABELS } from "@/lib/constants";
import { CreateTicketModal } from "@/components/tickets/create-ticket-modal";
import { TicketDetailModal } from "@/components/tickets/ticket-detail-modal";

type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";

export function TicketsPage({ userRole, userId }: { userRole: UserRole; userId: string }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTickets = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`/api/tickets?${params}`);
      const data = await res.json();
      if (data.success) { setTickets(data.data.items); setTotal(data.data.total); }
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, [page, statusFilter]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchTickets(); };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-muted-foreground mt-1">{total} total tickets</p>
        </div>
        {userRole === "CUSTOMER" && (
          <button
            id="create-ticket-btn"
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition"
          >
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {Object.entries(TICKET_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16">
          <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
          <p className="text-muted-foreground">
            {userRole === "CUSTOMER" ? "Create a new ticket to get help from our support team." : "No tickets match your filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">#{ticket.number}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getTicketStatusColor(ticket.status))}>
                      {TICKET_STATUS_LABELS[ticket.status]}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getTicketPriorityColor(ticket.priority))}>
                      {TICKET_PRIORITY_LABELS[ticket.priority]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{ticket.subject}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{truncateText(ticket.description, 120)}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>{TICKET_CATEGORY_LABELS[ticket.category]}</span>
                    <span>{ticket._count?.comments ?? 0} comment{ticket._count?.comments !== 1 ? "s" : ""}</span>
                    <span>{formatRelativeTime(ticket.updatedAt)}</span>
                  </div>
                </div>
                {ticket.agent && (
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground text-xs">Agent</div>
                    <div className="font-medium">{ticket.agent.name || ticket.agent.email}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <CreateTicketModal
          onClose={() => setCreating(false)}
          onCreated={() => { setCreating(false); fetchTickets(); }}
        />
      )}

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          userRole={userRole}
          userId={userId}
          onClose={() => setSelectedTicket(null)}
          onUpdated={fetchTickets}
        />
      )}
    </div>
  );
}
