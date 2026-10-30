import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime, getTicketStatusColor, getTicketPriorityColor } from "@/lib/utils";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { AgentInboxClient } from "@/components/agent/agent-inbox-client";

export const metadata = { title: "Agent Inbox" };

export default async function AgentInboxPage() {
  const session = await auth();
  if (!session?.user || !["AGENT", "ADMIN"].includes(session.user.role))
    redirect("/dashboard");

  const tickets = await prisma.supportTicket.findMany({
    where: {
      OR: [
        { agentId: session.user.id },
        { agentId: null, status: { in: ["OPEN", "IN_PROGRESS"] } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      customer: { select: { id: true, name: true, email: true } },
      agent: { select: { id: true, name: true, email: true } },
      _count: { select: { comments: true } },
    },
  });

  return (
    <DashboardLayout>
      <AgentInboxClient
        initialTickets={tickets}
        agentId={session.user.id}
        agentRole={session.user.role}
      />
    </DashboardLayout>
  );
}
