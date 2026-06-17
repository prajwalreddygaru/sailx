"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us";

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia",
  "UAE", "Saudi Arabia", "Germany", "France", "Italy", "Spain", "Other"
];

const businessStages = [
  "Just starting", "Exploring suppliers", "Sampling products", "Ready to place order", "Scaling production"
];

export default function ConsultationPage() {
  const [mode, setMode] = React.useState<"FIND" | "MANAGE">("FIND");
  const [loading, setLoading] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [businessStage, setBusinessStage] = React.useState("");
  const [message, setMessage] = React.useState("");
  const formRef = React.useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone || !country || !businessStage) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, lastName, email, phone, country,
          businessStage, message, mode
        })
      });

      if (res.ok) {
        setSubmitted(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setCountry("");
        setBusinessStage("");
        setMessage("");
        toast.success("Consultation request submitted successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit request");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl border bg-card p-8 md:p-12 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Thanks! We received your request</h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              Our team will reach out on your email/phone shortly to discuss your sourcing needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="rounded-xl font-bold">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl font-bold">
                <Link href="/tours">Explore Tours</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <section className="pt-20 md:pt-28 pb-10 md:pb-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest">
              Book a Consultation
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mt-4">
              <span>Your Trusted Trade & Sourcing</span><br />
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">Partner in China</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Finding a reliable supplier and ensuring smooth production can be challenging. Our agents handle the entire process, from sourcing to delivery.
            </p>
            <ul className="mt-5 grid sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
              <li className="rounded-xl border bg-card px-3 py-2">↗ 24–48h response time</li>
              <li className="rounded-xl border bg-card px-3 py-2">✓ Confidential & secure</li>
              <li className="rounded-xl border bg-card px-3 py-2">★ Verified supplier network</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={() => {
                  setMode("FIND");
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
                  mode === "FIND"
                    ? "border-red-600 bg-red-50"
                    : "border-border bg-card hover:border-red-300"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">Find new suppliers</h3>
                <p className="text-sm text-muted-foreground">If you are looking for new suppliers, we can help you find the best match and offer you a competitive price along with a cost-effective manufacturing solution.</p>
              </button>
              <button
                onClick={() => {
                  setMode("MANAGE");
                  formRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex-1 p-6 rounded-2xl border-2 transition-all ${
                  mode === "MANAGE"
                    ? "border-red-600 bg-red-50"
                    : "border-border bg-card hover:border-red-300"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">Manage my suppliers</h3>
                <p className="text-sm text-muted-foreground">If you prefer to use your own suppliers, we can collaborate with them and manage the entire purchasing process from production to quality inspection and door-to-door logistics. Our support will significantly enhance your sourcing efficiency.</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Paragraph */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4">Submit Your Sourcing Request</h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Fill out this form with your detailed needs and our customer support team will contact you shortly. We will assign a professional agent to follow up on your project and provide personalized assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section ref={formRef} className="pb-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-3xl border bg-card p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Submit Request</h2>
              <p className="text-sm text-muted-foreground mb-6">We'll match you with the right sourcing agent.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name *</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Select your country *</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger><SelectValue placeholder="Choose country" /></SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>The stage of your business? *</Label>
                    <Select value={businessStage} onValueChange={setBusinessStage}>
                      <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                      <SelectContent>
                        {businessStages.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>What do you need from China?</Label>
                  <textarea
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm min-h-[120px] resize-y"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the products, links, services, etc."
                  />
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" className="rounded-xl" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={loading} className="rounded-xl bg-red-600 hover:bg-red-700 font-bold">
                    {loading ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-10 md:py-16 border-t bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black mb-4">How it works</h2>
            <p className="text-muted-foreground">Simple steps to get started with your sourcing journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="rounded-2xl border bg-card p-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-bold mb-2">Submit your request</h3>
              <p className="text-sm text-muted-foreground">Fill out the form with your sourcing needs and business details</p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-bold mb-2">We match you with an expert</h3>
              <p className="text-sm text-muted-foreground">Our team connects you with a sourcing agent specialized in your category</p>
            </div>
            <div className="rounded-2xl border bg-card p-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-bold mb-2">Start sourcing with confidence</h3>
              <p className="text-sm text-muted-foreground">Get supplier matches, factory visits, and end-to-end support</p>
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us */}
      <WhyChooseUsSection />

    </div>
  );
}
