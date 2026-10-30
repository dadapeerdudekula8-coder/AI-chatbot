import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { prisma } from "@/lib/prisma";
import { BarChart3, MessageCircle, Ticket, Users, ThumbsUp, Bot } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard" };

async function getAdminStats() {
  const [
    totalUsers,
    totalConversations,
    openTickets,
    resolvedTickets,
    helpfulFeedback,
    totalFeedback,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.conversation.count(),
    prisma.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.supportTicket.count({ where: { status: "RESOLVED" } }),
    prisma.feedback.count({ where: { rating: "HELPFUL" } }),
    prisma.feedback.count(),
  ]);
  return { totalUsers, totalConversations, openTickets, resolvedTickets, helpfulFeedback, totalFeedback };
}

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/dashboard");

  const stats = await getAdminStats();
  const satisfactionRate = stats.totalFeedback > 0
    ? Math.round((stats.helpfulFeedback / stats.totalFeedback) * 100)
    : null;

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, href: "/admin/users", color: "from-blue-500 to-blue-600" },
    { label: "Conversations", value: stats.totalConversations, icon: Bot, href: "/admin/analytics", color: "from-purple-500 to-purple-600" },
    { label: "Open Tickets", value: stats.openTickets, icon: Ticket, href: "/admin/analytics", color: "from-orange-500 to-orange-600" },
    { label: "Resolved Tickets", value: stats.resolvedTickets, icon: Ticket, href: "/admin/analytics", color: "from-green-500 to-green-600" },
    ...(satisfactionRate !== null
      ? [{ label: "Satisfaction Rate", value: `${satisfactionRate}%`, icon: ThumbsUp, href: "/admin/analytics", color: "from-teal-500 to-teal-600" }]
      : []),
  ];

  const quickLinks = [
    { href: "/admin/users", label: "Manage Users", icon: Users, desc: "Add, edit, or deactivate user accounts" },
    { href: "/admin/knowledge", label: "Knowledge Base", icon: MessageCircle, desc: "Upload documents and manage content" },
    { href: "/admin/faqs", label: "FAQs", icon: BarChart3, desc: "Create and manage frequently asked questions" },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3, desc: "View detailed performance reports" },
    { href: "/admin/settings", label: "Settings", icon: BarChart3, desc: "Configure chatbot behavior and system options" },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform overview and management.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {cards.map(({ label, value, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold mb-1">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
