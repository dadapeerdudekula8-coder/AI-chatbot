// src/lib/validations/chat.ts
import { z } from "zod";

export const sendMessageSchema = z.object({
  conversationId: z.string().optional().nullable(),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(4000, "Message too long"),
});

export const feedbackSchema = z.object({
  messageId: z.string().min(1),
  rating: z.enum(["HELPFUL", "NOT_HELPFUL"]),
  comment: z.string().max(500).optional().nullable(),
});

export const createConversationSchema = z.object({
  title: z.string().max(100).optional().nullable(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
