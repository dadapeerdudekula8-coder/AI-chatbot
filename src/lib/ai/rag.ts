// src/lib/ai/rag.ts
// Retrieval-Augmented Generation — retrieves relevant knowledge chunks
// and builds a grounded context prompt for the AI.
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai/provider";
import { KNOWLEDGE_TOP_K } from "@/lib/constants";
import type { KnowledgeSource } from "@/types";

interface RetrievedChunk {
  id: string;
  content: string;
  documentId: string;
  documentTitle: string;
  similarity: number;
}

// Comprehensive English stop words set to prevent stop-word pollution during retrieval
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
  "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
  "but", "by", "can", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't",
  "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't",
  "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
  "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll",
  "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's",
  "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once",
  "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same",
  "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
  "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
  "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
  "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd",
  "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where",
  "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
  "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
  "yourself", "yourselves", "please", "tell", "give", "help", "know", "want", "need", "like",
  "can", "could", "also", "much", "many", "just"
]);

/**
 * Tokenize query into meaningful search keywords, stripping punctuation and stop words.
 */
export function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

/**
 * Retrieve the top-K knowledge chunks most relevant to `query`.
 * Uses cosine similarity via pgvector when available, with an intelligent
 * relevance-scored keyword fallback across FAQs and uploaded knowledge documents.
 */
export async function retrieveRelevantChunks(
  query: string,
  topK: number = KNOWLEDGE_TOP_K
): Promise<RetrievedChunk[]> {
  try {
    const provider = getAIProvider();
    const queryEmbedding = await provider.embed(query);

    if (queryEmbedding.every((v) => v === 0)) {
      // No embedding available (no API key or mock embedding) — fall back to scored keyword search
      return await keywordFallback(query, topK);
    }

    // Try pgvector cosine similarity query
    const embeddingStr = `[${queryEmbedding.join(",")}]`;
    const results = await prisma.$queryRaw<
      Array<{
        id: string;
        content: string;
        documentId: string;
        title: string;
        similarity: number;
      }>
    >`
      SELECT
        kc.id,
        kc.content,
        kc."documentId",
        kd.title,
        1 - (kc.embedding <=> ${embeddingStr}::vector) AS similarity
      FROM "KnowledgeChunk" kc
      JOIN "KnowledgeDocument" kd ON kd.id = kc."documentId"
      WHERE kd.status = 'READY'
        AND kc.embedding IS NOT NULL
      ORDER BY kc.embedding <=> ${embeddingStr}::vector
      LIMIT ${topK}
    `;

    if (!results || results.length === 0) {
      return await keywordFallback(query, topK);
    }

    return results
      .filter((r: { similarity: number }) => r.similarity > 0.4)
      .map((r: { id: string; content: string; documentId: string; title: string; similarity: number }) => ({
        id: r.id,
        content: r.content,
        documentId: r.documentId,
        documentTitle: r.title,
        similarity: r.similarity,
      }));
  } catch (error: any) {
    // If pgvector is unavailable (SQLite or Postgres without pgvector extension),
    // gracefully fall back to keyword search across FAQs and knowledge documents
    return await keywordFallback(query, topK);
  }
}

/**
 * Scored keyword-based fallback when vector search is not configured or unavailable.
 * Searches both FAQs and uploaded knowledge documents, filtering stop words and
 * ranking candidates by exact phrase, question match, category match, and answer match.
 */
async function keywordFallback(
  query: string,
  topK: number
): Promise<RetrievedChunk[]> {
  try {
    const keywords = extractKeywords(query);

    // If query contains only stop words or greeting, do not falsely match arbitrary FAQs
    if (keywords.length === 0) return [];

    const lowerQuery = query.toLowerCase().trim();
    const scoredCandidates: Array<{
      chunk: RetrievedChunk;
      score: number;
    }> = [];

    // 1. Search FAQs
    const faqs = await prisma.fAQ.findMany({
      where: {
        isActive: true,
        OR: keywords.flatMap((word) => [
          { question: { contains: word } },
          { answer: { contains: word } },
          { category: { contains: word } },
        ]),
      },
    });

    for (const faq of faqs) {
      const qLower = faq.question.toLowerCase();
      const aLower = faq.answer.toLowerCase();
      const cLower = faq.category.toLowerCase();

      let score = 0;

      // Exact phrase match bonus
      if (lowerQuery.includes(qLower) || qLower.includes(lowerQuery)) {
        score += 12;
      }

      // Keyword matches
      for (const kw of keywords) {
        if (qLower.includes(kw)) score += 4;
        if (cLower.includes(kw)) score += 3;
        if (aLower.includes(kw)) score += 1.5;
      }

      // Exact key terms bonus (e.g. "reset password", "return policy", "track order")
      if (lowerQuery.includes("reset") && lowerQuery.includes("password") && qLower.includes("reset")) score += 6;
      if (lowerQuery.includes("return") && (lowerQuery.includes("policy") || lowerQuery.includes("refund")) && qLower.includes("return")) score += 6;
      if (lowerQuery.includes("track") && lowerQuery.includes("order") && qLower.includes("track")) score += 6;
      if (lowerQuery.includes("payment") && qLower.includes("payment")) score += 6;

      // Minimum score threshold to prevent spurious stop-word match
      if (score >= 3.0) {
        // Calculate normalized similarity in [0.75, 0.98]
        const similarity = Math.min(0.98, 0.75 + (score / 30) * 0.23);
        scoredCandidates.push({
          chunk: {
            id: faq.id,
            content: `Question: ${faq.question}\nAnswer: ${faq.answer}`,
            documentId: `faq-${faq.id}`,
            documentTitle: `FAQ: ${faq.category}`,
            similarity: Math.round(similarity * 100) / 100,
          },
          score,
        });
      }
    }

    // 2. Search uploaded knowledge chunks
    const chunks = await prisma.knowledgeChunk.findMany({
      where: {
        OR: keywords.map((word) => ({
          content: { contains: word },
        })),
      },
      include: {
        document: {
          select: { id: true, title: true, status: true },
        },
      },
      take: 20,
    });

    for (const chunk of chunks) {
      if (chunk.document?.status !== "READY" && chunk.document?.status !== undefined) continue;
      const cLower = chunk.content.toLowerCase();
      const tLower = (chunk.document?.title || "").toLowerCase();

      let score = 0;
      for (const kw of keywords) {
        if (tLower.includes(kw)) score += 4;
        if (cLower.includes(kw)) score += 1.5;
      }

      if (score >= 3.0) {
        const similarity = Math.min(0.95, 0.70 + (score / 30) * 0.25);
        scoredCandidates.push({
          chunk: {
            id: chunk.id,
            content: chunk.content,
            documentId: chunk.documentId,
            documentTitle: chunk.document?.title || "Knowledge Base",
            similarity: Math.round(similarity * 100) / 100,
          },
          score,
        });
      }
    }

    // Find maximum score among candidates
    const maxScore = scoredCandidates.reduce((max, c) => Math.max(max, c.score), 0);

    // Filter by relative relevance threshold:
    // Chunks must have a significant score AND be at least 50% as relevant as the top match
    const minThreshold = Math.max(3.5, maxScore * 0.5);
    const filteredCandidates = scoredCandidates.filter((c) => c.score >= minThreshold);

    // Sort descending by score
    filteredCandidates.sort((a, b) => b.score - a.score);

    // Deduplicate by documentTitle to avoid repetitive verified sources
    const seenTitles = new Set<string>();
    const deduplicatedResults: RetrievedChunk[] = [];

    for (const item of filteredCandidates) {
      if (!seenTitles.has(item.chunk.documentTitle)) {
        seenTitles.add(item.chunk.documentTitle);
        deduplicatedResults.push(item.chunk);
      }
      if (deduplicatedResults.length >= topK) break;
    }

    return deduplicatedResults;
  } catch (err: any) {
    console.error("[RAG] Keyword fallback error:", err.message);
    return [];
  }
}

/**
 * Build a context string and sources array from retrieved chunks.
 */
export function buildRAGContext(chunks: RetrievedChunk[]): {
  context: string;
  sources: KnowledgeSource[];
} {
  if (chunks.length === 0) {
    return { context: "", sources: [] };
  }

  // Deduplicate sources by documentTitle & documentId
  const seenTitles = new Set<string>();
  const sources: KnowledgeSource[] = [];

  for (const c of chunks) {
    if (!seenTitles.has(c.documentTitle)) {
      seenTitles.add(c.documentTitle);
      sources.push({
        documentId: c.documentId,
        documentTitle: c.documentTitle,
        chunkContent: c.content.slice(0, 200),
        similarity: c.similarity,
      });
    }
  }

  const context =
    "RELEVANT KNOWLEDGE BASE CONTEXT:\n\n" +
    chunks
      .map(
        (c, i) =>
          `[Source ${i + 1}: ${c.documentTitle}]\n${c.content}`
      )
      .join("\n\n---\n\n") +
    "\n\nINSTRUCTION: Base your answer on the above context whenever relevant. If the context does not answer the question or no relevant context exists, state so honestly. Be concise, polite, and helpful.";

  return { context, sources };
}

/**
 * Full RAG pipeline: embed query → retrieve chunks → build context.
 */
export async function ragPipeline(query: string): Promise<{
  augmentedPrompt: string;
  sources: KnowledgeSource[];
}> {
  const chunks = await retrieveRelevantChunks(query);
  const { context, sources } = buildRAGContext(chunks);

  const augmentedPrompt = context
    ? `${context}\n\nCUSTOMER QUESTION: ${query}`
    : query;

  return { augmentedPrompt, sources };
}
