"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  Code2,
  CheckCircle,
  Copy,
  ArrowLeft,
  Bot,
  Layers,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function SpecificationsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyCode = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const API_ENDPOINTS = [
    {
      method: "POST",
      endpoint: "/api/chat",
      desc: "Stream grounded AI chat responses via Server-Sent Events (SSE) with RAG context.",
      auth: "Customer, Agent, Admin",
      body: JSON.stringify({ content: "How do I return an item?", conversationId: "optional-conv-id" }, null, 2),
    },
    {
      method: "POST",
      endpoint: "/api/register",
      desc: "Register a new user account with bcrypt password hashing and audit logging.",
      auth: "Public",
      body: JSON.stringify({ name: "Jane Smith", email: "jane@example.com", password: "Password123!", confirmPassword: "Password123!" }, null, 2),
    },
    {
      method: "GET",
      endpoint: "/api/tickets",
      desc: "Fetch paginated support tickets with filtering by status, category, and priority.",
      auth: "Customer (own), Agent, Admin",
      body: "Query params: ?status=OPEN&priority=HIGH&page=1&pageSize=20",
    },
    {
      method: "POST",
      endpoint: "/api/tickets",
      desc: "Create a new support ticket and optionally escalate an existing chat conversation.",
      auth: "Customer, Agent, Admin",
      body: JSON.stringify({ subject: "Refund delayed", description: "Details...", category: "REFUND", priority: "HIGH" }, null, 2),
    },
    {
      method: "POST",
      endpoint: "/api/knowledge",
      desc: "Upload knowledge document (PDF/TXT/MD), auto-chunk, generate embeddings, and index.",
      auth: "Admin only",
      body: "FormData: { file: File, title: 'Return Policy 2024' }",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-2 font-bold text-white">
              <Bot className="w-5 h-5 text-teal-400" />
              <span>{APP_NAME} Architecture & Technical Specifications</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/chat"
              className="px-3.5 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold transition"
            >
              Launch AI Chat
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Zap className="w-3.5 h-3.5" /> Production Specification v2.0
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            System Specifications & Architecture
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
            Detailed technical breakdown of SupportAI&apos;s AI orchestration, Retrieval-Augmented
            Generation (RAG), vector embeddings pipeline, edge security protocols, and REST API contracts.
          </p>
        </div>

        {/* Core Architecture Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">AI Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Google Gemini 1.5 Flash with sub-500ms TTFB. Dynamic fallback with intelligent local knowledge grounding.
            </p>
            <div className="text-[11px] font-mono text-teal-400 pt-2 border-t border-slate-800">
              Model: gemini-1.5-flash
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">RAG Embeddings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              768-dimensional dense vectors with cosine similarity indexing. Multi-token keyword search fallback.
            </p>
            <div className="text-[11px] font-mono text-blue-400 pt-2 border-t border-slate-800">
              Dims: 768 &bull; Top-K: 5
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Storage & ORM</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prisma ORM with pgvector for Postgres deployments, with automated zero-config SQLite local dev database.
            </p>
            <div className="text-[11px] font-mono text-indigo-400 pt-2 border-t border-slate-800">
              Prisma 5.22 &bull; SQLite/PG
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-white">Security & RBAC</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              NextAuth v5 JWT sessions, bcrypt 12-round password hashing, edge security headers, and immutable audit logs.
            </p>
            <div className="text-[11px] font-mono text-purple-400 pt-2 border-t border-slate-800">
              Roles: CUSTOMER, AGENT, ADMIN
            </div>
          </div>
        </div>

        {/* Detailed Technical Specifications Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Detailed System Parameters</h2>
            <p className="text-sm text-slate-400 mt-1">Exact runtime limits, vector configurations, and SLA tiers.</p>
          </div>
          <div className="divide-y divide-slate-800/80 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20">
              <span className="font-medium text-slate-300">Vector Embeddings Dimension</span>
              <span className="font-mono text-teal-400">768 floats</span>
              <span className="text-slate-400 text-xs">Standardized on Google text-embedding-004 specification</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20">
              <span className="font-medium text-slate-300">Document Chunking Strategy</span>
              <span className="font-mono text-teal-400">500 words / 50 overlap</span>
              <span className="text-slate-400 text-xs">Sliding window text tokenization preserves sentence context</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20">
              <span className="font-medium text-slate-300">RAG Cosine Threshold</span>
              <span className="font-mono text-teal-400">&ge; 0.70 similarity</span>
              <span className="text-slate-400 text-xs">Guarantees high relevance and filters irrelevant noise</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20">
              <span className="font-medium text-slate-300">Streaming Protocol</span>
              <span className="font-mono text-teal-400">Server-Sent Events (SSE)</span>
              <span className="text-slate-400 text-xs">HTTP text/event-stream with word-by-word real-time delivery</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20">
              <span className="font-medium text-slate-300">Password Encryption</span>
              <span className="font-mono text-teal-400">bcrypt (12 cost factor)</span>
              <span className="text-slate-400 text-xs">Resistant to rainbow table attacks and high-speed hardware cracking</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 hover:bg-slate-800/20">
              <span className="font-medium text-slate-300">Ticket SLA Targets</span>
              <span className="font-mono text-teal-400">Urgent: 1h &bull; High: 4h &bull; Med: 12h</span>
              <span className="text-slate-400 text-xs">Automated priority categorization and agent assignment alerts</span>
            </div>
          </div>
        </div>

        {/* REST API Reference */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">REST API Reference</h2>
              <p className="text-sm text-slate-400 mt-1">Core endpoints exposed by the SupportAI Next.js App Router.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Code2 className="w-4 h-4 text-teal-400" /> JSON / UTF-8
            </div>
          </div>

          <div className="space-y-4">
            {API_ENDPOINTS.map((api, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        api.method === "POST"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {api.method}
                    </span>
                    <span className="font-mono text-sm font-semibold text-white">
                      {api.endpoint}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                    Auth: {api.auth}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{api.desc}</p>
                <div className="relative">
                  <pre className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800/80">
                    {api.body}
                  </pre>
                  <button
                    onClick={() => copyCode(`api-${idx}`, api.body)}
                    className="absolute right-2 top-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                  >
                    {copiedKey === `api-${idx}` ? (
                      <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise SLA Tiers */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white">Enterprise SLA & Escalation Protocol</h2>
            <p className="text-sm text-slate-400 mt-2">
              SupportAI is configured to automatically calculate response metrics and trigger escalations
              when user queries exceed defined difficulty or priority thresholds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-semibold text-teal-400 uppercase">Tier 1: AI Instant RAG</div>
              <div className="text-2xl font-bold text-white mt-1">&lt; 1 Second</div>
              <p className="text-xs text-slate-400 mt-2">
                90% of order tracking, shipping policies, returns, and FAQs resolved instantly with source citations.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-semibold text-blue-400 uppercase">Tier 2: Agent Inbox</div>
              <div className="text-2xl font-bold text-white mt-1">1–4 Hours</div>
              <p className="text-xs text-slate-400 mt-2">
                High-priority and refund inquiries escalated directly to the agent queue with full chat transcripts.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-semibold text-purple-400 uppercase">Tier 3: Engineering</div>
              <div className="text-2xl font-bold text-white mt-1">Same-Day</div>
              <p className="text-xs text-slate-400 mt-2">
                Technical bugs or critical account escalations flagged directly with priority tags and audit tracking.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
