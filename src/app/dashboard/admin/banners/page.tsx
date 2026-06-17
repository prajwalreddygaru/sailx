"use client";

import * as React from "react";
import {
  Plus, Pencil, Trash2, Image as ImageIcon, Eye, EyeOff,
  GripVertical, Megaphone, BarChart3
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const GRADIENTS = [
  { label: "Blue Indigo",    value: "from-blue-900 via-blue-800 to-indigo-900" },
  { label: "Rose Fuchsia",   value: "from-rose-900 via-pink-800 to-fuchsia-900" },
  { label: "Amber Orange",   value: "from-amber-900 via-orange-800 to-red-900" },
  { label: "Emerald Teal",   value: "from-emerald-900 via-teal-800 to-cyan-900" },
  { label: "Purple Violet",  value: "from-purple-900 via-violet-800 to-indigo-900" },
  { label: "Brand Dark",     value: "from-brand-950 via-brand-900 to-background" },
  { label: "Slate Dark",     value: "from-slate-900 via-zinc-900 to-background" },
];

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  badge: string;
  imageUrl: string;
  gradient: string;
  isActive: boolean;
  order: number;
  createdAt: string;
};

type FormState = {
  title: string; subtitle: string; ctaLabel: string; ctaHref: string;
  badge: string; imageUrl: string; gradient: string; isActive: boolean; order: string;
};

const emptyForm: FormState = {
  title: "", subtitle: "", ctaLabel: "Shop Now", ctaHref: "/categories",
  badge: "", imageUrl: "", gradient: GRADIENTS[0].value, isActive: true, order: "1",
};

export default function AdminBannersPage() {
  const [banners, setBanners] = React.useState<Banner[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Banner | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);

  async function fetchBanners() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      if (res.ok) setBanners(await res.json());
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { fetchBanners(); }, []);

  const stats = {
    total: banners.length,
    active: banners.filter((b) => b.isActive).length,
    inactive: banners.filter((b) => !b.isActive).length,
  };

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm, order: String(banners.length + 1) });
    setDialogOpen(true);
  }

  async function addFromEvent() {
    const eventId = prompt("Enter Event ID to use as banner (first image will be used):");
    if (!eventId) return;
    try {
      const res = await fetch("/api/admin/banners/from-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, makeActive: true }),
      });
      const d = await res.json();
      if (!res.ok) { alert(d.error || "Failed to create banner"); return; }
      await fetchBanners();
      alert("Banner created from event");
    } catch {
      alert("Failed to create banner from event");
    }
  }

  function openEdit(b: Banner) {
    setEditing(b);
    setForm({
      title: b.title, subtitle: b.subtitle, ctaLabel: b.ctaLabel, ctaHref: b.ctaHref,
      badge: b.badge, imageUrl: b.imageUrl, gradient: b.gradient,
      isActive: b.isActive, order: String(b.order),
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.title) return;
    setSaving(true);
    const payload = { ...form, order: parseInt(form.order || "1") };
    try {
      if (editing) {
        await fetch(`/api/admin/banners/${editing.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/admin/banners", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      await fetchBanners();
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await fetchBanners();
  }

  async function toggleActive(id: string) {
    const b = banners.find((x) => x.id === id);
    if (!b) return;
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !b.isActive }),
    });
    await fetchBanners();
  }

  const sorted = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners & Posters"
        description="Control the hero carousel on the home page. Only active banners are shown to visitors."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={addFromEvent}>
              Use Event as Banner
            </Button>
            <Button variant="gradient" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Add Banner
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Banners" value={stats.total} icon={Megaphone} />
        <StatCard label="Active" value={stats.active} icon={Eye} />
        <StatCard label="Inactive" value={stats.inactive} icon={EyeOff} hint="Hidden from visitors" />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading banners…</div>
      )}

      {/* Banner Cards */}
      <div className="space-y-4">
        {sorted.map((b) => (
          <Card key={b.id} className={cn("overflow-hidden transition-opacity", !b.isActive && "opacity-60")}>
            <div className={cn("relative h-32 bg-gradient-to-r flex items-center px-6", b.gradient)}>
              {b.imageUrl && (
                <div className="absolute right-0 top-0 h-full w-2/5 overflow-hidden opacity-30">
                  <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10">
                {b.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white mb-2 inline-block">
                    {b.badge}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-white">{b.title}</h3>
                <p className="text-white/70 text-xs mt-0.5 max-w-xs">{b.subtitle}</p>
              </div>
              {/* Order badge */}
              <div className="absolute top-2 right-2 z-20 h-6 w-6 rounded-full bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                {b.order}
              </div>
            </div>
            <CardContent className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span>CTA: <span className="text-foreground font-medium">"{b.ctaLabel}"</span></span>
                <span>→ <span className="font-mono text-xs">{b.ctaHref}</span></span>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded border",
                  b.isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                )}>
                  {b.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={b.isActive} onCheckedChange={() => toggleActive(b.id)} />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEdit(b)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost" size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(b.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {banners.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-20 text-center text-muted-foreground">
            No banners yet. Add your first banner.
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Mega Electronics Sale"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Short supporting text shown under the title"
                className="mt-1 resize-none"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>CTA Button Label</Label>
                <Input
                  value={form.ctaLabel}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                  placeholder="Shop Now"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>CTA Link</Label>
                <Input
                  value={form.ctaHref}
                  onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
                  placeholder="/categories"
                  className="mt-1 font-mono text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Badge Label <span className="text-xs text-muted-foreground">(optional)</span></Label>
                <Input
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g. FLASH SALE"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number" min="1"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Poster / Background Image URL
              </Label>
              <Input
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="mt-1 font-mono text-xs"
              />
              {form.imageUrl && (
                <div className="mt-2 rounded-lg border border-border overflow-hidden h-24">
                  <img
                    src={form.imageUrl} alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Background Gradient</Label>
              <Select value={form.gradient} onValueChange={(v) => setForm({ ...form, gradient: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADIENTS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn("h-4 w-8 rounded bg-gradient-to-r", g.value)} />
                        {g.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Live preview */}
              <div className={cn("mt-2 h-16 rounded-lg bg-gradient-to-r flex items-center px-4", form.gradient)}>
                <span className="text-white text-sm font-semibold">{form.title || "Banner Preview"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                id="banner-active"
              />
              <Label htmlFor="banner-active" className="cursor-pointer">
                Show on home page
                <span className="ml-1.5 text-xs text-muted-foreground">— toggle to publish/hide</span>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleSave} disabled={!form.title || saving}>
              {editing ? "Save Changes" : "Create Banner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Banner?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This banner will be permanently removed from the home page.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
