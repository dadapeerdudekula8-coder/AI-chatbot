import Link from "next/link";
import { Bot, Layers, Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-800 py-12 bg-slate-950 text-slate-400">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-white">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-3d-cyan">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span>{APP_NAME}</span>
          </Link>

          <p className="text-xs text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} {APP_NAME}. 3D AI Support & Knowledge Grounding Platform.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
            <Link href="/chat" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Chat
            </Link>
            <Link href="/specifications" className="hover:text-purple-400 transition-colors flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> 3D Architecture
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-white transition-colors">
              Register
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
