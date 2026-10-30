import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const settings = await prisma.appSettings.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json({ success: true, data: settings });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const { key, value, description } = body;
  if (!key || value === undefined) return NextResponse.json({ success: false, error: "key and value required" }, { status: 400 });

  const setting = await prisma.appSettings.upsert({
    where: { key },
    update: { value: String(value), description },
    create: { key, value: String(value), description },
  });

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "SETTINGS_UPDATED", entity: "AppSettings", metadata: JSON.stringify({ key }) },
  });

  return NextResponse.json({ success: true, data: setting });
}
