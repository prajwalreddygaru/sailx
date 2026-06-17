"use client";

import { Search, Filter } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { rfqs } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AgentRFQsPage() {
  return (
    <div>
      <PageHeader title="Assigned RFQs" description="RFQs that need your sourcing expertise." />
      <Card>
        <div className="p-4 border-b flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search RFQs..." className="pl-9" />
          </div>
          <Button variant="outline"><Filter className="h-3.5 w-3.5" /> Filters</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfqs.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="text-xs font-mono text-muted-foreground">{r.code}</div>
                  <div className="text-sm font-medium truncate max-w-xs">{r.title}</div>
                </TableCell>
                <TableCell className="text-sm">{r.buyerCompany}</TableCell>
                <TableCell className="tabular-nums text-sm">{r.quantity.toLocaleString()}</TableCell>
                <TableCell className="tabular-nums text-sm">{formatCurrency(r.budget)}</TableCell>
                <TableCell>
                  <Badge variant={r.priority === "HIGH" ? "destructive" : r.priority === "MEDIUM" ? "warning" : "muted"}>
                    {r.priority}
                  </Badge>
                </TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-xs">{formatDate(r.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
