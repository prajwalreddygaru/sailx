"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Upload, Sparkles, X, FileText } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function NewRFQPage() {
  const router = useRouter();
  const [files, setFiles] = React.useState<{ name: string; size: string }[]>([
    { name: "Product_Specification_v2.pdf", size: "1.2 MB" }
  ]);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("RFQ created — we'll match an agent within 24 hours");
    router.push("/dashboard/buyer/rfqs");
  };

  return (
    <div>
      <Link
        href="/dashboard/buyer/rfqs"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to RFQs
      </Link>
      <PageHeader
        title="Create new RFQ"
        description="Tell us what you need. We'll match a verified agent within 24 hours."
        actions={
          <Button variant="outline" size="sm">
            <Sparkles className="h-3.5 w-3.5" /> Draft with AI
          </Button>
        }
      />

      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product title *</Label>
                <Input placeholder="e.g. Wireless Bluetooth Earbuds with ANC" required />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  rows={5}
                  placeholder="Describe specifications, features, materials, and any customization requirements..."
                  required
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Electronics", "Packaging", "Industrial", "Machinery", "Home Decor", "Accessories"].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sub-category</Label>
                  <Input placeholder="e.g. Audio / Earbuds" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quantity, budget & timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Target quantity *</Label>
                  <Input type="number" placeholder="5000" required />
                </div>
                <div className="space-y-2">
                  <Label>Acceptable MOQ</Label>
                  <Input type="number" placeholder="1000" />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="CNY">CNY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget per unit</Label>
                  <Input type="number" step="0.01" placeholder="9.50" />
                </div>
                <div className="space-y-2">
                  <Label>Delivery timeline</Label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="45">45 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Customization requirements</Label>
                <Textarea
                  rows={3}
                  placeholder="Logo printing, branded packaging, color variants, certifications..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-accent/30 transition-colors">
                <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                <div className="text-sm font-medium">Drop files here or click to upload</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Spec sheets, reference images, drawings (PDF, JPG, PNG, DWG · max 25 MB)
                </div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const list = Array.from(e.target.files || []).map((f) => ({
                      name: f.name,
                      size: `${(f.size / 1024).toFixed(0)} KB`
                    }));
                    setFiles((prev) => [...prev, ...list]);
                  }}
                />
              </label>
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border bg-card/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.size}</div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setFiles(files.filter((_, j) => j !== i))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Submission summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="default">1</Badge>
                <div>
                  <div className="font-medium">Agent matching</div>
                  <div className="text-xs text-muted-foreground">A verified agent in your category will own this RFQ within 24h.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="default">2</Badge>
                <div>
                  <div className="font-medium">Supplier sourcing</div>
                  <div className="text-xs text-muted-foreground">8–12 factories will be screened. Top 3–6 will quote.</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="default">3</Badge>
                <div>
                  <div className="font-medium">Quotation comparison</div>
                  <div className="text-xs text-muted-foreground">Side-by-side scorecards in your dashboard.</div>
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : <>Submit RFQ <ArrowRight className="h-4 w-4" /></>}
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  Save as draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
