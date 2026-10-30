"use client";
import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Upload, Trash2, RefreshCw, FileText, Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatRelativeTime, formatFileSize } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
  PROCESSING: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
  PROCESSED: <CheckCircle className="w-4 h-4 text-green-500" />,
  FAILED: <XCircle className="w-4 h-4 text-red-500" />,
};

export default function AdminKnowledgePage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    const res = await fetch("/api/knowledge");
    const data = await res.json();
    if (data.success) setDocuments(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title.trim()) { setError("Title and file are required"); return; }
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("file", file);
    const res = await fetch("/api/knowledge", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!data.success) { setError(data.error || "Upload failed"); return; }
    setTitle("");
    if (fileRef.current) fileRef.current.value = "";
    fetchDocs();
  };

  const deleteDoc = async (id: string) => {
    if (!confirm("Delete this document and all its embeddings?")) return;
    await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const reprocess = async (id: string) => {
    await fetch(`/api/knowledge/${id}`, { method: "POST" });
    setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, status: "PENDING" } : d));
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="w-8 h-8" /> Knowledge Base
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload documents to power AI-grounded answers. Supported: PDF, TXT, MD, DOCX (max 10 MB).
          </p>
        </div>

        {/* Upload form */}
        <form onSubmit={handleUpload} className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Document Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Return Policy 2024"
                className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">File *</label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,.md,.docx"
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:text-xs file:cursor-pointer"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Upload className="w-4 h-4" /> Upload & Process</>}
          </button>
        </form>

        {/* Document list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold">No documents yet</h3>
              <p className="text-sm text-muted-foreground">Upload your first document above.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">Document</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Chunks</th>
                  <th className="px-6 py-4 text-left font-semibold">Size</th>
                  <th className="px-6 py-4 text-left font-semibold">Uploaded</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-xs text-muted-foreground">{doc.filename}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {STATUS_ICONS[doc.status]}
                        <span className="capitalize text-xs">{doc.status.toLowerCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{doc._count?.chunks ?? "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatFileSize(doc.fileSize)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatRelativeTime(doc.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => reprocess(doc.id)}
                          title="Reprocess"
                          className="p-1.5 text-muted-foreground hover:text-primary transition rounded-lg hover:bg-muted"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          title="Delete"
                          className="p-1.5 text-muted-foreground hover:text-red-500 transition rounded-lg hover:bg-muted"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
