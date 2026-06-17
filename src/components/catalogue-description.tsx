"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

function renderDescriptionWithLinks(text: string) {
  if (!text) return null;
  const URL_RE = /(https?:\/\/[^\s]+)/g;
  const parts = String(text).split(URL_RE);
  return parts.map((part, i) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-primary hover:underline break-all"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function normalizeDescription(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function CatalogueDescription({
  description,
  title,
  variant = "card",
}: {
  description: string;
  title?: string;
  variant?: "card" | "full";
}) {
  const [open, setOpen] = React.useState(false);
  const previewRef = React.useRef<HTMLParagraphElement>(null);
  const [needsExpand, setNeedsExpand] = React.useState(false);
  const normalized = normalizeDescription(description);

  React.useLayoutEffect(() => {
    const el = previewRef.current;
    if (!el || !normalized.trim()) {
      setNeedsExpand(false);
      return;
    }
    const check = () => setNeedsExpand(el.scrollHeight > el.clientHeight + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [normalized]);

  if (!normalized.trim()) return null;

  if (variant === "full") {
    return (
      <>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-5 lg:h-6 bg-primary rounded-full" />
            <h2 className="text-base lg:text-lg font-bold">Description</h2>
          </div>
          <div className="relative rounded-xl border border-primary/10 bg-background/60 p-4 lg:p-5 overflow-hidden">
            <p
              ref={previewRef}
              className="text-sm lg:text-[15px] text-foreground/80 leading-relaxed whitespace-pre-line line-clamp-6 lg:line-clamp-8 break-words"
            >
              {renderDescriptionWithLinks(normalized)}
            </p>
            {needsExpand && (
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/95 to-transparent pointer-events-none" />
            )}
          </div>
          {needsExpand && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-3 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View more
            </button>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[min(85vh,85svh)] overflow-y-auto p-5 sm:p-6">
            <DialogTitle className="text-lg font-bold pr-8 leading-snug">
              {title || "Description"}
            </DialogTitle>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground -mt-1">
              Description
            </p>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words">
              {renderDescriptionWithLinks(normalized)}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2 w-full sm:w-auto text-sm font-semibold text-primary hover:text-primary/80 transition-colors text-left"
            >
              View less
            </button>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Description
        </h2>
        <div className="relative overflow-hidden">
          <p
            ref={previewRef}
            className="text-muted-foreground leading-relaxed whitespace-pre-line line-clamp-4 break-words"
          >
            {renderDescriptionWithLinks(normalized)}
          </p>
          {needsExpand && (
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card via-card/80 to-transparent pointer-events-none" />
          )}
        </div>
        {needsExpand && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-3 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View more
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[min(85vh,85svh)] overflow-y-auto p-5 sm:p-6">
          <DialogTitle className="text-lg font-bold pr-8 leading-snug">
            {title || "Description"}
          </DialogTitle>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground -mt-1">
            Description
          </p>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line break-words">
            {renderDescriptionWithLinks(normalized)}
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 w-full sm:w-auto text-sm font-semibold text-primary hover:text-primary/80 transition-colors text-left"
          >
            View less
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
