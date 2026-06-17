"use client";

import { Plus, Search, Star, MapPin, ShieldCheck, Upload } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { suppliers } from "@/lib/mock-data";

export default function SourcingPage() {
  return (
    <div>
      <PageHeader
        title="Supplier sourcing"
        description="Add suppliers, upload quotations, and track sourcing notes."
        actions={
          <Button variant="gradient" size="sm"><Plus className="h-4 w-4" /> Add supplier</Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search supplier database..." className="pl-9" />
          </div>
          {suppliers.map((s) => (
            <Card key={s.id} className="p-4">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                  <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" /> {s.city}
                      </div>
                    </div>
                    <Badge variant="success"><ShieldCheck className="h-2.5 w-2.5" /> Verified</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {s.rating}
                    </div>
                    <span className="text-muted-foreground">·</span>
                    <span>Trust {s.trustScore}</span>
                    <span className="text-muted-foreground">·</span>
                    <span>{s.totalOrders.toLocaleString()} orders</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1">
                      {s.certifications.slice(0, 3).map((c) => (
                        <Badge key={c} variant="muted" className="text-[10px]">{c}</Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">Add to RFQ</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="lg:sticky lg:top-20 h-fit">
          <CardHeader><CardTitle>Add new supplier</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Factory name</Label>
              <Input placeholder="ACME Manufacturing Co." />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">City</Label>
              <Input placeholder="Shenzhen, Guangdong" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Specialization</Label>
              <Input placeholder="e.g. TWS earbuds, audio devices" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sourcing notes</Label>
              <Textarea rows={3} placeholder="MOQ, lead time, certifications observed..." />
            </div>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Upload className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <div className="text-xs">Upload factory photos</div>
            </div>
            <Button variant="gradient" className="w-full">Submit supplier</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
