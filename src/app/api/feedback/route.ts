import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { feedbackSchema } from "@/lib/validations/chat";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });

  const feedback = await prisma.feedback.upsert({
    where: { messageId: parsed.data.messageId },
    update: { rating: parsed.data.rating, comment: parsed.data.comment },
    create: { messageId: parsed.data.messageId, userId: session.user.id, rating: parsed.data.rating, comment: parsed.data.comment },
  });

  return NextResponse.json({ success: true, data: feedback });
}
