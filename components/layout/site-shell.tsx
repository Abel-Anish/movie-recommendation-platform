"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/login", label: "Login" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <Link href="/" className="text-lg font-black tracking-[0.3em] text-white">
            MOVIEMATCH
          </Link>

          <nav className="flex flex-wrap gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}
