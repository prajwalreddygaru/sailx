"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppBack } from "@/hooks/use-app-back";
import { useSession } from "next-auth/react";
import { ShoppingBag, PackageCheck, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  images: string[];
  tags: string[];
  stock: number;
}

export default function ProductDetailPage() {
  const { id }     = useParams<{ id: string }>();
  const router     = useRouter();
  const goBack     = useAppBack("/");
  const { data: session } = useSession();
  const [product, setProduct]   = React.useState<Product | null>(null);
  const [loading, setLoading]   = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const [notes, setNotes]       = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [isBulk, setIsBulk]    = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => { setProduct(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  async function requestSample(bulk: boolean) {
    if (!session) { router.push("/login"); return; }
    setIsBulk(bulk);
    setSubmitting(true);
    try {
      const res = await fetch("/api/sample-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, quantity, notes, isBulk: bulk }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed"); return; }
      toast.success(`${bulk ? "Bulk order" : "Sample request"} placed! Code: ${data.code}`);
      router.push("/dashboard/buyer/orders");
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  if (!product) return <div className="text-center py-20 text-muted-foreground">Product not found.</div>;

  const displayPrice = product.salePrice ?? product.price;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={goBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square rounded-xl overflow-hidden bg-muted">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.title} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.slice(1, 4).map((img, i) => (
                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
                  <img src={img} alt="" className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <Badge variant="outline" className="mb-2">{product.category}</Badge>
            <h1 className="text-2xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-bold text-primary">₹{displayPrice.toLocaleString()}</span>
              {product.salePrice && (
                <span className="text-lg text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>
              )}
            </div>
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {product.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="border rounded-xl p-4 space-y-4 bg-card">
            <h3 className="font-semibold">Place a Request</h3>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-32" />
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input placeholder="Specifications, colour, size..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => requestSample(false)} disabled={submitting}>
                <PackageCheck className="h-4 w-4 mr-2" />
                {submitting && !isBulk ? "Requesting..." : "Request Sample"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => requestSample(true)} disabled={submitting}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                {submitting && isBulk ? "Placing..." : "Bulk Order"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">An agent will review and quote you the final price. Payment required only after quotation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
