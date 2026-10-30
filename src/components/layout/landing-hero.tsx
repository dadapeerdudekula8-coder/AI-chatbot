import Link from "next/link";
import { ArrowRight, Bot, Shield, Zap } from "lucide-react";

export function LandingHero() {
  return (
    <section className="pt-32 pb-24 overflow-hidden relative">
      <div className="absolute inset-0 gradient-dark opacity-5 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 animate-fade-in">
          <Zap className="w-4 h-4" /> AI-Powered Customer Support
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
          Resolve{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            80% of Queries
          </span>
          <br />Automatically
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
          SupportAI uses RAG-powered AI to instantly answer customer questions using your business knowledge — 24/7, in any language.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-all"
          >
            Sign In
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
          {[{icon: Bot, label: "AI Responses", value: "< 2s"},{icon: Shield, label: "Uptime", value: "99.9%"},{icon: Zap, label: "Resolution Rate", value: "80%+"}].map(({icon: Icon, label, value}) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="w-8 h-8 text-primary mb-2" />
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
