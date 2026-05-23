import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.768a1.45 1.45 0 01-1.341.735H7.716a1.45 1.45 0 01-1.341-.735H2.979a2 2 0 01-2-2V5a2 2 0 012-2h2.768a1.45 1.45 0 011.341.735h6.845a1.45 1.45 0 011.341.735H18.02a2 2 0 012 2v2m16 0h2M9.732 18h2.528m-2.528 0V5a2 2 0 012-2h2.528"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}