import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ChatInterface } from "@/components/chat/chat-interface";

export const metadata = { title: "AI Chat" };

export default async function ChatPage({
  searchParams,
}: {
  searchParams?: { q?: string; prompt?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const initialPrompt = searchParams?.q || searchParams?.prompt || "";

  return (
    <DashboardLayout>
      <div className="flex-1 flex overflow-hidden">
        <ChatInterface
          userId={session.user.id}
          userName={session.user.name || "You"}
          initialPrompt={initialPrompt}
        />
      </div>
    </DashboardLayout>
  );
}
