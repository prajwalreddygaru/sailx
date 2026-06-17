"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "sailx-enquiry-popup-seen";
const POPUP_DELAY_MS = 2500;

function shouldShowPopup(pathname: string) {
  if (pathname.startsWith("/dashboard")) return false;
  if (pathname.startsWith("/login")) return false;
  if (pathname.startsWith("/register")) return false;
  if (pathname.startsWith("/forgot-password")) return false;
  return true;
}

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70">
      {children}
    </span>
  );
}

export function EnquiryPopup() {
  const pathname = usePathname() || "/";
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [destFocused, setDestFocused] = React.useState(false);

  const enabled = shouldShowPopup(pathname);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !enabled) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* private browsing */
    }

    const timer = window.setTimeout(() => setOpen(true), POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [mounted, enabled]);

  function markSeen() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) markSeen();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedDestination = destination.trim();

    if (!trimmedName) {
      toast.error("Please enter your name");
      return;
    }
    if (!trimmedEmail && !trimmedPhone) {
      toast.error("Please enter your email or phone number");
      return;
    }
    if (!trimmedDestination) {
      toast.error("Please enter your destination");
      return;
    }

    setSubmitting(true);
    try {
      const fullPhone = trimmedPhone
        ? trimmedPhone.startsWith("+")
          ? trimmedPhone
          : `+91${trimmedPhone.replace(/\D/g, "")}`
        : null;

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail || null,
          phone: fullPhone,
          message: `Destination: ${trimmedDestination}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to submit enquiry");
        return;
      }

      markSeen();
      setOpen(false);
      setName("");
      setEmail("");
      setPhone("");
      setDestination("");
      toast.success("Thank you! Our team will get back to you shortly.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!mounted || !enabled) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-[calc(100vw-2rem)] rounded-2xl border-0 p-0 overflow-hidden shadow-2xl gap-0">
        <div className="bg-white px-6 pt-8 pb-6 sm:px-8">
          <DialogTitle className="text-center text-2xl font-bold text-red-600 tracking-tight">
            Enquire Now
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground mt-2 leading-relaxed px-2">
            Fill out the form and our team will get back to you shortly.
          </DialogDescription>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                required
                className="w-full h-12 rounded-xl border border-border/80 bg-white px-4 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <FieldIcon>
                <User className="h-4 w-4" />
              </FieldIcon>
            </div>

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email ID"
                className="w-full h-12 rounded-xl border border-border/80 bg-white px-4 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              <FieldIcon>
                <Mail className="h-4 w-4" />
              </FieldIcon>
            </div>

            <div className="flex h-12 rounded-xl border border-border/80 bg-white overflow-hidden focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-colors">
              <div className="flex items-center gap-1.5 shrink-0 border-r border-border/80 px-3 text-sm text-muted-foreground bg-muted/30">
                <span className="text-base leading-none" aria-hidden>🇮🇳</span>
                <span className="font-medium">+91</span>
              </div>
              <div className="relative flex-1 min-w-0">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, ""))}
                  placeholder=""
                  inputMode="numeric"
                  className="w-full h-full bg-transparent px-3 pr-10 text-sm outline-none"
                />
                <FieldIcon>
                  <Phone className="h-4 w-4" />
                </FieldIcon>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setDestFocused(true)}
                onBlur={() => setDestFocused(false)}
                placeholder="Enter Your Destination"
                required
                className={cn(
                  "w-full h-12 rounded-xl border bg-white px-4 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-red-500/20",
                  destFocused ? "border-red-500" : "border-border/80 focus:border-red-500"
                )}
              />
              <FieldIcon>
                <MapPin className={cn("h-4 w-4 transition-colors", destFocused ? "text-red-500" : "")} />
              </FieldIcon>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide uppercase transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Now"
              )}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
