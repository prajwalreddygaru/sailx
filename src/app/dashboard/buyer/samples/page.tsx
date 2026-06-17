"use client";

import { Plus, Package, Truck, CheckCircle2, XCircle, Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Progress } from "@/components/ui/progress";
import { samples } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function SamplesPage() {
  return (
    <div>
      <PageHeader
        title="Sample tracking"
        description="Manage sample requests, courier tracking, and quality scoring."
        actions={
          <Button variant="gradient" size="sm">
            <Plus className="h-4 w-4" /> Request sample
          </Button>
        }
      />

      <div className="grid gap-3">
        {samples.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="grid lg:grid-cols-[1fr_auto] gap-4">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Package className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium">{s.productTitle}</div>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {s.supplierName} · Sample for {s.rfqId.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      <span className="font-mono">{s.trackingNumber}</span>
                    </div>
                    <div>Requested {formatDate(s.requestedAt)}</div>
                    {s.receivedAt && <div>Received {formatDate(s.receivedAt)}</div>}
                  </div>
                  {s.notes && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/40 text-sm">
                      <div className="text-xs text-muted-foreground mb-0.5">Quality notes</div>
                      {s.notes}
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:w-72 space-y-3">
                {s.qualityScore > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Quality score</span>
                      <span className="font-semibold">{s.qualityScore}/100</span>
                    </div>
                    <Progress value={s.qualityScore} />
                  </div>
                )}
                <div className="flex gap-2">
                  {s.status === "DELIVERED" && (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                      <Button variant="gradient" size="sm" className="flex-1">
                        <CheckCircle2 className="h-3 w-3" /> Approve
                      </Button>
                    </>
                  )}
                  {s.status === "SHIPPED" && (
                    <Button variant="outline" size="sm" className="w-full">Track shipment</Button>
                  )}
                  {s.status === "REQUESTED" && (
                    <Button variant="outline" size="sm" className="w-full">View RFQ</Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
