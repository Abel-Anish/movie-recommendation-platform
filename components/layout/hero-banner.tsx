import type { ReactNode } from "react";

type HeroPanelProps = {
  badge?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function HeroBanner({ badge, title, subtitle, actions, children, className = "" }: HeroPanelProps) {
  return (
    <section className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:p-10 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,61,90,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(108,99,255,0.22),_transparent_35%)]" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-5">
          {badge ? (
            <span className="inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-semibold text-pink-200">
              {badge}
            </span>
          ) : null}
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
            {subtitle ? <p className="max-w-xl text-lg leading-8 text-slate-300">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {children ? <div className="w-full max-w-md">{children}</div> : null}
      </div>
    </section>
  );
}
