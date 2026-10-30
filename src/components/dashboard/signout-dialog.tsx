"use client";
import { LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function SignOutDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <LogOut className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Sign Out of SupportAI?</h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            You will need to sign in again to access your conversations, tickets, and dashboard.
          </p>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSigningOut}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-900/30 flex items-center justify-center gap-1.5"
          >
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
