"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/constants";
import { AppearanceToggle } from "@/components/AppearanceToggle";

interface AdminTopBarProps {
  role: Role;
  userName: string;
  userEmail: string;
  isImpersonating?: boolean;
  onMenuClick?: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  const first = parts[0]!;
  const last = parts[parts.length - 1]!;
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function getRoleLabel(role: Role, isImpersonating: boolean): string {
  if (isImpersonating) return "Impersonating";
  if (role === Role.SuperAdmin) return "Super Admin";
  if (role === Role.TenantMainAdmin) return "Tenant Owner";
  return "Tenant Admin";
}

export function AdminTopBar({
  role,
  userName,
  userEmail,
  isImpersonating = false,
  onMenuClick,
}: AdminTopBarProps) {
  const router = useRouter();
  const initials = getInitials(userName);
  const roleLabel = getRoleLabel(role, isImpersonating);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  const handleStopImpersonation = async () => {
    await fetch("/api/super/stop-impersonation", { method: "POST" });
    router.push("/super");
    router.refresh();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 border-b border-border bg-background",
        "flex items-center justify-between gap-4 px-4 md:px-6 lg:px-8",
      )}
    >
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden -ml-2"
            aria-label="Open menu"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <AppearanceToggle className="hidden items-center sm:flex" />
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-3 rounded-xl py-1.5 pl-2 pr-3",
              "outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary/30",
            )}
          >
            <Avatar size="default">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="max-w-[160px] truncate text-sm font-semibold text-foreground">
                {userName}
              </span>
              <span
                className={cn(
                  "mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wider",
                  isImpersonating
                    ? "bg-amber-100 text-amber-700"
                    : role === Role.SuperAdmin
                      ? "bg-purple-100 text-purple-700"
                      : "bg-secondary text-secondary-foreground",
                )}
              >
                {roleLabel}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-2">
            <DropdownMenuLabel className="px-2 py-1.5 font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isImpersonating && (
              <DropdownMenuItem onClick={handleStopImpersonation} className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Super Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
