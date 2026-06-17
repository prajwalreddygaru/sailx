"use client";

import React from "react";
import Link from "next/link";
import { Package, Ticket, Loader2, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BuyerDashboardPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(true);
  const [loadingBookings, setLoadingBookings] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/sample-orders").then((r) => r.json()),
      fetch("/api/catalogue/purchases").then((r) => r.json()),
    ])
      .then(([sampleOrders, cataloguePurchases]) => {
        const so = Array.isArray(sampleOrders) ? sampleOrders : [];
        const cp = Array.isArray(cataloguePurchases) ? cataloguePurchases : [];
        // Normalize catalogue purchases to match sample order shape
        const normalized = cp.map((p: any) => ({
          id: p.id,
          code: "CAT-" + p.id.slice(-6).toUpperCase(),
          productTitle: p.item?.title ?? "Catalogue Item",
          quotedPrice: p.totalAmount,
          status: p.paymentStatus === "PAID" ? "completed" : p.paymentStatus.toLowerCase(),
          createdAt: p.createdAt,
          _source: "catalogue",
        }));
        const merged = [...so, ...normalized].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(merged);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));

    fetch("/api/events/my-bookings")
      .then((r) => r.json())
      .then((d) => setBookings(Array.isArray(d) ? d : []))
      .finally(() => setLoadingBookings(false));
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* My Orders (Catalogue) */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4 text-primary" /> My Orders
          </CardTitle>
          <Link href="/dashboard/buyer/orders" className="text-xs text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {loadingOrders ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No orders yet. <Link href="/" className="text-primary hover:underline">Browse catalogue</Link> to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 rounded-lg border bg-card/40 hover:bg-accent/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{o.code}</span>
                    <span className="text-sm font-medium">{o.product?.title ?? o.productTitle}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {o.quotedPrice && <span className="text-xs font-semibold text-primary">₹{o.quotedPrice.toLocaleString()}</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium capitalize">{o.status.replace(/_/g, " ")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Events (Tours & Trade Fairs) */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Ticket className="h-4 w-4 text-primary" /> My Events
          </CardTitle>
          <Link href="/dashboard/buyer/events" className="text-xs text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {loadingBookings ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <Ticket className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No event bookings yet. <Link href="/" className="text-primary hover:underline">Browse events</Link> to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 rounded-lg border bg-card/40 hover:bg-accent/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{b.event?.title ?? "Event"}</span>
                    <span className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {b.totalAmount && <span className="text-xs font-semibold text-primary">₹{Number(b.totalAmount).toLocaleString()}</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium">{b.paymentStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
