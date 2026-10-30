// src/lib/ai/embeddings.ts
// Document ingestion pipeline: parse → chunk → embed → store
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai/provider";
import {
  KNOWLEDGE_CHUNK_SIZE,
  KNOWLEDGE_CHUNK_OVERLAP,
} from "@/lib/constants";

/**
 * Split text into overlapping word-based chunks.
 */
export function chunkText(
  text: string,
  chunkSize = KNOWLEDGE_CHUNK_SIZE,
  overlap = KNOWLEDGE_CHUNK_OVERLAP
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let i = 0;

  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim()) chunks.push(chunk.trim());
    i += chunkSize - overlap;
  }

  return chunks.length > 0 ? chunks : [text.trim()];
}

/**
 * Extract plain text from different document formats.
 */
export async function extractText(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (mimeType === "text/plain" || extension === "txt") {
    return buffer.toString("utf-8");
  }

  if (
    mimeType === "text/markdown" ||
    mimeType === "text/x-markdown" ||
    extension === "md"
  ) {
    return buffer.toString("utf-8");
  }

  if (mimeType === "application/pdf" || extension === "pdf") {
    try {
      const pdfModule = await import("pdf-parse");
      const pdfParse = (pdfModule as any).default || pdfModule;
      const data = await pdfParse(buffer);
      return data.text;
    } catch (err: any) {
      console.warn("[Embeddings] pdf-parse fallback:", err.message);
      // Fallback: extract visible text from buffer
      return buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
    }
  }

  // Fallback: try reading as UTF-8 text
  return buffer.toString("utf-8");
}

/**
 * Process a knowledge document: extract → chunk → embed → store chunks.
 * Updates the document status throughout.
 */
export async function processDocument(documentId: string): Promise<void> {
  const document = await prisma.knowledgeDocument.findUnique({
    where: { id: documentId },
  });

  if (!document) {
    throw new Error(`Document ${documentId} not found`);
  }

  // Mark as processing
  await prisma.knowledgeDocument.update({
    where: { id: documentId },
    data: { status: "PROCESSING" },
  });

  try {
    // Read file from storage
    const { readFileBuffer } = await import("@/lib/storage/adapter");
    const buffer = await readFileBuffer(document.storagePath);

    // Extract text
    const text = await extractText(buffer, document.mimeType, document.filename);

    if (!text || text.trim().length === 0) {
      throw new Error("No text content extracted from document");
    }

    // Delete old chunks (re-processing scenario)
    await prisma.knowledgeChunk.deleteMany({ where: { documentId } });

    // Chunk the text
    const chunks = chunkText(text);
    console.log(`[Embeddings] ${chunks.length} chunks for document ${documentId}`);

    // Embed and store chunks
    const provider = getAIProvider();
    const embeddings = await provider.embedBatch(chunks);

    const chunkData = chunks.map((content, i) => ({
      documentId,
      content,
      chunkIndex: i,
      metadata: { wordCount: content.split(/\s+/).length },
    }));

    // Store chunks with fallback
    for (let i = 0; i < chunkData.length; i++) {
      const embedding = embeddings[i];
      const hasEmbedding = embedding && !embedding.every((v) => v === 0);
      const embeddingStr = hasEmbedding ? `[${embedding.join(",")}]` : null;

      let stored = false;
      if (hasEmbedding) {
        try {
          await prisma.$executeRaw`
            INSERT INTO "KnowledgeChunk" (id, "documentId", content, embedding, "chunkIndex", metadata, "createdAt")
            VALUES (
              gen_random_uuid()::text,
              ${chunkData[i].documentId},
              ${chunkData[i].content},
              ${embeddingStr}::vector,
              ${chunkData[i].chunkIndex},
              ${JSON.stringify(chunkData[i].metadata)}::jsonb,
              NOW()
            )
          `;
          stored = true;
        } catch {
          stored = false;
        }
      }

      if (!stored) {
        await prisma.knowledgeChunk.create({
          data: {
            documentId: chunkData[i].documentId,
            content: chunkData[i].content,
            chunkIndex: chunkData[i].chunkIndex,
            embedding: embeddingStr,
            metadata: JSON.stringify(chunkData[i].metadata),
          },
        });
      }
    }

    await prisma.knowledgeDocument.update({
      where: { id: documentId },
      data: { status: "READY" },
    });

    console.log(`[Embeddings] Document ${documentId} processed successfully.`);
  } catch (error: any) {
    console.error(`[Embeddings] Failed to process document ${documentId}:`, error.message);
    await prisma.knowledgeDocument.update({
      where: { id: documentId },
      data: { status: "FAILED", errorMessage: error.message },
    });
    throw error;
  }
}
