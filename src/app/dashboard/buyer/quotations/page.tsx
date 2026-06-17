"use client";

import { Star, Award, Clock, Package, Check, X, MessageSquare, ShieldCheck, TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { quotations } from "@/lib/mock-data";
import { formatCurrency, cn } from "@/lib/utils";

export default function QuotationsPage() {
  const rfq = "RFQ-2026-0184 · Wireless Bluetooth Earbuds";
  const cheapest = Math.min(...quotations.map((q) => q.unitPrice));

  return (
    <div>
      <PageHeader
        title="Quotation comparison"
        description={rfq}
        actions={
          <>
            <Button variant="outline" size="sm">Export PDF</Button>
            <Button variant="gradient" size="sm">Negotiate selected</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quotations.map((q) => {
          const isBest = q.unitPrice === cheapest;
          return (
            <Card
              key={q.id}
              className={cn(
                "relative overflow-hidden",
                isBest && "border-success ring-1 ring-success/30"
              )}
            >
              {isBest && (
                <div className="absolute top-3 right-3">
                  <Badge variant="success">
                    <TrendingDown className="h-3 w-3" /> Best price
                  </Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-mono text-xs">
                    {q.supplierName.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="truncate">{q.supplierName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {q.supplierRating}
                      <span>·</span>
                      <span>{q.supplierCountry}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Unit price</div>
                    <div className="font-display text-2xl font-semibold mt-0.5">
                      ${q.unitPrice}
                    </div>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
                    <div className="font-display text-2xl font-semibold mt-0.5">
                      {formatCurrency(q.totalPrice)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5" /> MOQ
                    </span>
                    <span className="font-medium">{q.moq.toLocaleString()} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> Lead time
                    </span>
                    <span className="font-medium">{q.leadTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" /> Trust
                    </span>
                    <span className="font-medium">{Math.round(q.supplierRating * 20)}%</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Certifications</div>
                  <div className="flex flex-wrap gap-1.5">
                    {q.certifications.map((c) => (
                      <Badge key={c} variant="secondary" className="text-[10px]">
                        <Award className="h-2.5 w-2.5" /> {c}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Agent notes</div>
                  <p className="text-xs">{q.notes}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="h-3 w-3" /> Chat
                  </Button>
                  <Button variant="gradient" size="sm" className="flex-1">
                    <Check className="h-3 w-3" /> Accept
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison table */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Side-by-side comparison</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left py-2 pr-4 font-medium">Criteria</th>
                {quotations.map((q) => (
                  <th key={q.id} className="text-left py-2 px-4 font-medium">
                    {q.supplierName.split(" ")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Unit price", get: (q: any) => `$${q.unitPrice}` },
                { label: "Total", get: (q: any) => formatCurrency(q.totalPrice) },
                { label: "MOQ", get: (q: any) => q.moq.toLocaleString() },
                { label: "Lead time", get: (q: any) => q.leadTime },
                { label: "Rating", get: (q: any) => `${q.supplierRating} ★` },
                { label: "Country", get: (q: any) => q.supplierCountry },
                { label: "Certifications", get: (q: any) => q.certifications.length },
                { label: "Status", get: (q: any) => q.status }
              ].map((row) => (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-3 pr-4 text-muted-foreground">{row.label}</td>
                  {quotations.map((q) => (
                    <td key={q.id} className="py-3 px-4 font-medium">{row.get(q)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
