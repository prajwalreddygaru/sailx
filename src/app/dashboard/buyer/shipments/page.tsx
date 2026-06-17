"use client";

import { Ship, MapPin, Package, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { shipments } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function ShipmentsPage() {
  return (
    <div>
      <PageHeader
        title="Shipment tracking"
        description="Container-level visibility, customs status, and live ETAs."
      />

      {/* World map placeholder */}
      <Card className="overflow-hidden mb-4">
        <CardHeader>
          <CardTitle>Global view</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[16/7] bg-gradient-to-br from-brand-950/50 via-card to-card rounded-lg overflow-hidden border">
            <div className="absolute inset-0 grid-bg opacity-10" />
            {/* Mock world dots */}
            <svg viewBox="0 0 800 350" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="route" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity="1" />
                </linearGradient>
              </defs>
              {/* Origin: Shanghai */}
              <circle cx="640" cy="135" r="6" fill="hsl(217 91% 60%)" className="animate-pulse-glow" />
              <circle cx="640" cy="135" r="14" fill="hsl(217 91% 60%)" opacity="0.2" />
              <text x="650" y="125" fill="currentColor" fontSize="10" className="font-mono">Shanghai</text>
              {/* Origin 2: Ningbo */}
              <circle cx="635" cy="145" r="5" fill="hsl(38 92% 50%)" className="animate-pulse-glow" />
              <circle cx="635" cy="145" r="12" fill="hsl(38 92% 50%)" opacity="0.2" />
              {/* Destination: Mumbai */}
              <circle cx="490" cy="180" r="6" fill="hsl(152 76% 40%)" />
              <text x="500" y="195" fill="currentColor" fontSize="10" className="font-mono">Mumbai</text>
              {/* Destination 2: Chennai */}
              <circle cx="510" cy="210" r="5" fill="hsl(152 76% 40%)" />
              {/* Routes */}
              <path d="M 640 135 Q 565 100 490 180" stroke="url(#route)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
              <path d="M 635 145 Q 575 130 510 210" stroke="url(#route)" strokeWidth="2" fill="none" strokeDasharray="4 4" opacity="0.6" />
            </svg>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" /> In transit (1)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Preparing (1)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" /> Delivered (1)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipment cards */}
      <div className="grid lg:grid-cols-2 gap-4">
        {shipments.map((sh) => (
          <Card key={sh.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-muted-foreground">{sh.orderCode}</div>
                  <CardTitle className="mt-0.5">{sh.carrier} · {sh.containerType}</CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">Tracking: <span className="font-mono">{sh.trackingNumber}</span></div>
                </div>
                <StatusBadge status={sh.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm mb-4">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Origin</div>
                  <div className="font-medium">{sh.origin}</div>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="flex-1 text-right">
                  <div className="text-xs text-muted-foreground">Destination</div>
                  <div className="font-medium">{sh.destination}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b">
                <div>
                  <div className="text-muted-foreground">Weight</div>
                  <div className="font-medium">{sh.weight}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">ETA</div>
                  <div className="font-medium">{formatDate(sh.eta)}</div>
                </div>
              </div>
              <div className="space-y-2">
                {sh.events.slice().reverse().map((e, i) => (
                  <div key={e.id} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className={`h-2 w-2 rounded-full ${i === 0 ? "bg-primary ring-4 ring-primary/20" : "bg-muted-foreground/30"}`} />
                      {i < sh.events.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="font-medium text-xs">{e.description}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-2.5 w-2.5" /> {e.location} · {formatDate(e.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
