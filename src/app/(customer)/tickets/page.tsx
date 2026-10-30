import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TicketsPage } from "@/components/tickets/tickets-page";

export const metadata = { title: "Support Tickets" };

export default async function TicketsRoute() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <DashboardLayout>
      <TicketsPage userRole={session.user.role as "CUSTOMER" | "AGENT" | "ADMIN"} userId={session.user.id} />
    </DashboardLayout>
  );
}
