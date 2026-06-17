"use client";

import * as React from "react";
import {
  Plus, Search, Pencil, Trash2, Star, StarOff, Package,
  ImageIcon, Tag, BarChart3, Upload, X, IndianRupee,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Electronics", "Fashion", "Home & Living", "Beauty", "Sports",
  "Books", "Toys", "Automotive", "Food & Grocery", "Health",
];

const STATUS_COLOR: Record<string, string> = {
  ACTIVE:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  DRAFT:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ARCHIVED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number | null;
  chinaCost: number | null;
  indiaCost: number | null;
  category: string;
  tags: string[];
  images: string[];
  stock: number;
  sku: string | null;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  isFeatured: boolean;
  createdAt: string;
};

type FormState = {
  title: string; description: string;
  price: string; salePrice: string;
  chinaCost: string; indiaCost: string;
  category: string; sku: string; stock: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  isFeatured: boolean; tags: string;
  images: string[];
};

const emptyForm: FormState = {
  title: "", description: "", price: "", salePrice: "",
  chinaCost: "", indiaCost: "",
  category: "", sku: "", stock: "0",
  status: "DRAFT", isFeatured: false, tags: "", images: [],
};

export default function AdminProductsPage() {
  const [products,      setProducts]      = React.useState<Product[]>([]);
  const [loading,       setLoading]       = React.useState(true);
  const [saving,        setSaving]        = React.useState(false);
  const [search,        setSearch]        = React.useState("");
  const [filterCat,     setFilterCat]     = React.useState("all");
  const [filterStatus,  setFilterStatus]  = React.useState("all");
  const [dialogOpen,    setDialogOpen]    = React.useState(false);
  const [editing,       setEditing]       = React.useState<Product | null>(null);
  const [deleteId,      setDeleteId]      = React.useState<string | null>(null);
  const [form,          setForm]          = React.useState<FormState>(emptyForm);
  const [uploading,     setUploading]     = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products?status=all");
      if (res.ok) setProducts(await res.json());
    } finally { setLoading(false); }
  }

  React.useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat === "all" || p.category === filterCat;
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const stats = {
    total:      products.length,
    active:     products.filter((p) => p.status === "ACTIVE").length,
    featured:   products.filter((p) => p.isFeatured).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  function openAdd() { setEditing(null); setForm(emptyForm); setDialogOpen(true); }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      title: p.title, description: p.description,
      price: String(p.price), salePrice: p.salePrice ? String(p.salePrice) : "",
      chinaCost: p.chinaCost ? String(p.chinaCost) : "",
      indiaCost: p.indiaCost ? String(p.indiaCost) : "",
      category: p.category, sku: p.sku ?? "", stock: String(p.stock),
      status: p.status, isFeatured: p.isFeatured,
      tags: p.tags.join(", "), images: [...p.images],
    });
    setDialogOpen(true);
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        uploaded.push(data.url);
      }
    }
    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(url: string) {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }));
  }

  async function handleSave() {
    if (!form.title || !form.category) return;
    setSaving(true);
    const payload = {
      title: form.title, description: form.description,
      price: form.indiaCost || form.price || "0",
      salePrice: form.salePrice || null,
      chinaCost: form.chinaCost || null,
      indiaCost: form.indiaCost || null,
      category: form.category, sku: form.sku || null,
      stock: form.stock || "0", status: form.status,
      isFeatured: form.isFeatured,
      images: form.images,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await fetch(`/api/products/${editing.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/products", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchProducts();
      setDialogOpen(false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await fetchProducts();
  }

  async function toggleFeatured(id: string) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    await fetch(`/api/products/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFeatured: !p.isFeatured }),
    });
    await fetchProducts();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage product listings. Toggle ⭐ Featured to show on homepage."
        actions={
          <Button variant="gradient" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          Loading products…
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={stats.total}      icon={Package}   />
        <StatCard label="Active"         value={stats.active}     icon={BarChart3} />
        <StatCard label="Featured"       value={stats.featured}   icon={Star}      />
        <StatCard label="Out of Stock"   value={stats.outOfStock} icon={Tag} hint="Needs restocking" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by title or SKU…" className="pl-9" value={search}
                onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={filterCat} onValueChange={setFilterCat}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                  <th className="text-left pb-3 pl-1">Product</th>
                  <th className="text-left pb-3">Category</th>
                  <th className="text-right pb-3">China Cost</th>
                  <th className="text-right pb-3">India Cost</th>
                  <th className="text-right pb-3">Stock</th>
                  <th className="text-center pb-3">Status</th>
                  <th className="text-center pb-3">Featured</th>
                  <th className="text-right pb-3 pr-1">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      No products found.
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-accent/30 transition-colors">
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0">
                          {p.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold">{p.title}</div>
                          <div className="text-xs text-muted-foreground font-mono">{p.sku ?? "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-xs bg-accent px-2 py-0.5 rounded">{p.category}</span>
                    </td>
                    <td className="py-3 text-right tabular-nums text-sm">
                      {p.chinaCost != null
                        ? <span className="text-orange-400 font-medium">¥{p.chinaCost.toFixed(2)}</span>
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 text-right tabular-nums text-sm">
                      {p.indiaCost != null
                        ? <span className="flex items-center justify-end gap-0.5 text-emerald-400 font-medium">
                            <IndianRupee className="h-3 w-3" />{p.indiaCost.toFixed(0)}
                          </span>
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      <span className={cn("font-medium", p.stock === 0 && "text-destructive")}>{p.stock}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded border", STATUS_COLOR[p.status])}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button onClick={() => toggleFeatured(p.id)} className="hover:scale-110 transition-transform" title="Toggle Featured">
                        {p.isFeatured
                          ? <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          : <StarOff className="h-4 w-4 text-muted-foreground" />}
                      </button>
                    </td>
                    <td className="py-3 pr-1 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(p)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(p.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── ADD / EDIT DIALOG ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">

            {/* Title + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Product title" className="mt-1" />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>SKU</Label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="e.g. ELEC-001" className="mt-1" />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the product…" className="mt-1 resize-none" rows={3} />
            </div>

            {/* Cost fields */}
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="text-sm font-bold text-foreground">Pricing</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="flex items-center gap-1.5">
                    <span className="text-orange-400">🇨🇳</span> China Cost (¥ CNY)
                  </Label>
                  <Input type="number" min="0" step="0.01" value={form.chinaCost}
                    onChange={(e) => setForm({ ...form, chinaCost: e.target.value })}
                    placeholder="Factory price in CNY" className="mt-1" />
                  <p className="text-[11px] text-muted-foreground mt-1">What you pay the factory</p>
                </div>
                <div>
                  <Label className="flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-emerald-500" /> India Cost (₹ INR)
                  </Label>
                  <Input type="number" min="0" step="0.01" value={form.indiaCost}
                    onChange={(e) => setForm({ ...form, indiaCost: e.target.value })}
                    placeholder="Landing price in India" className="mt-1" />
                  <p className="text-[11px] text-muted-foreground mt-1">Displayed price on homepage</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Sale / Offer Price (₹)</Label>
                  <Input type="number" min="0" step="0.01" value={form.salePrice}
                    onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                    placeholder="Optional discount price" className="mt-1" />
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <Input type="number" min="0" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="flex items-center gap-1.5 mb-2">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" /> Product Images
              </Label>

              {/* Upload button */}
              <div
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer transition-colors",
                  "hover:border-primary/50 hover:bg-primary/3",
                  uploading && "opacity-60 pointer-events-none"
                )}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-semibold">
                  {uploading ? "Uploading…" : "Click to upload images from your device"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WEBP · Multiple files allowed
                </p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)} />

              {/* Image previews */}
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-lg border border-border overflow-hidden group bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage(url)}
                        className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[9px] font-bold text-center py-0.5">
                          MAIN
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Tags <span className="text-muted-foreground text-xs">(comma-separated)</span></Label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="wireless, audio, premium" className="mt-1" />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3.5">
              <Switch checked={form.isFeatured} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} id="featured" />
              <div>
                <Label htmlFor="featured" className="cursor-pointer font-semibold">
                  ⭐ Show on Homepage
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Product appears in the Browse Products section. Set Status to <strong>Active</strong> too.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleSave}
              disabled={!form.title || !form.category || saving}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Product?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This action is permanent and cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
