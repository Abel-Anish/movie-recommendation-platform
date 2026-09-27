"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useWatchlist } from "../../hooks/use-watchlist";

const navLinks = [
  { href: "/", label: "HOME", act: "ISSUE #01" },
  { href: "/search", label: "DISCOVER", act: "DATABASE" },
  { href: "/recommendations", label: "RECOMMENDATIONS", act: "WRITERS ROOM" },
  { href: "/watchlist", label: "WATCHLIST", act: "ARCHIVE" },
  { href: "/login", label: "ACCOUNT", act: "ACCESS" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { watchlist } = useWatchlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090c] text-[#f4f4f6] bg-comic-dots">
      {/* Top Editorial Film-strip Bar */}
      <div className="bg-[#050608] border-b border-white/10 px-4 py-1 text-[11px] font-mono tracking-widest text-slate-400 flex justify-between items-center select-none">
        <span className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#e50914] animate-pulse" />
          MOVIEMATCH • LIVE CINEMATIC FEED
        </span>
        <span className="hidden sm:inline text-slate-500 uppercase">
          TMDB BROADCAST • 2026 EDITION
        </span>
      </div>

      {/* Main Sticky Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0c12]/95 backdrop-blur-xl border-b border-white/12 shadow-2xl py-3"
            : "bg-[#0a0c12]/80 backdrop-blur-lg border-b border-white/8 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo / Identity */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#e50914] bg-black font-sans font-black text-xl text-white shadow-[2px_2px_0px_#e50914] transition group-hover:scale-105">
              M
            </div>
            <div>
              <span className="block font-sans text-lg font-black tracking-tight text-white uppercase group-hover:text-[#f5c518] transition">
                MOVIEMATCH
              </span>
              <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-[#e50914]">
                CINEMA ISSUE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const isWatchlist = link.href === "/watchlist";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative rounded-md px-3.5 py-2 text-xs font-black uppercase tracking-wider transition ${
                    active
                      ? "bg-[#e50914] text-white shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {isWatchlist && watchlist.length > 0 ? (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f5c518] px-1 text-[10px] font-black text-black">
                        {watchlist.length}
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Search Action & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/search"
              aria-label="Search movies"
              className="flex items-center gap-2 rounded-md border border-white/15 bg-white/6 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-[#e50914] hover:text-white transition"
            >
              <span>🔍</span>
              <span className="hidden lg:inline text-slate-400">SEARCH UNIVERSE</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/6 text-white"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen ? (
          <div className="md:hidden border-t border-white/10 bg-[#0c0e15] px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const isWatchlist = link.href === "/watchlist";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-md p-3 text-sm font-black uppercase tracking-wider ${
                    active ? "bg-[#e50914] text-white" : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-slate-400 font-mono">
                    {isWatchlist && watchlist.length > 0 ? `(${watchlist.length})` : link.act}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : null}
      </header>

      {/* Main Content Viewport */}
      <div className="flex-1">{children}</div>

      {/* Editorial Footer */}
      <footer className="mt-20 border-t border-white/12 bg-[#06070a] pt-12 pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 pb-10 border-b border-white/10">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded border border-[#e50914] bg-black font-black text-white shadow-[2px_2px_0px_#e50914]">
                  M
                </div>
                <span className="font-sans text-xl font-black uppercase tracking-tight text-white">
                  MOVIEMATCH
                </span>
                <span className="comic-badge comic-badge-red text-[10px]">ISSUE #2026</span>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-slate-400">
                A cinematic story discovery platform transforming streaming and movie exploration into living comic storyboard panels. Powered by live TMDb audience data.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-[#f5c518]">
                DISCOVERY CHAPTERS
              </p>
              <ul className="space-y-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <li>
                  <Link href="/" className="hover:text-[#e50914] transition">
                    Featured Releases
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="hover:text-[#e50914] transition">
                    Search Database
                  </Link>
                </li>
                <li>
                  <Link href="/recommendations" className="hover:text-[#e50914] transition">
                    Writers Room AI
                  </Link>
                </li>
                <li>
                  <Link href="/watchlist" className="hover:text-[#e50914] transition">
                    Personal Collection
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-[#e50914]">
                ATTRIBUTIONS & CITATIONS
              </p>
              <p className="text-[11px] leading-relaxed text-slate-400">
                This application uses the TMDb API for real-time movie metadata and posters but is not endorsed or certified by TMDb.
              </p>
              <p className="text-[11px] leading-relaxed text-slate-400">
                External movie records are connected to IMDb where external identifiers are provided.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <p>© {new Date().getFullYear()} MOVIEMATCH PLATFORM. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4">
              <span className="hover:text-slate-400">STORYBOARD UI 2.0</span>
              <span>•</span>
              <span className="hover:text-slate-400">NEXT.JS 16 TURBOPACK</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
