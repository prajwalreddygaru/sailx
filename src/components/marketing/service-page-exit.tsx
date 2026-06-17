"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { markReturnHomeSection, markSkipHomeSavedScroll } from "@/lib/scroll-storage";

/** Browser back from a service detail page always returns to the home services section. */
export function ServicePageExit() {
  const router = useRouter();
  const pathname = usePathname();
  const handlingRef = useRef(false);

  useEffect(() => {
    window.history.pushState({ sailxServiceExit: true }, "", window.location.href);

    const onPopState = () => {
      if (handlingRef.current) return;
      if (!window.location.pathname.startsWith("/services/")) return;

      handlingRef.current = true;
      markReturnHomeSection("services");
      markSkipHomeSavedScroll();
      router.replace("/", { scroll: false });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [router]);

  useEffect(() => {
    if (pathname === "/") {
      handlingRef.current = false;
    }
  }, [pathname]);

  return null;
}
