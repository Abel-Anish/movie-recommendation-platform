import { cn } from "../../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn("w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-400 focus:border-white/20", className)} {...props} />;
}
