"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Mail, Phone } from "lucide-react";

function fmt(d: string) {
  return new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminEnquiriesPage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState("");

  async function load() {
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/admin/enquiries");
      const data = await r.json();
      if (!r.ok) { setErr(data.error ?? "Failed to load"); } else { setItems(Array.isArray(data) ? data : []); }
    } catch { setErr("Network error"); }
    finally { setLoading(false); }
  }

  React.useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await fetch(`/api/admin/enquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      await load();
    } catch {}
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Enquiries" description="Leads from the website popup, contact page, events, and catalogue." />

      {err && <div className="text-sm text-destructive">{err}</div>}
      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{e.name}</div>
                <Badge variant="outline" className="text-xs">{e.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {e.event?.title ?? (
                  e.message?.startsWith("Destination:")
                    ? `Website · ${e.message.replace(/^Destination:\s*/, "")}`
                    : "Website Enquiry"
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {e.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{e.email}</span>}
                {e.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{e.phone}</span>}
              </div>
              {e.message && !/^Destination:\s*.+$/.test(e.message.trim()) && (
                <div className="text-sm bg-muted/50 p-2 rounded">{e.message}</div>
              )}
              <div className="text-[11px] text-muted-foreground">{fmt(e.createdAt)}</div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => updateStatus(e.id, "CONTACTED")}>Mark Contacted</Button>
                <Button size="sm" variant="destructive" onClick={() => updateStatus(e.id, "CLOSED")}>Close</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && items.length === 0 && !err && (
        <div className="text-sm text-muted-foreground">No enquiries yet.</div>
      )}
    </div>
  );
}
