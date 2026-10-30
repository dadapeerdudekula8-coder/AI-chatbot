// src/lib/storage/adapter.ts
// File storage abstraction — "local" for dev, "vercel-blob" for production
import path from "path";
import fs from "fs/promises";
import { MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";

export type StorageAdapter = "local" | "vercel-blob";

const ADAPTER: StorageAdapter =
  (process.env.STORAGE_ADAPTER as StorageAdapter) || "local";
const LOCAL_DIR = process.env.LOCAL_UPLOAD_DIR || "./uploads";

// ── Validation ─────────────────────────────────────────────────────────────────

export interface ValidatedFile {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

export function validateFile(file: ValidatedFile): void {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File too large. Maximum allowed size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`
    );
  }
  if (!ALLOWED_MIME_TYPES.includes(file.mimeType)) {
    throw new Error(
      `File type not allowed. Allowed types: PDF, TXT, Markdown, DOCX.`
    );
  }
}

// ── Local Adapter ──────────────────────────────────────────────────────────────

async function ensureLocalDir(): Promise<void> {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
}

async function localSave(file: ValidatedFile): Promise<string> {
  await ensureLocalDir();
  const ext = path.extname(file.originalName);
  const filename = `${uuidv4()}${ext}`;
  const filePath = path.join(LOCAL_DIR, filename);
  await fs.writeFile(filePath, file.buffer);
  return filePath;
}

async function localRead(storagePath: string): Promise<Buffer> {
  return fs.readFile(storagePath);
}

async function localDelete(storagePath: string): Promise<void> {
  try {
    await fs.unlink(storagePath);
  } catch {
    // Ignore if file doesn't exist
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Save a validated file and return its storage path.
 */
export async function saveFile(file: ValidatedFile): Promise<string> {
  validateFile(file);

  if (ADAPTER === "local") {
    return localSave(file);
  }

  // Vercel Blob (production)
  if (ADAPTER === "vercel-blob") {
    const mod = "@vercel/blob";
    const { put } = await import(/* webpackIgnore: true */ mod);
    const blob = await put(file.originalName, file.buffer, {
      access: "private",
      contentType: file.mimeType,
    });
    return blob.url;
  }

  throw new Error(`Unknown storage adapter: ${ADAPTER}`);
}

/**
 * Read a file buffer from its storage path.
 */
export async function readFileBuffer(storagePath: string): Promise<Buffer> {
  if (ADAPTER === "local") {
    return localRead(storagePath);
  }

  if (ADAPTER === "vercel-blob") {
    const response = await fetch(storagePath);
    if (!response.ok) throw new Error(`Failed to fetch blob: ${storagePath}`);
    return Buffer.from(await response.arrayBuffer());
  }

  throw new Error(`Unknown storage adapter: ${ADAPTER}`);
}

/**
 * Delete a file from storage.
 */
export async function deleteFile(storagePath: string): Promise<void> {
  if (ADAPTER === "local") {
    return localDelete(storagePath);
  }

  if (ADAPTER === "vercel-blob") {
    const mod = "@vercel/blob";
    const { del } = await import(/* webpackIgnore: true */ mod);
    await del(storagePath);
    return;
  }

  throw new Error(`Unknown storage adapter: ${ADAPTER}`);
}
