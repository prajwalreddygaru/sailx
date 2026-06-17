"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function ServiceConsultForm({ serviceSlug }: { serviceSlug?: string }) {
  const [first, setFirst] = React.useState("");
  const [last, setLast] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [stage, setStage] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!first || !last || !email || !phone || !country || !stage) return;
    setLoading(true);
    try {
      await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: first,
          lastName: last,
          email,
          phone,
          country,
          businessStage: stage,
          message: msg,
          mode: "FIND",
          service: serviceSlug ?? null,
        }),
      });
      setSent(true);
      setFirst(""); setLast(""); setEmail(""); setPhone(""); setCountry(""); setStage(""); setMsg("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <h3 className="text-xl font-black mb-1">Request a consultation</h3>
      <p className="text-sm text-muted-foreground mb-4">Our expert agents will contact you shortly.</p>
      {sent ? (
        <div className="text-sm text-emerald-600 font-semibold">Thanks! Your request has been received.</div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>First Name *</Label>
              <Input value={first} onChange={(e) => setFirst(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Last Name *</Label>
              <Input value={last} onChange={(e) => setLast(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label>Phone Number *</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Country *</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue placeholder="Choose country" /></SelectTrigger>
                <SelectContent>
                  {["India","United States","United Kingdom","Canada","Australia","UAE","Saudi Arabia","Germany","France","Italy","Spain","Other"].map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Business stage *</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                <SelectContent>
                  {["Just starting","Exploring suppliers","Sampling products","Ready to place order","Scaling production"].map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>What do you need from China?</Label>
            <textarea className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px]" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Tell us about the products, links, or support you need." />
          </div>
          <div className="text-right">
            <Button type="submit" disabled={loading} className="rounded-full bg-red-600 hover:bg-red-700">{loading ? "Submitting..." : "Submit"}</Button>
          </div>
        </form>
      )}
    </div>
  );
}
