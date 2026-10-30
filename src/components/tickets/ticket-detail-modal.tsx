"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Send } from "lucide-react";
import { cn, formatDateTime, getTicketStatusColor, getTicketPriorityColor } from "@/lib/utils";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS, TICKET_CATEGORY_LABELS } from "@/lib/constants";

type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";

export function TicketDetailModal({
  ticket,
  userRole,
  userId,
  onClose,
  onUpdated,
}: {
  ticket: any;
  userRole: UserRole;
  userId: string;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [fullTicket, setFullTicket] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const refetch = async () => {
    const res = await fetch(`/api/tickets/${ticket.id}`);
    const data = await res.json();
    if (data.success) setFullTicket(data.data);
  };

  useEffect(() => { refetch(); }, [ticket.id]);

  const submitComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    await fetch(`/api/tickets/${ticket.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: comment.trim(), isInternal }),
    });
    setComment("");
    await refetch();
    setSubmitting(false);
    onUpdated();
  };

  const updateStatus = async (status: string) => {
    await fetch(`/api/tickets/${ticket.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refetch();
    onUpdated();
  };

  const t = fullTicket || ticket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">#{t.number}</span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getTicketStatusColor(t.status))}>
                {TICKET_STATUS_LABELS[t.status]}
              </span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", getTicketPriorityColor(t.priority))}>
                {TICKET_PRIORITY_LABELS[t.priority]}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{t.subject}</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="text-xs text-muted-foreground mb-2">
              {TICKET_CATEGORY_LABELS[t.category] || t.category} · {formatDateTime(t.createdAt)}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{t.description}</p>
          </div>

          {/* Status controls for agents/admins */}
          {(userRole === "AGENT" || userRole === "ADMIN") && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(TICKET_STATUS_LABELS).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition",
                      t.status === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {TICKET_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <h3 className="font-semibold mb-4">
              Comments ({fullTicket?.comments?.length ?? t.comments?.length ?? 0})
            </h3>
            <div className="space-y-4">
              {(fullTicket?.comments || t.comments || []).map((c: any) => (
                <div
                  key={c.id}
                  className={cn(
                    "rounded-xl p-4",
                    c.isInternal
                      ? "bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900"
                      : "bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{c.author?.name || "Support Agent"}</span>
                    <div className="flex items-center gap-2">
                      {c.isInternal && (
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Internal</span>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reply area */}
        <div className="p-6 border-t border-border flex-shrink-0">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-3"
          />
          <div className="flex items-center justify-between">
            {(userRole === "AGENT" || userRole === "ADMIN") && (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded"
                />
                Internal note
              </label>
            )}
            <div className="ml-auto">
              <button
                onClick={submitComment}
                disabled={!comment.trim() || submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isInternal ? "Add Note" : "Send Reply"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
