"use client";

import * as React from "react";
import { Wifi, WifiOff, Package, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  code: string;
  status: string;
  quantity: number;
  quotedPrice?: number;
  productTitle: string;
  trackingInfo?: string;
  user: { name: string; email: string };
  product: { title: string };
  createdAt: string;
}

const STATUS_COLOR: Record<string, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-800",
  QUOTED:    "bg-blue-100 text-blue-800",
  PAID:      "bg-green-100 text-green-800",
  SHIPPED:   "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-200 text-green-900",
};

export default function AgentDashboardPage() {
  const [isOnline, setIsOnline]   = React.useState(false);
  const [statusLoaded, setStatusLoaded] = React.useState(false);
  const [toggling, setToggling]   = React.useState(false);
  const [orders, setOrders]       = React.useState<Order[]>([]);
  const [loading, setLoading]     = React.useState(true);
  const [quoting, setQuoting]     = React.useState<string | null>(null);
  const [quoteInputs, setQuoteInputs] = React.useState<Record<string, string>>({});
  const [trackInputs, setTrackInputs] = React.useState<Record<string, string>>({});

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/sample-orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  // Fetch real online status from DB on mount
  React.useEffect(() => {
    fetch("/api/agents/status")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.isOnline === "boolean") setIsOnline(d.isOnline);
      })
      .finally(() => setStatusLoaded(true));
  }, []);

  React.useEffect(() => { load(); }, [load]);

  async function handleToggle(val: boolean) {
    setToggling(true);
    await fetch("/api/agents/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOnline: val }),
    });
    setIsOnline(val);
    setToggling(false);
    toast.success(val ? "You are now Online — visible to buyers" : "You are now Offline — hidden from buyers");
  }

  async function submitQuote(orderId: string) {
    const price = parseFloat(quoteInputs[orderId]);
    if (!price || price <= 0) { toast.error("Enter a valid price"); return; }
    setQuoting(orderId);
    await fetch(`/api/sample-orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotedPrice: price, status: "QUOTED" }),
    });
    toast.success("Quote sent to buyer!");
    setQuoting(null);
    load();
  }

  async function updateTracking(orderId: string, newStatus: string) {
    await fetch(`/api/sample-orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus, trackingInfo: trackInputs[orderId] || undefined }),
    });
    toast.success("Order updated!");
    load();
  }

  const pending = orders.filter((o) => o.status === "REQUESTED");
  const active  = orders.filter((o) => !["REQUESTED", "DELIVERED", "CANCELLED"].includes(o.status));
  const paid    = orders.filter((o) => ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(o.status));

  return (
    <div className="space-y-6 p-6">
      {/* Online toggle */}
      <div className={cn(
        "rounded-xl border p-5 flex items-center justify-between transition-colors",
        isOnline ? "bg-emerald-950/30 border-emerald-500/40" : "bg-card border-border"
      )}>
        <div className="flex items-center gap-3">
          <div className="relative">
            {isOnline ? (
              <Wifi className="h-6 w-6 text-emerald-400" />
            ) : (
              <WifiOff className="h-6 w-6 text-muted-foreground" />
            )}
            {isOnline && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">
              {isOnline ? "You are Online" : "You are Offline"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isOnline
                ? "Your profile is live and visible to buyers on the home page"
                : "Go online to appear in the Sourcing Agents panel"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {toggling ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              isOnline
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-muted text-muted-foreground"
            )}>
              {isOnline ? "● Live" : "○ Hidden"}
            </span>
          )}
          <Switch
            checked={isOnline}
            onCheckedChange={handleToggle}
            disabled={toggling || !statusLoaded}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{pending.length}</p><p className="text-xs text-muted-foreground mt-1">Pending Quotes</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{active.length}</p><p className="text-xs text-muted-foreground mt-1">Active Orders</p></CardContent></Card>
        <Card><CardContent className="pt-5"><p className="text-2xl font-bold">{paid.length}</p><p className="text-xs text-muted-foreground mt-1">Paid Orders</p></CardContent></Card>
      </div>

      {/* Orders list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl md:text-3xl font-semibold">All Orders</h2>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
        ) : orders.length === 0 ? (
          <Card><CardContent className="py-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No orders assigned yet.</p>
          </CardContent></Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-medium">{order.code}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="font-medium text-sm mt-1">{order.product?.title ?? order.productTitle}</p>
                      <p className="text-xs text-muted-foreground">Qty: {order.quantity} · Buyer: {order.user?.name}</p>
                      {order.quotedPrice && <p className="text-xs text-primary font-semibold">Quoted: ₹{order.quotedPrice}</p>}
                      {order.trackingInfo && <p className="text-xs text-muted-foreground">📦 {order.trackingInfo}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>

                  {/* Quote form */}
                  {order.status === "REQUESTED" && (
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        placeholder="Quote price (₹)"
                        className="w-40 h-8 text-sm"
                        value={quoteInputs[order.id] ?? ""}
                        onChange={(e) => setQuoteInputs((p) => ({ ...p, [order.id]: e.target.value }))}
                      />
                      <Button size="sm" onClick={() => submitQuote(order.id)} disabled={quoting === order.id}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {quoting === order.id ? "Sending..." : "Send Quote"}
                      </Button>
                    </div>
                  )}

                  {/* Status update for paid orders */}
                  {["PAID", "PROCESSING", "SHIPPED"].includes(order.status) && (
                    <div className="flex gap-2 flex-wrap">
                      <Input
                        placeholder="Tracking info / notes"
                        className="flex-1 min-w-32 h-8 text-sm"
                        value={trackInputs[order.id] ?? ""}
                        onChange={(e) => setTrackInputs((p) => ({ ...p, [order.id]: e.target.value }))}
                      />
                      {order.status === "PAID" && (
                        <Button size="sm" variant="outline" onClick={() => updateTracking(order.id, "PROCESSING")}>Mark Processing</Button>
                      )}
                      {order.status === "PROCESSING" && (
                        <Button size="sm" variant="outline" onClick={() => updateTracking(order.id, "SHIPPED")}>Mark Shipped</Button>
                      )}
                      {order.status === "SHIPPED" && (
                        <Button size="sm" variant="outline" onClick={() => updateTracking(order.id, "DELIVERED")}>Mark Delivered</Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
