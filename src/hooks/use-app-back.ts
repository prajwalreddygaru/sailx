"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { markReturnHomeSection, markSkipHomeSavedScroll } from "@/lib/scroll-storage";

function homeSectionFromFallback(fallback: string) {
  const hashIndex = fallback.indexOf("#");
  if (hashIndex === -1) return null;
  return fallback.slice(hashIndex + 1) || null;
}

function pathFromFallback(fallback: string) {
  const hashIndex = fallback.indexOf("#");
  const path = hashIndex === -1 ? fallback : fallback.slice(0, hashIndex);
  return path || "/";
}

export function useAppBack(fallback = "/", preferHomeSection = false) {
  const router = useRouter();

  return useCallback(() => {
    if (
      !preferHomeSection &&
      typeof window !== "undefined" &&
      window.history.length > 1
    ) {
      router.back();
      return;
    }

    const section = preferHomeSection ? homeSectionFromFallback(fallback) : null;
    if (section) {
      markReturnHomeSection(section);
      markSkipHomeSavedScroll();
    }

    router.push(pathFromFallback(fallback), { scroll: false });
  }, [router, fallback, preferHomeSection]);
}
