"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Plus,
  ThumbsUp,
  ThumbsDown,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  LifeBuoy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import { SUGGESTED_QUESTIONS } from "@/lib/constants";
import Link from "next/link";

interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: Date;
  sources?: Array<{ documentTitle: string; similarity: number }>;
  feedback?: string | null;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  _count: { messages: number };
}

const QUICK_CHIPS = [
  { label: "📦 Track Order", prompt: "How can I track my order status and delivery timeline?" },
  { label: "🔄 Return Policy", prompt: "What is your return policy and how do refunds work?" },
  { label: "💳 Payment Methods", prompt: "What payment methods do you accept and is checkout secure?" },
  { label: "⏱️ Shipping Rates", prompt: "Do you offer international shipping and what are the delivery times?" },
  { label: "🔒 Reset Password", prompt: "How do I reset my account password?" },
  { label: "🎫 Open Ticket", isEscalate: true },
];

export function ChatInterface({
  userId,
  userName,
  initialPrompt,
}: {
  userId?: string;
  userName?: string;
  initialPrompt?: string;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const initialSentRef = useRef(false);

  // Escalate to Ticket Modal state
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketCategory, setTicketCategory] = useState("GENERAL");
  const [ticketPriority, setTicketPriority] = useState("MEDIUM");
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketSuccessMessage, setTicketSuccessMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setConversations(data.data.items);
      });
  }, []);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && !initialSentRef.current) {
      initialSentRef.current = true;
      sendMessage(initialPrompt.trim());
    }
  }, [initialPrompt]);

  const loadConversation = async (convId: string) => {
    setActiveConvId(convId);
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(
          data.data.map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) }))
        );
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  const startNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
    setError("");
    inputRef.current?.focus();
  };

  const copyToClipboard = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleEscalateClick = () => {
    // Extract recent messages to pre-fill description
    const lastUserMsg = messages
      .filter((m) => m.role === "USER")
      .slice(-1)[0]?.content || "";
    const conversationTitle =
      conversations.find((c) => c.id === activeConvId)?.title ||
      "Support request from chat";

    setTicketSubject(
      lastUserMsg ? `Issue: ${lastUserMsg.slice(0, 50)}...` : conversationTitle
    );
    setTicketDescription(
      messages.length > 0
        ? `Customer inquiry from AI Chat:\n\n${messages
            .slice(-4)
            .map((m) => `${m.role === "USER" ? "User" : "AI"}: ${m.content}`)
            .join("\n\n")}\n\nAdditional notes: Please assist with resolution.`
        : "Customer requested escalation from AI chat assistant."
    );
    setTicketSuccessMessage("");
    setShowEscalateModal(true);
  };

  const submitEscalateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTicket(true);
    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: ticketSubject.trim(),
          description: ticketDescription.trim(),
          category: ticketCategory,
          priority: ticketPriority,
          conversationId: activeConvId || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTicketSuccessMessage(`Ticket #${data.data.number} created successfully! Our agents will follow up.`);
        setTimeout(() => {
          setShowEscalateModal(false);
          setTicketSuccessMessage("");
        }, 2500);
      } else {
        alert(data.error || "Failed to create ticket.");
      }
    } catch {
      alert("Network error while creating ticket.");
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || streaming) return;
    setInput("");
    setError("");

    const userMsg: Message = {
      id: `tmp-${Date.now()}`,
      role: "USER",
      content: content.trim(),
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      role: "ASSISTANT",
      content: "",
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    setStreaming(true);

    try {
      const payload: { content: string; conversationId?: string } = {
        content: content.trim(),
      };
      if (activeConvId) {
        payload.conversationId = activeConvId;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok || !res.body) {
        let errMessage = "Request failed";
        try {
          const errJson = await res.json();
          if (errJson?.error) errMessage = errJson.error;
        } catch {}
        throw new Error(errMessage);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.error) {
              throw new Error(event.error);
            }
            if (event.text) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsg.id ? { ...m, content: m.content + event.text } : m
                )
              );
            }
            if (event.done) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsg.id
                    ? { ...m, id: event.messageId, sources: event.sources }
                    : m
                )
              );
              if (!activeConvId && event.conversationId) {
                setActiveConvId(event.conversationId);
                // Refresh sidebar
                fetch("/api/conversations")
                  .then((r) => r.json())
                  .then((data) => {
                    if (data.success) setConversations(data.data.items);
                  });
              }
            }
          } catch (e: any) {
            if (e?.message && e.message !== "Unexpected end of JSON input") {
              throw e;
            }
          }
        }
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== aiMsg.id));
    } finally {
      setStreaming(false);
    }
  };

  const submitFeedback = async (
    messageId: string,
    rating: "HELPFUL" | "NOT_HELPFUL"
  ) => {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, rating }),
    });
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedback: rating } : m))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r border-border bg-muted/30">
        <div className="p-4 border-b border-border">
          <button
            onClick={startNewConversation}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition text-sm shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 && (
            <div className="text-center py-8 px-4 text-xs text-muted-foreground">
              No previous chats found. Start asking questions to build your history!
            </div>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => loadConversation(conv.id)}
              className={cn(
                "w-full text-left px-3 py-3 rounded-xl mb-1 transition-all text-sm",
                activeConvId === conv.id
                  ? "bg-primary/10 text-primary font-medium border border-primary/20"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <div className="truncate">{conv.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {conv._count.messages} messages
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-border bg-background/50 text-xs text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            RAG Grounded
          </span>
          <Link href="/specifications" className="text-primary hover:underline font-medium">
            Specs & API
          </Link>
        </div>
      </div>

      {/* Main chat */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base flex items-center gap-2">
                SupportAI Assistant
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  AI + RAG v2.0
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>Online &bull; 99.9% Uptime SLA</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleEscalateClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition text-foreground"
              title="Escalate to human support ticket"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Escalate to</span> Ticket
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loadingMessages && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {messages.length === 0 && !loadingMessages && (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 max-w-xl mx-auto">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">How can we support you today?</h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Ask about order tracking, refunds, payment options, delivery times, or technical questions.
                Our RAG system retrieves answers directly from verified knowledge docs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="p-3 text-left text-xs sm:text-sm bg-muted/60 hover:bg-muted rounded-xl border border-border/80 transition shadow-sm hover:shadow"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 animate-slide-up",
                msg.role === "USER" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "ASSISTANT" && (
                <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={cn("max-w-[80%] space-y-2")}>
                <div
                  className={cn(
                    "px-4 py-3.5 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl",
                    msg.role === "USER"
                      ? "chat-bubble-user"
                      : "chat-bubble-ai border border-border/60 shadow-sm"
                  )}
                >
                  {msg.content}
                  {msg.role === "ASSISTANT" && !msg.content && streaming && (
                    <span className="inline-flex gap-1 ml-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-dot"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </span>
                  )}
                </div>

                {/* Sources tag */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center text-[11px] text-muted-foreground px-1">
                    <span className="font-semibold text-primary">Verified Sources:</span>
                    {msg.sources.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-muted border border-border/60 font-medium"
                      >
                        {s.documentTitle}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions: Copy, Thumbs, Timestamp */}
                {msg.role === "ASSISTANT" && msg.content && (
                  <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.content)}
                      className="p-1 rounded hover:bg-muted transition text-muted-foreground hover:text-foreground"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {msg.id && !msg.id.startsWith("ai-") && (
                      <>
                        <button
                          onClick={() => submitFeedback(msg.id, "HELPFUL")}
                          className={cn(
                            "p-1 rounded transition-colors",
                            msg.feedback === "HELPFUL"
                              ? "text-emerald-500 bg-emerald-500/10"
                              : "hover:text-emerald-500"
                          )}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => submitFeedback(msg.id, "NOT_HELPFUL")}
                          className={cn(
                            "p-1 rounded transition-colors",
                            msg.feedback === "NOT_HELPFUL"
                              ? "text-rose-500 bg-rose-500/10"
                              : "hover:text-rose-500"
                          )}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    <span className="ml-auto text-[11px]">
                      {formatRelativeTime(msg.createdAt)}
                    </span>
                  </div>
                )}
              </div>
              {msg.role === "USER" && (
                <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {error && (
          <div className="mx-6 mb-2 flex items-center gap-2 text-sm text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Quick prompt chips & input */}
        <div className="px-6 pb-6 pt-1 space-y-2.5">
          {/* Quick Action Chips Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {QUICK_CHIPS.map((chip, i) => (
              <button
                key={i}
                onClick={() => {
                  if (chip.isEscalate) {
                    handleEscalateClick();
                  } else if (chip.prompt) {
                    sendMessage(chip.prompt);
                  }
                }}
                disabled={streaming}
                className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border/80 bg-muted/40 hover:bg-muted text-foreground font-medium transition disabled:opacity-50"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-3 border border-border rounded-2xl bg-background p-3 focus-within:ring-2 focus-within:ring-primary transition-all shadow-sm">
            <textarea
              ref={inputRef}
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-transparent resize-none text-sm outline-none max-h-32 overflow-y-auto"
              style={{ minHeight: "24px" }}
              disabled={streaming}
            />
            <button
              id="send-message"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
              aria-label="Send message"
            >
              {streaming ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span>Grounding: 768-dim Gemini Embeddings + Knowledge RAG</span>
            <Link href="/tickets" className="hover:underline text-primary font-medium">
              View My Tickets &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Escalate to Human Support Ticket Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Escalate Chat to Support Ticket</h3>
              </div>
              <button
                onClick={() => setShowEscalateModal(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {ticketSuccessMessage ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-center font-medium">
                {ticketSuccessMessage}
              </div>
            ) : (
              <form onSubmit={submitEscalateTicket} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Ticket Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Short summary of your issue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Category
                    </label>
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="GENERAL">General Support</option>
                      <option value="BILLING">Billing & Payment</option>
                      <option value="TECHNICAL">Technical Issue</option>
                      <option value="DELIVERY">Shipping & Delivery</option>
                      <option value="REFUND">Refund Request</option>
                      <option value="ACCOUNT">Account Security</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Priority
                    </label>
                    <select
                      value={ticketPriority}
                      onChange={(e) => setTicketPriority(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="LOW">Low (24h SLA)</option>
                      <option value="MEDIUM">Medium (12h SLA)</option>
                      <option value="HIGH">High (4h SLA)</option>
                      <option value="URGENT">Urgent (1h SLA)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Details & Chat Context
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none resize-none font-mono text-xs"
                    placeholder="Provide details about the issue..."
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    This ticket will be assigned to a support agent and linked to this chat.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEscalateModal(false)}
                    className="px-4 py-2 rounded-xl text-sm border border-border hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingTicket}
                    className="px-4 py-2 rounded-xl text-sm gradient-primary text-white font-medium hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmittingTicket ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      "Submit Ticket"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
