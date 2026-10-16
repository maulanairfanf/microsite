import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  backHref?: string;
}

export function PageHeader({ title, description, action, className, backHref }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex items-center justify-between gap-4", className)}>
      <div className="flex gap-3">
        {backHref && (
          <Link href={backHref} aria-label="Go back">
            <Button variant="ghost" size="icon" className="-ml-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
