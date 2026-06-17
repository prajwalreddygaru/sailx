"use client";

import { DollarSign, TrendingUp, Award, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpendChart } from "@/components/dashboard/charts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { spendByMonth } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

const deals = [
  { id: "d1", code: "ORD-2026-0091", buyer: "Kavya Imports", amount: 89400, commission: 4470, status: "PAID", date: "2026-05-15" },
  { id: "d2", code: "ORD-2026-0084", buyer: "Saffron D2C", amount: 21750, commission: 1087, status: "PENDING", date: "2026-05-22" },
  { id: "d3", code: "ORD-2026-0072", buyer: "Bloomwell Imports", amount: 26100, commission: 1305, status: "PAID", date: "2026-04-28" }
];

export default function CommissionsPage() {
  const total = deals.reduce((s, d) => s + d.commission, 0);
  const paid = deals.filter((d) => d.status === "PAID").reduce((s, d) => s + d.commission, 0);
  const pending = total - paid;

  return (
    <div>
      <PageHeader title="Commission analytics" description="Earnings, performance metrics, and payouts." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total earned (YTD)" value={formatCurrency(total)} icon={DollarSign} delta={28} />
        <StatCard label="Paid" value={formatCurrency(paid)} icon={CheckCircle2} hint="2 deals" />
        <StatCard label="Pending" value={formatCurrency(pending)} icon={Clock} hint="Next payout: 1st Jun" />
        <StatCard label="Performance" value="96 / 100" icon={Award} hint="Top 10%" />
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Earnings trend</CardTitle>
        </CardHeader>
        <CardContent>
          <SpendChart data={spendByMonth.map((s) => ({ ...s, spend: s.spend / 8 }))} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader><CardTitle>Recent deals</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Order value</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.code}</TableCell>
                  <TableCell>{d.buyer}</TableCell>
                  <TableCell className="tabular-nums">{formatCurrency(d.amount)}</TableCell>
                  <TableCell className="tabular-nums font-semibold text-success">{formatCurrency(d.commission)}</TableCell>
                  <TableCell>
                    <Badge variant={d.status === "PAID" ? "success" : "warning"}>{d.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(d.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
