const STORAGE_PREFIX = "scroll-pos:";
const RETURN_SECTION_KEY = "home-return-section";

let skipHomeSavedScrollCount = 0;

/** Skip restoring stale saved scroll on `/` after a programmatic return to a home section. */
export function markSkipHomeSavedScroll(count = 1) {
  skipHomeSavedScrollCount += count;
}

export function consumeSkipHomeSavedScroll() {
  if (skipHomeSavedScrollCount <= 0) return false;
  skipHomeSavedScrollCount -= 1;
  return true;
}

/** Remember which home section to scroll to after leaving a detail page. */
export function markReturnHomeSection(section: string) {
  try {
    sessionStorage.setItem(RETURN_SECTION_KEY, section);
  } catch {
    // sessionStorage may be unavailable
  }
}

export function peekReturnHomeSection(): string | null {
  try {
    return sessionStorage.getItem(RETURN_SECTION_KEY);
  } catch {
    return null;
  }
}

export function clearReturnHomeSection() {
  try {
    sessionStorage.removeItem(RETURN_SECTION_KEY);
  } catch {
    // sessionStorage may be unavailable
  }
}

export function routeKey(pathname?: string) {
  if (typeof window === "undefined") return pathname ?? "/";
  return (pathname ?? window.location.pathname) + window.location.search;
}

export function getSavedScroll(key: string): number | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveScroll(key: string, y: number) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + key, String(Math.round(y)));
  } catch {
    // sessionStorage may be unavailable
  }
}

export function saveScrollForRoute(pathname?: string, y?: number) {
  if (typeof window === "undefined") return;
  saveScroll(routeKey(pathname), y ?? window.scrollY);
}

/** Home section to scroll to when returning from a detail page. */
export function homeSectionForPath(pathname: string): string | null {
  if (/^\/events\/[^/]+/.test(pathname)) return "events";
  if (/^\/catalogue\/[^/]+/.test(pathname)) return "catalogue";
  if (/^\/services\/[^/]+/.test(pathname)) return "services";
  return null;
}

export function isInternalHref(href: string) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  if (href.startsWith("/")) return true;
  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}
