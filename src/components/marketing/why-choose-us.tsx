"use client";

import * as React from "react";
import { ShieldCheck, BadgeCheck, HandshakeIcon, Truck, Users, Clock } from "lucide-react";

export function WhyChooseUsSection() {
  const features = [
    {
      icon: BadgeCheck,
      title: "Verified Suppliers",
      desc: "Access a curated network of vetted factories and wholesalers across China.",
    },
    {
      icon: ShieldCheck,
      title: "Quality & Compliance",
      desc: "On‑ground inspections and structured QC to ensure your standards are met.",
    },
    {
      icon: HandshakeIcon,
      title: "Negotiation & Payments",
      desc: "We negotiate better terms and coordinate secure payments with suppliers.",
    },
    {
      icon: Truck,
      title: "Door‑to‑Door Logistics",
      desc: "End‑to‑end shipping support with clear timelines and transparent costs.",
    },
    {
      icon: Users,
      title: "Local Team in China",
      desc: "Bilingual team for factory visits, follow‑ups, and faster resolution.",
    },
    {
      icon: Clock,
      title: "Fast Turnarounds",
      desc: "Swift sourcing cycles with proactive updates and reliable ETAs.",
    },
  ];

  return (
    <section className="py-6 md:py-20 border-t bg-muted/10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          {/* Left: Text + Features */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1.5 w-8 rounded-full bg-red-500" />
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Why Choose Us</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3">
              We make China sourcing simple, safe, and cost‑effective
            </h2>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5 md:mb-8 max-w-2xl">
              From verified suppliers to door‑to‑door logistics, we manage every step so you can focus on growing your business.
            </p>

            {/* Mobile: compact 2-col grid */}
            <div className="md:hidden">
              <div className="grid grid-cols-3 gap-2">
                {features.map(({ icon: Icon, title }) => (
                  <div key={title} className="flex flex-col items-center text-center gap-1.5 rounded-lg border bg-card p-2.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-500/10 text-red-600 shrink-0">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="text-[11px] font-semibold leading-tight">{title}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop and tablets: card grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6">
              {features.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-bold">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:block">
            <div className="relative rounded-3xl border bg-card p-6 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=70"
                alt="Why choose us — sourcing support"
                className="w-full h-[360px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
