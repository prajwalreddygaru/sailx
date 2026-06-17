"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Calendar, MapPin, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const offices = [
  { city: "Bengaluru, India", addr: "WeWork Galaxy, Residency Road, Bengaluru 560025" },
  { city: "Shenzhen, China", addr: "Tower 3, Tian An Cyber Park, Futian District" },
  { city: "Singapore", addr: "9 Battery Road, MYP Centre, Singapore 049910" }
];

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || (!email && !phone)) {
      toast.error("Please provide your name and at least one contact (email or phone)");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || null,
          phone: phone || null,
          message: message ? `${message}${company ? `\nCompany: ${company}` : ""}` : (company ? `Company: ${company}` : null),
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast.error(d.error || "Failed to submit enquiry");
        return;
      }
      toast.success("Message sent! We'll be in touch soon.");
      setName(""); setEmail(""); setCompany(""); setPhone(""); setMessage("");
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="container pt-24 md:pt-28 pb-12 md:pb-16 text-center max-w-3xl mx-auto">
        <Badge variant="default">Contact</Badge>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mt-5">
          We're here to help.
        </h1>
      </section>

      <section className="container pb-24 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Imports" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>How can we help?</Label>
                <Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you're sourcing or what you'd like to discuss..." />
              </div>
              <Button type="submit" variant="gradient" disabled={submitting}>
                {submitting ? "Sending..." : "Send message"}
              </Button>
            </form>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Mail className="h-4 w-4" />
              </div>
              <div className="text-base font-semibold">Email</div>
            </div>
            <a href="mailto:info@sailxchina.com" className="text-base text-primary hover:underline">
              info@sailxchina.com
            </a>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="text-base font-semibold">WhatsApp</div>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "918660752291"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-emerald-600 hover:underline"
            >
              +91 86607 52291
            </a>
          </Card>
        </div>
      </section>
    </>
  );
}
