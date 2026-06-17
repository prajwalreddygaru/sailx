"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Search, ChevronDown, History, LayoutDashboard, LogOut, User, Calendar, Package, Info, Phone, Mail, FileText } from "lucide-react";
import { useSession } from "next-auth/react";
import { signOutAndRedirect } from "@/lib/sign-out";
import { saveScrollForRoute } from "@/lib/scroll-storage";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function MarketingNavbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [results, setResults] = React.useState<{ events: any[]; catalogue: any[] } | null>(null);
  const [searching, setSearching] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const [services, setServices] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);

  // Debounced search
  React.useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) setResults(await res.json());
      } catch { /* silent */ }
      setSearching(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setResults(null);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Load services for the navbar menu (DB-backed with static fallback)
  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/services");
        if (!r.ok) return; // fallback to static in render
        const arr = await r.json();
        if (Array.isArray(arr)) setServices(arr);
      } catch { /* ignore */ }
    })();
  }, []);

  // Load categories dynamically for Categories sub-menu dropdown
  React.useEffect(() => {
    (async () => {
      try {
        let r = await fetch("/api/admin/categories");
        if (!r.ok) {
          r = await fetch("/api/categories");
        }
        if (r.ok) {
          const arr = await r.json();
          if (Array.isArray(arr)) setCategories(arr);
        }
      } catch { /* ignore */ }
    })();
  }, []);

  // Close mobile menu when search query is typed
  React.useEffect(() => {
    if (q.trim() !== "") {
      setOpen(false);
    }
  }, [q]);

  void pathname;

  const router = useRouter();
  const isLoggedIn = status === "authenticated" && !!session?.user;
  const userName = session?.user?.name ?? "User";
  const userRole = (session?.user as any)?.role as string ?? "";

  const dashboardHref =
    userRole === "ADMIN"    ? "/dashboard/admin" :
    userRole === "AGENT"    ? "/dashboard/agent" :
    "/dashboard/buyer";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 will-change-transform transform-gpu",
        overlay
          ? "bg-transparent border-b border-transparent"
          : "bg-background/90 backdrop-blur-xl border-b border-border text-foreground"
      )}
    >
      {/* Top contact strip */}
      <div className="hidden md:block bg-red-600 text-white text-sm font-bold">
        <div className="container h-10 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-5">
            <a href="tel:+918660752291" className="inline-flex items-center gap-1.5 hover:opacity-90 text-white">
              <Phone className="h-4 w-4 text-white" /> +918660752291
            </a>
            <span className="opacity-40 text-white">|</span>
            <a href="mailto:info@sailxchina.com" className="inline-flex items-center gap-1.5 hover:opacity-90 text-white">
              <Mail className="h-4 w-4 text-white" /> info@sailxchina.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="opacity-90 text-white hidden sm:inline">Follow us:</span>
            <a href="https://m.facebook.com/saahilhussain0" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
              <img src="/images/FB LOGO.png" alt="Facebook" className="h-7 w-7 object-contain" />
            </a>
            <a href="https://www.instagram.com/sailxchina" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
              <img src="/images/insta logo.png" alt="Instagram" className="h-7 w-7 object-contain" />
            </a>
            <a href="https://www.youtube.com/@Saahilkannada" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:opacity-80 transition-opacity">
              <img src="/images/yt logo.png" alt="YouTube" className="h-7 w-7 object-contain" />
            </a>
            {!isLoggedIn && <Link href="/login" className="hover:underline text-white hidden md:inline font-bold">Login</Link>}
          </div>
        </div>
      </div>

      <div className="container flex h-14 items-center gap-4">
        {/* Logo */}
        <div className="shrink-0 -ml-2 md:ml-0">
          <Logo />
        </div>

        {/* Search bar next to logo, overlaying hero */}
        <div ref={searchRef} className="hidden md:flex w-[min(380px,42svw)] relative ml-3">
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10",
            overlay ? "text-muted-foreground" : "text-muted-foreground"
          )} />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => { if (q.trim()) setResults(results); }}
            placeholder="Search tours, catalogue…"
            className={cn(
              "pl-9 h-9 rounded-xl text-sm w-full outline-none text-foreground",
              overlay
                ? "bg-white border border-white/60 placeholder:text-gray-500 shadow-sm"
                : "border border-border/70 bg-background"
            )}
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-3.5 w-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Results dropdown */}
          {results && (results.events.length > 0 || results.catalogue.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-popover shadow-xl overflow-hidden z-50">
              {results.events.length > 0 && (
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50">Tours & Events</div>
              )}
              {results.events.map((ev) => (
                <button key={ev.id}
                  onClick={() => { saveScrollForRoute(); router.push(`/events/${ev.id}`, { scroll: false }); setResults(null); setQ(""); }}
                  className="block w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-sm">
                  <Calendar className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{ev.title}</div>
                    <div className="text-[11px] text-muted-foreground">{ev.city}, {ev.country}</div>
                  </div>
                </button>
              ))}
              {results.catalogue.length > 0 && (
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 border-t">Catalogue</div>
              )}
              {results.catalogue.map((item) => (
                <button key={item.id}
                  onClick={() => { saveScrollForRoute(); router.push("/#catalogue", { scroll: false }); setResults(null); setQ(""); }}
                  className="block w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-sm border-t">
                  <Package className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground">₹{item.price.toLocaleString("en-IN")}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {results && results.events.length === 0 && results.catalogue.length === 0 && q.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border bg-popover shadow-xl p-4 text-sm text-muted-foreground z-50">
              No results for “{q}”
            </div>
          )}
        </div>

        {/* Right nav */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className={cn("inline-flex items-center gap-1 hover:opacity-90 font-semibold not-italic", overlay && "text-white")}>
                  Our Services <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 text-center font-sans not-italic [&_*]:font-sans">
                {(() => {
                  const toSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                  const staticServices = [
                    { title: "End-to-End Product Sourcing", slug: "end-to-end-product-sourcing" },
                    { title: "China-Side Sourcing Support", slug: "china-side-sourcing-support" },
                    { title: "Translation & Business Communication", slug: "translation-business-communication" },
                    { title: "Factory Inspections & Quality Checks", slug: "factory-inspections-quality-checks" },
                    { title: "Supplier Payment Support", slug: "supplier-payment-support" },
                    { title: "Price Negotiation Support", slug: "price-negotiation-support" },
                  ];
                  const list = services && services.length ? services : staticServices;
                  return list.map((s: any) => {
                    const href = `/services/${s.slug ?? toSlug(s.title)}`;
                    const label = s.title;
                    return (
                      <DropdownMenuItem key={href} asChild className="justify-center text-sm font-medium font-sans not-italic">
                        <Link href={href} className="font-sans not-italic">{label}</Link>
                      </DropdownMenuItem>
                    );
                  });
                })()}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className={cn("inline-flex items-center gap-1 hover:opacity-90", overlay && "text-white")}>
                  Categories <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 text-center">
                {categories && categories.length > 0 ? (
                  categories
                    .filter((c: any) => c.isVisible !== false)
                    .map((c: any) => {
                      const label = c.name as string;
                      return (
                        <DropdownMenuItem key={c.id} asChild className="justify-center text-sm font-medium">
                          <Link href="/#catalogue">{label}</Link>
                        </DropdownMenuItem>
                      );
                    })
                ) : (
                  <>
                    <DropdownMenuItem asChild className="justify-center">
                      <Link href="/tours?type=BUSINESS_TOUR">Business Trips</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="justify-center">
                      <Link href="/tours?type=TRADE_FAIR">Trade Fairs</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="inline-flex items-center gap-1">
              <Link href="/about" className={cn("hover:opacity-90", overlay && "text-white")}>About Us</Link>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button aria-label="About menu" className={cn("inline-flex items-center hover:opacity-90", overlay && "text-white")}> 
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 text-center">
                  <DropdownMenuItem asChild className="justify-center">
                    <Link href="/about">About SailX</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="justify-center">
                    <Link href="/about/founder">Founder</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </nav>
          <div className={cn("h-5 w-px mx-1", overlay ? "bg-white/40" : "bg-foreground/30")} />
          <ThemeToggle />

          {isLoggedIn ? (
            /* ── LOGGED IN ─────────────────────────── */
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-colors border",
                  overlay ? "border-white/50 bg-transparent hover:bg-white/10 text-white" : "border-border hover:bg-accent"
                )}>
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className={cn("text-xs font-bold", overlay ? "bg-white/20 text-white" : "bg-primary/10 text-primary") }>
                      {initials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">Hi, {userName.split(" ")[0]}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5", overlay ? "text-white/80" : "text-muted-foreground")} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal truncate">
                  {session?.user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref}>
                    <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buyer/bookings">
                    <History className="h-3.5 w-3.5" /> Booking History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buyer/settings">
                    <User className="h-3.5 w-3.5" /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/about">
                    <Info className="h-3.5 w-3.5" /> About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#services">
                    <FileText className="h-3.5 w-3.5" /> Our Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#catalogue">
                    <Package className="h-3.5 w-3.5" /> Categories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">
                    <Phone className="h-3.5 w-3.5" /> Contact Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/payment-policy">
                    <FileText className="h-3.5 w-3.5" /> Payment Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cancellation-policy">
                    <FileText className="h-3.5 w-3.5" /> Cancellation Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/refund-policy">
                    <FileText className="h-3.5 w-3.5" /> Refund Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/visa-policy">
                    <FileText className="h-3.5 w-3.5" /> Visa Policy
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/terms">
                    <FileText className="h-3.5 w-3.5" /> T&C
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => signOutAndRedirect("/")}
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* ── NOT LOGGED IN ─────────────────────── */
            <>
              <Button asChild variant="ghost" size="sm" className={cn("font-semibold", overlay && "text-white") }>
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <ThemeToggle />
          {isLoggedIn && (
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                {initials(userName)}
              </AvatarFallback>
            </Avatar>
          )}
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} data-auth-bypass>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      {!pathname.startsWith("/about") && !pathname.startsWith("/contact") && !pathname.startsWith("/blog") && !pathname.startsWith("/guides") && !pathname.startsWith("/sourcing-reports") && !pathname.startsWith("/trust-center") && (
        <div ref={searchRef} className="md:hidden border-t border-border/50 px-4 py-2">
        <div className="relative max-w-[260px] mx-auto w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tours, catalogue…"
            className="pl-9 h-9 rounded-xl text-sm w-full outline-none border border-border/70 bg-background text-foreground relative z-10"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
              <div className="h-3.5 w-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {/* Mobile results dropdown */}
          {results && (results.events.length > 0 || results.catalogue.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-1 rounded-xl border bg-popover shadow-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
              {results.events.length > 0 && (
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50">Tours & Events</div>
              )}
              {results.events.map((ev) => (
                <button key={ev.id}
                  onClick={() => { saveScrollForRoute(); router.push(`/events/${ev.id}`, { scroll: false }); setResults(null); setQ(""); }}
                  className="block w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-sm">
                  <Calendar className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{ev.title}</div>
                    <div className="text-[11px] text-muted-foreground">{ev.city}, {ev.country}</div>
                  </div>
                </button>
              ))}
              {results.catalogue.length > 0 && (
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/50 border-t">Catalogue</div>
              )}
              {results.catalogue.map((item) => (
                <button key={item.id}
                  onClick={() => { saveScrollForRoute(); router.push("/#catalogue", { scroll: false }); setResults(null); setQ(""); }}
                  className="block w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors text-sm border-t">
                  <Package className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{item.title}</div>
                    <div className="text-[11px] text-muted-foreground">₹{item.price.toLocaleString("en-IN")}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
          {results && results.events.length === 0 && results.catalogue.length === 0 && q.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1 rounded-xl border bg-popover shadow-xl p-4 text-sm text-muted-foreground z-50">
              No results for “{q}”
            </div>
          )}
        </div>
      </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="container py-3 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  <div className="text-sm font-semibold px-1 mb-1">Hi, {userName} 👋</div>
                  <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                    <Link href={dashboardHref}><LayoutDashboard className="h-4 w-4 mr-2" />Dashboard</Link>
                  </Button>
                  <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                    <Link href="/dashboard/buyer/bookings"><History className="h-4 w-4 mr-2" />Booking History</Link>
                  </Button>

                  {/* Info / Policy Links */}
                  <div className="grid grid-cols-1 gap-2 mt-1">
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/about"><Info className="h-4 w-4 mr-2" />About Us</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/#services"><FileText className="h-4 w-4 mr-2" />Our Services</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/#catalogue"><Package className="h-4 w-4 mr-2" />Categories</Link>
                    </Button>
                    {categories && categories.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pl-8 pr-2">
                        {categories.filter((c: any) => c.isVisible !== false).map((c: any) => (
                          <a
                            key={c.id}
                            href="/#catalogue"
                            onClick={() => setOpen(false)}
                            className="text-xs px-2 py-1.5 rounded-lg border text-muted-foreground hover:bg-accent transition-colors"
                          >
                            {c.name}
                          </a>
                        ))}
                      </div>
                    )}
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/contact"><Phone className="h-4 w-4 mr-2" />Contact Us</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/payment-policy"><FileText className="h-4 w-4 mr-2" />Payment Policy</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/cancellation-policy"><FileText className="h-4 w-4 mr-2" />Cancellation Policy</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/refund-policy"><FileText className="h-4 w-4 mr-2" />Refund Policy</Link>
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    className="justify-start"
                    onClick={() => { setOpen(false); signOutAndRedirect("/"); }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />Sign out
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" className="flex-1">
                      <Link href="/login" onClick={() => setOpen(false)}>Sign in</Link>
                    </Button>
                    <Button asChild variant="gradient" className="flex-1">
                      <Link href="/register" onClick={() => setOpen(false)}>Get started</Link>
                    </Button>
                  </div>

                  {/* Quick Links */}
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/about"><Info className="h-4 w-4 mr-2" />About Us</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/#services"><FileText className="h-4 w-4 mr-2" />Our Services</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/#catalogue"><Package className="h-4 w-4 mr-2" />Categories</Link>
                    </Button>
                    {categories && categories.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pl-8 pr-2">
                        {categories.filter((c: any) => c.isVisible !== false).map((c: any) => (
                          <a
                            key={c.id}
                            href="/#catalogue"
                            onClick={() => setOpen(false)}
                            className="text-xs px-2 py-1.5 rounded-lg border text-muted-foreground hover:bg-accent transition-colors"
                          >
                            {c.name}
                          </a>
                        ))}
                      </div>
                    )}
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/contact"><Phone className="h-4 w-4 mr-2" />Contact Us</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/payment-policy"><FileText className="h-4 w-4 mr-2" />Payment Policy</Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start" onClick={() => setOpen(false)}>
                      <Link href="/refund-policy"><FileText className="h-4 w-4 mr-2" />Refund Policy</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

