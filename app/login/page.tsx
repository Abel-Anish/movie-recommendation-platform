"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <section className="grid gap-10 overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0d0f17] p-6 sm:p-10 shadow-2xl lg:grid-cols-[1fr_1.1fr]">
        {/* Left Side Story Intro */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="comic-badge comic-badge-red text-[10px]">
                ACCESS REGISTRY
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                PROLOGUE
              </span>
            </div>

            <h1 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              YOUR NEXT STORY STARTS HERE.
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Sign in to keep your personal watchlist synced, preserve custom recommendation seeds, and unlock advanced script doctor tools.
            </p>
          </div>

          <div className="caption-box caption-box-gold text-xs leading-relaxed text-slate-300">
            <span className="block font-black uppercase tracking-wider text-[#f5c518] mb-1">
              COLLECTION NOTE:
            </span>
            Watchlist movies are automatically preserved in your browser session even without signing in.
          </div>
        </div>

        {/* Right Side Framed Comic Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-white/15 bg-[#12151e] p-6 sm:p-8 shadow-xl"
        >
          <div className="border-b border-white/10 pb-3">
            <span className="text-xs font-black uppercase tracking-widest text-white">
              AUTHENTICATION PANEL
            </span>
          </div>

          {submitted ? (
            <div className="rounded-lg border border-[#f5c518] bg-[#f5c518]/10 p-4 text-xs font-bold text-[#f5c518]">
              ✓ Session initialized. Enjoy browsing the MovieMatch universe!
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="curator@moviematch.com"
              className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#e50914] focus:bg-black/90"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                PASSWORD
              </label>
              <button
                type="button"
                className="text-[11px] font-bold text-slate-400 hover:text-[#f5c518] transition"
              >
                FORGOT?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#e50914] focus:bg-black/90"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-white/20 bg-black/60 accent-[#e50914]"
            />
            <label htmlFor="remember" className="text-xs text-slate-300">
              Keep my session active on this terminal
            </label>
          </div>

          <button
            type="submit"
            className="comic-btn-primary w-full py-3.5 text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            ENTER THE UNIVERSE →
          </button>

          <div className="text-center pt-2 border-t border-white/10">
            <p className="text-xs text-slate-400">
              New to MovieMatch?{" "}
              <Link href="/register" className="font-bold text-white hover:text-[#e50914] transition">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
