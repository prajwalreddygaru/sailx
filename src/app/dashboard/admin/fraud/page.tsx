"use client";

import { ShieldCheck, AlertTriangle, Eye, Ban, Globe2 } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { initials } from "@/lib/utils";

const flags = [
  { name: "Unknown LLC", risk: 92, signals: ["Mismatched IP/country", "5 chargebacks in 30d", "Unverified GST"], status: "BLOCKED", date: "2026-05-22" },
  { name: "Phantom Trading Co", risk: 78, signals: ["New account, $40k order", "Multiple failed verification"], status: "REVIEW", date: "2026-05-20" },
  { name: "QuickShip Logistics", risk: 64, signals: ["Unusual login pattern", "VPN access"], status: "REVIEW", date: "2026-05-19" },
  { name: "BrightStar Imports", risk: 38, signals: ["Slow response time"], status: "WATCH", date: "2026-05-18" }
];

export default function FraudPage() {
  return (
    <div>
      <PageHeader title="Fraud monitoring" description="Suspicious users, risky transactions, and platform health." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="High-risk users" value="3" icon={AlertTriangle} hint="Auto-blocked" />
        <StatCard label="Under review" value="12" icon={Eye} delta={-15} />
        <StatCard label="Blocked (MTD)" value="28" icon={Ban} delta={4} />
        <StatCard label="Trust score (avg)" value="91" icon={ShieldCheck} delta={2} />
      </div>
      <Card className="mt-4">
        <CardContent className="p-0">
          {flags.map((f, i) => (
            <div key={f.name} className={`p-5 ${i < flags.length - 1 ? "border-b" : ""}`}>
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10"><AvatarFallback>{initials(f.name)}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium">{f.name}</div>
                    <Badge
                      variant={f.status === "BLOCKED" ? "destructive" : f.status === "REVIEW" ? "warning" : "muted"}
                    >
                      {f.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{f.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {f.signals.map((s) => (
                      <Badge key={s} variant="muted" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div className="w-48 shrink-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Risk score</span>
                    <span className={`font-semibold ${f.risk > 70 ? "text-destructive" : f.risk > 50 ? "text-[hsl(var(--warning))]" : "text-success"}`}>
                      {f.risk}
                    </span>
                  </div>
                  <Progress value={f.risk} />
                </div>
                <Button variant="outline" size="sm">Investigate</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
