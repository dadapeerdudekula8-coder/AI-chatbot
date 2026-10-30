import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const pageSize = Math.min(100, parseInt(searchParams.get("pageSize") || "20"));
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || undefined;

  const where: any = {};
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];
  if (role) where.role = role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true, _count: { select: { conversations: true, tickets: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ success: true, data: { items: users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } });
}
