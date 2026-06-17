"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppBack } from "@/hooks/use-app-back";

type BackButtonProps = {
  fallback?: string;
  label?: string;
  className?: string;
  iconClassName?: string;
  /** Navigate to fallback section on home instead of browser history. */
  preferHomeSection?: boolean;
};

export function BackButton({
  fallback = "/",
  label = "Back",
  className,
  iconClassName,
  preferHomeSection = false,
}: BackButtonProps) {
  const goBack = useAppBack(fallback, preferHomeSection);

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        "inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors",
        className
      )}
    >
      <ChevronLeft className={cn("h-4 w-4", iconClassName)} />
      {label}
    </button>
  );
}
