import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(5).max(200),
  answer: z.string().min(10).max(5000),
  category: z.string().max(50).default("General"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export async function GET(_req: NextRequest) {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ success: true, data: faqs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = faqSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });

  const faq = await prisma.fAQ.create({ data: parsed.data });
  return NextResponse.json({ success: true, data: faq }, { status: 201 });
}
