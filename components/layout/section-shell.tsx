import type { ReactNode } from "react";

type SectionShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionShell({
  eyebrow,
  title,
  description,
  action,
  children,
  className = "",
}: SectionShellProps) {
  return (
    <section className={`space-y-5 ${className}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-2">
          {eyebrow ? (
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff3d5a]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-2xl font-semibold text-white sm:text-[1.7rem]">{title}</h2>
          {description ? <p className="text-sm leading-7 text-slate-400">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div>{children}</div>
    </section>
  );
}
