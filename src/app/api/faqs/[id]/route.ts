import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateFaqSchema = z.object({
  question: z.string().min(5).max(200).optional(),
  answer: z.string().min(10).max(5000).optional(),
  category: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = updateFaqSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
  const faq = await prisma.fAQ.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ success: true, data: faq });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  await prisma.fAQ.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
