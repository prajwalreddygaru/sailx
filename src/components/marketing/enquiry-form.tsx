"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EnquiryForm({ eventId, title }: { eventId: string; title: string }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function submit() {
    setErr("");
    setLoading(true);
    try {
      const r = await fetch(`/api/events/${eventId}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message })
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error ?? "Failed to submit"); setLoading(false); return; }
      setSent(true);
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (sent) return (
    <div className="text-sm text-emerald-600 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
      Thank you! We will contact you shortly about “{title}”.
    </div>
  );

  return (
    <div className="space-y-3">
      {err && <div className="text-xs text-destructive">{err}</div>}
      <div>
        <Label className="text-xs">Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" className="mt-1" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="mt-1" />
        </div>
      </div>
      <div>
        <Label className="text-xs">Message</Label>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`I am interested in ${title}…`} className="mt-1" />
      </div>
      <Button onClick={submit} className="w-full" disabled={loading}>{loading ? "Submitting..." : "Submit Now"}</Button>
    </div>
  );
}
