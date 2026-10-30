import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTicketSchema, ticketFilterSchema } from "@/lib/validations/tickets";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filters = ticketFilterSchema.parse({
    status: searchParams.get("status") || undefined,
    priority: searchParams.get("priority") || undefined,
    category: searchParams.get("category") || undefined,
    search: searchParams.get("search") || undefined,
    page: searchParams.get("page") || "1",
    pageSize: searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE),
  });

  const where: any = {};
  if (session.user.role === "CUSTOMER") where.customerId = session.user.id;
  if (session.user.role === "AGENT") where.agentId = session.user.id;
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.category) where.category = filters.category;
  if (filters.search) {
    where.OR = [
      { subject: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  const [tickets, total] = await Promise.all([
    prisma.supportTicket.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        agent: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.supportTicket.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: { items: tickets, total, page: filters.page, pageSize: filters.pageSize, totalPages: Math.ceil(total / filters.pageSize) },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = createTicketSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });

    const { conversationId, ...ticketData } = parsed.data;

    const lastTicket = await prisma.supportTicket.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });
    const nextNumber = (lastTicket?.number || 1000) + 1;

    const ticket = await prisma.supportTicket.create({
      data: {
        customerId: session.user.id,
        number: nextNumber,
        ...ticketData,
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        agent: { select: { id: true, name: true, email: true } },
      },
    });

    // Link conversation if provided
    if (conversationId) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { status: "ESCALATED", ticketId: ticket.id },
      });
    }

    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error: any) {
    console.error("[Tickets POST]", error);
    return NextResponse.json({ success: false, error: "Failed to create ticket" }, { status: 500 });
  }
}
