import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Star, MapPin, Award, Package, Clock, Building2, MessageSquare, Video } from "lucide-react";
import { suppliers } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";

export default function SupplierDetailPage({ params }: { params: { id: string } }) {
  const s = suppliers.find((x) => x.id === params.id);
  if (!s) notFound();

  return (
    <div>
      <Link href="/dashboard/buyer/suppliers" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to suppliers
      </Link>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-[16/8] bg-muted overflow-hidden">
              <img src={s!.imageUrl} alt={s!.name} className="h-full w-full object-cover" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="font-display text-2xl font-semibold">{s!.name}</h1>
                  <div className="text-sm text-muted-foreground mt-1">{s!.factoryName}</div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {s!.city}, {s!.country}
                  </div>
                </div>
                <Badge variant="success">
                  <ShieldCheck className="h-3 w-3" /> Verified factory
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Trust score</div>
                  <div className="font-display text-2xl font-semibold mt-1">{s!.trustScore}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Rating</div>
                  <div className="font-display text-2xl font-semibold mt-1 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {s!.rating}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Orders</div>
                  <div className="font-display text-2xl font-semibold mt-1">{s!.totalOrders.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Response</div>
                  <div className="font-display text-2xl font-semibold mt-1">{s!.responseTime}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Certifications & compliance</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {s!.certifications.map((c) => (
                  <div key={c} className="flex items-center gap-3 p-3 rounded-lg border bg-card/40">
                    <div className="h-9 w-9 rounded-lg bg-success/10 text-success flex items-center justify-center">
                      <Award className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{c}</div>
                      <div className="text-xs text-muted-foreground">Verified by SailX</div>
                    </div>
                    <ShieldCheck className="h-4 w-4 text-success" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Factory media</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img src={s!.imageUrl} alt="" className="h-full w-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="gradient" className="w-full justify-start">
                <MessageSquare className="h-4 w-4" /> Chat with agent
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4" /> Schedule factory tour
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4" /> Request quotation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {s!.categories.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Export details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Export license</span>
                <span className="font-mono text-xs">{s!.exportLicense}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Years exporting</span>
                <span className="font-medium">{s!.yearsActive} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Top markets</span>
                <span className="font-medium">US, EU, IN</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
