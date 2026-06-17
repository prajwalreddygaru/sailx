"use client";

import * as React from "react";
import { Plus, Trash2, Upload, Image as ImageIcon, MoveUp, MoveDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Memory {
  id: string;
  title: string | null;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMemoriesPage() {
  const [memories, setMemories] = React.useState<Memory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({ title: "", imageUrl: "", order: 0 });

  const loadMemories = React.useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/memories");
      if (r.ok) {
        const arr = await r.json();
        setMemories(Array.isArray(arr) ? arr : []);
      }
    } catch {}
    setLoading(false);
  }, []);

  React.useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: form });
      if (r.ok) {
        const { url } = await r.json();
        setFormData((f) => ({ ...f, imageUrl: url }));
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!formData.imageUrl) {
      toast.error("Image is required");
      return;
    }
    try {
      const r = await fetch("/api/admin/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (r.ok) {
        toast.success("Memory added");
        setDialogOpen(false);
        setFormData({ title: "", imageUrl: "", order: 0 });
        loadMemories();
      } else {
        toast.error("Failed to add memory");
      }
    } catch {
      toast.error("Failed to add memory");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const r = await fetch(`/api/admin/memories/${deleteId}`, { method: "DELETE" });
      if (r.ok) {
        toast.success("Memory deleted");
        setDeleteId(null);
        loadMemories();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const r = await fetch(`/api/admin/memories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (r.ok) {
        loadMemories();
      }
    } catch {}
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newMemories = [...memories];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newMemories.length) return;
    const temp = newMemories[index].order;
    newMemories[index].order = newMemories[targetIdx].order;
    newMemories[targetIdx].order = temp;
    setMemories(newMemories);
    try {
      await Promise.all([
        fetch(`/api/admin/memories/${newMemories[index].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newMemories[index].order }),
        }),
        fetch(`/api/admin/memories/${newMemories[targetIdx].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newMemories[targetIdx].order }),
        }),
      ]);
      loadMemories();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Memories</h1>
          <p className="text-muted-foreground">Manage images shown in the marketing marquee</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Memory
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Memory</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Title (optional)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Event name or description"
                />
              </div>
              <div>
                <Label>Image</Label>
                <div className="mt-2">
                  {formData.imageUrl ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.imageUrl} alt="" className="h-40 w-full object-cover rounded-md" />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setFormData((f) => ({ ...f, imageUrl: "" }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-md p-8 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        id="memory-upload"
                      />
                      <label htmlFor="memory-upload" className="cursor-pointer">
                        {uploading ? (
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload image</p>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : memories.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No memories yet. Add your first memory image.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((m, idx) => (
            <div key={m.id} className="border rounded-md overflow-hidden bg-card">
              <div className="relative h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.imageUrl} alt={m.title || ""} className="h-full w-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                  >
                    <MoveUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === memories.length - 1}
                  >
                    <MoveDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setDeleteId(m.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {m.title && <p className="text-sm font-medium truncate">{m.title}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Order: {m.order}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Active</span>
                    <Switch
                      checked={m.active}
                      onCheckedChange={(checked) => handleToggleActive(m.id, checked)}
                      className="scale-75"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Memory</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this memory? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
