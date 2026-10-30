import Link from "next/link";
import { Bot, Sparkles, ArrowRight, Zap, CheckCircle2 } from "lucide-react";

export function AIAssistantSpotlightCard() {
  const SAMPLE_QUESTIONS = [
    { label: "📦 How do I track my active order?", q: "How do I track my active order?" },
    { label: "🔄 What is the return & refund policy?", q: "What is your 30-day return policy and how do refunds work?" },
    { label: "💳 What payment methods are supported?", q: "What payment methods do you accept and is checkout secure?" },
  ];

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-b from-card via-card to-blue-500/5 p-6 space-y-5 shadow-xs relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                SupportAI Assistant
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Available 24/7 &bull; Instant RAG Grounded
            </p>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
        <p>
          Trained on your business documentation, verified FAQs, and order guidelines.
          Resolves over 85% of customer inquiries in under 400ms without waiting in a queue.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 font-medium text-foreground text-[11px]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" /> Grounded in Docs
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-500" /> Sub-400ms TTFB
          </span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="space-y-2 pt-1">
        <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Try asking:
        </div>
        <div className="space-y-1.5">
          {SAMPLE_QUESTIONS.map((item, idx) => (
            <Link
              key={idx}
              href={`/chat?q=${encodeURIComponent(item.q)}`}
              className="block p-2 rounded-xl bg-muted/60 hover:bg-muted text-xs text-foreground transition-all truncate border border-border/60 hover:border-primary/30"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <Link
        href="/chat"
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white gradient-primary hover:opacity-95 transition-all shadow-md shadow-blue-500/20"
      >
        <Sparkles className="w-4 h-4 text-cyan-300" />
        <span>Start New Conversation</span>
        <ArrowRight className="w-4 h-4 ml-auto" />
      </Link>
    </div>
  );
}
