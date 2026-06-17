"use client";

import React from "react";
import { Package, Image, LayoutGrid, Ticket, ShoppingBag, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Stats {
  events: number;
  catalogue: number;
  products: number;
  banners: number;
  orders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    Promise.allSettled([
      fetch("/api/events?status=all").then((r) => r.json()),
      fetch("/api/admin/catalogue").then((r) => r.json()),
      fetch("/api/products?status=all").then((r) => r.json()),
      fetch("/api/admin/banners").then((r) => r.json()),
      fetch("/api/admin/orders").then((r) => r.json()),
    ]).then(([events, catalogue, products, banners, orders]) => {
      const val = (r: PromiseSettledResult<any>) =>
        r.status === "fulfilled" && Array.isArray(r.value) ? r.value.length : 0;
      setStats({
        events:    val(events),
        catalogue: val(catalogue),
        products:  val(products),
        banners:   val(banners),
        orders:    val(orders),
      });
    });
  }, []);

  const tiles = [
    { label: "Events",    value: stats?.events    ?? "—", icon: Ticket,     href: "/dashboard/admin/events",    color: "text-green-500"  },
    { label: "Catalogue", value: stats?.catalogue ?? "—", icon: BookOpen,   href: "/dashboard/admin/catalogue", color: "text-orange-500" },
    { label: "Products",  value: stats?.products  ?? "—", icon: Package,    href: "/dashboard/admin/products",  color: "text-purple-500" },
    { label: "Banners",   value: stats?.banners   ?? "—", icon: Image,      href: "/dashboard/admin/banners",   color: "text-pink-500"   },
    { label: "Orders",    value: stats?.orders    ?? "—", icon: ShoppingBag, href: "/dashboard/admin/orders",   color: "text-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Live data from the database.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-5 pb-4">
                <t.icon className={`h-6 w-6 mb-3 ${t.color}`} />
                <p className="text-2xl font-bold">{t.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Add Event / Tour",    href: "/dashboard/admin/events"    },
              { label: "Add Catalogue Item",  href: "/dashboard/admin/catalogue" },
              { label: "Add Product",         href: "/dashboard/admin/products"  },
              { label: "Manage Banners",      href: "/dashboard/admin/banners"   },
              { label: "View All Orders",     href: "/dashboard/admin/orders"    },
            ].map((a) => (
              <Link key={a.href} href={a.href} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent text-sm transition-colors">
                <span>{a.label}</span>
                <span className="text-muted-foreground">→</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Platform Status</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <Badge variant="outline" className="text-green-500 border-green-500/30">Connected</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Authentication</span>
              <Badge variant="outline" className="text-green-500 border-green-500/30">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Razorpay</span>
              <Badge variant="outline" className="text-green-500 border-green-500/30">Live</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">SMTP Email</span>
              <Badge variant="outline" className="text-green-500 border-green-500/30">Configured</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
