"use client";

import { AlertTriangle, MessageSquare, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const disputes = [
  { id: "D-2026-014", type: "Quality", buyer: "Saffron D2C", supplier: "Yiwu BrightLite", amount: 18400, status: "Open", priority: "HIGH", desc: "Sample colors don't match approved swatches; 12% defect rate." },
  { id: "D-2026-013", type: "Refund", buyer: "Bloomwell Imports", supplier: "Guangzhou EcoPack", amount: 6200, status: "In Review", priority: "MEDIUM", desc: "Partial shipment received; missing 800 units of SKU-A2." },
  { id: "D-2026-012", type: "Shipment", buyer: "Kavya Imports", supplier: "Ningbo PrecisionWorks", amount: 12500, status: "Mediating", priority: "MEDIUM", desc: "Container delayed at customs; demurrage charges disputed." },
  { id: "D-2026-011", type: "Quality", buyer: "Saffron D2C", supplier: "Shenzhen AudioPeak", amount: 4200, status: "Resolved", priority: "LOW", desc: "Buyer accepted partial credit note." }
];

export default function DisputesPage() {
  return (
    <div>
      <PageHeader title="Dispute resolution" description="Quality, refund, and shipment disputes — mediated end-to-end." />
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[
          { label: "Open", value: disputes.filter((d) => d.status === "Open").length, color: "destructive" },
          { label: "In Review", value: disputes.filter((d) => d.status === "In Review").length, color: "warning" },
          { label: "Mediating", value: disputes.filter((d) => d.status === "Mediating").length, color: "default" },
          { label: "Resolved", value: disputes.filter((d) => d.status === "Resolved").length, color: "success" }
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="font-display text-3xl font-semibold mt-2">{s.value}</div>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        {disputes.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-warning/10 text-[hsl(var(--warning))] flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-mono text-xs text-muted-foreground">{d.id}</div>
                    <Badge variant="muted">{d.type}</Badge>
                    <Badge variant={d.priority === "HIGH" ? "destructive" : d.priority === "MEDIUM" ? "warning" : "muted"}>
                      {d.priority}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium mt-1">
                    {d.buyer} <span className="text-muted-foreground">↔</span> {d.supplier}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <span>Disputed amount: <span className="font-semibold">{formatCurrency(d.amount)}</span></span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge variant={d.status === "Resolved" ? "success" : d.status === "Open" ? "destructive" : "warning"}>
                    {d.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><MessageSquare className="h-3 w-3" /> Mediate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
