"use client";

import { Upload, Award, ShieldCheck, Calendar } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const certs = [
  { name: "ISO 9001:2015", body: "TÜV Rheinland", expires: "2027-08-12", status: "Verified" },
  { name: "CE Marking", body: "Notified Body 0123", expires: "Indefinite", status: "Verified" },
  { name: "FCC ID 2A4Z9-AP24", body: "FCC", expires: "Indefinite", status: "Verified" },
  { name: "RoHS Compliance", body: "SGS", expires: "2026-12-31", status: "Verified" },
  { name: "BSCI", body: "amfori", expires: "2026-07-04", status: "Renewing" }
];

export default function CertificationsPage() {
  return (
    <div>
      <PageHeader
        title="Certifications"
        description="Maintain compliance certificates and export licenses."
        actions={<Button variant="gradient" size="sm"><Upload className="h-4 w-4" /> Upload certificate</Button>}
      />
      <div className="grid lg:grid-cols-2 gap-4">
        {certs.map((c) => (
          <Card key={c.name}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-success/10 text-success flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">Issued by {c.body}</div>
                  </div>
                </div>
                <Badge variant={c.status === "Verified" ? "success" : "warning"}>
                  <ShieldCheck className="h-3 w-3" /> {c.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" /> Expires: {c.expires}
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
