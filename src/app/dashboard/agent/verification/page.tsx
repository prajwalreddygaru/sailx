"use client";

import { Upload, Check, FileText, Image as ImageIcon, Video, Award } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const checklist = [
  { label: "Business license verified", done: true },
  { label: "Export license verified", done: true },
  { label: "Factory photos uploaded (min. 8)", done: true },
  { label: "Factory video walkthrough uploaded", done: false },
  { label: "Production capacity confirmed", done: true },
  { label: "QC process documented", done: false },
  { label: "Sample dispatched and tracked", done: true },
  { label: "Reference customer contacted", done: false }
];

export default function VerificationPage() {
  const done = checklist.filter((c) => c.done).length;
  const pct = (done / checklist.length) * 100;

  return (
    <div>
      <PageHeader
        title="Factory verification"
        description="Run a 36-point factory audit on Shenzhen AudioPeak Tech."
      />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verification progress</CardTitle>
                <Badge variant="default">{done} / {checklist.length} complete</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={pct} className="h-2" />
              <div className="text-xs text-muted-foreground mt-2">{pct.toFixed(0)}% complete</div>
              <div className="space-y-2 mt-5">
                {checklist.map((c) => (
                  <label key={c.label} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/40 cursor-pointer">
                    <Checkbox defaultChecked={c.done} />
                    <span className={`text-sm flex-1 ${c.done ? "line-through text-muted-foreground" : ""}`}>{c.label}</span>
                    {c.done && <Check className="h-4 w-4 text-success" />}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Media uploads</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center hover:bg-accent/30 cursor-pointer">
                    {i < 4 ? (
                      <img src={`https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&sig=${i}`} alt="" className="h-full w-full object-cover rounded-lg" />
                    ) : i === 4 ? (
                      <><Video className="h-5 w-5 text-muted-foreground mb-1" /><div className="text-xs">Upload video</div></>
                    ) : (
                      <><Upload className="h-5 w-5 text-muted-foreground mb-1" /><div className="text-xs">Add more</div></>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Certifications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {["CE", "FCC", "RoHS", "ISO 9001", "BSCI"].map((c) => (
              <div key={c} className="flex items-center justify-between p-2.5 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">{c}</span>
                </div>
                <Badge variant="success">Verified</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-3">
              <Upload className="h-3.5 w-3.5" /> Upload certificate
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
