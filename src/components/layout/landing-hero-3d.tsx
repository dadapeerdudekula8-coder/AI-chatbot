"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Shield,
  Zap,
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  MessageSquare,
  Play,
  RotateCcw,
} from "lucide-react";

export function LandingHero3D() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Simulated 3D Chat Interactive State
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [simulatedChat, setSimulatedChat] = useState({
    query: "How do I track my active order?",
    answer:
      "You can track your order in real time! Navigate to Orders > Track Order, or click your tracking link sent via email. Expected delivery: 2-3 business days.",
    source: "Verified FAQ: Shipping & Orders",
  });

  const DEMO_PROMPTS = [
    {
      q: "How do I track my active order?",
      a: "You can track your order in real time! Navigate to Orders > Track Order, or click your tracking link sent via email. Expected delivery: 2-3 business days.",
      src: "Verified FAQ: Shipping & Orders",
    },
    {
      q: "What is your 30-day refund policy?",
      a: "Returns are accepted within 30 days of delivery for unused items in original packaging. Refunds process in 5-7 business days to your original payment method.",
      src: "Verified Policy: Returns & Refunds",
    },
    {
      q: "Can I escalate this inquiry to a human agent?",
      a: "Yes! I can automatically generate ticket #1004 and forward our conversation history to an on-duty specialist. Average response time: < 2 hours.",
      src: "Support Protocol: Tier 2 Escalation",
    },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const selectPrompt = (idx: number) => {
    setActivePromptIndex(idx);
    setSimulatedChat({
      query: DEMO_PROMPTS[idx].q,
      answer: DEMO_PROMPTS[idx].a,
      source: DEMO_PROMPTS[idx].src,
    });
  };

  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-slate-950 text-white min-h-[92vh] flex items-center">
      {/* 3D Volumetric Ambient Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-12 left-10 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-float-reverse pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle 3D Perspective Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transform: "perspective(500px) rotateX(60deg) translateY(-80px)",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Tag */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] animate-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>Next-Generation 3D AI Support Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] animate-slide-up">
            Resolve{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(37,99,235,0.4)]">
              85% of Customer Queries
            </span>
            <br />
            With 3D Grounded AI
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Empower your team with semantic RAG intelligence, sub-second streaming answers,
            seamless ticket escalation, and enterprise SLA observability.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 animate-fade-in">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-base hover:opacity-95 transition-all shadow-3d-cyan transform hover:-translate-y-1"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/specifications"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all transform hover:-translate-y-0.5"
            >
              Explore 3D Specs & Architecture
            </Link>
          </div>
        </div>

        {/* 3D Interactive Showcase Component */}
        <div className="mt-16 max-w-5xl mx-auto perspective-1000">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-3xl border border-cyan-500/30 bg-slate-900/80 backdrop-blur-2xl p-6 sm:p-10 shadow-3d-blue transition-transform duration-200 ease-out transform-style-3d cursor-pointer"
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
                isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
              }`,
            }}
          >
            {/* 3D Floating Floating Badges */}
            <div
              className="absolute -top-6 -left-4 sm:-left-8 px-4 py-2 rounded-2xl bg-slate-900/90 border border-cyan-400/50 shadow-3d-cyan text-xs font-bold text-cyan-300 flex items-center gap-2 transform-style-3d animate-float-slow z-30"
              style={{ transform: "translateZ(50px)" }}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>&lt; 350ms TTFB Latency</span>
            </div>

            <div
              className="absolute -bottom-6 -right-4 sm:-right-8 px-4 py-2 rounded-2xl bg-slate-900/90 border border-purple-500/50 shadow-3d-purple text-xs font-bold text-purple-300 flex items-center gap-2 transform-style-3d animate-float-reverse z-30"
              style={{ transform: "translateZ(60px)" }}
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>768-Dim Gemini RAG Embeddings</span>
            </div>

            <div
              className="absolute top-1/2 -right-6 hidden lg:flex px-4 py-2 rounded-2xl bg-slate-900/90 border border-emerald-400/50 shadow-3d-emerald text-xs font-bold text-emerald-300 items-center gap-2 transform-style-3d z-30"
              style={{ transform: "translateZ(45px) translateY(-50%)" }}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>99.9% Uptime SLA</span>
            </div>

            {/* Inner 3D Chat Interface Simulation */}
            <div className="space-y-6" style={{ transform: "translateZ(30px)" }}>
              {/* Window Controls */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    SupportAI Live Interactive 3D Demonstration
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Streaming Online
                </div>
              </div>

              {/* Interactive Demo Prompt Selectors */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
                  <Play className="w-3 h-3 text-cyan-400" /> Test Prompts:
                </span>
                {DEMO_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectPrompt(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      activePromptIndex === idx
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60"
                    }`}
                  >
                    {p.q.length > 25 ? `${p.q.slice(0, 25)}...` : p.q}
                  </button>
                ))}
              </div>

              {/* Simulated Chat Dialogue */}
              <div className="space-y-4 pt-2">
                {/* User Message */}
                <div className="flex justify-end">
                  <div
                    className="max-w-[85%] sm:max-w-[70%] px-5 py-3 rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium shadow-lg transform-style-3d"
                    style={{ transform: "translateZ(25px)" }}
                  >
                    {simulatedChat.query}
                  </div>
                </div>

                {/* AI Assistant Message */}
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-3d-cyan mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div
                    className="max-w-[85%] sm:max-w-[75%] p-5 rounded-2xl rounded-bl-sm bg-slate-800/90 border border-slate-700/80 text-slate-100 text-sm leading-relaxed space-y-3 shadow-xl transform-style-3d"
                    style={{ transform: "translateZ(35px)" }}
                  >
                    <p>{simulatedChat.answer}</p>
                    <div className="pt-2 border-t border-slate-700/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Source: {simulatedChat.source}</span>
                      </div>
                      <span className="text-[11px] font-mono text-purple-400">
                        Cosine Sim: 0.94 &bull; TTFB: 280ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Info Ribbon */}
              <div
                className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2"
                style={{ transform: "translateZ(15px)" }}
              >
                <span>Interactive 3D Card: Hover and tilt your mouse over the dashboard</span>
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Open Full Chat Interface &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metrics Counter Row */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center space-y-2 hover:border-cyan-500/40 transition-all shadow-lg hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              &lt; 400ms
            </div>
            <div className="text-sm font-semibold text-white">Streaming Response</div>
            <p className="text-xs text-slate-400">Word-by-word token generation with real-time SSE</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center space-y-2 hover:border-purple-500/40 transition-all shadow-lg hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              85%+
            </div>
            <div className="text-sm font-semibold text-white">First-Contact Resolution</div>
            <p className="text-xs text-slate-400">Knowledge-grounded answers without human intervention</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center space-y-2 hover:border-emerald-500/40 transition-all shadow-lg hover:-translate-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              99.9%
            </div>
            <div className="text-sm font-semibold text-white">Enterprise SLA Uptime</div>
            <p className="text-xs text-slate-400">Continuous 24/7 availability with resilient fallbacks</p>
          </div>
        </div>
      </div>
    </section>
  );
}
