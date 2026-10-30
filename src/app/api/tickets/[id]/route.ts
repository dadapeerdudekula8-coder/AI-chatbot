import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateTicketSchema } from "@/lib/validations/tickets";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: params.id },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      agent: { select: { id: true, name: true, email: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { id: true, name: true, role: true } } },
        where: session.user.role === "CUSTOMER" ? { isInternal: false } : {},
      },
    },
  });

  if (!ticket) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  if (session.user.role === "CUSTOMER" && ticket.customerId !== session.user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ success: true, data: ticket });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "CUSTOMER") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = updateTicketSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });

  const updateData: any = { ...parsed.data };
  if (parsed.data.status === "RESOLVED") updateData.resolvedAt = new Date();

  const ticket = await prisma.supportTicket.update({
    where: { id: params.id },
    data: updateData,
    include: {
      customer: { select: { id: true, name: true, email: true } },
      agent: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "TICKET_UPDATED",
      entity: "SupportTicket",
      entityId: params.id,
      metadata: JSON.stringify(parsed.data),
    },
  });

  return NextResponse.json({ success: true, data: ticket });
}
