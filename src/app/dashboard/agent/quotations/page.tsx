"use client";

import * as React from "react";
import { Send, Loader2, Package, RefreshCw, CheckCircle2, Clock, IndianRupee } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  code: string;
  status: string;
  quantity: number;
  quotedPrice?: number | null;
  notes?: string | null;
  productTitle: string;
  product: { title: string };
  user: { name: string; email: string };
  createdAt: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  REQUESTED:  { label: "Awaiting Quote", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  QUOTED:     { label: "Quoted",         color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  PAID:       { label: "Paid",           color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  SHIPPED:    { label: "Shipped",        color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  DELIVERED:  { label: "Delivered",      color: "bg-green-500/10 text-green-400 border-green-500/20" },
  CANCELLED:  { label: "Cancelled",      color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export default function AgentQuotationsPage() {
  const [orders, setOrders]         = React.useState<Order[]>([]);
  const [loading, setLoading]       = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [price, setPrice]           = React.useState("");
  const [notes, setNotes]           = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function fetchOrders() {
    setLoading(true);
    const res = await fetch("/api/sample-orders");
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  }

  React.useEffect(() => { fetchOrders(); }, []);

  const pending = orders.filter((o) => o.status === "REQUESTED");
  const quoted  = orders.filter((o) => !["REQUESTED", "CANCELLED"].includes(o.status));

  const selectedOrder = orders.find((o) => o.id === selectedId);

  async function submitQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) { toast.error("Select an order first"); return; }
    const p = parseFloat(price);
    if (!p || p <= 0) { toast.error("Enter a valid price"); return; }
    setSubmitting(true);
    const res = await fetch(`/api/sample-orders/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotedPrice: p, status: "QUOTED", notes: notes || undefined }),
    });
    if (res.ok) {
      toast.success("Quote sent to buyer!");
      setSelectedId(null);
      setPrice("");
      setNotes("");
      fetchOrders();
    } else {
      toast.error("Failed to submit quote");
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Review pending orders and send price quotes to buyers."
        actions={
          <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} /> Refresh
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left: orders list */}
          <div className="lg:col-span-2 space-y-4">
            {/* Pending quotes */}
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-yellow-400" /> Pending Quotes
                <span className="ml-1 text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">{pending.length}</span>
              </h3>
              {pending.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No pending orders.</CardContent></Card>
              ) : pending.map((o) => (
                <Card
                  key={o.id}
                  className={cn("p-4 cursor-pointer transition-colors hover:bg-accent/40 mb-2", selectedId === o.id && "ring-2 ring-primary")}
                  onClick={() => { setSelectedId(o.id); setPrice(""); setNotes(""); }}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">{o.code}</div>
                      <div className="font-semibold mt-0.5">{o.product?.title ?? o.productTitle}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Qty: {o.quantity} · Buyer: {o.user?.name}</div>
                      {o.notes && <div className="text-xs text-muted-foreground mt-0.5 italic">"{o.notes}"</div>}
                    </div>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded border", STATUS_LABEL["REQUESTED"].color)}>
                      Awaiting Quote
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Already quoted */}
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Submitted Quotations
              </h3>
              {quoted.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No quotations submitted yet.</CardContent></Card>
              ) : quoted.map((o) => {
                const sc = STATUS_LABEL[o.status] ?? STATUS_LABEL["QUOTED"];
                return (
                  <Card key={o.id} className="p-4 mb-2">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-mono text-xs text-muted-foreground">{o.code}</div>
                        <div className="font-semibold mt-0.5">{o.product?.title ?? o.productTitle}</div>
                        <div className="text-xs text-muted-foreground">Qty: {o.quantity} · Buyer: {o.user?.name}</div>
                      </div>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded border", sc.color)}>{sc.label}</span>
                    </div>
                    {o.quotedPrice && (
                      <div className="mt-3 pt-3 border-t flex items-center gap-1 text-sm font-semibold text-primary">
                        <IndianRupee className="h-3.5 w-3.5" /> {o.quotedPrice.toLocaleString("en-IN")}
                        <span className="text-xs font-normal text-muted-foreground ml-1">quoted price</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right: quote form */}
          <Card className="h-fit sticky top-6">
            <CardHeader><CardTitle className="text-base">Send Quote</CardTitle></CardHeader>
            <CardContent>
              {!selectedOrder ? (
                <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                  <Package className="h-8 w-8 opacity-30" />
                  <p className="text-sm text-center">Click a pending order on the left to fill in your quote</p>
                </div>
              ) : (
                <form onSubmit={submitQuote} className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                    <div className="font-medium">{selectedOrder.product?.title ?? selectedOrder.productTitle}</div>
                    <div className="text-xs text-muted-foreground font-mono">{selectedOrder.code}</div>
                    <div className="text-xs text-muted-foreground">Qty: {selectedOrder.quantity} · {selectedOrder.user?.name}</div>
                    {selectedOrder.notes && <div className="text-xs italic text-muted-foreground">"{selectedOrder.notes}"</div>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Quoted Price (₹) *</Label>
                    <Input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="e.g. 1200"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Notes to buyer</Label>
                    <Textarea
                      rows={3}
                      placeholder="Includes packaging, lead time, delivery terms…"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedId(null)}>Cancel</Button>
                    <Button type="submit" variant="gradient" className="flex-1" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-3.5 w-3.5 mr-1" /> Send Quote</>}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
