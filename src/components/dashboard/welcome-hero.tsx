"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Send,
  Bot,
  ShieldCheck,
  Zap,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  { label: "📦 Track order status", query: "How do I track my active order and delivery timeline?" },
  { label: "🔄 Return & refund policy", query: "What is your 30-day return policy and how do refunds work?" },
  { label: "💳 Payment & billing", query: "What payment methods do you accept and is checkout secure?" },
  { label: "⏱️ Shipping delivery times", query: "Do you offer international shipping and what are the delivery times?" },
  { label: "🔒 Reset my password", query: "How do I reset my account password?" },
];

export function WelcomeHero({ userName }: { userName: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
  };

  const handleChipClick = (promptQuery: string) => {
    router.push(`/chat?q=${encodeURIComponent(promptQuery)}`);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 p-6 sm:p-8 md:p-10 text-white shadow-xl shadow-indigo-950/20 border border-blue-400/20">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-5">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>SupportAI RAG Assistant &bull; Grounded Knowledge Base</span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
            How can we help you today, {userName}?
          </h2>
          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl">
            Ask any question to get instantaneous grounded answers from our knowledge base,
            or create a support ticket to collaborate with our human agents.
          </p>
        </div>

        {/* Interactive Search / Prompt Input */}
        <form onSubmit={handleSearch} className="pt-1">
          <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl focus-within:ring-2 focus-within:ring-cyan-300 focus-within:bg-white/15 transition-all">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="w-5 h-5 text-slate-950" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything (e.g., 'What is your refund policy?')"
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-white placeholder-blue-200/60 focus:outline-none px-2"
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs sm:text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Suggested Prompt Chips */}
        <div className="pt-1 space-y-2">
          <div className="flex items-center gap-2 text-xs text-blue-200/80 font-medium">
            <span>Suggested topics:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChipClick(item.query)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Abstract Decorative AI Badge (Right) */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3 p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15 text-center w-60 shadow-2xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
        </div>
        <div>
          <div className="font-bold text-sm text-white">AI Support Agent</div>
          <div className="text-[11px] text-cyan-200 mt-0.5">768-Dim Vector RAG</div>
        </div>
        <div className="w-full pt-2 border-t border-white/10 flex items-center justify-around text-[10px] text-blue-200/90 font-medium">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-300" /> &lt; 400ms
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-300" /> Grounded
          </span>
        </div>
      </div>
    </div>
  );
}
