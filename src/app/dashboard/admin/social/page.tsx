"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, Save, LinkIcon, Youtube, Instagram } from "lucide-react";

export default function AdminSocialPage() {
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [instaUrl, setInstaUrl] = React.useState("");
  const [youtubeAltUrl, setYoutubeAltUrl] = React.useState("");
  const [loadingCfg, setLoadingCfg] = React.useState(false);

  type Account = { id: string; platform: "YOUTUBE" | "INSTAGRAM"; name: string; url: string; order: number; isActive: boolean };
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [saving, setSaving] = React.useState(false);

  const [newAcc, setNewAcc] = React.useState<{ platform: "YOUTUBE" | "INSTAGRAM"; name: string; url: string; order: number; isActive: boolean }>({
    platform: "YOUTUBE",
    name: "",
    url: "",
    order: 0,
    isActive: true,
  });

  React.useEffect(() => {
    (async () => {
      try {
        setLoadingCfg(true);
        const [cfgR, accR] = await Promise.all([
          fetch("/api/admin/social/config"),
          fetch("/api/admin/social/accounts"),
        ]);
        if (cfgR.ok) {
          const cfg = await cfgR.json();
          setYoutubeUrl(cfg?.youtubeVideoUrl ?? "");
          setYoutubeAltUrl(cfg?.youtubeAltVideoUrl ?? "");
          setInstaUrl(cfg?.instagramReelUrl ?? "");
        }
        if (accR.ok) {
          const a = await accR.json();
          setAccounts(Array.isArray(a) ? a : []);
        }
      } catch {
        toast.error("Failed to load social data");
      } finally {
        setLoadingCfg(false);
      }
    })();
  }, []);

  async function saveConfig() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/social/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeVideoUrl: youtubeUrl, youtubeAltVideoUrl: youtubeAltUrl, instagramReelUrl: instaUrl }),
      });
      if (!res.ok) throw new Error();
      toast.success("Saved configuration");
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  }

  async function addAccount() {
    if (!newAcc.name.trim() || !newAcc.url.trim()) { toast.error("Enter name and URL"); return; }
    try {
      const res = await fetch("/api/admin/social/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAcc),
      });
      if (!res.ok) throw new Error();
      const acc: Account = await res.json();
      setAccounts((list) => [...list, acc].sort((a,b) => a.order - b.order));
      setNewAcc({ platform: "YOUTUBE", name: "", url: "", order: 0, isActive: true });
      toast.success("Account added");
    } catch {
      toast.error("Failed to add account");
    }
  }

  async function updateAccount(id: string, patch: Partial<Account>) {
    try {
      const res = await fetch(`/api/admin/social/accounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      const updated: Account = await res.json();
      setAccounts((list) => list.map((a) => a.id === id ? updated : a).sort((a,b) => a.order - b.order));
    } catch {
      toast.error("Update failed");
    }
  }

  async function removeAccount(id: string) {
    if (!confirm("Delete this account?")) return;
    try {
      const res = await fetch(`/api/admin/social/accounts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAccounts((list) => list.filter((a) => a.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Social Media Presence</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure homepage YouTube & Instagram embeds and manage account lists.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><LinkIcon className="h-4 w-4" /> Featured Embeds</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube video URL</Label>
            <div className="flex gap-2">
              <Input id="youtube" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
              <Button onClick={saveConfig} disabled={saving}>{saving ? "Saving..." : <><Save className="h-4 w-4" /> Save</>}</Button>
            </div>
            <p className="text-xs text-muted-foreground">Paste a standard YouTube watch URL. We will auto-convert to embed.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube2">Second YouTube URL (optional)</Label>
            <div className="flex gap-2">
              <Input id="youtube2" placeholder="https://www.youtube.com/watch?v=..." value={youtubeAltUrl} onChange={(e) => setYoutubeAltUrl(e.target.value)} />
              <Button onClick={saveConfig} disabled={saving}>{saving ? "Saving..." : <><Save className="h-4 w-4" /> Save</>}</Button>
            </div>
            <p className="text-xs text-muted-foreground">Shown as an additional video card on the homepage.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="insta">Instagram reel URL</Label>
            <div className="flex gap-2">
              <Input id="insta" placeholder="https://www.instagram.com/reel/..." value={instaUrl} onChange={(e) => setInstaUrl(e.target.value)} />
              <Button onClick={saveConfig} disabled={saving}>{saving ? "Saving..." : <><Save className="h-4 w-4" /> Save</>}</Button>
            </div>
            {/(?:youtube\.com|youtu\.be)/i.test(instaUrl) ? (
              <p className="text-xs text-red-500 font-bold">⚠️ Warning: You have pasted a YouTube URL into the Instagram field. Please paste a valid Instagram reel/post URL to display an Instagram reel!</p>
            ) : (
              <p className="text-xs text-muted-foreground">Public reel/post URL. Instagram embedding must be public.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4" /> Add Account</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-[160px_1fr_1fr_120px_120px] gap-3 items-end">
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select value={newAcc.platform} onValueChange={(v) => setNewAcc((s) => ({ ...s, platform: v as any }))}>
              <SelectTrigger><SelectValue placeholder="Platform" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="YOUTUBE">YouTube</SelectItem>
                <SelectItem value="INSTAGRAM">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={newAcc.name} onChange={(e) => setNewAcc((s) => ({ ...s, name: e.target.value }))} placeholder="Channel / Account name" />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input value={newAcc.url} onChange={(e) => setNewAcc((s) => ({ ...s, url: e.target.value }))} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Input type="number" value={newAcc.order} onChange={(e) => setNewAcc((s) => ({ ...s, order: Number(e.target.value) }))} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={newAcc.isActive} onCheckedChange={(v) => setNewAcc((s) => ({ ...s, isActive: v }))} />
            <span className="text-sm">Active</span>
          </div>
          <div className="md:col-span-5 text-right">
            <Button onClick={addAccount}>Add</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {accounts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No accounts added.</div>
          ) : (
            <div className="divide-y rounded-lg border">
              {accounts.map((a) => (
                <div key={a.id} className="grid md:grid-cols-[140px_1fr_1fr_100px_140px] gap-3 items-center p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {a.platform === "YOUTUBE" ? <Youtube className="h-4 w-4 text-red-500" /> : <Instagram className="h-4 w-4 text-pink-500" />}
                    {a.platform}
                  </div>
                  <Input value={a.name} onChange={(e) => updateAccount(a.id, { name: e.target.value })} />
                  <Input value={a.url} onChange={(e) => updateAccount(a.id, { url: e.target.value })} />
                  <Input type="number" value={a.order} onChange={(e) => updateAccount(a.id, { order: Number(e.target.value) })} />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch checked={a.isActive} onCheckedChange={(v) => updateAccount(a.id, { isActive: v })} />
                      <span className="text-xs">Active</span>
                    </div>
                    <button className="text-red-500 hover:text-red-600" onClick={() => removeAccount(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
