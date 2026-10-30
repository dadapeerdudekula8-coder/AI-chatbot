// src/lib/validations/tickets.ts
import { z } from "zod";

export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(120, "Subject too long"),
  description: z
    .string()
    .min(20, "Please provide more detail (at least 20 characters)")
    .max(5000, "Description too long"),
  category: z.enum([
    "BILLING",
    "TECHNICAL",
    "DELIVERY",
    "REFUND",
    "ACCOUNT",
    "GENERAL",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  conversationId: z.string().optional().nullable(),
});

export const updateTicketSchema = z.object({
  status: z
    .enum([
      "OPEN",
      "IN_PROGRESS",
      "WAITING_FOR_CUSTOMER",
      "RESOLVED",
      "CLOSED",
    ])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  agentId: z.string().cuid().optional().nullable(),
  category: z
    .enum(["BILLING", "TECHNICAL", "DELIVERY", "REFUND", "ACCOUNT", "GENERAL"])
    .optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(5000),
  isInternal: z.boolean().default(false),
});

export const ticketFilterSchema = z.object({
  status: z
    .enum(["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER", "RESOLVED", "CLOSED"])
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  category: z
    .enum(["BILLING", "TECHNICAL", "DELIVERY", "REFUND", "ACCOUNT", "GENERAL"])
    .optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type TicketFilterInput = z.infer<typeof ticketFilterSchema>;
