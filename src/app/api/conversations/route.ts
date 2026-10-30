import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(50, parseInt(searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE)));

  const where = session.user.role === "CUSTOMER"
    ? { userId: session.user.id }
    : {};

  const [conversations, total] = await Promise.all([
    prisma.conversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true, title: true, status: true, createdAt: true, updatedAt: true,
        _count: { select: { messages: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1, select: { content: true, role: true } },
      },
    }),
    prisma.conversation.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: { items: conversations, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = (body.title || "New Conversation").slice(0, 100);

  const conversation = await prisma.conversation.create({
    data: { userId: session.user.id, title },
  });

  return NextResponse.json({ success: true, data: conversation }, { status: 201 });
}
