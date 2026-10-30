import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalConversations, escalated, totalMessages, openTickets, resolvedTickets,
    helpfulFeedback, totalFeedback, dailyConversations] = await Promise.all([
    prisma.conversation.count(),
    prisma.conversation.count({ where: { status: "ESCALATED" } }),
    prisma.message.count({ where: { role: "ASSISTANT" } }),
    prisma.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER"] } } }),
    prisma.supportTicket.count({ where: { status: "RESOLVED" } }),
    prisma.feedback.count({ where: { rating: "HELPFUL" } }),
    prisma.feedback.count(),
    prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*)::int as count
      FROM "Conversation"
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `,
  ]);

  const aiResolved = totalConversations - escalated;
  const satisfactionRate = totalFeedback > 0 ? Math.round((helpfulFeedback / totalFeedback) * 100) : 0;

  return NextResponse.json({
    success: true,
    data: {
      totalConversations,
      aiResolvedConversations: aiResolved,
      escalatedConversations: escalated,
      openTickets,
      resolvedTickets,
      satisfactionRate,
      totalMessages,
      dailyConversations,
    },
  });
}
