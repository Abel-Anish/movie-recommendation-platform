"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
};

type GlassNavProps = {
  brand: ReactNode;
  links: NavItem[];
  actions?: ReactNode;
  className?: string;
};

export function GlassNav({ brand, links, actions, className = "" }: GlassNavProps) {
  const pathname = usePathname();

  return (
    <header className={`sticky top-4 z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="rounded-full border border-white/10 bg-black/45 px-4 py-3 shadow-[0_10px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold tracking-[0.35em] text-white/90 transition hover:text-white">
              {brand}
            </Link>
          </div>

          <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-2">
            {links.map((link) => {
              const active = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {actions ? <div className="ml-auto">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
