"use client";

import * as React from "react";
import {
  Plus, Pencil, Trash2, Smartphone, Shirt, Home, Gem,
  Dumbbell, BookOpen, Car, Baby, Leaf, Percent, Package,
  Utensils, HeartPulse, Cpu, Music, Camera, Gamepad2
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  { label: "Electronics",  value: "Smartphone",  Icon: Smartphone },
  { label: "Fashion",      value: "Shirt",       Icon: Shirt },
  { label: "Home",         value: "Home",        Icon: Home },
  { label: "Beauty",       value: "Gem",         Icon: Gem },
  { label: "Sports",       value: "Dumbbell",    Icon: Dumbbell },
  { label: "Books",        value: "BookOpen",    Icon: BookOpen },
  { label: "Automotive",   value: "Car",         Icon: Car },
  { label: "Kids",         value: "Baby",        Icon: Baby },
  { label: "Organic",      value: "Leaf",        Icon: Leaf },
  { label: "Deals",        value: "Percent",     Icon: Percent },
  { label: "Food",         value: "Utensils",    Icon: Utensils },
  { label: "Health",       value: "HeartPulse",  Icon: HeartPulse },
  { label: "Tech",         value: "Cpu",         Icon: Cpu },
  { label: "Music",        value: "Music",       Icon: Music },
  { label: "Camera",       value: "Camera",      Icon: Camera },
  { label: "Gaming",       value: "Gamepad2",    Icon: Gamepad2 },
  { label: "Package",      value: "Package",     Icon: Package },
];

const ICON_MAP: Record<string, React.ElementType> = Object.fromEntries(
  ICON_OPTIONS.map((o) => [o.value, o.Icon])
);

const COLOR_OPTIONS = [
  { label: "Blue",    bg: "bg-blue-500/10",    text: "text-blue-400",    value: "blue" },
  { label: "Pink",    bg: "bg-pink-500/10",    text: "text-pink-400",    value: "pink" },
  { label: "Orange",  bg: "bg-orange-500/10",  text: "text-orange-400",  value: "orange" },
  { label: "Purple",  bg: "bg-purple-500/10",  text: "text-purple-400",  value: "purple" },
  { label: "Green",   bg: "bg-green-500/10",   text: "text-green-400",   value: "green" },
  { label: "Yellow",  bg: "bg-yellow-500/10",  text: "text-yellow-400",  value: "yellow" },
  { label: "Red",     bg: "bg-red-500/10",     text: "text-red-400",     value: "red" },
  { label: "Teal",    bg: "bg-teal-500/10",    text: "text-teal-400",    value: "teal" },
  { label: "Emerald", bg: "bg-emerald-500/10", text: "text-emerald-400", value: "emerald" },
  { label: "Rose",    bg: "bg-rose-500/10",    text: "text-rose-400",    value: "rose" },
];

function colorMeta(value: string) {
  return COLOR_OPTIONS.find((c) => c.value === value) ?? COLOR_OPTIONS[0];
}

type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  productCount: number;
  isVisible: boolean;
  createdAt: string;
};

type FormState = { name: string; icon: string; color: string; isVisible: boolean };
const emptyForm: FormState = { name: "", icon: "Package", color: "blue", isVisible: true };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [search, setSearch] = React.useState("");

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) setCategories(await res.json());
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: categories.length,
    visible: categories.filter((c) => c.isVisible).length,
    totalProducts: categories.reduce((s, c) => s + c.productCount, 0),
  };

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({ name: c.name, icon: c.icon, color: c.color, isVisible: c.isVisible });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/categories/${editing.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/categories", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await fetchCategories();
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await fetchCategories();
  }

  async function toggleVisible(id: string) {
    const c = categories.find((x) => x.id === id);
    if (!c) return;
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !c.isVisible }),
    });
    await fetchCategories();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories shown across the store. Only visible categories appear to users."
        actions={
          <Button variant="gradient" onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Categories" value={stats.total} icon={Package} />
        <StatCard label="Visible" value={stats.visible} icon={Package} />
        <StatCard label="Total Products" value={stats.totalProducts} icon={Package} />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">Loading categories…</div>
      )}

      {/* Search */}
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filtered.map((c) => {
          const IconComp = ICON_MAP[c.icon] ?? Package;
          const meta = colorMeta(c.color);
          return (
            <Card
              key={c.id}
              className={cn("transition-opacity", !c.isVisible && "opacity-50")}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", meta.bg)}>
                    <IconComp className={cn("h-5 w-5", meta.text)} />
                  </div>
                  <Switch
                    checked={c.isVisible}
                    onCheckedChange={() => toggleVisible(c.id)}
                    className="scale-75 origin-right"
                  />
                </div>
                <div className="font-semibold text-sm mb-0.5">{c.name}</div>
                <div className="text-xs text-muted-foreground mb-3">
                  {c.productCount} products
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 flex-1 text-xs"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(c.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-5 py-16 text-center text-muted-foreground">
            No categories found.
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Category Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Electronics"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      <div className="flex items-center gap-2">
                        <o.Icon className="h-4 w-4" /> {o.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Accent Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    key={col.value}
                    onClick={() => setForm({ ...form, color: col.value })}
                    className={cn(
                      "h-8 w-8 rounded-lg border-2 flex items-center justify-center transition-transform hover:scale-110",
                      col.bg,
                      form.color === col.value ? "border-primary scale-110" : "border-transparent"
                    )}
                    title={col.label}
                  >
                    {(() => {
                      const IconComp = ICON_MAP[form.icon] ?? Package;
                      return <IconComp className={cn("h-4 w-4", col.text)} />;
                    })()}
                  </button>
                ))}
              </div>
              {/* Preview */}
              {form.name && (
                <div className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-border">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", colorMeta(form.color).bg)}>
                    {(() => {
                      const IconComp = ICON_MAP[form.icon] ?? Package;
                      return <IconComp className={cn("h-5 w-5", colorMeta(form.color).text)} />;
                    })()}
                  </div>
                  <span className="font-medium text-sm">{form.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={form.isVisible}
                onCheckedChange={(v) => setForm({ ...form, isVisible: v })}
                id="cat-visible"
              />
              <Label htmlFor="cat-visible" className="cursor-pointer">
                Visible to users
                <span className="ml-1.5 text-xs text-muted-foreground">— shows in navigation & filters</span>
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="gradient" onClick={handleSave} disabled={!form.name || saving}>
              {editing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Category?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Products in this category won't be deleted, but will lose their category assignment.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteId && handleDelete(deleteId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
