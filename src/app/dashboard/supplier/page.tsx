"use client";

import { Package, FileText, DollarSign, TrendingUp, Award } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpendChart } from "@/components/dashboard/charts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { spendByMonth, rfqs } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function SupplierDashboardPage() {
  return (
    <div>
      <PageHeader title="Supplier dashboard" description="Manage RFQs received, products, and orders." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active RFQs" value="14" icon={FileText} delta={22} />
        <StatCard label="Products listed" value="48" icon={Package} hint="3 pending review" />
        <StatCard label="Revenue (YTD)" value="$284k" icon={DollarSign} delta={31} />
        <StatCard label="Trust score" value="96" icon={Award} hint="Top tier" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendChart data={spendByMonth} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent RFQs</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {rfqs.slice(0, 4).map((r) => (
              <div key={r.id} className="text-sm p-2 rounded-lg hover:bg-accent/40">
                <div className="font-mono text-[10px] text-muted-foreground">{r.code}</div>
                <div className="font-medium truncate">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.buyerCompany}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
