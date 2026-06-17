"use client";

import * as React from "react";
import { Calendar, MapPin, Ticket, IndianRupee, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  seats: number;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  razorpayPaymentId?: string;
  event: {
    id: string;
    title: string;
    city: string;
    country: string;
    startDate: string;
    endDate: string;
    images: string[];
  };
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function isCompleted(endDate: string) {
  return new Date(endDate) < new Date();
}

function StatusBadge({ status, completed }: { status: string; completed: boolean }) {
  if (completed) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
        <CheckCircle2 className="h-3 w-3" /> Completed
      </span>
    );
  }
  if (status === "PAID") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Confirmed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
      <Clock className="h-3 w-3" /> {status}
    </span>
  );
}

export default function BookingHistoryPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [loading, setLoading]   = React.useState(true);
  const [tab, setTab]           = React.useState<"all" | "upcoming" | "completed">("all");

  React.useEffect(() => {
    fetch("/api/events/my-bookings")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setBookings(d); })
      .finally(() => setLoading(false));
  }, []);

  const visible = bookings.filter((b) => {
    const done = isCompleted(b.event.endDate);
    if (tab === "upcoming")  return !done;
    if (tab === "completed") return done;
    return true;
  });

  const completedCount = bookings.filter((b) => isCompleted(b.event.endDate)).length;
  const upcomingCount  = bookings.filter((b) => !isCompleted(b.event.endDate)).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking History"
        description={`${bookings.length} total booking${bookings.length !== 1 ? "s" : ""}`}
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {(["all", "upcoming", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize",
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
            {t === "upcoming"  && upcomingCount  > 0 && <span className="ml-1.5 text-xs bg-primary/10 text-primary rounded-full px-1.5">{upcomingCount}</span>}
            {t === "completed" && completedCount > 0 && <span className="ml-1.5 text-xs bg-muted-foreground/20 text-muted-foreground rounded-full px-1.5">{completedCount}</span>}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card/40 animate-pulse h-64" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && visible.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground rounded-2xl border-2 border-dashed border-border">
          <Ticket className="h-16 w-16 opacity-10" />
          <div className="font-semibold text-lg">
            {tab === "completed" ? "No completed tours yet" :
             tab === "upcoming"  ? "No upcoming bookings" :
             "No bookings yet"}
          </div>
          <p className="text-sm text-center max-w-xs">
            Book a business tour or trade fair from the home page to see it here.
          </p>
          <Button asChild variant="outline" size="sm">
            <a href="/#events">Browse Events</a>
          </Button>
        </div>
      )}

      {/* Bookings grid */}
      {!loading && visible.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((b) => {
            const done = isCompleted(b.event.endDate);
            const img  = b.event.images?.[0];
            return (
              <div
                key={b.id}
                className={cn(
                  "group relative flex flex-col rounded-2xl border overflow-hidden bg-card transition-all hover:shadow-lg",
                  done
                    ? "border-border/40 opacity-80 hover:opacity-100"
                    : "border-primary/20 shadow-sm hover:shadow-primary/10"
                )}
              >
                {/* Cover image */}
                <div className="relative h-40 overflow-hidden">
                  {img ? (
                    <img
                      src={img}
                      alt={b.event.title}
                      className={cn(
                        "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105",
                        done && "grayscale"
                      )}
                    />
                  ) : (
                    <div className={cn(
                      "w-full h-full flex items-center justify-center",
                      done
                        ? "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
                        : "bg-gradient-to-br from-primary/20 to-red-500/20"
                    )}>
                      <Ticket className={cn("h-12 w-12", done ? "text-gray-400" : "text-primary/40")} />
                    </div>
                  )}
                  {/* Overlay badge */}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={b.paymentStatus} completed={done} />
                  </div>
                  {done && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase">
                        Tour Completed
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={cn("p-4 flex flex-col gap-3 flex-1", done && "grayscale")}>
                  <div>
                    <h3 className="font-black text-base leading-snug line-clamp-2">{b.event.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {b.event.city}, {b.event.country}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{fmt(b.event.startDate)}</span>
                    <span className="text-border">→</span>
                    <span>{fmt(b.event.endDate)}</span>
                  </div>

                  {/* Details row */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{b.seats}</span> seat{b.seats > 1 ? "s" : ""}
                    </div>
                    <div className="flex items-center gap-0.5 font-black text-base text-primary">
                      <IndianRupee className="h-4 w-4" />
                      {b.totalAmount.toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Booking ID: {b.id.slice(0, 12).toUpperCase()}
                  </div>

                  {b.razorpayPaymentId && (
                    <div className="text-[10px] text-muted-foreground font-mono">
                      Payment: {b.razorpayPaymentId}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
