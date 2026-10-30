import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";
import { DashboardHeader3D } from "@/components/dashboard/dashboard-header-3d";
import { WelcomeHero3D } from "@/components/dashboard/welcome-hero-3d";
import { StatCards3D } from "@/components/dashboard/stat-cards-3d";
import { QuickActions3D } from "@/components/dashboard/quick-actions-3d";
import { RecentActivity3D } from "@/components/dashboard/recent-activity-3d";
import { TicketOverview3D } from "@/components/dashboard/ticket-overview-3d";
import { AIAssistantSpotlightCard3D } from "@/components/dashboard/ai-spotlight-card-3d";
import Link from "next/link";
import { ShieldCheck, BookOpen, Zap, Clock, ExternalLink } from "lucide-react";

export const metadata = {
  title: "3D Intelligence Center | SupportAI",
  description: "Immersive 3D AI Customer Support Portal and Ticket Management",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;
  const userName = session.user.name || "Customer";
  const userEmail = session.user.email || "";
  const userRole = (session.user.role as UserRole) || "CUSTOMER";

  // Fetch real statistics & recent records concurrently
  const [
    convCount,
    ticketCount,
    openTickets,
    feedbackCount,
    recentConversations,
    recentTickets,
    faqCount,
    docCount,
  ] = await Promise.all([
    prisma.conversation.count({ where: { userId } }),
    prisma.supportTicket.count({ where: { customerId: userId } }),
    prisma.supportTicket.count({
      where: {
        customerId: userId,
        status: { in: ["OPEN", "IN_PROGRESS", "WAITING_FOR_CUSTOMER"] },
      },
    }),
    prisma.feedback.count({ where: { userId, rating: "HELPFUL" } }),
    prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      include: {
        _count: { select: { messages: true } },
      },
    }),
    prisma.supportTicket.findMany({
      where: { customerId: userId },
      orderBy: { updatedAt: "desc" },
      take: 4,
      include: {
        agent: { select: { name: true, email: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.fAQ.count({ where: { isActive: true } }),
    prisma.knowledgeDocument.count({ where: { status: "READY" } }),
  ]);

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Floating 3D Glass Header */}
        <DashboardHeader3D
          userName={userName}
          userEmail={userEmail}
          userRole={userRole}
        />

        {/* Main 3D Content Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* 1. Immersive 3D Hero with Procedural Three.js Quantum AI Assistant */}
          <WelcomeHero3D userName={userName} />

          {/* 2. Interactive 3D Statistics Cards with Perspective Tilt */}
          <StatCards3D
            convCount={convCount}
            ticketCount={ticketCount}
            openTickets={openTickets}
            feedbackCount={feedbackCount}
          />

          {/* 3. Main Dashboard 3D Grid: Left (2 Cols) + Right Spotlight (1 Col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Left 2 Columns: Floating Quick Actions, Support Tickets Overview, and Recent Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Floating 3D Quick Actions */}
              <QuickActions3D />

              {/* Support Ticket 3D Overview Table */}
              <TicketOverview3D tickets={recentTickets} />

              {/* Recent Activity 3D Timeline */}
              <RecentActivity3D
                conversations={recentConversations}
                tickets={recentTickets}
              />
            </div>

            {/* Right 1 Column: 3D AI Spotlight & Telemetry Status Card */}
            <div className="space-y-6">
              {/* 3D AI Assistant Spotlight Card with embedded Mini Hologram */}
              <AIAssistantSpotlightCard3D />

              {/* Grounded Knowledge Base & SLA Status Card */}
              <div className="rounded-2xl border border-white/10 bg-[#090f22]/80 backdrop-blur-2xl p-5 space-y-4 shadow-xl shadow-black/40 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      System Health & SLAs
                    </h4>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    OPERATIONAL
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 text-slate-300">
                      <BookOpen className="w-4 h-4 text-cyan-400" />
                      <span>Verified Knowledge FAQs</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {faqCount} FAQs &bull; {docCount} Docs
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Avg. Vector RAG Latency</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      &lt; 380ms
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Cluster Availability</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      99.9% Uptime
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Human Support Operations</span>
                    </div>
                    <span className="font-mono text-slate-200">
                      Mon-Fri, 8am-8pm EST
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Neural specs & docs</span>
                  <Link
                    href="/specifications"
                    className="inline-flex items-center gap-1 font-semibold text-cyan-300 hover:text-white transition-colors"
                  >
                    <span>View Specifications</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
