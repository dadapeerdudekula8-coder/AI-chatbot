// src/types/index.ts
// Global TypeScript types shared across the application

export type UserRole = "CUSTOMER" | "AGENT" | "ADMIN";

export type ConversationStatus = "ACTIVE" | "RESOLVED" | "ESCALATED";

export type MessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_CUSTOMER"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketCategory =
  | "BILLING"
  | "TECHNICAL"
  | "DELIVERY"
  | "REFUND"
  | "ACCOUNT"
  | "GENERAL";

export type DocumentStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export type FeedbackRating = "HELPFUL" | "NOT_HELPFUL";

export type NotificationType =
  | "TICKET_UPDATE"
  | "TICKET_ASSIGNED"
  | "TICKET_RESOLVED"
  | "NEW_MESSAGE"
  | "SYSTEM";

// ── API Response shapes ────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ── Chat / AI ─────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  feedback?: FeedbackRating | null;
  sources?: KnowledgeSource[];
}

export interface KnowledgeSource {
  documentId: string;
  documentTitle: string;
  chunkContent: string;
  similarity: number;
}

export interface StreamChunk {
  type: "text" | "error" | "done";
  content?: string;
  error?: string;
}

// ── Ticket ─────────────────────────────────────────────────────────────────────

export interface TicketWithRelations {
  id: string;
  number: number;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  customer: { id: string; name: string | null; email: string };
  agent: { id: string; name: string | null; email: string } | null;
  _count: { comments: number };
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalConversations: number;
  aiResolvedConversations: number;
  escalatedConversations: number;
  openTickets: number;
  resolvedTickets: number;
  avgResponseTimeMs: number;
  satisfactionRate: number;
  totalMessages: number;
}

export interface ConversationVolumePoint {
  date: string;
  conversations: number;
  escalated: number;
}

export interface TopQuestion {
  question: string;
  count: number;
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: UserRole;
}

declare module "next-auth" {
  interface Session {
    user: SessionUser;
  }
  interface User {
    role: UserRole;
  }
}
