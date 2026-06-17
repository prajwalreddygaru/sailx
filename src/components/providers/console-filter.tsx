"use client";

import * as React from "react";

/**
 * Suppresses known non-critical console errors in development:
 * - NextAuth v4 CLIENT_FETCH_ERROR noise (Next.js 16 + Turbopack)
 * - React 19 script tag rendering warnings from next-themes
 * These do not affect production or actual functionality.
 */
export function ConsoleFilter() {
  React.useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const first = args[0];
      if (typeof first === "string") {
        const suppressed = [
          "[next-auth][error][CLIENT_FETCH_ERROR]",
          "https://next-auth.js.org/errors#client_fetch_error",
          "Encountered a script tag while rendering React component",
          "Scripts inside React components are never executed",
        ];
        if (suppressed.some((s) => first.includes(s))) return;
      }
      originalError.apply(console, args);
    };
    return () => { console.error = originalError; };
  }, []);
  return null;
}
