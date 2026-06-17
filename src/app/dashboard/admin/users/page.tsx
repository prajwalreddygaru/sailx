"use client";

import { Search, Plus, Ban, ShieldCheck, MoreHorizontal } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initials } from "@/lib/utils";

const users = [
  { id: 1, name: "Arjun Mehta", email: "arjun@kavyaimports.in", role: "BUYER", company: "Kavya Imports", status: "Active", verified: true, joined: "Jan 2025" },
  { id: 2, name: "Li Wei", email: "liwei@sailx.cn", role: "AGENT", company: "—", status: "Active", verified: true, joined: "Mar 2024" },
  { id: 3, name: "Shenzhen AudioPeak", email: "biz@audiopeak.cn", role: "SUPPLIER", company: "AudioPeak Mfg.", status: "Active", verified: true, joined: "Aug 2023" },
  { id: 4, name: "Priya Iyer", email: "priya@saffrond2c.in", role: "BUYER", company: "Saffron D2C", status: "Active", verified: true, joined: "Apr 2025" },
  { id: 5, name: "Chen Hua", email: "chenhua@sailx.cn", role: "AGENT", company: "—", status: "Active", verified: true, joined: "Jun 2024" },
  { id: 6, name: "Suspect User 01", email: "suspect@example.com", role: "BUYER", company: "Unknown LLC", status: "Banned", verified: false, joined: "Apr 2026" }
];

export default function AdminUsersPage() {
  return (
    <div>
      <PageHeader
        title="User management"
        description="Manage buyers, agents, suppliers, and platform admins."
        actions={<Button variant="gradient" size="sm"><Plus className="h-4 w-4" /> Invite user</Button>}
      />
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
        </TabsList>
      </Tabs>
      <Card className="mt-4">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-[10px]">{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="muted">{u.role}</Badge></TableCell>
                <TableCell className="text-sm">{u.company}</TableCell>
                <TableCell>
                  <Badge variant={u.status === "Active" ? "success" : "destructive"}>{u.status}</Badge>
                </TableCell>
                <TableCell>
                  {u.verified ? (
                    <ShieldCheck className="h-4 w-4 text-success" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{u.joined}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {u.status === "Active" ? (
                      <Button variant="ghost" size="icon"><Ban className="h-3.5 w-3.5" /></Button>
                    ) : (
                      <Button variant="ghost" size="icon"><ShieldCheck className="h-3.5 w-3.5" /></Button>
                    )}
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
