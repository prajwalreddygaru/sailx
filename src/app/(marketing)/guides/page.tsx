"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Shield, Truck, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const GUIDES = [
  {
    icon: Compass,
    title: "1. Global Supplier Discovery & Validation",
    description: "Learn how to filter out secondary brokers and find direct-tier manufacturers.",
    steps: [
      "Verify business registrations & export licenses with Chinese ministries",
      "Check production capabilities, machinery specs, and minimum order quantities (MOQs)",
      "Initiate secure sample orders to evaluate quality parameters before bulk deposits"
    ],
    bg: "bg-red-500/5 border-red-500/10 text-red-600"
  },
  {
    icon: Shield,
    title: "2. Quality Control & Pre-Shipment Audits",
    description: "Our comprehensive on-site testing checklist to maintain flawless product standards.",
    steps: [
      "Define strict AQL standards (Acceptable Quality Limit) before production starts",
      "Perform mid-production reviews to catch functional and structural errors early",
      "Conduct pre-shipment container loading supervision to count cartons and verify packaging"
    ],
    bg: "bg-emerald-500/5 border-emerald-500/10 text-emerald-600"
  },
  {
    icon: Truck,
    title: "3. Import Logistics, Duties & Customs Clearance",
    description: "A complete walkthrough of shipping terms, container loading, and duty savings.",
    steps: [
      "Choose the right Incoterms: understand the differences between FOB, CIF, and DDP",
      "Verify exact customs HS Code classifications to calculate exact import duty rates",
      "Prepare mandatory clearance papers: Bill of Lading, Certificate of Origin, Commercial Invoice"
    ],
    bg: "bg-amber-500/5 border-amber-500/10 text-amber-600"
  },
  {
    icon: Search,
    title: "4. Sourcing Tours & Fair Readiness Guide",
    description: "Prepare for your physical trade fair visits and factory face-to-face negotiations.",
    steps: [
      "Secure appropriate business visas and coordinate flight schedules with the SAILX team",
      "Pre-compile list of target booths and direct supplier offices you wish to audit",
      "Utilize professional bilingual interpreter services for seamless pricing negotiations"
    ],
    bg: "bg-blue-500/5 border-blue-500/10 text-blue-600"
  }
];

export default function GuidesPage() {
  return (
    <div className="pt-24 md:pt-28 pb-12 md:pb-16 min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary bg-primary/5">
            Sourcing Playbooks
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight mt-4 mb-3">
            Sourcing <span className="text-primary">Guides</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Expertly-crafted, step-by-step playbooks to help you source, manufacture, inspect, and import goods globally with absolute security.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {GUIDES.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <Card key={idx} className="p-6 md:p-8 hover:shadow-md transition-shadow duration-300 border-primary/10 bg-card rounded-2xl flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Top Bar with Icon */}
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-14 rounded-2xl flex items-center justify-center border shrink-0 ${guide.bg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground leading-snug">
                        {guide.title}
                      </h2>
                      <p className="text-muted-foreground text-xs md:text-sm mt-1">
                        {guide.description}
                      </p>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <ul className="space-y-3.5 pl-1">
                    {guide.steps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-border/50 mt-6 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-mono">STEP {idx + 1} OF 4</span>
                  <Button variant="link" className="text-primary hover:text-primary/95 p-0 h-auto font-bold flex items-center gap-1">
                    Open Full Guide <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
