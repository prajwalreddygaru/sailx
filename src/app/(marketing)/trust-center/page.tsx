"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Landmark, CheckSquare, EyeOff, ShieldAlert, Award } from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: CheckSquare,
    title: "On-Ground Supplier Verification",
    description: "Every supplier on our platform is physically visited and verified by our regional auditors before being recommended.",
    details: [
      "Registration check with Chinese Ministry of Commerce",
      "Annual factory output capacity & quality certification audits",
      "Direct bank-holder credentials verification to eliminate broker fraud"
    ],
    accent: "bg-red-500/10 text-red-600 border-red-500/20"
  },
  {
    icon: Landmark,
    title: "100% Secure Authorized Payments",
    description: "We mandate strict secure payment workflows, eliminating personal account deals.",
    details: [
      "Payments routed exclusively through verified corporate bank channels",
      "Strict warnings against personal transactions to staff member bank cards",
      "Secure escrow-like contract clearings on major project milestones"
    ],
    accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  },
  {
    icon: ShieldCheck,
    title: "Strict Quality Inspection (AQL 2.5)",
    description: "No product leaves Chinese borders without passing standard batch inspections.",
    details: [
      "Rigorous random sampling matching international ISO/AQL criteria",
      "Full digital reporting containing high-resolution photos and video tests",
      "Supervised container packaging and loading to ensure zero damage in transit"
    ],
    accent: "bg-amber-500/10 text-amber-600 border-amber-500/20"
  },
  {
    icon: EyeOff,
    title: "IP Protection & Legally Binding NDAs",
    description: "Your product specs, proprietary CAD drawings, and trademarks are completely secure.",
    details: [
      "Enforceable bilingual English-Chinese Non-Disclosure Agreements (NDAs)",
      "Strict access-control models on supplier portal to isolate blueprints",
      "Encrypted design files handling over modern enterprise databases"
    ],
    accent: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  }
];

export default function TrustCenterPage() {
  return (
    <div className="pt-24 md:pt-28 pb-12 md:pb-16 min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary bg-primary/5">
            Security & Compliance
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight mt-4 mb-3">
            SAILX <span className="text-primary">Trust Center</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Our priority is to maintain absolute transparency, security, and reliability across your end-to-end global supply chain.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} className="p-6 md:p-8 hover:shadow-md transition-shadow duration-300 border-primary/10 bg-card rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border shrink-0 ${pillar.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground leading-snug">
                      {pillar.title}
                    </h2>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {pillar.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-border/50 pl-1">
                    {pillar.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2.5 text-xs text-foreground/80 leading-relaxed">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Trust Seal Banner */}
        <div className="p-6 md:p-8 rounded-3xl border border-primary/10 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mx-auto">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Zero-Broker Sourcing Assurance</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mt-1">
                We directly connect trade buyers with physical factory owners. No middle-man markups, completely transparent quotations.
              </p>
            </div>
          </div>
          <Badge className="bg-primary hover:bg-primary text-primary-foreground font-mono px-4 py-1.5 text-xs rounded-xl shadow-sm tracking-wide">
            100% VERIFIED
          </Badge>
        </div>
      </div>
    </div>
  );
}
