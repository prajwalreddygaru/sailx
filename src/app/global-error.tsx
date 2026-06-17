"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-background font-sans antialiased p-6">
        <div className="max-w-xl w-full p-6 text-center border rounded-2xl bg-card shadow-sm">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black mb-2">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mb-5">
            An unexpected server error occurred. Please try again or return home.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={() => reset()} className="font-semibold">
              Try again
            </Button>
            <Button asChild variant="outline" className="font-semibold">
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline" className="font-semibold">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
          {error?.digest && (
            <div className="mt-4 text-[11px] text-muted-foreground">Ref: {error.digest}</div>
          )}
        </div>
      </body>
    </html>
  );
}
