"use client";

import React from "react";
import Link from "next/link";
import { Package, CreditCard, Loader2, RefreshCw, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const STATUS_COLOR: Record<string, string> = {
  REQUESTED:       "bg-yellow-100 text-yellow-800",
  QUOTED:          "bg-blue-100 text-blue-800",
  PAYMENT_PENDING: "bg-orange-100 text-orange-800",
  PAID:            "bg-green-100 text-green-800",
  PROCESSING:      "bg-purple-100 text-purple-800",
  SHIPPED:         "bg-indigo-100 text-indigo-800",
  DELIVERED:       "bg-green-200 text-green-900",
  CANCELLED:       "bg-red-100 text-red-800",
};

interface Order {
  id: string;
  code: string;
  status: string;
  quantity: number;
  quotedPrice?: number;
  isBulk: boolean;
  notes?: string;
  trackingInfo?: string;
  createdAt: string;
  product: { title: string; images: string[] };
  agent?: { name: string };
}

declare global { interface Window { Razorpay: any; } }

export default function BuyerOrdersPage() {
  const [orders, setOrders]   = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [paying, setPaying]   = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    const [soRes, cpRes] = await Promise.all([
      fetch("/api/sample-orders"),
      fetch("/api/catalogue/purchases"),
    ]);

    let sampleOrders: any[] = [];
    let cataloguePurchases: any[] = [];

    try {
      if (soRes.ok) {
        const soData = await soRes.json();
        if (Array.isArray(soData)) sampleOrders = soData;
      }
    } catch { /* ignore parse errors */ }

    try {
      if (cpRes.ok) {
        const cpData = await cpRes.json();
        if (Array.isArray(cpData)) cataloguePurchases = cpData;
      }
    } catch { /* ignore parse errors */ }

    // Normalize catalogue purchases to match Order shape
    const normalized: Order[] = cataloguePurchases.map((p: any) => ({
      id: p.id,
      code: "CAT-" + p.id.slice(-6).toUpperCase(),
      status: p.paymentStatus === "PAID" ? "PAID" : p.paymentStatus,
      quantity: 1,
      quotedPrice: p.totalAmount,
      isBulk: false,
      notes: undefined,
      trackingInfo: undefined,
      createdAt: p.createdAt,
      product: { title: p.item?.title ?? "Catalogue Item", images: p.item?.image ? [p.item.image] : [] },
      agent: undefined,
    }));

    const merged = [...sampleOrders, ...normalized].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(merged);
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  async function initiatePayment(orderId: string) {
    setPaying(orderId);
    try {
      const res  = await fetch(`/api/sample-orders/${orderId}/pay`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      if (data.demo) { toast.success("Demo: order marked as paid!"); load(); return; }

      if (!window.Razorpay) {
        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.onload = () => resolve();
          document.body.appendChild(s);
        });
      }
      const rzp = new window.Razorpay({
        key: data.key, order_id: data.orderId, amount: data.amount,
        currency: data.currency, name: data.name, description: data.description,
        handler: async (response: any) => {
          await fetch(`/api/sample-orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "PAID", razorpayPaymentId: response.razorpay_payment_id }),
          });
          toast.success("Payment successful! Invoice will be emailed to you.");
          load();
        },
      });
      rzp.open();
    } catch { toast.error("Payment failed"); }
    finally { setPaying(null); }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Sample &amp; bulk order requests</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-medium">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-1">Browse products and request a sample.</p>
            <Link href="/"><Button className="mt-4">Browse Products</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-medium">{order.code}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-800"}`}>
                        {order.status.replace(/_/g, " ")}
                      </span>
                      {order.isBulk && <Badge variant="outline" className="text-xs">Bulk</Badge>}
                    </div>
                    <p className="font-medium">{order.product.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {order.quantity}
                      {order.agent && ` • Agent: ${order.agent.name}`}
                    </p>
                    {order.quotedPrice && (
                      <p className="text-sm font-semibold text-primary">Quoted: ₹{order.quotedPrice.toLocaleString()}</p>
                    )}
                    {order.trackingInfo && (
                      <p className="text-sm text-muted-foreground">📦 {order.trackingInfo}</p>
                    )}
                    {order.notes && <p className="text-xs text-muted-foreground">Note: {order.notes}</p>}
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                    {order.status === "QUOTED" && (
                      <Button size="sm" onClick={() => initiatePayment(order.id)} disabled={paying === order.id}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {paying === order.id ? "Opening..." : "Pay Now"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
