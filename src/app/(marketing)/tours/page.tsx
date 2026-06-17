"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, MapPin, IndianRupee, Loader2,
  Star, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us";
import { eventTypeLabel, parseEventType } from "@/lib/event-type";

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function eventStatus(ev: any): "active" | "completed" {
  return new Date(ev.endDate) < new Date() ? "completed" : "active";
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
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 22 }}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden bg-card border",
        "hover:shadow-2xl hover:-translate-y-2 transition-all duration-300",
        isActive ? "border-red-500/30 shadow-red-500/10 shadow-md" : "border-border"
      )}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-slate-800 to-slate-700">
        {ev.images?.[0] ? (
          <img src={ev.images[0]} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Calendar className="h-14 w-14 text-white/10" />
          </div>
        )}
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

        {/* Price + discount */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-baseline gap-0.5">
            <IndianRupee className="h-4 w-4 text-white font-black" />
            <span className="text-xl font-black text-white drop-shadow-lg">
              {ev.costPerSeat?.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-white/60 ml-1">/seat</span>
          </div>
          {ev.mrp && ev.mrp > ev.costPerSeat && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/70 line-through">₹{Number(ev.mrp).toLocaleString("en-IN")}</span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/90 text-white border border-emerald-400/50">
                -{Math.round((1 - ev.costPerSeat / ev.mrp) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body — match Catalogue style */}
      <div className="flex flex-col flex-1 p-6 gap-5 border-t border-border">
        <div>
          <Link href={`/events/${ev.id}`} className="hover:underline">
            <h3 className="font-black text-base sm:text-lg md:text-xl leading-snug mb-1">{ev.title}</h3>
          </Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ev.city}, {ev.country}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmtDate(ev.startDate)} → {fmtDate(ev.endDate)}</span>
          </div>
        </div>
        <div className="mt-auto">
          <Button asChild className="w-full h-13 font-extrabold gap-2 rounded-2xl shadow-md text-base bg-red-600 hover:bg-red-700">
            <Link href={`/events/${ev.id}`}>View More — ₹{ev.costPerSeat?.toLocaleString("en-IN")}</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ToursPage() {
  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "active" | "completed">("active");
  const [typeFilter, setTypeFilter] = React.useState<"all" | "BUSINESS_TOUR" | "TRADE_FAIR">("all");
  const [reviews, setReviews] = React.useState<any[]>([]);
  const [askName, setAskName] = React.useState("");
  const [askEmail, setAskEmail] = React.useState("");
  const [askText, setAskText] = React.useState("");
  const [askSent, setAskSent] = React.useState(false);

  React.useEffect(() => {
    // Initialize from query param if present
    try {
      const u = new URL(window.location.href);
      const t = u.searchParams.get("type") as any;
      if (t === "BUSINESS_TOUR" || t === "TRADE_FAIR") setTypeFilter(t);
    } catch {}

    async function load() {
      try {
        const [evR, rvR] = await Promise.all([
          fetch("/api/events?status=active").catch(() => null),
          fetch("/api/reviews").catch(() => null),
        ]);

        if (evR && evR.ok) {
          const d = await evR.json();
          setEvents(Array.isArray(d) ? d : []);
        }
        if (rvR && rvR.ok) {
          const d = await rvR.json();
          setReviews(Array.isArray(d) ? d : []);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredEvents = events.filter((ev) => {
    const st = eventStatus(ev);
    if (typeFilter !== "all" && parseEventType(ev.eventType) !== typeFilter) return false;
    if (filter === "active") return st === "active" && ev.isActive !== false;
    if (filter === "completed") return st === "completed";
    return true;
  });

  const orderedEvents = React.useMemo(() => {
    const active: any[] = [];
    const completed: any[] = [];
    for (const ev of filteredEvents) {
      (eventStatus(ev) === "completed" ? completed : active).push(ev);
    }
    // Keep original order within groups
    return [...active, ...completed];
  }, [filteredEvents]);

  return (
    <div className="min-h-screen bg-muted/10 pb-12 md:pb-16">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-28 md:pt-24">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-normal leading-tight mb-3">
          China Business Tours and <span className="bg-gradient-to-r from-primary via-orange-400 to-yellow-400 bg-clip-text text-transparent">Trade Fairs</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
          Join exclusive business tours and attend world-renowned trade fairs with guided support. Connect directly with suppliers, visit factories, and secure the best deals for your business.
        </p>
        {/* Filters and Stats */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/60 pb-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Type Filter Tabs */}
            <div className="flex bg-muted p-1 rounded-xl gap-1">
              {[
                { id: "all", label: "All Types" },
                { id: "BUSINESS_TOUR", label: "Business Tours" },
                { id: "TRADE_FAIR", label: "Trade Fairs" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id as any)}
                  className={cn(
                    "px-3 py-2 text-xs md:text-sm font-bold rounded-lg transition-all",
                    typeFilter === tab.id
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs md:text-sm font-semibold text-muted-foreground">
            Showing <span className="text-foreground font-bold">{filteredEvents.length}</span> events
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-16 md:py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
            <p className="text-sm font-semibold text-muted-foreground">Loading premium business tours...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-12 md:py-20 text-center bg-card border rounded-3xl p-6 md:p-8 max-w-md mx-auto shadow-sm">
            <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-1">No tours found</h3>
            <p className="text-sm text-muted-foreground mb-4">We are currently planning more trade tours. Check back soon or contact support to request a trip.</p>
            <Button asChild size="sm" className="rounded-xl font-bold bg-red-600 hover:bg-red-700">
              <Link href="/#ask">Contact Sourcing Desk</Link>
            </Button>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {orderedEvents.map((ev, index) => (
              <EventCard key={ev.id} ev={ev} index={index} />
            ))}
          </div>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-10 md:mt-20 border-t border-border/60 pt-6 md:pt-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-7 rounded-full bg-primary block" />
              <h2 className="text-2xl md:text-3xl font-black">What importers say</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.slice(0, 4).map((r: any) => (
                <div key={r.id} className="rounded-xl border bg-card p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={cn("h-4 w-4", s <= r.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">( {r.rating} Stars )</span>
                  </div>
                  <div className="flex gap-3 flex-1">
                    <div className="w-1 shrink-0 rounded-full bg-primary/70 self-stretch" />
                    <p className="text-sm text-foreground/80 leading-relaxed line-clamp-6">{r.text}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-1 border-t border-border/50">
                    <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                      <AvatarImage src={r.profileImage || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">{r.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm leading-tight">{r.name}</div>
                      {r.subtitle && <div className="text-xs text-muted-foreground mt-0.5">{r.subtitle}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ask a Question */}
        <section id="ask" className="mt-10 md:mt-20 border-t border-border/60 pt-6 md:pt-10">
          <div className="grid lg:grid-cols-[340px_1fr] gap-12 items-start">
            {/* Left — Ask form */}
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
                  <p className="text-xs text-muted-foreground">We'll reply to your email soon.</p>
                  <button className="w-fit text-sm font-semibold text-primary hover:underline" onClick={() => setAskSent(false)}>
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
                Feel Free to Contact our Support Team at {" "}
                <a href="mailto:info@sailxchina.com" className="text-primary hover:underline">info@sailxchina.com</a>
              </p>
            </div>

            {/* Right — Simple note */}
            <div className="relative p-6 rounded-2xl border bg-card">
              <h3 className="font-bold mb-2">Need help choosing a tour?</h3>
              <p className="text-sm text-muted-foreground">Share your goals, product category, and budget. Our team will suggest the most relevant fairs and cities for you.</p>
              <div className="mt-4">
                <Button asChild size="sm" className="rounded-xl font-bold">
                  <Link href="/#events">See all tours</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Why Choose Us */}
      <WhyChooseUsSection />

    </div>
  );
}
