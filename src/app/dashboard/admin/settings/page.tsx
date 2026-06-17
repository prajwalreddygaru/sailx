"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [loading, setLoading] = React.useState(false);
  const [savingSmtp, setSavingSmtp] = React.useState(false);
  const [savingRzp, setSavingRzp] = React.useState(false);

  const [smtpHost, setSmtpHost] = React.useState("");
  const [smtpPort, setSmtpPort] = React.useState<number | "">("");
  const [smtpUser, setSmtpUser] = React.useState("");
  const [smtpPassword, setSmtpPassword] = React.useState("");
  const [smtpFrom, setSmtpFrom] = React.useState("");
  const [hasSmtpPassword, setHasSmtpPassword] = React.useState(false);

  const [rzpKeyId, setRzpKeyId] = React.useState("");
  const [rzpKeySecret, setRzpKeySecret] = React.useState("");
  const [hasRzpSecret, setHasRzpSecret] = React.useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/system/config");
      if (r.ok) {
        const cfg = await r.json();
        setSmtpHost(cfg.smtpHost ?? "");
        setSmtpPort(cfg.smtpPort ?? "");
        setSmtpUser(cfg.smtpUser ?? "");
        setSmtpFrom(cfg.smtpFrom ?? "");
        setHasSmtpPassword(!!cfg.hasSmtpPassword);
        setRzpKeyId(cfg.razorpayKeyId ?? "");
        setHasRzpSecret(!!cfg.hasRazorpayKeySecret);
      }
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  async function saveSmtp() {
    setSavingSmtp(true);
    try {
      const body: any = {
        smtpHost: smtpHost || null,
        smtpPort: smtpPort === "" ? null : Number(smtpPort),
        smtpUser: smtpUser || null,
        smtpFrom: smtpFrom || null,
      };
      if (smtpPassword) body.smtpPassword = smtpPassword;
      const r = await fetch("/api/admin/system/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      setSmtpPassword("");
      toast.success("SMTP settings saved");
      await load();
    } catch {
      toast.error("Failed to save SMTP settings");
    } finally {
      setSavingSmtp(false);
    }
  }

  async function saveRzp() {
    setSavingRzp(true);
    try {
      const body: any = { razorpayKeyId: rzpKeyId || null };
      if (rzpKeySecret) body.razorpayKeySecret = rzpKeySecret;
      const r = await fetch("/api/admin/system/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      setRzpKeySecret("");
      toast.success("Razorpay settings saved");
      await load();
    } catch {
      toast.error("Failed to save Razorpay settings");
    } finally {
      setSavingRzp(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure SMTP and Razorpay API keys.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SMTP Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>SMTP Host</Label>
            <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} placeholder="smtp.gmail.com" className="mt-1" />
          </div>
          <div>
            <Label>SMTP Port</Label>
            <Input type="number" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value ? Number(e.target.value) : "")} placeholder="587" className="mt-1" />
          </div>
          <div>
            <Label>SMTP User</Label>
            <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} placeholder="user@example.com" className="mt-1" />
          </div>
          <div>
            <Label>SMTP Password {hasSmtpPassword ? <span className="text-xs text-muted-foreground">(already set)</span> : null}</Label>
            <Input type="password" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} placeholder="••••••••" className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>From Address</Label>
            <Input value={smtpFrom} onChange={(e) => setSmtpFrom(e.target.value)} placeholder="sailxchina <no-reply@sailxchina.com>" className="mt-1" />
          </div>
          <div className="md:col-span-2 text-right">
            <Button onClick={saveSmtp} disabled={savingSmtp || loading}>{savingSmtp ? "Saving..." : "Save SMTP"}</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Razorpay Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Key ID</Label>
            <Input value={rzpKeyId} onChange={(e) => setRzpKeyId(e.target.value)} placeholder="rzp_test_..." className="mt-1" />
          </div>
          <div>
            <Label>Key Secret {hasRzpSecret ? <span className="text-xs text-muted-foreground">(already set)</span> : null}</Label>
            <Input type="password" value={rzpKeySecret} onChange={(e) => setRzpKeySecret(e.target.value)} placeholder="••••••••" className="mt-1" />
          </div>
          <div className="md:col-span-2 text-right">
            <Button onClick={saveRzp} disabled={savingRzp || loading}>{savingRzp ? "Saving..." : "Save Razorpay"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
