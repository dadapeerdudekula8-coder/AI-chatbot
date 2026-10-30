import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MessageCircle, Bot } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export const metadata = { title: "Conversations" };

export default async function ConversationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { messages: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, role: true, createdAt: true },
      },
    },
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Conversations</h1>
            <p className="text-muted-foreground mt-1">{conversations.length} total</p>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition"
          >
            <Bot className="w-4 h-4" /> New Chat
          </Link>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-6">Start a chat with our AI assistant.</p>
            <Link href="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition">
              <Bot className="w-4 h-4" /> Start Chat
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => {
              const lastMsg = conv.messages[0];
              return (
                <Link
                  key={conv.id}
                  href={`/chat?conv=${conv.id}`}
                  className="block bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="w-4 h-4 text-primary flex-shrink-0" />
                        <h3 className="font-semibold truncate">{conv.title || "New Conversation"}</h3>
                      </div>
                      {lastMsg && (
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMsg.role === "ASSISTANT" ? "AI: " : "You: "}
                          {lastMsg.content}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{conv._count.messages} message{conv._count.messages !== 1 ? "s" : ""}</span>
                        <span>{formatRelativeTime(conv.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
