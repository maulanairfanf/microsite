import { cn } from "@/lib/utils";

interface PlanBadgeProps {
  plan: "free" | "premium";
  className?: string;
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  if (plan !== "premium") return null;

  return (
    <span
      className={cn(
        "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-700",
        className,
      )}
    >
      Pro
    </span>
  );
}
