import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const doc = await prisma.knowledgeDocument.findUnique({ where: { id: params.id } });
  if (!doc) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  const { deleteFile } = await import("@/lib/storage/adapter");
  await deleteFile(doc.storagePath).catch(() => {});
  await prisma.knowledgeDocument.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  // Re-process document
  await prisma.knowledgeDocument.update({ where: { id: params.id }, data: { status: "PENDING" } });
  const { processDocument } = await import("@/lib/ai/embeddings");
  processDocument(params.id).catch(console.error);
  return NextResponse.json({ success: true, message: "Reprocessing started" });
}
