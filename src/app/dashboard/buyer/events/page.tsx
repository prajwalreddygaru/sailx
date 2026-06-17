"use client";

import * as React from "react";
import { Calendar, MapPin, Ticket, IndianRupee, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Booking = {
  id: string; seats: number; totalAmount: number;
  paymentStatus: string; createdAt: string;
  event: {
    id: string; title: string; city: string; country: string;
    startDate: string; endDate: string; images: string[];
  };
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BuyerEventsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading,  setLoading]  = React.useState(true);

  React.useEffect(() => {
    fetch("/api/events/my-bookings")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setBookings(d); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Event Bookings"
        description="All your booked business tours and trade fair tickets."
      />

      {loading && (
        <div className="text-center py-16 text-muted-foreground text-sm">Loading bookings…</div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-24 text-muted-foreground gap-3">
          <Ticket className="h-16 w-16 opacity-10" />
          <div className="font-semibold text-lg">No bookings yet</div>
          <a href="/" className="text-primary text-sm font-semibold hover:underline">Browse upcoming events →</a>
        </div>
      )}

      <div className="grid gap-4">
        {bookings.map((b) => {
          const ended = new Date(b.event.endDate) < new Date();
          return (
            <Card key={b.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="h-20 w-24 rounded-xl bg-muted border border-border overflow-hidden shrink-0">
                    {b.event.images?.[0]
                      ? <img src={b.event.images[0]} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Calendar className="h-8 w-8 text-muted-foreground/20" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="font-black text-base">{b.event.title}</div>
                        <div className="flex items-center gap-3 text-muted-foreground text-xs mt-1 flex-wrap">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {b.event.city}, {b.event.country}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmt(b.event.startDate)} – {fmt(b.event.endDate)}</span>
                          <span className="flex items-center gap-1"><Ticket className="h-3 w-3" /> {b.seats} seat{b.seats > 1 ? "s" : ""}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0",
                        ended
                          ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}>
                        {ended ? "✅ Completed" : "🟢 Upcoming"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-0.5 font-black text-primary text-lg">
                        <IndianRupee className="h-4 w-4" />{b.totalAmount.toLocaleString("en-IN")}
                      </span>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full border",
                        b.paymentStatus === "PAID"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      )}>
                        {b.paymentStatus}
                      </span>
                      <span className="text-muted-foreground text-xs">Booked on {fmt(b.createdAt)}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {b.id}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
