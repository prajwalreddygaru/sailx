"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, TrendingUp, Cpu, Truck } from "lucide-react";

const REPORTS = [
  {
    icon: TrendingUp,
    title: "Chongqing Automotive Parts & EV Sourcing Directory 2026",
    size: "4.8 MB",
    pages: "38 pages",
    published: "May 2026",
    highlights: [
      "Catalog of 45+ pre-audited OEM/ODM automotive parts manufacturers",
      "Average cost benchmarks and volume pricing breaks",
      "Analysis of EV battery standards & customs regulations for India/Europe"
    ],
    accent: "bg-red-500/10 text-red-600 border-red-500/20"
  },
  {
    icon: Cpu,
    title: "Consumer Electronics & IoT Smart Hardware Factory Guide",
    size: "6.2 MB",
    pages: "52 pages",
    published: "April 2026",
    highlights: [
      "In-depth map of supply chains across Shenzhen and Chongqing Liangjiang Zone",
      "Standard sample development schedules and mass production timelines",
      "Frictionless testing guidelines (CE, RoHS, FCC compliance checks)"
    ],
    accent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
  },
  {
    icon: Truck,
    title: "Heavy Machinery & Automation Equipment Import Brief",
    size: "3.5 MB",
    pages: "24 pages",
    published: "March 2026",
    highlights: [
      "Directory of certified hydraulic and pneumatic machine factories",
      "On-site loading supervision protocols for oversized containers",
      "Step-by-step custom tax calculation & HS Code mappings"
    ],
    accent: "bg-amber-500/10 text-amber-600 border-amber-500/20"
  }
];

export default function SourcingReportsPage() {
  return (
    <div className="pt-24 md:pt-28 pb-12 md:pb-16 min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="px-3 py-1 border-primary/20 text-primary bg-primary/5">
            Market Intelligence
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight mt-4 mb-3">
            Sourcing <span className="text-primary">Reports</span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Exclusive directories, manufacturing cost analyses, and trade fair field reports researched and verified directly by the SAILX network.
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {REPORTS.map((report, i) => {
            const Icon = report.icon;
            return (
              <Card key={i} className="p-6 hover:shadow-md transition-shadow duration-300 border-primary/10 bg-card rounded-2xl flex flex-col justify-between">
                <div className="space-y-5">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${report.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="text-xs bg-muted text-foreground/80 font-mono">
                      PDF REPORT
                    </Badge>
                  </div>

                  <h3 className="font-bold text-base md:text-lg leading-snug text-foreground hover:text-primary transition-colors">
                    {report.title}
                  </h3>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1 border-b border-border/50 pb-3">
                    <div>Pages: <span className="font-semibold text-foreground">{report.pages}</span></div>
                    <div>Size: <span className="font-semibold text-foreground">{report.size}</span></div>
                    <div>Published: <span className="font-semibold text-foreground">{report.published}</span></div>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-foreground/75 uppercase tracking-wider">Report Highlights:</h4>
                    <ul className="space-y-2 text-xs md:text-sm text-muted-foreground leading-relaxed pl-1">
                      {report.highlights.map((hl, hlIdx) => (
                        <li key={hlIdx} className="flex items-start gap-2">
                          <FileText className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-border/50 mt-6">
                  <Button className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 font-semibold flex items-center justify-center gap-2 text-sm">
                    <Download className="h-4 w-4" /> Download Full Report
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
