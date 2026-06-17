"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Filter, Download, MoreHorizontal, Eye, Paperclip, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { rfqs } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function RFQsPage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");

  const filtered = rfqs.filter((r) => {
    if (status !== "all" && r.status !== status) return false;
    if (search && !`${r.title} ${r.code} ${r.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="RFQs"
        description="Manage your Requests for Quotation across categories."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link href="/dashboard/buyer/rfqs/new">
                <Plus className="h-4 w-4" /> New RFQ
              </Link>
            </Button>
          </>
        }
      />

      <Card>
        <div className="flex flex-col md:flex-row gap-3 p-4 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by RFQ code, title, or category..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SOURCING">Sourcing</SelectItem>
              <SelectItem value="QUOTATIONS_RECEIVED">Quotations received</SelectItem>
              <SelectItem value="SAMPLE_STAGE">Sample</SelectItem>
              <SelectItem value="PRODUCTION">Production</SelectItem>
              <SelectItem value="SHIPPING">Shipping</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="default">
            <Filter className="h-3.5 w-3.5" /> More filters
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <img src={r.imageUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-muted-foreground">{r.code}</div>
                      <div className="font-medium text-sm truncate max-w-[260px]">{r.title}</div>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <span className="inline-flex items-center gap-0.5"><Paperclip className="h-2.5 w-2.5" /> {r.attachments}</span>
                        <span className="inline-flex items-center gap-0.5"><MessageSquare className="h-2.5 w-2.5" /> {r.quotations}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="secondary">{r.category}</Badge></TableCell>
                <TableCell className="text-sm tabular-nums">{r.quantity.toLocaleString()}</TableCell>
                <TableCell className="text-sm tabular-nums">{formatCurrency(r.budget)}</TableCell>
                <TableCell className="text-sm">{r.agentName || "—"}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(r.updatedAt)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No RFQs match your filters.
          </div>
        )}
      </Card>
    </div>
  );
}
