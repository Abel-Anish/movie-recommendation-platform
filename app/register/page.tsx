"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <section className="grid gap-10 overflow-hidden rounded-2xl border-2 border-white/15 bg-[#0d0f17] p-6 sm:p-10 shadow-2xl lg:grid-cols-[1fr_1.1fr]">
        {/* Left Side Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="comic-badge comic-badge-red text-[10px]">
                ORIGIN STORY
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ISSUE #00
              </span>
            </div>

            <h1 className="font-sans text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              START BUILDING YOUR MOVIE PROFILE.
            </h1>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Join the MovieMatch network to track personal ratings, curate custom storyboards, and export personal recommendations.
            </p>
          </div>

          {/* Feature Checklist */}
          <div className="rounded-xl border border-white/10 bg-white/4 p-5 space-y-2.5 text-xs text-slate-300">
            <span className="block font-black uppercase tracking-widest text-[#f5c518] mb-1">
              PROFILE ADVANTAGES:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[#e50914]">✓</span>
              <span>Direct cross-reference with TMDb catalogue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#e50914]">✓</span>
              <span>Writers room custom mood profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#e50914]">✓</span>
              <span>Instant sync with browser collection</span>
            </div>
          </div>
        </div>

        {/* Right Side Registration Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-white/15 bg-[#12151e] p-6 sm:p-8 shadow-xl"
        >
          <div className="border-b border-white/10 pb-3">
            <span className="text-xs font-black uppercase tracking-widest text-white">
              CREATE REGISTRATION
            </span>
          </div>

          {error ? (
            <div className="rounded-lg border border-[#e50914] bg-[#e50914]/10 p-3 text-xs font-bold text-red-300">
              ✕ {error}
            </div>
          ) : null}

          {submitted ? (
            <div className="rounded-lg border border-[#f5c518] bg-[#f5c518]/10 p-4 text-xs font-bold text-[#f5c518]">
              ✓ Profile registered successfully. Welcome to MovieMatch!
            </div>
          ) : null}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              CURATOR NAME
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#e50914] focus:bg-black/90"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="curator@moviematch.com"
              className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#e50914] focus:bg-black/90"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#e50914] focus:bg-black/90"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              className="w-full rounded-lg border border-white/20 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-[#e50914] focus:bg-black/90"
            />
          </div>

          <button
            type="submit"
            className="comic-btn-primary w-full py-3.5 text-xs font-black uppercase tracking-wider cursor-pointer mt-2"
          >
            CREATE ARCHIVE ACCOUNT →
          </button>

          <div className="text-center pt-2 border-t border-white/10">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-white hover:text-[#e50914] transition">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
