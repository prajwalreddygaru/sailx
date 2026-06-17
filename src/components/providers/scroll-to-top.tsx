"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  clearReturnHomeSection,
  consumeSkipHomeSavedScroll,
  getSavedScroll,
  homeSectionForPath,
  isInternalHref,
  markSkipHomeSavedScroll,
  peekReturnHomeSection,
  routeKey,
  saveScroll,
  saveScrollForRoute,
} from "@/lib/scroll-storage";

const NAVBAR_OFFSET = 88;
const READY_TIMEOUT_MS = 5000;

let pendingTraverse = false;

if (typeof window !== "undefined") {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  window.addEventListener(
    "popstate",
    () => {
      pendingTraverse = true;
    },
    true
  );
}

function maxScrollY() {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

function scrollWindowTo(y: number) {
  const top = Math.min(Math.max(0, y), maxScrollY());
  window.scrollTo({ top, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;
}

function elementScrollY(id: string) {
  const el = document.getElementById(id);
  if (!el) return null;

  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET);
}

function hashScrollY() {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  return elementScrollY(hash);
}

function scrollOnceWhenReady(resolveY: () => number | null) {
  let done = false;
  let rafId = 0;
  let timeoutId = 0;

  const apply = () => {
    if (done) return;

    const y = resolveY();
    if (y === null) return;

    if (maxScrollY() >= y - 24) {
      scrollWindowTo(y);
      done = true;
      cleanup();
    }
  };

  const ro = new ResizeObserver(apply);
  ro.observe(document.documentElement);
  ro.observe(document.body);

  const cleanup = () => {
    ro.disconnect();
    if (rafId) window.cancelAnimationFrame(rafId);
    if (timeoutId) window.clearTimeout(timeoutId);
  };

  apply();
  rafId = window.requestAnimationFrame(apply);
  timeoutId = window.setTimeout(() => {
    if (done) return;
    const y = resolveY();
    if (y !== null) scrollWindowTo(y);
    done = true;
    cleanup();
  }, READY_TIMEOUT_MS);

  return cleanup;
}

function maintainHomeSectionScroll(section: string, durationMs = 2500) {
  const startedAt = Date.now();
  const timeouts: number[] = [];

  const correct = () => {
    if (Date.now() - startedAt > durationMs) return;
    const y = elementScrollY(section);
    if (y !== null) saveScroll(routeKey("/"), y);
    return y;
  };

  const ro = new ResizeObserver(() => {
  const y = correct();

  if (typeof y === "number") {
    scrollWindowTo(y);
  }
});

  ro.observe(document.documentElement);
  ro.observe(document.body);

  for (const delay of [200, 500, 1000]) {
    timeouts.push(
      window.setTimeout(() => {
        const y = correct();

        if (typeof y === "number") {
          scrollWindowTo(y);
        }
      }, delay)
    );
  }

  const stopId = window.setTimeout(() => ro.disconnect(), durationMs);

  return () => {
    ro.disconnect();
    window.clearTimeout(stopId);
    timeouts.forEach((id) => window.clearTimeout(id));
  };
}

/** Single scroll manager: restore on history back/forward, hash on forward anchor nav, top on first forward visit. */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const prevPathnameRef = React.useRef(pathname);
  const cleanupRef = React.useRef<(() => void) | null>(null);
  const lockedHomeSectionRef = React.useRef<string | null>(null);
  const homeReturnAppliedRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (pathname !== "/") {
      lockedHomeSectionRef.current = null;
      homeReturnAppliedRef.current = null;
    }
  }, [pathname]);

  React.useEffect(() => {
    const key = routeKey(pathname);
    const persist = () => saveScroll(key, window.scrollY);

    window.addEventListener("scroll", persist, { passive: true });
    window.addEventListener("pagehide", persist);

    return () => {
      window.removeEventListener("scroll", persist);
      window.removeEventListener("pagehide", persist);
    };
  }, [pathname]);

  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest("a[href]");
      if (!anchor || anchor.getAttribute("target") === "_blank") return;

      const href = anchor.getAttribute("href");
      if (!href || !isInternalHref(href)) return;

      saveScrollForRoute();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const applyScrollForRoute = React.useCallback((isTraverse: boolean, fromPathname: string) => {
    cleanupRef.current?.();
    cleanupRef.current = null;

    const key = routeKey(pathname);
    const saved = getSavedScroll(key);

    if (pathname === "/") {
      const section = peekReturnHomeSection() ?? homeSectionForPath(fromPathname);

      if (section) {
        if (homeReturnAppliedRef.current === section) {
          return;
        }

        homeReturnAppliedRef.current = section;
        lockedHomeSectionRef.current = section;
        markSkipHomeSavedScroll();

        cleanupRef.current = scrollOnceWhenReady(() => {
          const y = elementScrollY(section);
          if (typeof y === "number") {
            clearReturnHomeSection();
            saveScroll(routeKey("/"), y);
          }
          return y;
        });

        const maintainCleanup = maintainHomeSectionScroll(section);
        const priorCleanup = cleanupRef.current;
        cleanupRef.current = () => {
          priorCleanup?.();
          maintainCleanup();
        };
        return;
      }
    }

    if (isTraverse && saved !== null) {
      if (pathname === "/" && consumeSkipHomeSavedScroll()) {
        return;
      }

      cleanupRef.current = scrollOnceWhenReady(() => saved);
      return;
    }

    if (!isTraverse) {
      if (pathname === "/" && lockedHomeSectionRef.current) {
        return;
      }

      const hashY = hashScrollY();
      if (hashY !== null) {
        cleanupRef.current = scrollOnceWhenReady(() => hashScrollY());
        return;
      }

      scrollWindowTo(0);
    }
  }, [pathname]);

  React.useLayoutEffect(() => {
    const fromPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    const isTraverse = pendingTraverse;
    pendingTraverse = false;
    applyScrollForRoute(isTraverse, fromPathname);
    return () => cleanupRef.current?.();
  }, [applyScrollForRoute, pathname]);

  React.useEffect(() => {
    const onHashChange = () => {
      if (pendingTraverse) return;
      if (peekReturnHomeSection() || lockedHomeSectionRef.current) return;
      applyScrollForRoute(false, prevPathnameRef.current);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [applyScrollForRoute]);

  return null;
}
