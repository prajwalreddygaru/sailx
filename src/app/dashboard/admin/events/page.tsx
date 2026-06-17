"use client";

import * as React from "react";
import {
  Plus, Pencil, Trash2, Users, Calendar, MapPin,
  ImageIcon, Upload, X, IndianRupee, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Ban, AlertCircle, Megaphone,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { normalizeEventType, parseEventType } from "@/lib/event-type";

type TEvent = {
  id: string; title: string; description: string;
  city: string; country: string;
  costPerSeat: number; mrp?: number | null; startDate: string; endDate: string; bookingEndDate?: string | null;
  totalSeats: number; bookedSeats: number;
  images: string[]; isActive: boolean; eventType: string; createdAt: string;
  _count?: { bookings: number };
};

type Booking = {
  id: string; userName: string; userEmail: string;
  seats: number; totalAmount: number; paymentStatus: string;
  createdAt: string;
};

const EMPTY = {
  title: "", description: "", city: "", country: "India",
  costPerSeat: "", mrp: "", startDate: "", endDate: "", bookingEndDate: "",
  totalSeats: "", images: [] as string[], isActive: true, eventType: "BUSINESS_TOUR",
  overview: "", overviewHeading: "", minAge: "", maxAge: "", happyTravellers: "",
  highlights: [] as string[], inclusions: [] as string[], exclusions: [] as string[],
};

function statusOf(ev: TEvent) {
  if (!ev.isActive) return "disabled";
  if (new Date(ev.endDate) < new Date()) return "completed";
  if (new Date(ev.startDate) <= new Date()) return "ongoing";
  return "upcoming";
}
const STATUS_STYLE: Record<string, string> = {
  upcoming:  "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ongoing:   "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  completed: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  disabled:  "bg-red-500/10 text-red-400 border-red-500/20",
};
const STATUS_LABEL: Record<string, string> = {
  upcoming: "Upcoming", ongoing: "Ongoing", completed: "Completed", disabled: "Disabled",
};
function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminEventsPage() {
  const [events,     setEvents]     = React.useState<TEvent[]>([]);
  const [loading,    setLoading]    = React.useState(true);
  const [loadErr,    setLoadErr]    = React.useState("");
  const [saving,     setSaving]     = React.useState(false);
  const [saveErr,    setSaveErr]    = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteId,   setDeleteId]   = React.useState<string | null>(null);
  const [editing,    setEditing]    = React.useState<TEvent | null>(null);
  const [form,       setForm]       = React.useState({ ...EMPTY });
  const [uploading,  setUploading]  = React.useState(false);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [bookings,   setBookings]   = React.useState<Record<string, Booking[]>>({});
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [days, setDays] = React.useState<{ heading?: string; title: string; description: string }[]>([]);
  const [assignEmail, setAssignEmail] = React.useState("");
  const [assignSeats, setAssignSeats] = React.useState<number>(1);
  const [assigning, setAssigning] = React.useState(false);
  const [assignErr, setAssignErr] = React.useState("");

  async function load() {
    setLoading(true);
    setLoadErr("");
    try {
      const r = await fetch("/api/events?status=all");
      const data = await r.json();
      if (r.ok) {
        setEvents(Array.isArray(data) ? data : []);
      } else {
        setLoadErr(data.error ?? "Failed to load events");
      }
    } catch {
      setLoadErr("Network error — check console");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  const stats = {
    total:     events.length,
    upcoming:  events.filter((e) => statusOf(e) === "upcoming").length,
    ongoing:   events.filter((e) => statusOf(e) === "ongoing").length,
    completed: events.filter((e) => statusOf(e) === "completed").length,
  };

  async function loadBookings(eventId: string) {
    if (bookings[eventId]) {
      setExpandedId(expandedId === eventId ? null : eventId);
      return;
    }
    try {
      const r = await fetch(`/api/events/${eventId}/bookings`);
      if (r.ok) {
        const data = await r.json();
        setBookings((b) => ({ ...b, [eventId]: Array.isArray(data) ? data : [] }));
        setExpandedId(eventId);
      }
    } catch { /* ignore */ }
  }

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY, images: [] });
    setDays([]);
    setSaveErr("");
    setDialogOpen(true);
  }

  function openEdit(ev: TEvent) {
    setEditing(ev);
    setSaveErr("");
    setForm({
      title: ev.title, description: ev.description,
      city: ev.city, country: ev.country,
      costPerSeat: String(ev.costPerSeat),
      mrp: ev.mrp != null ? String(ev.mrp) : "",
      startDate: ev.startDate.slice(0, 10),
      endDate:   ev.endDate.slice(0, 10),
      bookingEndDate: ev.bookingEndDate ? String(ev.bookingEndDate).slice(0, 10) : "",
      totalSeats: String(ev.totalSeats),
      images: [...ev.images], isActive: ev.isActive, eventType: parseEventType(ev.eventType) ?? "BUSINESS_TOUR",
      overview: (ev as any).overview || "",
      overviewHeading: (ev as any).overviewHeading || "",
      minAge: (ev as any).minAge != null ? String((ev as any).minAge) : "",
      maxAge: (ev as any).maxAge != null ? String((ev as any).maxAge) : "",
      happyTravellers: (ev as any).happyTravellers != null ? String((ev as any).happyTravellers) : "",
      highlights: Array.isArray((ev as any).highlights) ? (ev as any).highlights : [],
      inclusions: Array.isArray((ev as any).inclusions) ? (ev as any).inclusions : [],
      exclusions: Array.isArray((ev as any).exclusions) ? (ev as any).exclusions : [],
    });
    // Load itinerary for this event
    fetch(`/api/events/${ev.id}/itinerary`).then(async (r) => {
      if (!r.ok) return setDays([]);
      const arr = await r.json();
      setDays(Array.isArray(arr)
        ? arr.map((d: any) => ({ heading: d.heading || "", title: d.title, description: d.description }))
        : []
      );
    }).catch(() => setDays([]));
    setDialogOpen(true);
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        if (r.ok) { const d = await r.json(); uploaded.push(d.url); }
      } catch { /* ignore single file errors */ }
    }
    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    setSaveErr("");
    const { title, city, startDate, endDate, costPerSeat, mrp, totalSeats } = form;
    if (!title.trim()) { setSaveErr("Event title is required"); return; }
    if (!city.trim())  { setSaveErr("City is required"); return; }
    if (!startDate)    { setSaveErr("Start date is required"); return; }
    if (!endDate)      { setSaveErr("End date is required"); return; }
    if (!costPerSeat)  { setSaveErr("Cost per seat is required"); return; }
    if (mrp && Number(mrp) < Number(costPerSeat)) { /* ok, discounted */ }
    if (!totalSeats)   { setSaveErr("Total seats is required"); return; }

    setSaving(true);
    const payload = {
      title: title.trim(), description: form.description.trim(),
      city: city.trim(), country: form.country.trim() || "India",
      costPerSeat, mrp: mrp || null, startDate, endDate, bookingEndDate: form.bookingEndDate || null, totalSeats,
      images: form.images, isActive: form.isActive, eventType: normalizeEventType(form.eventType),
      overview: (form as any).overview?.trim() || null,
      overviewHeading: (form as any).overviewHeading?.trim() || null,
      minAge: (form as any).minAge ? Number((form as any).minAge) : null,
      maxAge: (form as any).maxAge ? Number((form as any).maxAge) : null,
      happyTravellers: (form as any).happyTravellers ? Number((form as any).happyTravellers) : null,
      highlights: (form as any).highlights ?? [],
      inclusions: (form as any).inclusions ?? [],
      exclusions: (form as any).exclusions ?? [],
    };
    try {
      const url    = editing ? `/api/events/${editing.id}` : "/api/events";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveErr(data.error ?? `Server error ${res.status}`);
        return;
      }
      const savedId = editing ? editing.id : data.id;
      // Persist itinerary if any
      try {
        await fetch(`/api/events/${savedId}/itinerary`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days: days.map((d, i) => ({ dayNumber: i + 1, heading: d.heading || null, title: d.title, description: d.description })) }),
        });
      } catch { /* ignore itinerary save failure in UI */ }
      setDialogOpen(false);
      await load();
    } catch (e: any) {
      setSaveErr(e.message ?? "Network error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
    } catch { /* ignore */ }
    setDeleteId(null);
    await load();
  }

  async function toggleActive(ev: TEvent) {
    try {
      await fetch(`/api/events/${ev.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !ev.isActive }),
      });
      await load();
    } catch { /* ignore */ }
  }

  async function makeBannerFromEvent(ev: TEvent) {
    try {
      const res = await fetch(`/api/admin/banners/from-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: ev.id, makeActive: true })
      });
      const d = await res.json();
      if (!res.ok) {
        alert(d.error || "Failed to create banner");
        return;
      }
      alert("Banner created/updated for this event.");
    } catch {
      alert("Failed to create banner");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Events & Tours"
        description="Create and manage trade fairs, city tours, and sourcing events."
        actions={
          <Button variant="gradient" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={stats.total}     icon={Calendar}     />
        <StatCard label="Upcoming"     value={stats.upcoming}  icon={Clock}        />
        <StatCard label="Ongoing"      value={stats.ongoing}   icon={CheckCircle2} />
        <StatCard label="Completed"    value={stats.completed} icon={Ban}          />
      </div>

      {/* Error banner */}
      {loadErr && (
        <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" /> {loadErr}
          <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-muted-foreground text-sm">Loading events…</div>
      )}

      {/* Event cards */}
      <div className="space-y-4">
        {events.map((ev) => {
          const st    = statusOf(ev);
          const avail = ev.totalSeats - ev.bookedSeats;
          const pct   = ev.totalSeats > 0 ? Math.round((ev.bookedSeats / ev.totalSeats) * 100) : 0;
          const isExp = expandedId === ev.id;

          return (
            <Card key={ev.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  {/* Cover image */}
                  <div className="h-24 w-28 rounded-lg bg-muted border border-border overflow-hidden shrink-0 flex items-center justify-center">
                    {ev.images[0]
                      ? <img src={ev.images[0]} alt="" className="h-full w-full object-cover" />
                      : <Calendar className="h-8 w-8 text-muted-foreground/30" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-base">{ev.title}</span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border",
                            ev.eventType === "BUSINESS_TOUR"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                          )}>
                            {ev.eventType === "BUSINESS_TOUR" ? "Business Tour" : "Trade Fair"}
                          </span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", STATUS_STYLE[st])}>
                            {STATUS_LABEL[st]}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ev.city}, {ev.country}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmt(ev.startDate)} → {fmt(ev.endDate)}</span>
                          <span className="flex items-center gap-1 text-primary font-semibold">
                            <IndianRupee className="h-3 w-3" />{ev.costPerSeat.toLocaleString("en-IN")}/seat
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Switch checked={ev.isActive} onCheckedChange={() => toggleActive(ev)} title="Active/Inactive" />
                        <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => makeBannerFromEvent(ev)} title="Use as home banner">
                          <Megaphone className="h-3.5 w-3.5 mr-1" /> Banner
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(ev)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(ev.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Seats progress */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {ev.bookedSeats}/{ev.totalSeats} booked · {avail} available
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all",
                            pct >= 90 ? "bg-red-500" : pct >= 60 ? "bg-amber-500" : "bg-emerald-500"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extra images strip */}
                {ev.images.length > 1 && (
                  <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
                    {ev.images.slice(1).map((img, i) => (
                      <img key={i} src={img} alt="" className="h-12 w-16 rounded-md object-cover border border-border shrink-0" />
                    ))}
                  </div>
                )}

                {/* Bookings toggle */}
                <button
                  onClick={() => {
                    (async () => {
                      await loadBookings(ev.id);
                      setTimeout(() => {
                        const el = document.getElementById(`assign-email-${ev.id}`) as HTMLInputElement | null;
                        el?.focus();
                      }, 100);
                    })();
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 border-t border-border/50 bg-muted/20 hover:bg-muted/50 text-xs font-semibold text-muted-foreground transition-colors"
                >
                  <span>View Bookings & Assign ({ev._count?.bookings ?? ev.bookedSeats})</span>
                  {isExp ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {isExp && (
                  <div className="px-4 pb-3">
                    {/* Assign booking inline form */}
                    <div className="mb-3 p-3 rounded-lg border bg-accent/30">
                      <div className="text-xs font-semibold mb-2">Assign booking to a user</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                        <div>
                          <Label className="text-xs">User email</Label>
                          <Input id={`assign-email-${ev.id}`} type="email" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} placeholder="user@example.com" className="h-8 mt-1" />
                        </div>
                        <div>
                          <Label className="text-xs">Seats</Label>
                          <Input type="number" min={1} value={assignSeats} onChange={(e) => setAssignSeats(Math.max(1, parseInt(e.target.value || "1")))} className="h-8 mt-1" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="h-8 mt-5" disabled={assigning}
                            onClick={async () => {
                              setAssignErr("");
                              setAssigning(true);
                              try {
                                const r = await fetch(`/api/admin/events/${ev.id}/assign-booking`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ email: assignEmail, seats: assignSeats, paymentStatus: "PAID" })
                                });
                                const d = await r.json();
                                if (!r.ok) { setAssignErr(d.error || "Failed to assign"); }
                                else {
                                  setAssignEmail(""); setAssignSeats(1);
                                  // Reload bookings for this event
                                  try {
                                    const rb = await fetch(`/api/events/${ev.id}/bookings`);
                                    if (rb.ok) {
                                      const arr = await rb.json();
                                      setBookings((b) => ({ ...b, [ev.id]: Array.isArray(arr) ? arr : [] }));
                                    }
                                  } catch {}
                                  await load();
                                }
                              } catch (e: any) {
                                setAssignErr(e?.message || "Network error");
                              } finally {
                                setAssigning(false);
                              }
                            }}
                          >Assign</Button>
                          {assignErr && <div className="text-xs text-destructive self-center">{assignErr}</div>}
                        </div>
                      </div>
                    </div>

                    {!(bookings[ev.id] ?? []).length ? (
                      <p className="text-xs text-muted-foreground py-3 text-center">No bookings yet.</p>
                    ) : (
                      <table className="w-full text-xs mt-2">
                        <thead>
                          <tr className="text-muted-foreground border-b border-border">
                            <th className="text-left pb-1.5">Buyer</th>
                            <th className="text-left pb-1.5">Email</th>
                            <th className="text-center pb-1.5">Seats</th>
                            <th className="text-right pb-1.5">Amount</th>
                            <th className="text-center pb-1.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {(bookings[ev.id] ?? []).map((b) => (
                            <tr key={b.id}>
                              <td className="py-1.5 font-medium">{b.userName}</td>
                              <td className="py-1.5 text-muted-foreground">{b.userEmail}</td>
                              <td className="py-1.5 text-center">{b.seats}</td>
                              <td className="py-1.5 text-right">₹{b.totalAmount.toLocaleString("en-IN")}</td>
                              <td className="py-1.5 text-center">
                                <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold border",
                                  b.paymentStatus === "PAID"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                )}>
                                  {b.paymentStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {!loading && events.length === 0 && !loadErr && (
          <div className="rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Calendar className="h-16 w-16 opacity-10" />
            <div className="font-semibold text-lg">No events yet</div>
            <Button variant="outline" onClick={openAdd}><Plus className="h-4 w-4" /> Create your first event</Button>
          </div>
        )}
      </div>

      {/* ── ADD / EDIT DIALOG ── */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) { setDialogOpen(false); setSaveErr(""); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "Add New Event"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1 max-h-[72vh] overflow-y-auto pr-2">
            {/* Title */}
            <div>
              <Label>Event Title *</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="China Trade Fair 2025 – Electronics" className="mt-1" autoComplete="off" />
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What's included, itinerary, highlights…"
                rows={3} className="mt-1 resize-none" />
            </div>

            {/* Trip Overview */}
            <div className="space-y-3">
              <div>
                <Label>Trip Overview heading (popup)</Label>
                <Input
                  value={(form as any).overviewHeading}
                  onChange={(e) => setForm((f: any) => ({ ...f, overviewHeading: e.target.value }))}
                  placeholder="Optional heading shown in the overview popup"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Trip Overview (public card)</Label>
                <Textarea value={(form as any).overview}
                  onChange={(e) => setForm((f: any) => ({ ...f, overview: e.target.value }))}
                  placeholder="Short overview shown on the tour page"
                  rows={3} className="mt-1 resize-none" />
              </div>
            </div>

            {/* Event Type */}
            <div>
              <Label>Event Type *</Label>
              <div className="grid grid-cols-2 gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, eventType: "BUSINESS_TOUR" }))}
                  className={cn(
                    "p-3 rounded-xl border-2 text-sm font-semibold transition-all",
                    form.eventType === "BUSINESS_TOUR"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  Business Tour
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, eventType: "TRADE_FAIR" }))}
                  className={cn(
                    "p-3 rounded-xl border-2 text-sm font-semibold transition-all",
                    form.eventType === "TRADE_FAIR"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  Trade Fair
                </button>
              </div>
            </div>

            {/* Age & Social proof */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="text-sm font-bold">Eligibility & Social Proof</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Min Age</Label>
                  <Input type="number" value={(form as any).minAge} onChange={(e) => setForm((f: any) => ({ ...f, minAge: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label>Max Age</Label>
                  <Input type="number" value={(form as any).maxAge} onChange={(e) => setForm((f: any) => ({ ...f, maxAge: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label>Happy Travellers</Label>
                  <Input type="number" value={(form as any).happyTravellers} onChange={(e) => setForm((f: any) => ({ ...f, happyTravellers: e.target.value }))} className="mt-1" />
                </div>
              </div>
            </div>

            {/* Highlights / Inclusions / Exclusions */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-4">
              <div className="text-sm font-bold">Trip Details</div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Highlights</Label>
                  <div className="mt-2 space-y-2">
                    {((form as any).highlights || []).map((it: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={it} onChange={(e) => setForm((f: any) => ({ ...f, highlights: f.highlights.map((x: string, j: number) => j === i ? e.target.value : x) }))} />
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setForm((f: any) => ({ ...f, highlights: f.highlights.filter((_: any, j: number) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => setForm((f: any) => ({ ...f, highlights: [...(f.highlights || []), ""] }))}>Add Highlight</Button>
                  </div>
                </div>
                <div>
                  <Label>Inclusions</Label>
                  <div className="mt-2 space-y-2">
                    {((form as any).inclusions || []).map((it: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={it} onChange={(e) => setForm((f: any) => ({ ...f, inclusions: f.inclusions.map((x: string, j: number) => j === i ? e.target.value : x) }))} />
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setForm((f: any) => ({ ...f, inclusions: f.inclusions.filter((_: any, j: number) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => setForm((f: any) => ({ ...f, inclusions: [...(f.inclusions || []), ""] }))}>Add Inclusion</Button>
                  </div>
                </div>
                <div>
                  <Label>Exclusions</Label>
                  <div className="mt-2 space-y-2">
                    {((form as any).exclusions || []).map((it: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={it} onChange={(e) => setForm((f: any) => ({ ...f, exclusions: f.exclusions.map((x: string, j: number) => j === i ? e.target.value : x) }))} />
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setForm((f: any) => ({ ...f, exclusions: f.exclusions.filter((_: any, j: number) => j !== i) }))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => setForm((f: any) => ({ ...f, exclusions: [...(f.exclusions || []), ""] }))}>Add Exclusion</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* City + Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City *</Label>
                <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="Guangzhou" className="mt-1" />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  placeholder="China" className="mt-1" />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start Date *</Label>
                <Input type="date" value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label>End Date *</Label>
                <Input type="date" value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className="mt-1" />
              </div>
              <div className="col-span-2">
                <Label>Booking End Date (optional)</Label>
                <Input type="date" value={form.bookingEndDate}
                  onChange={(e) => setForm((f) => ({ ...f, bookingEndDate: e.target.value }))} className="mt-1" />
                <p className="text-[11px] text-muted-foreground mt-1">After this date, new bookings will be blocked automatically.</p>
              </div>
            </div>

            {/* Cost + Seats */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="text-sm font-bold">Pricing & Capacity</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Discounted Price (₹) *</Label>
                  <Input
                    type="text"
                    value={form.costPerSeat}
                    onChange={(e) => setForm((f) => ({ ...f, costPerSeat: e.target.value }))}
                    placeholder="345000"
                    className="mt-1"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <Label>Actual Price / MRP (₹)</Label>
                  <Input
                    type="text"
                    value={(form as any).mrp}
                    onChange={(e) => setForm((f: any) => ({ ...f, mrp: e.target.value }))}
                    placeholder="356000"
                    className="mt-1"
                    autoComplete="off"
                  />
                </div>
                <div className="col-span-2 text-[11px] text-muted-foreground">
                  {Number((form as any).mrp) > Number(form.costPerSeat) && (
                    <span>
                      Discount: {Math.round((1 - Number(form.costPerSeat) / Number((form as any).mrp)) * 100)}% off
                    </span>
                  )}
                </div>
                <div>
                  <Label>Total Seats *</Label>
                  <Input
                    type="text"
                    value={form.totalSeats}
                    onChange={(e) => setForm((f) => ({ ...f, totalSeats: e.target.value }))}
                    placeholder="30"
                    className="mt-1"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="flex items-center gap-1.5 mb-2">
                <ImageIcon className="h-3.5 w-3.5" /> Event Photos
              </Label>
              <div
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer transition-colors",
                  "hover:border-primary/50 hover:bg-primary/5",
                  uploading && "opacity-60 pointer-events-none"
                )}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-semibold">
                  {uploading ? "Uploading…" : "Click to upload photos from your device"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP · Multiple files</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)} />

              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative h-20 w-24 rounded-lg border border-border overflow-hidden group bg-muted">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                        className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-primary/80 text-primary-foreground text-[9px] font-bold text-center py-0.5">COVER</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Itinerary (Day-wise) */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">Itinerary (Day-wise)</div>
                <Button size="sm" variant="outline" onClick={() => setDays((d) => [...d, { heading: "", title: `Arrival`, description: "" }])}>Add Day</Button>
              </div>
              {days.length === 0 ? (
                <p className="text-xs text-muted-foreground">No days added. Click "Add Day" to create the itinerary.</p>
              ) : (
                <div className="space-y-3">
                  {days.map((d, i) => (
                    <div key={i} className="rounded-lg border border-border p-3 bg-card/50">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">Day {i + 1}</div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDays((arr) => arr.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        <div>
                          <Label>Heading (optional)</Label>
                          <Input value={d.heading || ""} onChange={(e) => setDays((arr) => arr.map((x, j) => j === i ? { ...x, heading: e.target.value } : x))} className="mt-1" placeholder="e.g. Nara & Osaka Sightseeing" />
                        </div>
                        <div>
                          <Label>Title</Label>
                          <Input value={d.title} onChange={(e) => setDays((arr) => arr.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className="mt-1" placeholder="Arrival in Osaka | Welcome to Japan!" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea rows={3} value={d.description} onChange={(e) => setDays((arr) => arr.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} className="mt-1 resize-none" placeholder="Brief about the activities planned for the day." />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Active toggle */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3.5">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} id="active-sw" />
              <div>
                <Label htmlFor="active-sw" className="cursor-pointer font-semibold">Active (visible on homepage)</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle off to hide from public</p>
              </div>
            </div>

            {/* Error message */}
            {saveErr && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive px-3 py-2.5 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" /> {saveErr}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button variant="gradient" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Event?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">All bookings will be deleted too. This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
