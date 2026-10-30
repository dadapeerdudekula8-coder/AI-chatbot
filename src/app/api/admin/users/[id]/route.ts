import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateUserSchema = z.object({
  role: z.enum(["CUSTOMER", "AGENT", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
  name: z.string().min(2).max(50).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = updateUserSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });

  const user = await prisma.user.update({
    where: { id: params.id },
    data: parsed.data,
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "USER_UPDATED", entity: "User", entityId: params.id, metadata: JSON.stringify(parsed.data) },
  });

  return NextResponse.json({ success: true, data: user });
}
