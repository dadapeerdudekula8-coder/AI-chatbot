import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar3D, type UserSession } from "@/components/layout/dashboard-sidebar-3d";
import { CyberSpaceBackground } from "@/components/3d/cyber-space-background";
import type { UserRole } from "@/types";

export async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="relative flex min-h-screen bg-[#050814] text-slate-100 overflow-x-hidden">
      {/* 3D Cyber Space Particle & Nebula Background Canvas */}
      <CyberSpaceBackground />

      {/* Futuristic 3D Glass Navigation Sidebar */}
      <DashboardSidebar3D
        role={session.user.role as UserRole}
        user={session.user as UserSession}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 pt-14 md:pt-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
