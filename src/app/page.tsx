import Link from "next/link";
import { LandingNav } from "@/components/layout/landing-nav";
import { LandingHero3D } from "@/components/layout/landing-hero-3d";
import { LandingFeatures3D } from "@/components/layout/landing-features-3d";
import { LandingFAQ } from "@/components/layout/landing-faq";
import { LandingFooter } from "@/components/layout/landing-footer";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <LandingNav />
      <LandingHero3D />
      <LandingFeatures3D />
      <LandingFAQ />

      {/* 3D Call to Action Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Deploy in Minutes
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready to Revolutionize Your Customer Support with 3D AI?
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Instant RAG retrieval, zero hallucinations, seamless agent escalation, and enterprise SLA observability.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-bold rounded-2xl hover:opacity-95 transition-all shadow-3d-cyan transform hover:-translate-y-1 text-base"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold transition-all text-base"
            >
              Test Live AI Chat
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
