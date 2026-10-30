"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  Ticket,
  Users,
  BookOpen,
  HelpCircle,
  BarChart3,
  Settings,
  Inbox,
  LogOut,
  Bot,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import type { UserRole } from "@/types";
import { SignOutDialog } from "@/components/dashboard/signout-dialog";

export interface UserSession {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: UserRole;
}

const customerNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/chat", icon: Bot, label: "AI Assistant", hasStatus: true },
  { href: "/conversations", icon: MessageCircle, label: "Conversations" },
  { href: "/tickets", icon: Ticket, label: "My Tickets" },
  { href: "/specifications", icon: Layers, label: "Architecture & Specs" },
];

const agentNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/agent/inbox", icon: Inbox, label: "Agent Inbox" },
  { href: "/tickets", icon: Ticket, label: "All Tickets" },
  { href: "/chat", icon: Bot, label: "AI Assistant", hasStatus: true },
  { href: "/specifications", icon: Layers, label: "Architecture & Specs" },
];

const adminNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin", icon: BarChart3, label: "Admin Overview" },
  { href: "/admin/users", icon: Users, label: "User Management" },
  { href: "/admin/knowledge", icon: BookOpen, label: "Knowledge Base" },
  { href: "/admin/faqs", icon: HelpCircle, label: "FAQs Management" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
  { href: "/chat", icon: Bot, label: "AI Assistant", hasStatus: true },
  { href: "/specifications", icon: Layers, label: "Architecture & Specs" },
];

const navMap: Record<UserRole, typeof customerNav> = {
  CUSTOMER: customerNav,
  AGENT: agentNav,
  ADMIN: adminNav,
};

export function DashboardSidebar3D({
  role,
  user,
}: {
  role: UserRole;
  user?: UserSession;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const nav = navMap[role] || customerNav;

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const initials = (user?.name || user?.email || "U")
    .slice(0, 2)
    .toUpperCase();

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case "ADMIN":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "AGENT":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      default:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
    }
  };

  return (
    <>
      {/* Mobile Sticky Navigation Trigger Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#070d1d]/90 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-cyan-500/30">
            <Bot className="w-4 h-4 text-slate-950 font-bold" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-wide">
            {APP_NAME} <span className="text-cyan-400 text-xs">3D</span>
          </span>
        </Link>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.05] border border-white/10 focus:outline-none"
          aria-label="Toggle navigation drawer"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out select-none",
          "bg-[#070d1e]/85 backdrop-blur-2xl border-r border-white/10 shadow-2xl shadow-black/80",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Subtle holographic vertical edge glow */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500/40 via-violet-500/30 to-transparent pointer-events-none" />

        {/* Brand Logo Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 min-h-[64px]">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 transition-opacity overflow-hidden",
              isCollapsed && "justify-center w-full"
            )}
          >
            <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-violet-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/30">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070d1e]" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
                  <span>{APP_NAME}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-500/40">
                    3D
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  Intelligence Center
                </div>
              </div>
            )}
          </Link>

          {/* Collapse/Expand Toggle on Desktop */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <div className="hidden md:flex justify-center pt-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {nav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-transparent text-white border-l-2 border-cyan-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.05]",
                  isCollapsed && "justify-center px-0"
                )}
              >
                {/* 3D Floating Icon Container */}
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-transform group-hover:scale-115 duration-200",
                    isActive
                      ? "text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      : "text-slate-400 group-hover:text-cyan-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <span className="flex-1 truncate tracking-wide">
                    {item.label}
                  </span>
                )}

                {/* AI Assistant Online Status Beacon */}
                {item.hasStatus && (
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-[10px] font-mono text-emerald-400",
                      isCollapsed ? "hidden" : "inline-flex"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ONLINE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Sign-out Section at Bottom */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]",
              isCollapsed && "justify-center p-1.5"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0">
              {initials}
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">
                  {user?.name || "Customer"}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border",
                      getRoleBadgeColor(role)
                    )}
                  >
                    {role}
                  </span>
                </div>
              </div>
            )}

            {!isCollapsed && (
              <button
                onClick={() => setShowSignOutDialog(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

          {isCollapsed && (
            <button
              onClick={() => setShowSignOutDialog(true)}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {showSignOutDialog && (
        <SignOutDialog
          isOpen={showSignOutDialog}
          onClose={() => setShowSignOutDialog(false)}
        />
      )}
    </>
  );
}
