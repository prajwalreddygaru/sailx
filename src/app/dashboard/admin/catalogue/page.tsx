"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { Plus, Pencil, Trash2, ImagePlus, IndianRupee, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CatalogueItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  price: number;
  isActive: boolean;
  order: number;
  createdAt: string;
}

type FormState = {
  title: string;
  description: string;
  image: string;
  price: string;
  isActive: boolean;
  order: string;
};

const EMPTY: FormState = {
  title: "", description: "", image: "", price: "", isActive: true, order: "0",
};

async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/upload", { method: "POST", body: fd });
  if (!r.ok) throw new Error("Upload failed");
  const d = await r.json();
  return d.url as string;
}

export default function AdminCataloguePage() {
  const [items,   setItems]   = React.useState<CatalogueItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open,    setOpen]    = React.useState(false);
  const [editing, setEditing] = React.useState<string | null>(null);
  const [form,    setForm]    = React.useState<FormState>(EMPTY);
  const [saving,  setSaving]  = React.useState(false);
  const [imgPrev, setImgPrev] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/catalogue");
    const d = await r.json();
    if (Array.isArray(d)) setItems(d);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setImgPrev("");
    setOpen(true);
  }

  function openEdit(item: CatalogueItem) {
    setEditing(item.id);
    setForm({
      title:       item.title,
      description: item.description,
      image:       item.image ?? "",
      price:       String(item.price),
      isActive:    item.isActive,
      order:       String(item.order),
    });
    setImgPrev(item.image ?? "");
    setOpen(true);
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      setImgPrev(url);
    } catch { toast.error("Image upload failed"); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.price) { toast.error("Title and price are required"); return; }
    setSaving(true);
    try {
      const method = editing ? "PATCH" : "POST";
      const body   = editing ? { id: editing, ...form } : form;
      const r = await fetch("/api/admin/catalogue", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error();
      toast.success(editing ? "Updated!" : "Created!");
      setOpen(false);
      load();
    } catch { toast.error("Save failed"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this catalogue item?")) return;
    const r = await fetch("/api/admin/catalogue", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) { toast.success("Deleted"); load(); }
    else toast.error("Delete failed");
  }

  async function toggleActive(item: CatalogueItem) {
    await fetch("/api/admin/catalogue", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catalogue"
        description="Products and offerings shown on the homepage"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        }
      />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-24 rounded-2xl border-2 border-dashed border-border text-muted-foreground">
          <BookOpen className="h-14 w-14 opacity-10" />
          <p className="font-semibold">No catalogue items yet</p>
          <Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" />Add first item</Button>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded-2xl border bg-card overflow-hidden flex flex-col shadow-sm",
                !item.isActive && "opacity-50"
              )}
            >
              {/* Image */}
              <div className="h-48 bg-muted relative overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    onClick={() => openEdit(item)}
                    className="h-8 w-8 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 rounded-full bg-background/90 hover:bg-red-50 text-red-500 flex items-center justify-center shadow"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-base leading-snug line-clamp-2">{item.title}</h3>
                  <div className="flex items-center gap-0.5 text-primary font-black text-lg shrink-0">
                    <IndianRupee className="h-4 w-4" />
                    {item.price.toLocaleString("en-IN")}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-3">{item.description}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">Order: {item.order}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.isActive ? "Active" : "Hidden"}</span>
                    <Switch checked={item.isActive} onCheckedChange={() => toggleActive(item)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Catalogue Item" : "Add Catalogue Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            {/* Image upload */}
            <div className="space-y-2">
              <Label>Product Image</Label>
              <div
                className="relative h-48 rounded-xl border-2 border-dashed border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {imgPrev ? (
                  <>
                    <img src={imgPrev} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 h-7 w-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center"
                      onClick={(e) => { e.stopPropagation(); setImgPrev(""); setForm((f) => ({ ...f, image: "" })); }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <ImagePlus className="h-8 w-8 opacity-40" />
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g. China Business Expo 2025 Catalogue"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe what this catalogue includes…"
                rows={4}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Price (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="999"
                    className="pl-8"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.order}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <div className="font-semibold text-sm">Active</div>
                <div className="text-xs text-muted-foreground">Show on homepage</div>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save Changes" : "Add to Catalogue"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
