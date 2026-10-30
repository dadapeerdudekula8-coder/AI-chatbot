"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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

export function DashboardSidebar({
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

  // Auto close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const initials = (user?.name || user?.email || "U")
    .slice(0, 2)
    .toUpperCase();

  const getRoleBadgeColor = (r: UserRole) => {
    switch (r) {
      case "ADMIN":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "AGENT":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-teal-500/10 text-teal-400 border-teal-500/20";
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-800/80">
      {/* Brand & Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800/80">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-3d-cyan flex-shrink-0 group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                {APP_NAME}
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v2.0
                </span>
              </span>
              <span className="text-[11px] text-slate-400">Customer Support AI</span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* AI Status Badge */}
      {!isCollapsed && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold text-slate-200">AI Assistant</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
              Online
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav
        className="flex-1 px-3 py-3 space-y-1 overflow-y-auto"
        aria-label="Sidebar navigation"
      >
        {nav.map(({ href, icon: Icon, label, hasStatus }) => {
          const isActive = pathname === href;
          return (
            <div key={href} className="relative group">
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-900/30 border border-blue-400/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                {!isCollapsed && <span className="truncate">{label}</span>}

                {!isCollapsed && hasStatus && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>

              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
                  {label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Profile & Sign Out Section */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        {!isCollapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {user?.name || "Customer Account"}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {user?.email || "Signed in"}
                </div>
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getRoleBadgeColor(
                  role
                )}`}
              >
                {role}
              </span>
            </div>

            <button
              onClick={() => setShowSignOutDialog(true)}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm cursor-default"
              title={`${user?.name || "User"} (${role})`}
            >
              {initials}
            </div>
            <button
              onClick={() => setShowSignOutDialog(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <SignOutDialog
        isOpen={showSignOutDialog}
        onClose={() => setShowSignOutDialog(false)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block min-h-screen transition-all duration-300 z-30 flex-shrink-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="fixed top-0 bottom-0 left-0 h-screen transition-all duration-300">
          <div className={cn("h-full", isCollapsed ? "w-16" : "w-64")}>
            {sidebarContent}
          </div>
        </div>
      </aside>

      {/* Mobile Hamburger Toggle Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-950 border-b border-slate-800 z-40 px-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-white text-sm">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span>{APP_NAME}</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Slide-Out Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slide-right">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-3 p-1 rounded-lg text-slate-400 hover:text-white"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
