"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Star, ShieldCheck, MapPin, Clock, Package, Award } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { suppliers } from "@/lib/mock-data";

export default function SuppliersPage() {
  const [q, setQ] = React.useState("");
  const filtered = suppliers.filter(
    (s) => `${s.name} ${s.factoryName} ${s.city}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Verified factories sourcing for your active RFQs."
      />
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search suppliers..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Link key={s.id} href={`/dashboard/buyer/suppliers/${s.id}`}>
            <Card className="overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all">
              <div className="aspect-[16/9] bg-muted overflow-hidden">
                <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" />
              </div>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-semibold leading-tight">{s.name}</div>
                  <Badge variant="success" className="text-[10px]">
                    <ShieldCheck className="h-2.5 w-2.5" /> Verified
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3" /> {s.city}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-3 py-3 border-y">
                  <div>
                    <div className="font-display text-lg font-semibold">{s.trustScore}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Trust</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold flex items-center justify-center gap-0.5">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {s.rating}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase">Rating</div>
                  </div>
                  <div>
                    <div className="font-display text-lg font-semibold">{s.yearsActive}y</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Active</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.certifications.slice(0, 4).map((c) => (
                    <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>
                  ))}
                  {s.certifications.length > 4 && (
                    <Badge variant="muted" className="text-[10px]">+{s.certifications.length - 4}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
