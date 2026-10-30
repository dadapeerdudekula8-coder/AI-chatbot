import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.id },
    select: { userId: true },
  });

  if (!conversation) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  // Enforce ownership for customers
  if (session.user.role === "CUSTOMER" && conversation.userId !== session.user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: params.id },
    orderBy: { createdAt: "asc" },
    include: { feedback: true },
  });

  const parsedMessages = messages.map((m) => {
    let sources = null;
    if (m.sources) {
      try {
        sources = typeof m.sources === "string" ? JSON.parse(m.sources) : m.sources;
      } catch {
        sources = null;
      }
    }
    return {
      ...m,
      sources,
      feedback: m.feedback ? m.feedback.rating : null,
    };
  });

  return NextResponse.json({ success: true, data: parsedMessages });
}
