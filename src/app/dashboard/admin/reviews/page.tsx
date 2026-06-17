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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Pencil, Trash2, Plus, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  name: string;
  subtitle: string | null;
  email: string | null;
  rating: number;
  text: string;
  profileImage: string | null;
  isVisible: boolean;
  createdAt: string;
}

type FormState = {
  name: string;
  subtitle: string;
  email: string;
  rating: number;
  text: string;
  profileImage: string;
  isVisible: boolean;
};

const EMPTY_FORM: FormState = {
  name: "", subtitle: "", email: "", rating: 5,
  text: "", profileImage: "", isVisible: true,
};

function Stars({
  rating, setRating, interactive,
}: {
  rating: number; setRating?: (n: number) => void; interactive?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => setRating?.(s)}
          className={cn(!interactive && "pointer-events-none")}
        >
          <Star
            className={cn(
              "h-5 w-5 transition-colors",
              s <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
              interactive && "hover:fill-amber-300 hover:text-amber-300 cursor-pointer"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Review | null>(null);
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState("");

  /* ── ref for hidden file input ── */
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/reviews");
      const d = await r.json();
      setReviews(Array.isArray(d) ? d : []);
    } catch { setReviews([]); }
    setLoading(false);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((p) => ({ ...p, profileImage: data.url }));
    } catch (err: any) {
      setUploadError(err.message ?? "Upload failed");
    }
    setUploading(false);
  }

  async function save() {
    try {
      const payload = { ...form, rating: Number(form.rating) };
      if (editing) {
        await fetch(`/api/reviews/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/reviews", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      load();
    } catch (e) { console.error("Save error:", e); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    load();
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setUploadError("");
    setOpen(true);
  }

  function openEdit(r: Review) {
    setEditing(r);
    setForm({
      name: r.name,
      subtitle: r.subtitle ?? "",
      email: r.email ?? "",
      rating: r.rating,
      text: r.text,
      profileImage: r.profileImage ?? "",
      isVisible: r.isVisible,
    });
    setUploadError("");
    setOpen(true);
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Customer Reviews</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage testimonials shown on the homepage</p>
        </div>
        <Button onClick={openAdd} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Review
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border h-32 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
          <Star className="h-10 w-10 opacity-20" />
          <p className="font-semibold">No reviews yet</p>
          <Button size="sm" variant="outline" onClick={openAdd}>Add your first review</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={cn(
                "rounded-xl border bg-card p-4 flex flex-col gap-3 transition-opacity",
                !r.isVisible && "opacity-50"
              )}
            >
              {/* Stars */}
              <Stars rating={r.rating} />

              {/* Text */}
              <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{r.text}</p>

              {/* Footer: avatar + name + actions */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-border">
                    <AvatarImage src={r.profileImage || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {r.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm leading-tight">{r.name}</div>
                    {r.subtitle && (
                      <div className="text-xs text-muted-foreground">{r.subtitle}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full",
                    r.isVisible ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                  )}>
                    {r.isVisible ? "Live" : "Hidden"}
                  </span>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(r)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(r.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setUploadError(""); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Review" : "Add Review"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Profile picture upload — prominent at top */}
            <div className="flex flex-col items-center gap-3 py-4 border-2 border-dashed rounded-xl bg-muted/20">
              {form.profileImage ? (
                <div className="relative">
                  <img
                    src={form.profileImage}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover ring-2 ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, profileImage: "" }))}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}

              {/* Hidden file input — triggered by ref */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4 mr-1.5" />
                {uploading ? "Uploading…" : form.profileImage ? "Change Photo" : "Upload Profile Photo"}
              </Button>

              {uploadError && (
                <p className="text-xs text-destructive">{uploadError}</p>
              )}
              <p className="text-xs text-muted-foreground">JPG, PNG or WebP · max 5 MB</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Shruthi Reddy"
                />
              </div>
              <div>
                <Label>Subtitle / Tour</Label>
                <Input
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="e.g. Japan Group Tour"
                />
              </div>
            </div>

            <div>
              <Label>Email (optional)</Label>
              <Input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="reviewer@email.com"
                type="email"
              />
            </div>

            <div>
              <Label>Star Rating</Label>
              <div className="mt-1.5">
                <Stars
                  rating={form.rating}
                  setRating={(n) => setForm((p) => ({ ...p, rating: n }))}
                  interactive
                />
              </div>
            </div>

            <div>
              <Label>Review Text *</Label>
              <Textarea
                value={form.text}
                onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                placeholder="Write what the customer said…"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="text-sm font-medium">Visible on homepage</div>
                <div className="text-xs text-muted-foreground">Show this review in the testimonials section</div>
              </div>
              <Switch
                checked={form.isVisible}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isVisible: v }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                onClick={save}
                disabled={!form.name.trim() || !form.text.trim() || uploading}
              >
                {editing ? "Save Changes" : "Add Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
