import { cn } from "../../lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("rounded-[1.5rem] border border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl", className)} {...props} />;
}
