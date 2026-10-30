"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Which AI models power the SupportAI 3D engine?",
    a: "SupportAI uses Google Gemini 1.5 Flash by default for sub-400ms latency and text-embedding-004 for 768-dimensional vector representations. It also features an automated local fallback engine that guarantees answers even offline.",
  },
  {
    q: "How does the Retrieval-Augmented Generation (RAG) system work?",
    a: "When a customer asks a question, SupportAI transforms the prompt into an embedding vector and searches across indexed knowledge documents and FAQs using cosine similarity (threshold >= 0.70). Only relevant chunks are injected into the prompt.",
  },
  {
    q: "What file formats can be uploaded to the Knowledge Base?",
    a: "Administrators can upload PDF, Markdown (.md), and plain text (.txt) files. The platform automatically extracts text, chunks it into overlapping 500-word blocks, embeds the vectors, and makes it retrievable within seconds.",
  },
  {
    q: "How does human agent ticket escalation work?",
    a: "Customers can escalate directly from the chat interface with 1 click. SupportAI pre-populates the ticket subject, category, priority, and entire recent dialogue history, assigning the ticket to the agent inbox queue.",
  },
  {
    q: "What security measures are implemented?",
    a: "SupportAI implements NextAuth v5 JWT sessions, bcrypt password hashing with 12 rounds, role-based access control (RBAC), and persistent audit logs tracking sensitive user, document, and settings actions.",
  },
];

export function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-slate-950 text-white relative">
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to know about the 3D AI Support platform and its enterprise architecture.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-800 bg-slate-900/60 rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:border-slate-700"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/40 transition-colors"
                aria-expanded={open === i}
              >
                <span className="font-semibold text-slate-100 pr-4">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-200",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
