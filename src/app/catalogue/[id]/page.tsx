"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IndianRupee, Loader2, Mail, User, Phone, CheckCircle2, ShieldCheck, ShoppingBag } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/footer";
import { CatalogueDescription } from "@/components/catalogue-description";

export default function CatalogueBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { status } = useSession();
  const [item, setItem] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [qty, setQty] = React.useState(1);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  /* Ask your question form */
  const [qName, setQName] = React.useState("");
  const [qEmail, setQEmail] = React.useState("");
  const [qPhone, setQPhone] = React.useState("");
  const [qMessage, setQMessage] = React.useState("");
  const [qSent, setQSent] = React.useState(false);
  const [qErr, setQErr] = React.useState("");
  const [qLoading, setQLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/catalogue/${id}`);
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Not found");
        setItem(d);
      } catch (e) {
        setError("Failed to load item.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleBuy() {
    if (!item) return;
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/catalogue/${id}`)}`);
      return;
    }
    setProcessing(true);
    setError("");
    try {
      const res = await fetch(`/api/catalogue/${id}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to initiate payment"); setProcessing(false); return; }
      if (data.demo) { alert("Purchase confirmed (demo mode). Thank you!"); setProcessing(false); return; }

      const win: any = window as any;
      if (!win.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);
        await new Promise((r) => { script.onload = r; });
      }

      const rzp = new win.Razorpay({
        key:         data.key,
        amount:      data.amount,
        currency:    data.currency,
        name:        data.name,
        description: data.description,
        order_id:    data.orderId,
        prefill:     data.prefill,
        theme:       { color: "#e11d48" },
        handler: async (response: any) => {
          await fetch(`/api/catalogue/${id}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              purchaseId:         data.purchaseId,
              razorpayOrderId:    response.razorpay_order_id,
              razorpayPaymentId:  response.razorpay_payment_id,
              razorpaySignature:  response.razorpay_signature,
            }),
          });
          setSuccess(true);
        },
      });
      rzp.on("payment.failed", () => { alert("Payment failed. Please try again."); });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  async function handleQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!qName || (!qEmail && !qPhone)) return;
    setQLoading(true);
    setQErr("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: qName,
          email: qEmail || null,
          phone: qPhone || null,
          message: qMessage ? `${qMessage}\n[Catalogue item: ${item?.title ?? id}]` : `[Enquiry about catalogue item: ${item?.title ?? id}]`,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setQErr(d.error || "Failed to submit"); setQLoading(false); return; }
      setQSent(true);
    } catch {
      setQErr("Network error");
    } finally {
      setQLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  );
  if (success) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4 max-w-md">
        <CheckCircle2 className="h-20 w-20 text-emerald-500 mx-auto" />
        <h1 className="text-3xl font-black">Booking Confirmed!</h1>
        <p className="text-muted-foreground">Your purchase for <strong>{item?.title}</strong> is confirmed. A PDF receipt has been sent to your email.</p>
        <div className="flex gap-3 justify-center pt-2">
          <Button asChild><Link href="/dashboard/buyer/orders">My Orders</Link></Button>
          <Button asChild variant="outline"><Link href="/">← Home</Link></Button>
        </div>
      </motion.div>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Item not found.</p>
      <BackButton preferHomeSection fallback="/#catalogue" label="← Back to Home" className="text-base" />
    </div>
  );

  const total = (item.price || 0) * qty;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/20 via-background to-background">
      <div className="container max-w-6xl px-4 sm:px-6 py-6 md:py-10">
        <BackButton preferHomeSection fallback="/#catalogue" label="Back to Home" className="mb-6" />

        {/* Desktop: hero image + purchase sidebar */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
          {/* Left column */}
          <div className="space-y-6 min-w-0">
            {/* Image — full width on desktop, first on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl lg:rounded-3xl overflow-hidden bg-muted aspect-[16/10] lg:aspect-[16/9] ring-1 ring-border/60 shadow-sm"
            >
              {item.image ? (
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/5 to-orange-400/5">
                  No image
                </div>
              )}
            </motion.div>

            {/* Title + badge — below image on desktop */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <ShoppingBag className="h-3.5 w-3.5" />
                Catalogue Item
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                {item.title}
              </h1>
            </div>

            {/* Description — full width under title on desktop */}
            {item.description && (
              <CatalogueDescription description={item.description} title={item.title} variant="full" />
            )}

            {/* Mobile purchase card */}
            <div className="lg:hidden">
              <PurchaseCard
                price={item.price || 0}
                qty={qty}
                setQty={setQty}
                total={total}
                error={error}
                processing={processing}
                onBuy={handleBuy}
              />
            </div>
          </div>

          {/* Right column — sticky purchase card (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <PurchaseCard
                price={item.price || 0}
                qty={qty}
                setQty={setQty}
                total={total}
                error={error}
                processing={processing}
                onBuy={handleBuy}
              />
            </div>
          </div>
        </div>

        {/* Ask your question */}
        <div className="mt-12 lg:mt-16 pt-10 border-t border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-xl md:text-2xl font-bold">Ask your question</h2>
          </div>
          {qSent ? (
            <div className="text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 max-w-2xl">
              Thank you! We will contact you shortly about this item.
            </div>
          ) : (
            <form onSubmit={handleQuestion} className="grid sm:grid-cols-2 lg:max-w-3xl gap-4">
              {qErr && <p className="text-destructive text-sm col-span-full">{qErr}</p>}
              <div className="relative">
                <Input value={qName} onChange={(e) => setQName(e.target.value)} placeholder="Your name" required className="pl-10 h-11 rounded-xl bg-card" />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <Input type="email" value={qEmail} onChange={(e) => setQEmail(e.target.value)} placeholder="Email ID" className="pl-10 h-11 rounded-xl bg-card" />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <Input value={qPhone} onChange={(e) => setQPhone(e.target.value)} placeholder="Phone number" className="pl-10 h-11 rounded-xl bg-card" />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <div className="relative">
                <Input value={qMessage} onChange={(e) => setQMessage(e.target.value)} placeholder={`Ask about ${item.title}…`} className="pl-10 h-11 rounded-xl bg-card" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">💬</span>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={qLoading} className="h-11 px-8 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold">
                  {qLoading ? "Submitting…" : "Submit Question"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      <MarketingFooter />
    </div>
  );
}

function PurchaseCard({
  price,
  qty,
  setQty,
  total,
  error,
  processing,
  onBuy,
}: {
  price: number;
  qty: number;
  setQty: (n: number) => void;
  total: number;
  error: string;
  processing: boolean;
  onBuy: () => void;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card shadow-lg shadow-black/5 overflow-hidden">
      <div className="bg-primary/5 px-5 py-4 border-b border-primary/10">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</div>
        <div className="flex items-baseline font-black text-3xl text-primary mt-1">
          <IndianRupee className="h-7 w-7 shrink-0" />
          {price.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <div className="text-sm font-semibold mb-2">Quantity</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-lg font-bold hover:bg-accent transition-colors"
            >
              −
            </button>
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-center font-bold text-lg h-10 w-16 rounded-xl"
            />
            <button
              type="button"
              onClick={() => setQty(qty + 1)}
              className="h-10 w-10 rounded-xl border border-border flex items-center justify-center text-lg font-bold hover:bg-accent transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-muted/50 p-4 space-y-2.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>₹{price.toLocaleString("en-IN")} × {qty}</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between font-black text-base border-t border-border/50 pt-2.5">
            <span>Total</span>
            <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {error && <p className="text-destructive text-sm font-medium">{error}</p>}

        <Button
          onClick={onBuy}
          disabled={processing}
          className="w-full h-12 font-black text-base gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md"
        >
          {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {processing ? "Processing…" : "Buy & Pay Now"}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          <span>Secured by Razorpay · PDF receipt sent to your email</span>
        </div>
      </div>
    </div>
  );
}
