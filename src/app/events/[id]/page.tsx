"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, IndianRupee, Users, Ticket, ChevronLeft,
  CheckCircle2, Loader2, ChevronDown, ChevronUp, Phone, Mail, User, X,
  Star, ChevronRight,
} from "lucide-react";
import { PoliciesAccordion } from "@/components/marketing/policies-accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us";
import { MarketingFooter } from "@/components/marketing/footer";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormattedText } from "@/components/formatted-text";
import { eventTypeLabel, parseEventType } from "@/lib/event-type";

declare global { interface Window { Razorpay: any; } }

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function TripOverviewSection({
  overview,
  heading,
}: {
  overview: string;
  heading?: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const previewRef = React.useRef<HTMLParagraphElement>(null);
  const [needsExpand, setNeedsExpand] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const check = () => setNeedsExpand(el.scrollHeight > el.clientHeight + 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [overview]);

  return (
    <>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 lg:p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-5 lg:h-6 bg-primary rounded-full" />
          <h2 className="text-base lg:text-lg font-bold">Trip Overview</h2>
        </div>
        <div className="relative rounded-xl border border-primary/10 bg-background/60 p-3 lg:p-4 overflow-hidden">
          <p
            ref={previewRef}
            className="line-clamp-[12] whitespace-pre-line text-sm text-foreground/80 leading-relaxed"
          >
            {overview.replace(/\r\n/g, "\n").replace(/\r/g, "\n")}
          </p>
          {needsExpand && (
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background/95 to-transparent pointer-events-none" />
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogTitle className="text-lg font-bold pr-8">Trip Overview</DialogTitle>
          {heading?.trim() && (
            <h3 className="text-base font-semibold text-foreground pr-8 -mt-1">
              {heading.trim()}
            </h3>
          )}
          <FormattedText
            text={overview}
            className="text-sm text-foreground/80 leading-relaxed"
          />
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

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event,    setEvent]    = React.useState<any>(null);
  const [loading,  setLoading]  = React.useState(true);
  const [seats,    setSeats]    = React.useState(1);
  const [booking,  setBooking]  = React.useState(false);
  const [success,  setSuccess]  = React.useState(false);
  const [bookingId, setBookingId] = React.useState("");
  const [error,    setError]    = React.useState("");
  const [imgIdx,   setImgIdx]   = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [days,     setDays]     = React.useState<any[]>([]);
  const [openDay,  setOpenDay]  = React.useState<number | null>(null);
  const [reviews,  setReviews]  = React.useState<any[]>([]);
  const [memDays,  setMemDays]  = React.useState<any[]>([]);
  const [tab, setTab] = React.useState<'IN' | 'EX'>('IN');

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/events/${id}`); const ev = await r.json(); setEvent(ev);
        const d = await fetch(`/api/events/${id}/itinerary`); if (d.ok) setDays(await d.json());
        const m = await fetch(`/api/events/${id}/memories`); if (m.ok) setMemDays(await m.json());
        const rv = await fetch(`/api/reviews`); if (rv.ok) setReviews(await rv.json());
      } catch { setError("Failed to load event."); }
      finally { setLoading(false); }
    })();
  }, [id]);

  function scrollToEnquiry() {
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const el = document.getElementById(isDesktop ? "enquiry-desktop" : "enquiry");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Event not found.</p>
      <BackButton preferHomeSection fallback="/#events" label="← Back to Home" className="text-base" />
    </div>
  );

  const avail = event.totalSeats - event.bookedSeats;
  const pct   = Math.min(100, Math.round((event.bookedSeats / event.totalSeats) * 100));
  const ended = new Date(event.endDate) < new Date();
  const bookingClosed = event.bookingEndDate ? new Date(event.bookingEndDate) < new Date() : false;
  const total = event.costPerSeat * seats;
  const tripDays = Math.max(1, Math.ceil((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000*60*60*24)) + 1);
  const tripNights = Math.max(0, tripDays - 1);
  const minAge = (event as any).minAge as number | undefined;
  const maxAge = (event as any).maxAge as number | undefined;
  const happyTravellers = (event as any).happyTravellers as number | undefined;
  const rawOverview = (event as any).overview as string | undefined | null;
  const overviewHeading = (event as any).overviewHeading as string | undefined | null;
  const overview =
    rawOverview && rawOverview !== "null" && String(rawOverview).trim()
      ? String(rawOverview).trim()
      : event.description?.trim() || undefined;
  const highlights = Array.isArray((event as any).highlights) ? (event as any).highlights as string[] : [];
  const inclusions = Array.isArray((event as any).inclusions) ? (event as any).inclusions as string[] : [];
  const exclusions = Array.isArray((event as any).exclusions) ? (event as any).exclusions as string[] : [];

  if (success) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4 max-w-md">
        <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto" />
        <h1 className="text-3xl font-black">Booking Confirmed!</h1>
        <p className="text-muted-foreground">Your seats for <strong>{event.title}</strong> are confirmed. A PDF receipt has been sent to your email.</p>
        <p className="text-sm text-muted-foreground font-mono">Booking ID: {bookingId}</p>
        <div className="flex gap-3 justify-center pt-2">
          <Button asChild><Link href="/dashboard/buyer/events">My Bookings</Link></Button>
          <Button asChild variant="outline"><Link href="/">← Home</Link></Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
        {/* Back */}
        <BackButton preferHomeSection fallback="/#events" label="Back to Home" className="mb-6" />

        {/* Images — mobile: hero + all thumbnails; desktop: mosaic grid */}
        {event.images?.length > 0 && (
          <>
            {/* Mobile layout */}
            <div className="sm:hidden space-y-3 mb-6">
              <div className="rounded-2xl overflow-hidden bg-muted aspect-[16/9] ring-1 ring-border/60 shadow-sm">
                <img
                  src={event.images[imgIdx] ?? event.images[0]}
                  alt={event.title}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                />
              </div>
              {event.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {event.images.map((img: string, i: number) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImgIdx(i)}
                      className={cn(
                        "rounded-xl overflow-hidden bg-muted aspect-[4/3] ring-2 transition-all",
                        imgIdx === i ? "ring-primary" : "ring-border/60"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop layout */}
            <div className="hidden sm:grid grid-cols-3 gap-3 md:gap-4 mb-6">
              <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden bg-muted aspect-[16/9] ring-1 ring-border/60 shadow-sm">
                <img
                  src={event.images[0]}
                  alt={event.title}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => { setImgIdx(0); setLightboxOpen(true); }}
                />
              </div>
              {event.images.slice(1).map((img: string, i: number) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-muted aspect-[16/9] ring-1 ring-border/60">
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => { setImgIdx(i + 1); setLightboxOpen(true); }}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Memories grid */}
        {ended && memDays.length > 0 && (
          <div className="mt-6 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Memories</h2>
            <div className="space-y-4">
              {memDays.map((md: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">Day {md.dayNumber || i + 1}</span>
                      {md.title && <span className="font-semibold">{md.title}</span>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {(md.images || []).map((img: string, j: number) => (
                      <div key={j} className="rounded-lg overflow-hidden bg-muted aspect-video">
                        <img src={img} alt="Memory" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start px-0">
          {/* Left: info */}
          <div className="space-y-6">
            <div>
              <span className={cn(
                "inline-flex items-center text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full mb-2",
                parseEventType(event.eventType) === "TRADE_FAIR"
                  ? "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                  : "bg-blue-500/10 text-blue-700 border border-blue-500/20"
              )}>
                {eventTypeLabel(event.eventType)}
              </span>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-snug">{event.title}</h1>
              <div className="flex flex-wrap gap-2 mt-3 text-[13px]">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-white">
                  <MapPin className="h-3.5 w-3.5" /> {event.country}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-white">
                  {tripDays}D/{tripNights}N
                </span>
                {(minAge || maxAge) && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-white">
                    {minAge ?? 0}–{maxAge ?? 99} Age
                  </span>
                )}
                {happyTravellers && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border bg-white">
                    {happyTravellers}+ Happy Travellers
                  </span>
                )}
              </div>
            </div>

            {/* Seats progress */}
            <div className="space-y-1.5 rounded-xl border border-border/70 bg-muted/30 p-4">
              <div className="flex justify-between text-sm font-semibold">
                <span>{event.bookedSeats} booked</span><span>{avail} remaining</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full transition-all",
                  pct >= 90 ? "bg-red-500" : pct >= 60 ? "bg-amber-500" : "bg-emerald-500")}
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-muted-foreground text-right">{pct}% full</div>
            </div>

            {/* Trip Overview — 12-line preview; full text in popup */}
            {overview && (
              <TripOverviewSection overview={overview} heading={overviewHeading} />
            )}

            {/* Mobile-only: price + scroll to enquiry form */}
            <div className="lg:hidden">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
                <div className="text-xs text-muted-foreground">Starting From</div>
                <div className="mt-1">
                  <div className="flex items-baseline gap-1 font-black text-3xl text-foreground">
                    <IndianRupee className="h-6 w-6" />{event.costPerSeat.toLocaleString("en-IN")}<span className="text-xs text-muted-foreground font-semibold">/person</span>
                  </div>
                  {event.mrp && event.mrp > event.costPerSeat && (
                    <div className="mt-1 text-sm text-muted-foreground line-through">₹{Number(event.mrp).toLocaleString("en-IN")}/person</div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={scrollToEnquiry}
                  className="mt-4 w-full h-11 font-bold rounded-xl bg-primary hover:bg-primary/90"
                >
                  Fill the form below
                </Button>
              </div>
            </div>

          </div>

          {/* Right: pricing + enquiry, sticky (desktop only) */}
          <div className="px-0 hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
                <div className="text-xs text-muted-foreground">Starting From</div>
                <div className="mt-1">
                  <div className="flex items-baseline gap-1 font-black text-3xl text-foreground">
                    <IndianRupee className="h-6 w-6" />{event.costPerSeat.toLocaleString("en-IN")}<span className="text-xs text-muted-foreground font-semibold">/person</span>
                  </div>
                  {event.mrp && event.mrp > event.costPerSeat && (
                    <div className="mt-1 text-sm text-muted-foreground line-through">₹{Number(event.mrp).toLocaleString("en-IN")}/person</div>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={scrollToEnquiry}
                  className="mt-4 w-full h-11 font-bold rounded-xl bg-primary hover:bg-primary/90"
                >
                  Fill the form below
                </Button>
              </div>

              <div id="enquiry-desktop" className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm scroll-mt-24">
                <div className="flex items-center gap-2 px-5 py-3 border-b bg-primary/5">
                  <span className="w-1.5 h-6 rounded-full bg-primary" />
                  <div>
                    <div className="text-lg font-bold">For Enquiry</div>
                    <div className="text-xs text-muted-foreground">{event.title}</div>
                  </div>
                </div>
                <div className="p-5">
                  <EnquiryForm eventId={String(id)} title={event.title} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip highlights + Trip details — full width */}
        {(highlights.length > 0 || inclusions.length > 0 || exclusions.length > 0) && (
          <div className="space-y-3 pt-6 border-t border-border/50 mt-6">
            {highlights.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-bold">Trip highlights</h2>
                </div>
                <ul className="grid gap-2 pl-0">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(inclusions.length > 0 || exclusions.length > 0) && (
              <div className="space-y-2 pt-6 md:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                    <h2 className="text-2xl md:text-3xl font-bold">Trip details</h2>
                  </div>
                  <div className="flex gap-1 rounded-lg border bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setTab('IN')}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-md",
                        tab === 'IN' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10"
                      )}
                    >
                      Inclusions
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('EX')}
                      className={cn(
                        "px-3 py-1.5 text-xs font-semibold rounded-md",
                        tab === 'EX' ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10"
                      )}
                    >
                      Exclusions
                    </button>
                  </div>
                </div>
                <ul className="grid gap-2 pl-0">
                  {(tab === 'IN' ? inclusions : exclusions).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {tab === 'IN'
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        : <X className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Itinerary — full width */}
        {days.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-border/50 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold">Itinerary</h2>
            </div>
            <div className="space-y-2.5">
              {days.map((d: any, i: number) => (
                <div key={i} className="rounded-2xl border border-primary/20 overflow-hidden">
                  <button
                    onClick={() => setOpenDay(openDay === i ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">Day {i + 1}</span>
                      <span className="font-semibold text-[15px]">
                        {d.heading ? (
                          <>
                            <span>{d.heading}</span>
                            <span className="px-1 text-muted-foreground">|</span>
                            <span>{d.title}</span>
                          </>
                        ) : (
                          d.title
                        )}
                      </span>
                    </div>
                    {openDay === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {openDay === i && (
                    <div className="px-4 py-3 text-sm text-muted-foreground bg-primary/5">
                      <FormattedText text={d.description || ""} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Policies & Terms — full width */}
        <div className="mt-8">
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b bg-primary/5">
              <span className="w-1.5 h-6 rounded-full bg-primary" />
              <div className="text-sm font-bold">Policies & Terms</div>
            </div>
            <PoliciesAccordion />
          </div>
        </div>

        {/* Mobile enquiry form — below page content */}
        <div id="enquiry" className="lg:hidden mt-8 scroll-mt-24">
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3 border-b bg-primary/5">
              <span className="w-1.5 h-6 rounded-full bg-primary" />
              <div>
                <div className="text-lg font-bold">For Enquiry</div>
                <div className="text-xs text-muted-foreground">{event.title}</div>
              </div>
            </div>
            <div className="p-5">
              <EnquiryForm eventId={String(id)} title={event.title} />
            </div>
          </div>
        </div>

        {/* Reviews section */}
        {reviews.length > 0 && <ReviewsSection reviews={reviews} />}

        {/* Lightbox overlay */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              key={imgIdx}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={event.images[imgIdx]}
              alt="Preview"
              className="max-w-[95vw] max-h-[90vh] object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
      {/* Why Choose Us */}
      <div className="mt-6">
        <WhyChooseUsSection />
      </div>

      <MarketingFooter />
    </div>
  );
}

/* ═══ REVIEWS SECTION ══════════════════════ */
function ReviewsSection({ reviews }: { reviews: any[] }) {
  const [idx, setIdx] = React.useState(0);
  const perPage = 2;
  const total = reviews.length;
  const pages = Math.ceil(total / perPage);
  const visible = reviews.slice(idx * perPage, idx * perPage + perPage);

  return (
    <section className="py-14 border-t border-border/50 bg-background">
      <div className="max-w-full">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-primary block" />
            <h2 className="text-2xl md:text-3xl font-black">Our Reviews</h2>
          </div>
          {/* Prev / Next arrows */}
          {total > perPage && (
            <div className="flex gap-2">
              <button
                onClick={() => setIdx((p) => Math.max(0, p - 1))}
                disabled={idx === 0}
                className={cn(
                  "h-9 w-9 rounded-full border flex items-center justify-center transition-colors",
                  idx === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-primary hover:text-white hover:border-primary"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIdx((p) => Math.min(pages - 1, p + 1))}
                disabled={idx === pages - 1}
                className={cn(
                  "h-9 w-9 rounded-full border flex items-center justify-center transition-colors",
                  idx === pages - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-primary hover:text-white hover:border-primary"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {visible.map((r) => (
            <div key={r.id} className="rounded-xl border bg-card p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Stars + count */}
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-4 w-4",
                        s <= r.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-medium">( {r.rating} Stars )</span>
              </div>

              {/* Review text with red left accent */}
              <div className="flex gap-3 flex-1">
                <div className="w-1 shrink-0 rounded-full bg-primary/70 self-stretch" />
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-6">{r.text}</p>
              </div>

              {/* Reviewer info at bottom */}
              <div className="flex items-center gap-3 pt-1 border-t border-border/50">
                <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                  <AvatarImage src={r.profileImage || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {r.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm leading-tight">{r.name}</div>
                  {r.subtitle && (
                    <div className="text-xs text-muted-foreground mt-0.5">{r.subtitle}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === idx ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function EnquiryForm({ eventId, title }: { eventId: string; title: string }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function submit() {
    setErr("");
    try {
      const r = await fetch(`/api/events/${eventId}/enquiries`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message })
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error ?? "Failed to submit"); return; }
      setSent(true);
    } catch { setErr("Network error"); }
  }

  if (sent) return (
    <div className="text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
      Thank you! We will contact you shortly about “{title}”.
    </div>
  );

  return (
    <div className="space-y-3">
      {err && <div className="text-xs text-destructive">{err}</div>}

      {/* Name */}
      <div className="relative">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Name"
          className="pl-10 h-11 rounded-xl"
        />
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Email */}
      <div className="relative">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email ID"
          className="pl-10 h-11 rounded-xl"
        />
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {/* Phone with country prefix (IN) */}
      <div className="flex gap-2">
        <div className="flex items-center gap-2 h-11 px-3 rounded-xl border bg-background text-sm">
          <span className="text-xl">🇮🇳</span>
          <span className="select-none">+91</span>
        </div>
        <div className="relative flex-1">
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="pl-10 h-11 rounded-xl"
          />
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Message */}
      <div className="relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`I am interested in ${title}…`}
          className="pl-10 h-11 rounded-xl"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      <Button onClick={submit} className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 font-semibold">
        Submit Now
      </Button>
    </div>
  );
}
