"use client";

import React from "react";
import { Loader2, RefreshCw, Package, IndianRupee, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const ALL_STATUSES = ["REQUESTED","QUOTED","PAYMENT_PENDING","PAID","PROCESSING","SHIPPED","DELIVERED","CANCELLED"];

interface Order {
  id: string;
  type: "sample" | "catalogue";
  code: string;
  status: string;
  paymentStatus: string;
  quantity: number;
  amount: number;
  quotedPrice?: number;
  isBulk: boolean;
  trackingInfo?: string | null;
  createdAt: string;
  productTitle: string;
  product: { title: string; images?: string[] };
  user: { name: string; email: string; phone?: string | null };
  agent?: { name: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders]   = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter]   = React.useState("ALL");
  const [agentInputs, setAgentInputs] = React.useState<Record<string, string>>({});
  const [updating, setUpdating] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  async function updateOrder(orderId: string, patch: Record<string, unknown>) {
    setUpdating(orderId);
    const res = await fetch(`/api/sample-orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) { toast.success("Updated"); load(); }
    else        { toast.error("Update failed"); }
    setUpdating(null);
  }

  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">All Orders</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage sample, bulk & catalogue orders</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {["ALL", ...ALL_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              filter === s ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
            }`}
          >
            {s.replace(/_/g, " ")}
            {s !== "ALL" && ` (${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="py-16 text-center">
          <Package className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No orders in this status.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Product image */}
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                    {order.product?.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={order.product.images[0]} alt={order.product.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Order info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-medium">{order.code}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                        {order.type === "catalogue" && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Catalogue</span>
                        )}
                        {order.type === "sample" && order.isBulk && <span className="text-xs border px-2 py-0.5 rounded-full">Bulk</span>}
                        {order.type === "sample" && !order.isBulk && <span className="text-xs border px-2 py-0.5 rounded-full">Sample</span>}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                    <p className="font-semibold text-sm leading-tight truncate">{order.product?.title ?? order.productTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      Buyer: <span className="text-foreground">{order.user?.name}</span> ({order.user?.email})
                      {order.user?.phone && <> · Phone: <span className="text-foreground">{order.user.phone}</span></>}
                      · Qty: {order.quantity}
                      {order.agent && <> · Agent: <span className="text-foreground">{order.agent.name}</span></>}
                    </p>
                    {order.amount > 0 ? (
                      <div className="flex items-center gap-1.5 text-xs">
                        <IndianRupee className="h-3 w-3 text-primary" />
                        <span className="font-bold text-primary">{order.amount.toLocaleString("en-IN")}</span>
                        {order.type === "catalogue" ? (
                          <span className="text-muted-foreground">paid</span>
                        ) : (
                          <span className="text-muted-foreground">quoted</span>
                        )}
                        {order.paymentStatus === "PAID" && (
                          <span className="flex items-center gap-0.5 text-emerald-500 font-semibold ml-1">
                            <CheckCircle2 className="h-3 w-3" /> Paid
                          </span>
                        )}
                        {order.paymentStatus === "PENDING" && order.status !== "REQUESTED" && (
                          <span className="flex items-center gap-0.5 text-amber-500 font-semibold ml-1">
                            <Clock className="h-3 w-3" /> Awaiting payment
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">No amount set</p>
                    )}
                    {order.trackingInfo && <p className="text-xs text-muted-foreground">📦 {order.trackingInfo}</p>}
                  </div>
                </div>

                {/* Admin controls — only for sample orders */}
                {order.type === "sample" && (
                  <div className="flex gap-2 flex-wrap items-center mt-3 pt-3 border-t border-border/40">
                    <select
                      className="text-xs border rounded px-2 py-1 bg-background"
                      defaultValue={order.status}
                      onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                      disabled={updating === order.id}
                    >
                      {ALL_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                    <Input
                      placeholder="Tracking / notes"
                      className="h-7 text-xs w-48"
                      value={agentInputs[order.id] ?? order.trackingInfo ?? ""}
                      onChange={(e) => setAgentInputs((p) => ({ ...p, [order.id]: e.target.value }))}
                    />
                    <Button
                      size="sm" variant="outline"
                      className="h-7 text-xs"
                      disabled={updating === order.id}
                      onClick={() => updateOrder(order.id, { trackingInfo: agentInputs[order.id] })}
                    >
                      {updating === order.id ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
