"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, MapPin, ChevronLeft, ChevronRight,
  Clock, Search, Users, Sparkles, IndianRupee, Zap,
  Calendar, Ticket, CheckCircle2, Globe2, ArrowRight,
  ShieldCheck, TrendingUp, Award, ChevronDown, ShoppingBag,
  Package, MessageSquare, ScanSearch, CreditCard, HandshakeIcon,
  BadgeCheck, PhoneCall,
  Youtube, Instagram, Volume2, VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ServiceConsultForm } from "@/components/marketing/service-consult-form";
import { MemoriesMarquee } from "@/components/marketing/memories-marquee";
import { EnquiryForm } from "@/components/marketing/enquiry-form";
import { eventTypeLabel, parseEventType } from "@/lib/event-type";
import { markReturnHomeSection, saveScrollForRoute } from "@/lib/scroll-storage";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function eventStatus(ev: any): "active" | "completed" {
  return new Date(ev.endDate) < new Date() ? "completed" : "active";
}

// Simple client-side retry to smooth out occasional cold-start 404s in dev
async function fetchWithRetry(url: string, init?: RequestInit, tries = 2): Promise<Response> {
  let lastErr: any;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, init);
      if (res.ok) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 250 * (i + 1)));
  }
  throw lastErr;
}

/* ═══ BANNER CAROUSEL ════════════════════ */
function HeroBanner({ banners }: { banners: any[] }) {
  const list = banners.map((b: any) => ({
    id: b.id,
    imageUrl: b.imageUrl,
    titleHighlight: b.titleHighlight ?? b.badge ?? "",
    title: b.title ?? "",
    sub: b.subtitle ?? b.sub ?? "",
    cta: b.ctaLabel ?? b.cta ?? "View Package Details",
    ctaHref: b.ctaHref ?? "/#events",
  }));

  const [idx, setIdx] = React.useState(0);
  const total = list.length;

  React.useEffect(() => {
    if (total === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  const item = list[idx];

  if (total === 0) return null;

  return (
    <div
      className="relative max-w-none overflow-hidden bg-slate-950 min-h-[460px] sm:min-h-[520px] md:h-[100svh] -mx-[calc(50vw-50%)]"
    >
      {/* All banner images stacked — CSS opacity toggle for instant first paint */}
      {list.map((b, i) => (
        <div
          key={b.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-out",
            i === idx ? "opacity-100 z-[1]" : "opacity-0 z-0"
          )}
        >
          <img
            src={b.imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </div>
      ))}

      {/* Carousel arrows — desktop only (mobile uses dots + auto-rotate) */}
      <button
        onClick={() => setIdx((idx - 1 + total) % total)}
        aria-label="Previous"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center backdrop-blur-sm transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => setIdx((idx + 1) % total)}
        aria-label="Next"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center backdrop-blur-sm transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Bottom content area */}
      <div className="absolute bottom-0 inset-x-0 z-10 pb-10 pt-16 md:pb-14 md:pt-20">
        {list.map((b, i) => (
          <div
            key={b.id}
            className={cn(
              "flex flex-col items-center text-center px-4 transition-all duration-500 ease-out",
              i === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-x-0 pointer-events-none"
            )}
          >
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-black text-white drop-shadow-xl leading-tight max-w-4xl">
              <span className="text-yellow-400">{b.titleHighlight}</span>
              {b.title && <span className="font-semibold"> {b.title}</span>}
            </h2>

            {/* Sub / price */}
            {b.sub && (
              <p className="mt-3 text-white/90 text-base md:text-lg font-medium">
                {b.sub}
              </p>
            )}

            {/* CTA button */}
            <Button
              asChild
              size="lg"
              className="mt-5 bg-primary hover:bg-primary/90 text-white font-bold px-6 sm:px-9 h-10 sm:h-12 rounded-xl shadow-2xl text-sm sm:text-base"
            >
              <Link href={b.ctaHref ?? "/#events"}>
                {b.cta ?? "View Package Details"}
              </Link>
            </Button>
          </div>
        ))}

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-5">
          {list.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                "rounded-full transition-all duration-300",
                i === idx ? "w-8 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>

        
        
      </div>
    </div>
  );
}


/* ═══ EVENT CARD ══════════════════════════ */
function EventCard({ ev, index }: { ev: any; index: number }) {
  const st = eventStatus(ev);
  const avail = ev.totalSeats - ev.bookedSeats;
  const pct = ev.totalSeats > 0 ? Math.min(100, Math.round((ev.bookedSeats / ev.totalSeats) * 100)) : 0;
  const isActive = st === "active" && ev.isActive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 200, damping: 22 }}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden bg-card border",
        "hover:shadow-2xl hover:-translate-y-2 transition-all duration-300",
        isActive ? "border-red-500/30 shadow-red-500/10 shadow-md" : "border-border"
      )}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-slate-800 to-slate-700">
        {ev.images?.[0]
          ? <img src={ev.images[0]} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <Calendar className="h-14 w-14 text-white/10" />
            </div>
          )
        }
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Event type / status badge */}
        {isActive ? (
          <span className={cn(
            "absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm border",
            parseEventType(ev.eventType) === "TRADE_FAIR"
              ? "bg-purple-500/90 text-white border-purple-400/50"
              : "bg-blue-500/90 text-white border-blue-400/50"
          )}>
            {eventTypeLabel(ev.eventType)}
          </span>
        ) : (
          <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm border bg-zinc-800/80 text-zinc-300 border-zinc-600/40">
            Completed
          </span>
        )}

        {/* Seats badge */}
        {isActive && (
          <span className={cn(
            "absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm border",
            avail === 0
              ? "bg-red-600/90 text-white border-red-400/50"
              : avail <= 5
              ? "bg-orange-500/90 text-white border-orange-400/50"
              : "bg-black/50 text-white/90 border-white/15"
          )}>
            {avail === 0 ? "Sold Out" : `${avail} seats left`}
          </span>
        )}

        {/* No price overlay; shown in body below to match reference */}
      </div>

      {/* Body — detailed ref style */}
      <div className="flex flex-col flex-1 p-6 gap-3 border-t border-border">
        {/* Title */}
        <h3 className="font-black text-base sm:text-lg md:text-xl leading-snug line-clamp-2">{ev.title}</h3>

        {/* Price block */}
        {(() => {
          const mrp = ev.mrp && Number(ev.mrp) > Number(ev.costPerSeat) ? Number(ev.mrp) : null;
          return (
            <div className="flex items-end gap-3">
              <div className="flex flex-col">
                {mrp && (
                  <div className="text-[11px] text-muted-foreground line-through">Price ₹{mrp.toLocaleString("en-IN")}/pp</div>
                )}
                <div className="text-xl font-extrabold tracking-tight text-foreground">₹{ev.costPerSeat?.toLocaleString("en-IN")}<span className="text-xs font-semibold text-muted-foreground">/pp</span></div>
              </div>
              <span className={cn(
                "ml-auto inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border",
                avail === 0
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              )}>
                {avail === 0 ? "Sold Out" : `${avail} Seats Left`}
              </span>
            </div>
          );
        })()}

        {/* Route + Duration */}
        {(() => {
          const sd = new Date(ev.startDate);
          const ed = new Date(ev.endDate);
          const days = Math.max(1, Math.round((Number(ed) - Number(sd)) / 86400000) + 1);
          const nights = Math.max(0, days - 1);
          return (
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />Bengaluru – {ev.city}, {ev.country}</div>
              <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" />{days} Days / {nights} Nights</div>
            </div>
          );
        })()}

        {/* Date pill + tagline */}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] bg-muted/40 shrink-0">
            <Calendar className="h-3.5 w-3.5 text-primary" /> {new Date(ev.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
          </div>
          <div className="flex-1 min-h-[32px] rounded-md bg-muted/50 border border-border/60 px-3 py-1 text-[11px] text-muted-foreground flex items-center leading-normal">
            <span className="line-clamp-2 md:line-clamp-none">
              {ev.happyTravellers
                ? `${ev.happyTravellers}+ travelers can't be wrong — book your trip today!`
                : "Book your trip today!"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <button className="inline-flex items-center justify-center h-10 rounded-xl border font-semibold text-[14px] hover:bg-accent transition-colors w-full">
                <PhoneCall className="h-4 w-4 mr-2" /> Call
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogTitle className="sr-only">Enquiry</DialogTitle>
              <div className="space-y-2">
                <div className="text-sm font-bold">For Enquiry</div>
                <EnquiryForm eventId={ev.id} title={ev.title} />
              </div>
            </DialogContent>
          </Dialog>

          <Button asChild className="h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[14px]">
            <Link href={`/events/${ev.id}`}>View More</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}


/* ═══ FAQ ITEM ════════════════════════════ */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 px-1 text-left group"
      >
        <span className={cn("font-medium text-sm leading-snug transition-colors", open ? "text-primary" : "text-foreground group-hover:text-primary")}>
          {question}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180 text-primary")} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="pb-4 px-1 text-sm text-muted-foreground leading-relaxed"
        >
          {answer}
        </motion.div>
      )}
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
    <section className="py-8 md:py-14 border-t border-border/50 bg-background">
      <div className="container">
        {/* Header row */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
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

/* ═══ SERVICES SECTION ════════════════════ */
const SERVICES = [
  {
    icon:        Package,
    number:      "01",
    title:       "End-to-End Product Sourcing",
    short:       "Full-cycle import support",
    description: "We help Indian businesses source products from China with complete support — from supplier identification to final delivery coordination. Includes product research, price comparison, order follow-up, inspection coordination, and shipping support.",
    gradient:    "from-blue-600 to-cyan-500",
    bg:          "bg-blue-500/10",
    border:      "hover:border-blue-500/40",
    glow:        "group-hover:shadow-blue-500/10",
    image:       "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon:        Globe2,
    number:      "02",
    title:       "China-Side Sourcing Support",
    short:       "On-ground supplier access",
    description: "For clients who already know what they want to import, we provide on-ground sourcing support in China. We connect with suppliers, collect quotations, verify supplier details, compare options, and help clients make better purchasing decisions.",
    gradient:    "from-red-500 to-orange-500",
    bg:          "bg-red-500/10",
    border:      "hover:border-red-500/40",
    glow:        "group-hover:shadow-red-500/10",
    image:       "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon:        MessageSquare,
    number:      "03",
    title:       "Translation & Business Communication",
    short:       "4-language bridge support",
    description: "Chinese / English / Hindi / Kannada translation support for supplier communication, business meetings, factory discussions, trade fair visits, and product conversations. Avoid misunderstandings — communicate clearly with Chinese suppliers.",
    gradient:    "from-violet-600 to-purple-500",
    bg:          "bg-violet-500/10",
    border:      "hover:border-violet-500/40",
    glow:        "group-hover:shadow-violet-500/10",
    image:       "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon:        ScanSearch,
    number:      "04",
    title:       "Factory Inspections & Quality Checks",
    short:       "On-site verification & reports",
    description: "We visit factories or supplier locations in China to verify products, check production status, inspect packaging, review quality, and provide photos, videos, and detailed reports before shipment — reducing your risk before releasing payment.",
    gradient:    "from-emerald-600 to-teal-500",
    bg:          "bg-emerald-500/10",
    border:      "hover:border-emerald-500/40",
    glow:        "group-hover:shadow-emerald-500/10",
    image:       "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon:        CreditCard,
    number:      "05",
    title:       "Supplier Payment Support",
    short:       "Safe & verified payment coordination",
    description: "We assist clients with supplier payment coordination in China after proper verification and confirmation. This service helps clients manage payments more safely and smoothly when dealing with Chinese suppliers.",
    gradient:    "from-yellow-500 to-amber-500",
    bg:          "bg-yellow-500/10",
    border:      "hover:border-yellow-500/40",
    glow:        "group-hover:shadow-yellow-500/10",
    image:       "https://images.unsplash.com/photo-1605901309584-818e2594ec6a?auto=format&fit=crop&w=900&q=80",
    imageStrong: true,
  },
  {
    icon:        HandshakeIcon,
    number:      "06",
    title:       "Price Negotiation Support",
    short:       "Better deals, fair terms",
    description: "We help clients negotiate with Chinese suppliers for better pricing, MOQ, packaging terms, payment terms, and delivery timelines. Our goal is to help clients get a fair deal while maintaining a professional relationship with the supplier.",
    gradient:    "from-pink-600 to-rose-500",
    bg:          "bg-pink-500/10",
    border:      "hover:border-pink-500/40",
    glow:        "group-hover:shadow-pink-500/10",
    image:       "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
  },
];

function ServicesSection() {
  const router = useRouter();
  const [active, setActive] = React.useState<number | null>(null);
  const [dbServices, setDbServices] = React.useState<any[] | null>(null);
  const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/api/services");
        if (!r.ok) return; // fallback to static
        const arr = await r.json();
        if (mounted && Array.isArray(arr) && arr.length) setDbServices(arr);
      } catch { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, []);

  // Icons removed from Services cards; using background imagery and typography only

  const list = React.useMemo(() => {
    if (!dbServices || !dbServices.length) return SERVICES;
    const palette = [
      { gradient: "from-blue-600 to-cyan-500", bg: "bg-blue-500/10", border: "hover:border-blue-500/40", glow: "group-hover:shadow-blue-500/10" },
      { gradient: "from-red-500 to-orange-500", bg: "bg-red-500/10", border: "hover:border-red-500/40", glow: "group-hover:shadow-red-500/10" },
      { gradient: "from-violet-600 to-purple-500", bg: "bg-violet-500/10", border: "hover:border-violet-500/40", glow: "group-hover:shadow-violet-500/10" },
      { gradient: "from-emerald-600 to-teal-500", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/40", glow: "group-hover:shadow-emerald-500/10" },
      { gradient: "from-yellow-500 to-amber-500", bg: "bg-yellow-500/10", border: "hover:border-yellow-500/40", glow: "group-hover:shadow-yellow-500/10" },
      { gradient: "from-pink-600 to-rose-500", bg: "bg-pink-500/10", border: "hover:border-pink-500/40", glow: "group-hover:shadow-pink-500/10" },
    ];
    return dbServices.map((s, i) => {
      const pal = palette[i % palette.length];
      return {
        // icon removed
        number: String((i + 1)).padStart(2, "0"),
        title: s.title,
        short: s.short || "",
        description: s.description || "",
        gradient: pal.gradient,
        bg: pal.bg,
        border: pal.border,
        glow: pal.glow,
        image: s.imageUrl || "",
        imageStrong: i === 4, // keep visual parity with existing styles
        slug: s.slug,
      };
    });
  }, [dbServices]);

  return (
    <section id="services" className="relative py-8 md:py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-950/5 to-background pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3 md:mb-5">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">What We Do</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black leading-tight mb-4">
            Our&nbsp;
            <span className="bg-gradient-to-r from-primary via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            From supplier discovery to final delivery — we provide end-to-end sourcing support for Indian businesses looking to import from China.
          </p>
        </motion.div>

        {/* Mobile: compact 2-col */}
        <div className="grid grid-cols-2 gap-4 sm:hidden">
          {list.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              onClick={() => {
                saveScrollForRoute();
                markReturnHomeSection("services");
                router.push(`/services/${(svc as any).slug || toSlug(svc.title)}`, { scroll: false });
              }}
              className={cn(
                "group relative flex flex-col rounded-2xl border border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-4 cursor-pointer h-full min-h-[100px]",
                "transition-all duration-300 shadow hover:shadow-xl overflow-hidden hover:-translate-y-0.5",
                svc.border
              )}
            >
              {svc.image && (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out scale-100 group-hover:scale-110 pointer-events-none opacity-[0.30] group-hover:opacity-[0.50] z-0"
                    style={{ backgroundImage: `url(${svc.image})` }}
                  />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-b pointer-events-none z-0",
                    svc.imageStrong ? "from-background/30 via-background/20 to-background/5" : "from-background/60 via-background/25 to-background/5"
                  )} />
                </>
              )}
              <div className="absolute top-3 right-3 text-[10px] font-black text-foreground/40 tabular-nums tracking-tight select-none z-10 bg-background/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                {svc.number}
              </div>
              <h3 className="text-sm font-black leading-snug group-hover:text-primary transition-colors duration-200 z-10 flex items-center h-full pr-8">
                {svc.title}
              </h3>
            </motion.div>
          ))}
        </div>

        {/* Desktop: original card grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {list.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => {
                saveScrollForRoute();
                markReturnHomeSection("services");
                router.push(`/services/${(svc as any).slug || toSlug(svc.title)}`, { scroll: false });
              }}
              className={cn(
                "group relative flex flex-col rounded-2xl border border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md p-7 cursor-pointer h-full",
                "transition-all duration-300 shadow hover:shadow-xl overflow-hidden hover:-translate-y-0.5",
                svc.border,
                active === i ? `shadow-2xl ${svc.glow}` : ""
              )}
            >
              {/* Background Image with gradient mask */}
              {svc.image && (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out scale-100 group-hover:scale-110 pointer-events-none opacity-[0.25] group-hover:opacity-[0.45] z-0"
                    style={{ backgroundImage: `url(${svc.image})` }}
                  />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-b pointer-events-none z-0",
                    svc.imageStrong ? "from-background/30 via-background/20 to-background/5" : "from-background/60 via-background/25 to-background/5"
                  )} />
                </>
              )}

              {/* Number badge */}
              <div className="absolute top-5 right-5 text-xs font-black text-foreground/40 tabular-nums tracking-tight select-none z-10 bg-background/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                {svc.number}
              </div>

              {/* Tag */}
              <div className={cn(
                "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest mb-3 z-10",
                "opacity-60 group-hover:opacity-100"
              )}>
                <span className={cn("h-1 w-4 rounded-full bg-gradient-to-r", svc.gradient)} />
                {svc.short}
              </div>

              {/* Title */}
              <h3 className="text-xl font-black leading-snug mb-2 group-hover:text-primary transition-colors duration-200 z-10">
                {svc.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 z-10">
                {svc.description}
              </p>

              {/* Learn more */}
              <div className={cn(
                "flex items-center gap-1 mt-4 text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors duration-200 z-10"
              )}>
                <span>Learn more</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>

              {/* Bottom gradient line */}
              <div className={cn(
                "absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                svc.gradient
              )} />
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 md:mt-14 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-white/10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <PhoneCall className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Ready to Source?</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Let's find the right product for your business
            </h3>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              Talk to our sourcing team today — no commitment, just clarity on how we can help you import smarter from China.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="h-12 px-7 font-bold rounded-xl shadow-lg shadow-primary/30 bg-red-600 hover:bg-red-700 text-white cursor-pointer w-full sm:w-auto">
                  Get Started Free
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-0 overflow-y-auto max-h-[90svh] border-none bg-transparent">
                <DialogTitle className="sr-only">Consultation</DialogTitle>
                <ServiceConsultForm />
              </DialogContent>
            </Dialog>
            <Button asChild size="lg" className="h-12 px-7 font-bold rounded-xl border border-white/20 bg-transparent text-white hover:bg-white/10 w-full sm:w-auto">
              <Link href="/#events">View Tours</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══ SOCIAL MEDIA SECTION ═════════════════ */
/* ─── CUSTOM SCROLL PLAYERS ──────────────── */
function YouTubePlayer({ url }: { url: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<any>(null);
  const [muted, setMuted] = React.useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const uidRef = React.useRef<string>(`vp-${Math.random().toString(36).slice(2)}`);
  const containerId = `yt-player-${uidRef.current}`;
  const [fallback, setFallback] = React.useState(false);
  const [ytError, setYtError] = React.useState<number | null>(null);
  const [loadFailed, setLoadFailed] = React.useState(false);
  const SIMPLE = true;

  const getVideoId = (urlStr: string) => {
    try {
      const u = new URL(urlStr);
      const host = u.hostname.replace(/^www\./, "");
      const parts = u.pathname.split("/").filter(Boolean);
      // Standard watch URL
      if (u.searchParams.get("v")) return u.searchParams.get("v") as string;
      // youtu.be short links: /VIDEOID
      if (host === "youtu.be" && parts.length >= 1) return parts[0];
      // /shorts/VIDEOID, /embed/VIDEOID, /live/VIDEOID
      if (["shorts", "embed", "live", "vi"].includes(parts[0]) && parts[1]) return parts[1];
      // Fallback to last non-empty segment
      if (parts.length) return parts[parts.length - 1];
      return "";
    } catch {
      return "";
    }
  };

  const videoId = getVideoId(url) || "BhidBQI0bBM"; // Default premium trade show/sourcing tour video

  React.useEffect(() => {
    if (!videoId) return;
    if (SIMPLE) return;

    const win = window as any;

    // Load YT API
    if (!win.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      try { if (playerRef.current?.destroy) playerRef.current.destroy(); } catch {}
      playerRef.current = new win.YT.Player(containerId, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 1,
          loop: 1,
          playlist: videoId,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: (win.location && win.location.origin) ? win.location.origin : undefined,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
            try {
              const iframe = event?.target?.getIframe?.();
              if (iframe) iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
            } catch {}
          },
          onError: (e: any) => {
            const code = typeof e?.data === "number" ? e.data : null;
            setYtError(code);
          },
        },
      });
    };

    if (win.YT && win.YT.Player) {
      initPlayer();
    } else {
      const prevCallback = win.onYouTubeIframeAPIReady;
      win.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    const t = setTimeout(() => {
      try {
        if (!(win.YT && win.YT.Player)) setFallback(true);
      } catch { setFallback(true); }
    }, 2500);

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      clearTimeout(t);
    };
  }, [videoId]);

  React.useEffect(() => {
    if (SIMPLE) return;
    if (!playerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!playerRef.current || !playerRef.current.playVideo) return;
        if (entry.isIntersecting) {
          playerRef.current.playVideo();
          setIsPlaying(true);
        } else {
          playerRef.current.pauseVideo();
          setIsPlaying(false);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [videoId]);

  // SIMPLE mode: mark playing immediately since iframe handles its own lifecycle
  React.useEffect(() => {
    if (!SIMPLE) return;
    setIsPlaying(true);
    setLoadFailed(false);
  }, [videoId, SIMPLE]);

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (muted) {
      playerRef.current.unMute();
      setMuted(false);
    } else {
      playerRef.current.mute();
      setMuted(true);
    }
  };

  const handleUserPlay = () => {
    try {
      if (playerRef.current && typeof playerRef.current.playVideo === "function") {
        playerRef.current.playVideo();
      }
    } catch {}
  };

  const ytBase = "https://www.youtube-nocookie.com";
  const embedSrc = `${ytBase}/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1&playlist=${videoId}&loop=1`;

  // API failed to load: use lightweight iframe embed
  if (fallback) {
    const src = `${ytBase}/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&playsinline=1&loop=1&playlist=${videoId}&rel=0`;
    return (
      <div ref={containerRef} className="relative w-full h-full aspect-video rounded-2xl overflow-hidden bg-black group border shadow-md">
        <iframe
          key={videoId}
          src={src}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          loading="lazy"
          title="YouTube video"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  // Unembeddable or unavailable: show clickable thumbnail
  if (ytError !== null || loadFailed) {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    return (
      <a href={watchUrl} target="_blank" rel="noopener noreferrer"
         className="relative block w-full h-full aspect-video rounded-2xl overflow-hidden bg-black border shadow-md">
        <img src={thumbUrl} alt="Open on YouTube" className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold shadow">Open on YouTube</span>
        </div>
      </a>
    );
  }

  return (
    <div ref={containerRef} onClick={handleUserPlay} className="relative w-full h-full aspect-video rounded-2xl overflow-hidden bg-black group border shadow-md cursor-pointer">
      {SIMPLE ? (
        <iframe key={videoId} src={embedSrc} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <div id={containerId} className="w-full h-full" />
      )}
      
      {!SIMPLE && (
        <>
          {/* Speaker Toggle Button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-black/75 hover:bg-black text-white backdrop-blur-md transition-all shadow-md hover:scale-105 active:scale-95"
          >
            {muted ? <VolumeX className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5 text-red-500" />}
          </button>
          {muted && isPlaying && (
            <span className="absolute top-4 left-4 bg-black/40 text-[10px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm select-none">
              Muted Autoplay
            </span>
          )}
        </>
      )}
    </div>
  );
}

function InstagramPlayer({ url }: { url: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = React.useState(true);
  const [isDirectVideo, setIsDirectVideo] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);

  // If no URL is provided, we use a beautiful default vertical logistics/sourcing mp4 video!
  const targetUrl = url || "https://assets.mixkit.co/videos/preview/mixkit-modern-warehouse-with-shelves-and-boxes-39967-large.mp4";

  React.useEffect(() => {
    const isVideo = /\.(mp4|webm|mov|ogg|m4v)/i.test(targetUrl) || targetUrl.includes("assets.mixkit.co") || targetUrl.includes("supabase.co") || targetUrl.includes("cloudinary.com");
    setIsDirectVideo(isVideo);
  }, [targetUrl]);

  React.useEffect(() => {
    if (!isDirectVideo || !videoRef.current) return;

    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    };

    playVideo();

    const t = setTimeout(playVideo, 150);
    return () => clearTimeout(t);
  }, [isDirectVideo, targetUrl]);

  // Ensure Instagram embeds are processed when using permalink embeds
  React.useEffect(() => {
    if (isDirectVideo) return;
    const tryProcess = () => {
      const win = window as any;
      if (win.instgrm && win.instgrm.Embeds && typeof win.instgrm.Embeds.process === "function") {
        win.instgrm.Embeds.process();
      }
    };
    tryProcess();
    const t = setTimeout(tryProcess, 500);
    return () => clearTimeout(t);
  }, [isDirectVideo, targetUrl]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  if (!isDirectVideo) {
    const isYouTube = /(?:youtube\.com|youtu\.be)/i.test(targetUrl);
    if (isYouTube) {
      const getYtId = (urlStr: string) => {
        try {
          const u = new URL(urlStr);
          const host = u.hostname.replace(/^www\./, "");
          const parts = u.pathname.split("/").filter(Boolean);
          if (u.searchParams.get("v")) return u.searchParams.get("v") as string;
          if (host === "youtu.be" && parts.length >= 1) return parts[0];
          if (["shorts", "embed", "live", "vi"].includes(parts[0]) && parts[1]) return parts[1];
          if (parts.length) return parts[parts.length - 1];
          return "";
        } catch { return ""; }
      };
      const vid = getYtId(targetUrl) || "BhidBQI0bBM";
      const src = `https://www.youtube.com/embed/${vid}?autoplay=1&mute=1&controls=1&modestbranding=1&playsinline=1&loop=1&playlist=${vid}&rel=0`;
      return (
        <div className="relative max-w-[340px] mx-auto group border rounded-[2rem] p-3 shadow-md bg-card">
          <div className="rounded-[1.4rem] bg-background overflow-hidden relative aspect-[9/16] border flex flex-col justify-center bg-black">
            <div className="w-full aspect-video">
              <iframe
                key={src}
                src={src}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                loading="lazy"
                title="YouTube video"
              />
            </div>
          </div>
        </div>
      );
    }

    // Enforce Instagram-only: if not an Instagram URL, show a friendly note
    const isInstagram = /(?:instagram\.com)/i.test(targetUrl);
    if (!targetUrl || !isInstagram) {
      return (
        <div className="relative max-w-[340px] mx-auto group border rounded-[2rem] p-3 shadow-md bg-card">
          <div className="rounded-[1.4rem] bg-background overflow-hidden relative aspect-[9/16] border flex items-center justify-center p-4">
            <div className="text-center text-xs text-muted-foreground">
              Please provide a valid Instagram reel/post URL in Admin → Social to display here.
            </div>
          </div>
        </div>
      );
    }

    const getIgEmbedSrc = (u: string) => {
      try {
        const url = new URL(u);
        const parts = url.pathname.split("/").filter(Boolean);
        if (parts[0] === "reel" && parts[1]) return `https://www.instagram.com/reel/${parts[1]}/embed`;
        if (parts[0] === "p" && parts[1]) return `https://www.instagram.com/p/${parts[1]}/embed`;
        if (parts[0] === "tv" && parts[1]) return `https://www.instagram.com/tv/${parts[1]}/embed`;
      } catch {}
      return null;
    };
    const embedSrc = getIgEmbedSrc(targetUrl);
    return (
      <div className="relative max-w-[340px] mx-auto group border rounded-[2rem] p-3 shadow-md bg-card">
        <div className="rounded-[1.4rem] bg-background overflow-hidden relative aspect-[9/16] border">
          {embedSrc ? (
            <>
              {/* Shift iframe up to crop Instagram embed header */}
              <iframe
                key={embedSrc}
                src={embedSrc}
                className="absolute -top-14 left-0 w-full h-[calc(100%+3.5rem)]"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title="Instagram embed"
                scrolling="no"
              />
            </>
          ) : (
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={targetUrl}
              data-instgrm-version="14"
              key={targetUrl}
              style={{ background: '#fff', width: '100%', minWidth: '100%', border: 0, boxShadow: 'none', margin: '0 auto' }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative max-w-[340px] mx-auto group">
      {/* Phone frame mock */}
      <div className="rounded-[2.2rem] border border-black/15 shadow-xl p-3 bg-black/5 dark:bg-white/5 backdrop-blur-sm">
        <div className="rounded-[1.6rem] bg-background overflow-hidden relative aspect-[9/16] border">
          <video
            ref={videoRef}
            src={targetUrl}
            muted={true}
            loop
            playsInline
            autoPlay
            onClick={() => { try { videoRef.current?.play(); } catch {} }}
            className="w-full h-full object-cover"
          />
          
          {muted && isPlaying && (
            <span className="absolute top-4 left-4 bg-black/40 text-[10px] font-black text-white px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm select-none">
              Muted Autoplay
            </span>
          )}

          {/* Floating speaker toggle button */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-black/75 hover:bg-black text-white backdrop-blur-md transition-all shadow-md hover:scale-105 active:scale-95"
          >
            {muted ? <VolumeX className="h-5 w-5 animate-pulse" /> : <Volume2 className="h-5 w-5 text-pink-500" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function SocialMediaSection({ data }: { data: any }) {
  const yt = data?.youtubeVideoUrl as string | null;
  const yt2 = (data?.youtubeAltVideoUrl as string | null) || "https://www.youtube.com/watch?v=BhidBQI0bBM";
  const ig = data?.instagramReelUrl as string | null;
  const ytc = (data?.youtubeChannels ?? []) as any[];
  const iga = (data?.instagramAccounts ?? []) as any[];
  const ytThumb = (u: string) => {
    try {
      if (!u) return "";
      const m = u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
      const id = m?.[1];
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
    } catch { return ""; }
  };

  return (
    <section id="social" className="py-8 md:py-14 border-t border-border/50 bg-muted/10 overflow-hidden">
      <div className="container">
        <div className="mb-6 md:mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3">
            <span className="h-1.5 w-4 rounded-full bg-primary" />
            <span className="text-sm font-extrabold text-primary uppercase tracking-widest">Our Social Media</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black">Follow us:</h2>
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 gap-8 items-start">
          {/* YouTube Section */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Featured Videos</div>
              <div className="space-y-3 max-w-[520px] mx-auto w-full">
                <div className="h-[200px] md:h-[240px] lg:h-[300px]"><YouTubePlayer key={`yt1-${yt || ""}`} url={yt || ""} /></div>
                <div className="h-[200px] md:h-[240px] lg:h-[300px]"><YouTubePlayer key={`yt2-${yt2 || ""}`} url={yt2 || ""} /></div>
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">YouTube Channels</div>
              {ytc.length === 0 ? (
                <div className="text-xs text-muted-foreground">No channels added.</div>
              ) : (
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {ytc.map((c: any) => (
                    <li key={c.id} className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-accent/60 transition-colors">
                      <Youtube className="h-3.5 w-3.5 text-red-500" />
                      <a href={c.url} target="_blank" className="text-[13px] font-medium hover:underline">{c.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Instagram Section */}
          <div className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col justify-between h-full min-h-[460px]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Featured Reel</div>
              <div className="max-w-[520px] mx-auto w-full">
                <InstagramPlayer url={ig || ""} />
              </div>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Instagram Accounts</div>
              {iga.length === 0 ? (
                <div className="text-xs text-muted-foreground">No accounts added.</div>
              ) : (
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {iga.map((c: any) => (
                    <li key={c.id} className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-accent/60 transition-colors">
                      <Instagram className="h-3.5 w-3.5 text-pink-500" />
                      <a href={c.url} target="_blank" className="text-[13px] font-medium hover:underline">{c.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>

        {/* Mobile: show real embeds (smaller height) */}
        <div className="sm:hidden space-y-4">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Featured Videos</div>
            <div className="h-[200px] max-w-[520px] mx-auto w-full">
              <YouTubePlayer key={`ytm-${yt || ""}`} url={yt || ""} />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Featured Reel</div>
            <div className="max-w-[520px] mx-auto w-full">
              <InstagramPlayer url={ig || ""} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ═══ CATALOGUE CARD ══════════════════════ */
function CatalogueCard({ item, isLoggedIn }: { item: any; isLoggedIn: boolean }) {
  const router = useRouter();

  function handleBuyNow() {
    const destination = `/catalogue/${item.id}`;
    if (!isLoggedIn) {
      window.location.href = `/login?callbackUrl=${encodeURIComponent(destination)}`;
      return;
    }
    router.push(destination);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4 }}
      className="group flex flex-col rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <Link href={`/catalogue/${item.id}`} className="relative bg-muted block overflow-hidden aspect-[16/9]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-orange-400/10">
            <TrendingUp className="h-16 w-16 text-primary/20" />
          </div>
        )}
        {/* Bottom gradient overlay for price */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Price overlay */}
        <div className="absolute bottom-3 left-3 text-white flex items-baseline gap-1 drop-shadow-lg">
          <span className="text-xl sm:text-2xl font-black inline-flex items-center gap-1">
            <IndianRupee className="h-4 w-4" />{item.price.toLocaleString("en-IN")}
          </span>
          {/* <span className="text-xs text-white/80">/seat</span> */}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-5 border-t border-border">
        <div>
          <Link href={`/catalogue/${item.id}`} className="hover:underline">
            <h3 className="font-black text-base md:text-lg leading-snug">{item.title}</h3>
          </Link>
        </div>
        <div className="mt-auto">
          <Button
            type="button"
            onClick={handleBuyNow}
            className="w-full h-13 font-extrabold gap-2 rounded-2xl shadow-md text-base bg-red-600 hover:bg-red-700"
          >
            <ShoppingBag className="h-4 w-4" /> Buy Now — ₹{item.price.toLocaleString("en-IN")}
          </Button>
          {!isLoggedIn && (
            <p className="text-center text-xs text-muted-foreground mt-2">Sign in to purchase</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══ PAGE ════════════════════════════════ */
export default function HomePage() {
  const { data: session, status } = useSession();
  const [activeStep, setActiveStep] = React.useState("insights");
  const [banners,  setBanners]  = React.useState<any[]>([]);
  const [events,   setEvents]   = React.useState<any[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = React.useState<"all" | "BUSINESS_TOUR" | "TRADE_FAIR">("all");
  const [ready,    setReady]    = React.useState(false);

  const [reviews,   setReviews]   = React.useState<any[]>([]);
  const [faqs,      setFaqs]      = React.useState<any[]>([]);
  const [catalogue, setCatalogue] = React.useState<any[]>([]);
  const [social,    setSocial]    = React.useState<any | null>(null);
  const [askName,   setAskName]   = React.useState("");
  const [askEmail,  setAskEmail]  = React.useState("");
  const [askText,   setAskText]   = React.useState("");
  const [askSent,   setAskSent]   = React.useState(false);

  const isLoggedIn = status === "authenticated" && !!session?.user;

  React.useEffect(() => {
    // 1. Fetch banners independently so the Hero banner loads and renders instantly
    fetch("/api/banners")
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error();
      })
      .then((d) => {
        setBanners(Array.isArray(d) ? d.filter((b: any) => b.isActive !== false) : []);
      })
      .catch(() => {});

    // 2. Load the rest of the sections concurrently in the background
    async function loadOthers() {
      try {
        const [evR, rvR, fqR, catR, soR] = await Promise.all([
          fetch("/api/events?status=all").catch(() => ({ ok: false } as Response)),
          fetch("/api/reviews").catch(() => ({ ok: false } as Response)),
          fetch("/api/faqs").catch(() => ({ ok: false } as Response)),
          fetch("/api/catalogue").catch(() => ({ ok: false } as Response)),
          fetch("/api/social").catch(() => ({ ok: false } as Response)),
        ]);
        if (evR.ok) {
          const d = await evR.json();
          setEvents(Array.isArray(d) ? d : []);
        }
        if (rvR.ok)  { const d = await (rvR  as Response).json(); setReviews(Array.isArray(d) ? d : []); }
        if (fqR.ok)  { const d = await (fqR  as Response).json(); setFaqs(Array.isArray(d) ? d : []); }
        if (catR.ok) { const d = await (catR as Response).json(); setCatalogue(Array.isArray(d) ? d : []); }
        if (soR.ok)  { const d = await (soR  as Response).json(); setSocial(d); }
      } catch { /* silent */ }
      finally { setReady(true); }
    }
    loadOthers();
  }, []);

  const visibleEvents = events.filter((ev) => {
    if (eventTypeFilter === "all") return true;
    return parseEventType(ev.eventType) === eventTypeFilter;
  });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-full">

      {/* ─── HERO ─── */}
      <HeroBanner banners={banners} />

      {/* ─── CONTENT WRAPPER (with horizontal spacing) ─── */}
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Stats strip just below the banner */}
        <section aria-label="site-stats" className="py-2 bg-muted/30 border-y">
          <div className="container">
            {/* Desktop/tablet: compact chips with icons */}
            <div className="hidden sm:flex items-center justify-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card/60 text-foreground/80 text-xs sm:text-sm">
                <Users className="h-3.5 w-3.5 text-red-500" />
                <span className="font-black bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent">1000+</span>
                <span className="opacity-80 font-semibold">clients</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card/60 text-foreground/80 text-xs sm:text-sm">
                <Globe2 className="h-3.5 w-3.5 text-red-500" />
                <span className="font-black bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent">22+</span>
                <span className="opacity-80 font-semibold">business tours</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card/60 text-foreground/80 text-xs sm:text-sm">
                <HandshakeIcon className="h-3.5 w-3.5 text-red-500" />
                <span className="font-black bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent">350+</span>
                <span className="opacity-80 font-semibold">deals closed</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card/60 text-foreground/80 text-xs sm:text-sm">
                <Star className="h-3.5 w-3.5 text-red-500" />
                <span className="font-black bg-gradient-to-r from-red-600 to-orange-400 bg-clip-text text-transparent">300k+</span>
                <span className="opacity-80 font-semibold">followers</span>
              </div>
            </div>

            {/* Mobile: auto-scrolling carousel strip */}
            <div className="sm:hidden overflow-hidden">
              <div className="flex items-center gap-x-8 whitespace-nowrap marquee text-[13px] font-semibold text-foreground/80">
                <span>1000+ clients</span>
                <span className="opacity-40">•</span>
                <span>22+ business tours</span>
                <span className="opacity-40">•</span>
                <span>350+ deals closed</span>
                <span className="opacity-40">•</span>
                <span>300k+ followers</span>
                <span className="opacity-40">•</span>
                {/* duplicate once to create seamless loop */}
                <span>1000+ clients</span>
                <span className="opacity-40">•</span>
                <span>22+ business tours</span>
                <span className="opacity-40">•</span>
                <span>350+ deals closed</span>
                <span className="opacity-40">•</span>
                <span>300k+ followers</span>
              </div>
              <style jsx>{`
                @keyframes stats-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
                .marquee { animation: stats-marquee 16s linear infinite; }
              `}</style>
            </div>
          </div>
        </section>

      {/* ─── BRAND TRUSTED PARTNER BLOCK ─── */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-card to-background border-b border-border/40 relative overflow-hidden">
        {/* Glow decorative effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="container max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[11px] font-black uppercase tracking-widest mb-4 border border-red-500/20">
            ⭐ Your Trusted Sourcing Partner
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-foreground">
            Your Trusted Trade & Sourcing<br />
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">Partner in China</span>
          </h2>
          
          <div className="mt-6 space-y-4 max-w-2xl mx-auto">
            <p className="text-sm font-bold text-red-500 uppercase tracking-widest">
              SAILX is a premier global trade brand
            </p>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              We help businesses of all sizes unlock sourcing and trading opportunities directly within China’s powerhouse industrial hubs. With secure transactions, rigorous on-ground factory quality checks, and custom logistical pipelines, SAILX takes your operations from idea to delivery with ultimate transparency.
            </p>
          </div>

          <div className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 rounded-xl font-bold bg-red-600 hover:bg-red-700 shadow-md shadow-red-500/15 group text-sm w-full sm:w-auto">
              <Link href="/consultation">
                Book a Consultation
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-xl font-bold border-border/80 hover:bg-muted text-sm w-full sm:w-auto group">
              <Link href="/tours">
                Join Business Tours
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ─── EVENTS ─── */}
      <section id="events" className="py-8 md:py-14">
        <div className="container">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1 w-8 rounded-full bg-red-500" />
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Upcoming</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3 md:whitespace-nowrap">
                China Business Tours and <span className="bg-gradient-to-r from-primary via-orange-400 to-yellow-400 bg-clip-text text-transparent">Trade Fairs</span>
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
                Join exclusive business tours and attend world-renowned trade fairs with guided support. Connect directly with suppliers, visit factories, and secure the best deals for your business.
              </p>
            </div>
          </div>

          <div className="flex bg-muted p-1 rounded-xl gap-1 mb-6 md:mb-8 max-w-md">
            {[
              { id: "all", label: "All" },
              { id: "BUSINESS_TOUR", label: "Business Tours" },
              { id: "TRADE_FAIR", label: "Trade Fairs" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setEventTypeFilter(tab.id as typeof eventTypeFilter)}
                className={cn(
                  "flex-1 px-3 py-2 text-xs md:text-sm font-bold rounded-lg transition-all",
                  eventTypeFilter === tab.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {!ready ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border bg-card/40 animate-pulse" style={{ height: 380 }} />
              ))}
            </div>
          ) : visibleEvents.length === 0 ? (
            <div className="flex flex-col items-center py-24 gap-3 text-muted-foreground rounded-2xl border-2 border-dashed border-border">
              <Calendar className="h-20 w-20 opacity-10" />
              <div className="font-semibold text-lg">
                No events found
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {visibleEvents.map((ev, i) => <EventCard key={ev.id} ev={ev} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW WE WORK ─── */}
      <section className="py-8 md:py-16 bg-muted/20 border-t border-border/40 overflow-hidden">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/10">
              Our Sourcing Process
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-4 leading-tight">
              Your Bridge to China's<br />
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Manufacturing Ecosystem</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base leading-relaxed">
              At SAILX, we simplify international sourcing and trade. Whether you’re an experienced importer, a growing business, or taking your first step, we help you navigate the Chinese market with confidence and connect with reliable manufacturers.
            </p>
          </div>

          {/* Mobile Horizontal Step Selector */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none snap-x snap-mandatory px-1 w-full max-w-full">
            {[
              { id: "insights", icon: ScanSearch, title: "Insights" },
              { id: "discovery", icon: Package, title: "Discovery" },
              { id: "inspection", icon: ShieldCheck, title: "Inspections" },
              { id: "sourcing", icon: Search, title: "Sourcing" },
              { id: "support", icon: HandshakeIcon, title: "Support" },
              { id: "tours", icon: Globe2, title: "Tours" }
            ].map((step, index) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    "snap-center shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-xs font-bold transition-all duration-300",
                    isActive
                      ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-500/20"
                      : "border-border/70 bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
                  )}
                >
                  <step.icon className="h-3.5 w-3.5" />
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-start mb-8 md:mb-14">
            {/* Desktop Vertical Selector Tabs */}
            <div className="hidden lg:flex lg:col-span-5 flex-col gap-2.5">
              {[
                { id: "insights", icon: ScanSearch, title: "Market Insights", tagline: "On-ground intelligence" },
                { id: "discovery", icon: Package, title: "Supplier Discovery", tagline: "Direct matching" },
                { id: "inspection", icon: ShieldCheck, title: "Quality Inspections", tagline: "On-ground audits" },
                { id: "sourcing", icon: Search, title: "Product Sourcing", tagline: "End-to-end procurement" },
                { id: "support", icon: HandshakeIcon, title: "Business Support", tagline: "Trusted partnerships" },
                { id: "tours", icon: Globe2, title: "Business Tours", tagline: "Direct wholesale market access" }
              ].map((step, index) => {
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden group",
                      isActive
                        ? "border-red-500/30 bg-card shadow-md shadow-red-500/5 text-foreground"
                        : "border-transparent bg-transparent hover:bg-card/40 text-muted-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isActive ? "bg-red-500/15 text-red-500" : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                    )}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm leading-tight flex items-center gap-2">
                        <span className="text-xs text-muted-foreground/50 tabular-nums">{(index + 1).toString().padStart(2, '0')}.</span>
                        {step.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5 font-medium truncate">{step.tagline}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Content Display Card */}
            <div className="lg:col-span-7 bg-card border rounded-2xl md:rounded-3xl p-5 md:p-10 shadow-sm relative overflow-hidden min-h-[280px] md:min-h-[380px] flex flex-col justify-between">
              {/* Background gradient blur */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -z-10" />

              <AnimatePresence mode="wait">
                {activeStep === "insights" && (
                  <motion.div
                    key="insights"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="inline-flex h-12 w-12 rounded-xl bg-red-500/10 text-red-600 items-center justify-center">
                      <ScanSearch className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">On-ground Market Insights</h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Navigate the complexities of China's immense manufacturing hubs with real-time data and direct intelligence. Our local, on-ground team works around the clock to analyze trending materials, demand shifts, and pricing standards across wholesale markets.
                      </p>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-foreground/80 pt-2">
                      <li className="flex items-center gap-2">🟢 Local price benchmarking</li>
                      <li className="flex items-center gap-2">🟢 Trend and material analysis</li>
                      <li className="flex items-center gap-2">🟢 Direct hub mapping</li>
                      <li className="flex items-center gap-2">🟢 Clear decision-making support</li>
                    </ul>
                  </motion.div>
                )}

                {activeStep === "discovery" && (
                  <motion.div
                    key="discovery"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="inline-flex h-12 w-12 rounded-xl bg-orange-500/10 text-orange-600 items-center justify-center">
                      <Package className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">Direct Supplier Discovery</h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Skip the middlemen and shady intermediaries. We connect global buyers directly with trusted and verified Chinese manufacturers. Every supplier is audited on production capacity, quality standards, and export legitimacy.
                      </p>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-foreground/80 pt-2">
                      <li className="flex items-center gap-2">🍊 Verified manufacturer matching</li>
                      <li className="flex items-center gap-2">🍊 Complete supplier background checks</li>
                      <li className="flex items-center gap-2">🍊 Production capability audits</li>
                      <li className="flex items-center gap-2">🍊 Legitimacy and compliance verification</li>
                    </ul>
                  </motion.div>
                )}

                {activeStep === "inspection" && (
                  <motion.div
                    key="inspection"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="inline-flex h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 items-center justify-center">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">Rigorous Quality Inspections</h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Never buy blind again. Our professional inspection team conducts factory visits and strict product quality checks directly at the assembly lines before your order is packed. We deliver clear reports, photos, and high-definition video confirmation.
                      </p>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-foreground/80 pt-2">
                      <li className="flex items-center gap-2">🍋 On-site assembly line audits</li>
                      <li className="flex items-center gap-2">🍋 Visual defect inspection</li>
                      <li className="flex items-center gap-2">🍋 Detailed inspection reports</li>
                      <li className="flex items-center gap-2">🍋 Defect mitigation & advice</li>
                    </ul>
                  </motion.div>
                )}

                {activeStep === "sourcing" && (
                  <motion.div
                    key="sourcing"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="inline-flex h-12 w-12 rounded-xl bg-yellow-500/10 text-yellow-600 items-center justify-center">
                      <Search className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">End-to-End Product Sourcing</h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        We handle product sourcing from initial price negotiations and sample collection to custom compliance checklists. We ensure you get competitive prices, solid raw materials, and accurate packaging custom-tailored to your exact business specifications.
                      </p>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-foreground/80 pt-2">
                      <li className="flex items-center gap-2">🍌 Professional price negotiation</li>
                      <li className="flex items-center gap-2">🍌 Sample collection & consolidation</li>
                      <li className="flex items-center gap-2">🍌 Custom packaging compliance</li>
                      <li className="flex items-center gap-2">🍌 Complete customs readiness</li>
                    </ul>
                  </motion.div>
                )}

                {activeStep === "support" && (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="inline-flex h-12 w-12 rounded-xl bg-lime-500/10 text-lime-600 items-center justify-center">
                      <HandshakeIcon className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold">Complete Business & Logistics Support</h3>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        From handling complex payments securely to arranging reliable shipping pipelines, we bridge the gap between global buyers and Chinese manufacturers. Receive full operational peace of mind with our dedicated client managers guiding you at every step.
                      </p>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-foreground/80 pt-2">
                      <li className="flex items-center gap-2">🟢 Secure transaction escrows</li>
                      <li className="flex items-center gap-2">🟢 Logistics & freight coordination</li>
                      <li className="flex items-center gap-2">🟢 Dedicated bilingual trade managers</li>
                      <li className="flex items-center gap-2">🟢 Fast, transparent communication</li>
                    </ul>
                  </motion.div>
                )}

                {activeStep === "tours" && (
                  <motion.div
                    key="tours"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                  >
                    <div className="inline-flex h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 items-center justify-center">
                      <Globe2 className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold mb-3">China Business Tours and <span className="bg-gradient-to-r from-primary via-orange-400 to-yellow-400 bg-clip-text text-transparent">Trade Fairs</span></h3>
<p className="text-muted-foreground text-base md:text-lg max-w-2xl">
  Join exclusive business tours and attend world-renowned trade fairs with guided support. Connect directly with suppliers, visit factories, and secure the best deals for your business.
</p>
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        Experience China's powerhouse manufacturing firsthand. We organize premium business tours for entrepreneurs, importers, and business owners. Get guided, direct access to elite trade fairs (like the Canton Fair), wholesale markets, and factory floor walk-throughs.
                      </p>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm font-semibold text-foreground/80 pt-2">
                      <li className="flex items-center gap-2">🟢 Trade fair guided walk-throughs</li>
                      <li className="flex items-center gap-2">🟢 Wholesale hub navigation</li>
                      <li className="flex items-center gap-2">🟢 Supplier relationship building</li>
                      <li className="flex items-center gap-2">🟢 All-inclusive ground logistics</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 pt-8">
            <div className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm md:text-base">
                To become the world's most trusted bridge between global businesses and China's manufacturing ecosystem, empowering entrepreneurs and companies with direct access to sourcing opportunities, market intelligence, and reliable trade solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                We envision a future where businesses of every size can confidently connect with world-class manufacturers, build strong supply chains, and grow beyond borders.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                To simplify international sourcing and trade through transparent guidance, on-ground support, business tours, and practical solutions that help companies discover products, build supplier relationships, and execute successful transactions with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATALOGUE ─── */}
      {catalogue.length > 0 && (
        <section id="catalogue" className="py-8 md:py-12 bg-muted/30 border-t border-border/50">
          <div className="container">
            <div className="mb-6 md:mb-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1 w-8 rounded-full bg-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Our Catalogue</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black leading-tight">
                Exclusive Products & <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">Offerings</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7">
              {catalogue.map((item: any) => (
                <CatalogueCard key={item.id} item={item} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── SERVICES ─── */}
      <ServicesSection />

      {/* ─── SOCIAL MEDIA ─── */}
      <SocialMediaSection data={social || {}} />

      {/* ─── REVIEWS ─── */}
      {reviews.length > 0 && (
        <ReviewsSection reviews={reviews} />
      )}

      {/* ─── FAQ / ASK A QUESTION ─── */}
      <section id="ask" className="py-8 md:py-14 border-t border-border/50">
        <div className="container">
          <div className="grid lg:grid-cols-[340px_1fr] gap-6 md:gap-10 items-start">

            {/* Left — Ask your question */}
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3">Ask your question</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  If the question is not available on our FAQ section, feel free to contact us personally, we will resolve your respective doubts.
                </p>
              </div>

              {askSent ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                    <CheckCircle2 className="h-5 w-5" /> Question sent!
                  </div>
                  <p className="text-xs text-muted-foreground">We&apos;ll reply to your email soon.</p>
                  <button
                    className="w-fit text-sm font-semibold text-primary hover:underline"
                    onClick={() => setAskSent(false)}
                  >
                    Ask another →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input placeholder="Your name" value={askName} onChange={(e) => setAskName(e.target.value)} />
                  <Input placeholder="Your email" type="email" value={askEmail} onChange={(e) => setAskEmail(e.target.value)} />
                  <textarea
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[90px] resize-y"
                    placeholder="Type your question here..."
                    value={askText}
                    onChange={(e) => setAskText(e.target.value)}
                  />
                  <Button
                    variant="outline"
                    className="rounded-full px-7 border-primary text-primary hover:bg-primary/10"
                    disabled={!askName.trim() || !askText.trim()}
                    onClick={async () => {
                      try {
                        await fetch("/api/faqs", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ question: askText, askedBy: askName, askedByEmail: askEmail }),
                        });
                        setAskSent(true);
                        setAskName(""); setAskEmail(""); setAskText("");
                      } catch { alert("Failed to send. Please try again."); }
                    }}
                  >
                    Ask Question
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Feel Free to Contact our Support Team at{" "}
                <a href="mailto:info@sailxchina.com" className="text-primary hover:underline">
                  info@sailxchina.com
                </a>
              </p>
            </div>

            {/* Right — FAQ accordion with red right border */}
            <div className="relative border-r-4 border-primary/80 pr-0 lg:pr-1">
              {faqs.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">No FAQs yet — add some from the admin panel.</p>
              ) : (
                <div className="divide-y divide-border">
                  {faqs.map((f) => (
                    <FaqItem key={f.id} question={f.question} answer={f.answer || ""} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ─── CTA STRIP ─── */}
      <section className="py-6 md:py-10 bg-gradient-to-r from-primary/10 via-red-500/10 to-primary/10 border-t border-border/50">
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest mb-2 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
              <Sparkles className="h-3 w-3" /> Ready to start sourcing?
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2 max-w-2xl mx-auto leading-tight">
              Join businesses worldwide already using Sailxchina
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-5">
              {isLoggedIn
                ? "Welcome back! Explore upcoming business tours and trade fairs."
                : "Create a free account and book your next business tour in minutes."}
            </p>
            {!isLoggedIn && (
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild size="lg" className="h-13 px-10 font-black text-base gap-2 shadow-xl rounded-xl">
                  <Link href="/register">Create Free Account <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-13 px-8 font-semibold rounded-xl">
                  <Link href="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      </div>

      <MemoriesMarquee />

    </div>
  );
}
