"use client";

import * as React from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ImageIcon, Upload, X, Plus, Pencil, Trash2 } from "lucide-react";

type TService = {
  id: string;
  slug: string;
  title: string;
  short: string | null;
  description: string | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
};

const EMPTY = {
  title: "",
  short: "",
  description: "",
  imageUrl: "",
  order: 0,
  isActive: true,
};

export default function AdminServicesPage() {
  const [items, setItems] = React.useState<TService[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TService | null>(null);
  const [form, setForm] = React.useState({ ...EMPTY });
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/services?status=all");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to load services");
      setItems(Array.isArray(d) ? d : []);
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY });
    setDialogOpen(true);
  }

  function openEdit(s: TService) {
    setEditing(s);
    setForm({
      title: s.title,
      short: s.short ?? "",
      description: s.description ?? "",
      imageUrl: s.imageUrl ?? "",
      order: s.order ?? 0,
      isActive: s.isActive,
    });
    setDialogOpen(true);
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", files[0]);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Upload failed");
      setForm((f) => ({ ...f, imageUrl: d.url }));
    } catch { /* noop */ }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    setSaving(true);
    try {
      const url = editing ? `/api/services/${editing.id}` : "/api/services";
      const method = editing ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          short: form.short.trim(),
          description: form.description.trim(),
          imageUrl: form.imageUrl,
          order: Number(form.order) || 0,
          isActive: form.isActive,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Save failed");
      setDialogOpen(false);
      await load();
    } catch (e: any) {
      alert(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      await load();
    } catch { /* noop */ }
  }

  async function toggleActive(s: TService) {
    try {
      await fetch(`/api/services/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !s.isActive }),
      });
      await load();
    } catch { /* noop */ }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Create and manage services shown on the marketing homepage."
        actions={<Button variant="gradient" onClick={openAdd}><Plus className="h-4 w-4" /> Add Service</Button>}
      />

      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{error}</div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-0 overflow-hidden">
              <div className="p-3 flex items-center justify-between">
                <div className="text-sm font-bold">{s.title}</div>
                <div className="text-[11px] text-muted-foreground">#{String(s.order).padStart(2, "0")}</div>
              </div>
              <div className="h-28 w-full bg-muted border-t border-b border-border overflow-hidden">
                {s.imageUrl ? (
                  <img src={s.imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                )}
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground line-clamp-2">{s.short || s.description}</div>
                <div className="flex items-center gap-1.5">
                  <button className="h-7 w-7 rounded-md hover:bg-accent" title="Edit" onClick={() => openEdit(s)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-7 w-7 rounded-md hover:bg-accent" title="Delete" onClick={() => handleDelete(s.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                  <button className={cn("h-7 px-2 rounded-md text-[11px] font-bold border", s.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20")} onClick={() => toggleActive(s)}>
                    {s.isActive ? "Active" : "Hidden"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) setDialogOpen(false); }}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add New Service"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="mt-1" placeholder="End-to-End Product Sourcing" />
            </div>
            <div>
              <Label>Short Tagline</Label>
              <Input value={form.short} onChange={(e) => setForm((f) => ({ ...f, short: e.target.value }))} className="mt-1" placeholder="Full-cycle import support" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1" placeholder="We help businesses source products from China…" />
            </div>

            <div>
              <Label>Order</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} className="mt-1 w-32" />
            </div>

            <div>
              <Label className="flex items-center gap-1.5 mb-2"><ImageIcon className="h-3.5 w-3.5" /> Background Image</Label>
              <div onClick={() => fileRef.current?.click()} className={cn("border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer", uploading && "opacity-60 pointer-events-none")}> 
                <Upload className="h-7 w-7 text-muted-foreground mx-auto mb-1.5" />
                <div className="text-sm font-semibold">{uploading ? "Uploading…" : "Click to upload image"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP</div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files)} />
              {form.imageUrl && (
                <div className="relative mt-2 h-28 rounded-lg overflow-hidden border">
                  <img src={form.imageUrl} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white flex items-center justify-center"><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Visible</Label>
              </div>
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
