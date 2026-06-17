"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

export function FloatingActionsProvider() {
  const pathname = usePathname() || "/";
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const show = React.useMemo(() => {
    if (pathname === "/") return true;
    if (pathname.startsWith("/tours")) return true;
    if (pathname.startsWith("/events")) return true;
    if (pathname.startsWith("/dashboard/buyer/bookings")) return true;
    return false;
  }, [pathname]);

  if (!mounted || !show) return null;

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "918660752291";
  const text = encodeURIComponent("Hello sailxchina team! I'd like to know more.");
  const waHref = `https://wa.me/${phone}?text=${text}`;

  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="fixed right-4 bottom-12 z-50 flex flex-col items-end gap-3">
      {/* Scroll to top arrow */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-foreground/90 hover:bg-foreground text-background shadow-lg flex items-center justify-center transition-colors"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* WhatsApp button */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] shadow-xl flex items-center justify-center overflow-hidden"
      >
        <img src="/images/whatsapp_logo.png" alt="WhatsApp" className="h-full w-full object-contain" />
      </a>
    </div>
  );
}
