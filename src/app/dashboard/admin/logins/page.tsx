"use client";

import * as React from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { Download, Search, KeyRound } from "lucide-react";

interface LoginLog {
  id: string;
  email: string;
  userId?: string | null;
  mode: "ADMIN" | "OTP" | string;
  status: "SUCCESS" | "FAILURE" | string;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

export default function AdminLoginLogsPage() {
  const [logs, setLogs] = React.useState<LoginLog[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<string>("ALL");
  const [mode, setMode] = React.useState<string>("ALL");
  const [loading, setLoading] = React.useState(false);

  async function fetchLogs(p = page, ps = pageSize) {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(p));
    params.set("pageSize", String(ps));
    if (q.trim()) params.set("q", q.trim());
    if (status !== "ALL") params.set("status", status);
    if (mode !== "ALL") params.set("mode", mode);
    const res = await fetch(`/api/admin/login-logs?${params.toString()}`);
    if (res.ok) {
      const d = await res.json();
      setLogs(d.items);
      setTotal(d.total);
      setPage(d.page);
      setPageSize(d.pageSize);
    }
    setLoading(false);
  }

  React.useEffect(() => { fetchLogs(1, pageSize); }, []);

  function exportCsv() {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status !== "ALL") params.set("status", status);
    if (mode !== "ALL") params.set("mode", mode);
    window.location.href = `/api/admin/login-logs/export?${params.toString()}`;
  }

  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <PageHeader
        title="Login Logs"
        description="Audit trail of user sign-ins (admin password, user password & email OTP)."
        actions={
          <div className="flex items-center gap-2">
            <Button onClick={() => fetchLogs(1, pageSize)} variant="outline" size="sm">Refresh</Button>
            <Button onClick={exportCsv} size="sm"><Download className="h-4 w-4 mr-2"/>Export CSV</Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {loading && <Spinner size="sm" className="absolute right-3 top-1/2 -translate-y-1/2" />}
                <Input
                  placeholder="Search email, IP or device"
                  className="pl-9 pr-9"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') fetchLogs(1, pageSize); }}
                />
              </div>
              <Button variant="secondary" onClick={() => fetchLogs(1, pageSize)} disabled={loading}>Search</Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={(v) => { setStatus(v); fetchLogs(1, pageSize); }}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="SUCCESS">Success</SelectItem>
                  <SelectItem value="FAILURE">Failure</SelectItem>
                </SelectContent>
              </Select>
              <Select value={mode} onValueChange={(v) => { setMode(v); fetchLogs(1, pageSize); }}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Modes</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="OTP">Email OTP</SelectItem>
                  <SelectItem value="PASSWORD">Password</SelectItem>
                </SelectContent>
              </Select>
              <Select value={String(pageSize)} onValueChange={(v) => { const ps = parseInt(v,10); setPageSize(ps); fetchLogs(1, ps); }}>
                <SelectTrigger className="w-[120px]"><SelectValue placeholder="Page size" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="25">25 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">#</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>User ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, idx) => (
              <TableRow key={log.id} className={log.status === 'FAILURE' ? 'bg-destructive/5' : ''}>
                <TableCell>{(page - 1) * pageSize + idx + 1}</TableCell>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{log.email}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border">
                    <KeyRound className="h-3 w-3"/>{log.mode}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                    {log.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.ip || '-'}</TableCell>
                <TableCell className="max-w-[280px] truncate text-xs text-muted-foreground" title={log.userAgent || ''}>{log.userAgent || '-'}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.userId || '-'}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-10">No logs found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
        <div>
          Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span>–<span className="font-medium">{Math.min(page * pageSize, total)}</span> of <span className="font-medium">{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => fetchLogs(page - 1, pageSize)}>Prev</Button>
          <div className="text-xs">Page {page} / {lastPage}</div>
          <Button variant="outline" size="sm" disabled={page >= lastPage} onClick={() => fetchLogs(page + 1, pageSize)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
