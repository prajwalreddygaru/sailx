"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Public logo asset — served from /public/mainlogo.png */
export const LOGO_SRC = "/mainlogo.png";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  showText?: boolean;
  href?: string;
  variant?: "auto" | "light" | "dark";
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={href} className={cn("flex items-center", className)} aria-label="SailX home">
      {imgError ? (
        <span className="font-extrabold text-xl leading-none text-red-600">SAILX</span>
      ) : (
        // Use native img — next/image throws 500 when src is not in images.localPatterns (Next.js 16)
        <img
          src={LOGO_SRC}
          alt="SailX China"
          width={220}
          height={60}
          className="h-14 w-auto object-contain"
          decoding="async"
          onError={() => setImgError(true)}
        />
      )}
    </Link>
  );
}
