import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  chapter?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionShell({
  eyebrow,
  chapter,
  title,
  description,
  action,
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section className={`space-y-6 ${className}`}>
      {/* Chapter & Title Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-1.5">
          <div className="flex items-center gap-2">
            {chapter ? (
              <span className="comic-badge comic-badge-dark text-[10px] font-mono">
                {chapter}
              </span>
            ) : null}
            {eyebrow ? (
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#e50914]">
                {eyebrow}
              </span>
            ) : null}
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {title}
          </h2>
          {description ? (
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {/* Panel Sequence Container */}
      <div>{children}</div>
    </section>
  );
}
