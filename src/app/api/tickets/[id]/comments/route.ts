import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCommentSchema } from "@/lib/validations/tickets";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });

  // Internal notes only for agents/admins
  if (parsed.data.isInternal && session.user.role === "CUSTOMER") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const ticket = await prisma.supportTicket.findUnique({ where: { id: params.id } });
  if (!ticket) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  if (session.user.role === "CUSTOMER" && ticket.customerId !== session.user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const comment = await prisma.ticketComment.create({
    data: { ticketId: params.id, authorId: session.user.id, ...parsed.data },
    include: { author: { select: { id: true, name: true, role: true } } },
  });

  // Notify customer
  if (!parsed.data.isInternal && session.user.role !== "CUSTOMER") {
    await prisma.notification.create({
      data: {
        userId: ticket.customerId,
        type: "NEW_MESSAGE",
        title: "New reply on your ticket",
        message: `Your ticket "${ticket.subject}" has a new reply.`,
        linkUrl: `/tickets/${ticket.id}`,
      },
    });
  }

  return NextResponse.json({ success: true, data: comment }, { status: 201 });
}
