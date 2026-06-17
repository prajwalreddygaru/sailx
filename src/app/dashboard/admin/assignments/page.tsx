"use client";

import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { rfqs } from "@/lib/mock-data";
import { initials } from "@/lib/utils";

export default function AssignmentsPage() {
  return (
    <div>
      <PageHeader title="RFQ assignment" description="Match RFQs to the right sourcing agents based on category and load." />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>RFQ</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assigned agent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rfqs.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-mono text-xs text-muted-foreground">{r.code}</div>
                  <div className="text-sm font-medium truncate max-w-xs">{r.title}</div>
                </TableCell>
                <TableCell className="text-sm">{r.buyerCompany}</TableCell>
                <TableCell><Badge variant="secondary">{r.category}</Badge></TableCell>
                <TableCell>
                  <Badge variant={r.priority === "HIGH" ? "destructive" : r.priority === "MEDIUM" ? "warning" : "muted"}>
                    {r.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {r.agentName ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[9px]">{initials(r.agentName)}</AvatarFallback></Avatar>
                      <span className="text-sm">{r.agentName}</span>
                    </div>
                  ) : (
                    <Select>
                      <SelectTrigger className="h-8 w-40 text-xs"><SelectValue placeholder="Assign..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="li">Li Wei</SelectItem>
                        <SelectItem value="chen">Chen Hua</SelectItem>
                        <SelectItem value="zhang">Zhang Mei</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm"><UserPlus className="h-3.5 w-3.5" /> Reassign</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
