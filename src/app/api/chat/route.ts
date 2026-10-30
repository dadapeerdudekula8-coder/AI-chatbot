import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai/provider";
import { ragPipeline } from "@/lib/ai/rag";
import { sendMessageSchema } from "@/lib/validations/chat";
import { SYSTEM_PROMPT_DEFAULT, MAX_CONVERSATION_HISTORY } from "@/lib/constants";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = sendMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { content, conversationId } = parsed.data;
    const userId = session.user.id;

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
      if (!conversation || conversation.userId !== userId) {
        return NextResponse.json({ success: false, error: "Conversation not found" }, { status: 404 });
      }
    } else {
      const title = content.slice(0, 60).trim() || "New Conversation";
      conversation = await prisma.conversation.create({
        data: { userId, title, status: "ACTIVE" },
      });
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: { conversationId: conversation.id, role: "USER", content },
    });

    // Get conversation history for context
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id, id: { not: userMessage.id } },
      orderBy: { createdAt: "asc" },
      take: MAX_CONVERSATION_HISTORY,
      select: { role: true, content: true },
    });

    // RAG: retrieve relevant knowledge
    const { augmentedPrompt, sources } = await ragPipeline(content);

    console.log(
      `[Chat Pipeline] Query: "${content.slice(0, 60)}" | Matched Sources: ${sources.length} [${sources.map((s) => s.documentTitle).join(", ")}]`
    );

    // Get configurable system prompt from settings
    const settingsRecord = await prisma.appSettings.findUnique({ where: { key: "system_prompt" } });
    const systemPrompt = settingsRecord?.value || SYSTEM_PROMPT_DEFAULT;

    // Build messages for AI
    const aiMessages = [
      ...history.map((m: { role: string; content: string }) => ({
        role: (m.role === "USER" ? "user" : "model") as "user" | "model",
        content: m.content,
      })),
      { role: "user" as const, content: augmentedPrompt },
    ];

    // Stream response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const provider = getAIProvider();
          await provider.streamChat(aiMessages, systemPrompt, async (chunk) => {
            if (chunk.text) {
              fullResponse += chunk.text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.text })}\n\n`));
            }
            if (chunk.done) {
              // Save AI response to DB
              const assistantMessage = await prisma.message.create({
                data: {
                  conversationId: conversation.id,
                  role: "ASSISTANT",
                  content: fullResponse || "I'm here to help! Let me know what you need assistance with.",
                  sources: sources.length > 0 ? JSON.parse(JSON.stringify(sources)) : undefined,
                },
              });
              // Update conversation title if first exchange
              if (history.length === 0) {
                const title = content.slice(0, 60).trim();
                await prisma.conversation.update({
                  where: { id: conversation.id },
                  data: { title },
                });
              }
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ done: true, messageId: assistantMessage.id, conversationId: conversation.id, sources })}\n\n`
                )
              );
              controller.close();
            }
          });
        } catch (error: any) {
          console.error("[Chat Stream Error]", error);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "AI error" })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("[Chat API]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
