import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const documents = await prisma.knowledgeDocument.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { chunks: true } } },
  });

  return NextResponse.json({ success: true, data: documents });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "";

    if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    if (!title.trim()) return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { saveFile, validateFile } = await import("@/lib/storage/adapter");

    const validatedFile = { buffer, originalName: file.name, mimeType: file.type, size: file.size };
    validateFile(validatedFile);

    const storagePath = await saveFile(validatedFile);

    const document = await prisma.knowledgeDocument.create({
      data: {
        title: title.trim(),
        filename: file.name,
        mimeType: file.type,
        fileSize: file.size,
        storagePath,
        uploadedById: session.user.id,
        status: "PENDING",
      },
    });

    // Process async
    const { processDocument } = await import("@/lib/ai/embeddings");
    processDocument(document.id).catch((err) =>
      console.error("[Knowledge] Processing failed:", err)
    );

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "DOCUMENT_UPLOADED",
        entity: "KnowledgeDocument",
        entityId: document.id,
        metadata: JSON.stringify({ filename: file.name }),
      },
    });

    return NextResponse.json({ success: true, data: document }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Upload failed" }, { status: 400 });
  }
}
