"use client";

import * as React from "react";

export function MemoriesMarquee({ images: initial }: { images?: string[] }) {
  const [imgs, setImgs] = React.useState<string[]>(initial ?? []);
  React.useEffect(() => {
    if (!initial || initial.length === 0) {
      (async () => {
        try {
          const r = await fetch("/api/memories");
          if (r.ok) {
            const arr = await r.json();
            if (Array.isArray(arr)) setImgs(arr);
          }
        } catch {}
      })();
    }
  }, [initial]);

  if (!imgs || imgs.length === 0) return null;

  // Duplicate images to create seamless loop
  const items = [...imgs, ...imgs];
  return (
    <div className="w-full overflow-hidden py-6 bg-background border-t">
      <div className="[--speed:40s] group relative">
        <div className="flex gap-4 animate-[marquee_var(--speed)_linear_infinite] group-hover:[animation-play-state:paused] will-change-transform">
          {items.map((src, i) => (
            <div key={i} className="h-24 sm:h-28 md:h-32 lg:h-36 aspect-video rounded-xl overflow-hidden border bg-muted shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
