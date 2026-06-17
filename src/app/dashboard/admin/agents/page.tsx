"use client";

import * as React from "react";
import {
  CheckCircle2, XCircle, Clock, Search, Users, Star,
  MapPin, Globe2, Briefcase, Eye, Plus, Trash2, Camera
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type OnboardingStatus = "PENDING" | "APPROVED" | "REJECTED";

type AgentEntry = {
  userId: string;
  onboardingStatus: OnboardingStatus;
  region: string | null;
  specialization: string[];
  experience: number;
  languages: string[];
  rating: number;
  completedDeals: number;
  bio: string | null;
  profileImage: string | null;
  isOnline: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    country: string | null;
    phone: string | null;
    createdAt: string;
  };
};

const STATUS_CONFIG: Record<OnboardingStatus, { label: string; color: string; icon: any }> = {
  PENDING:  { label: "Pending",  color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",  icon: Clock },
  APPROVED: { label: "Approved", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", color: "bg-red-500/10 text-red-400 border-red-500/20",           icon: XCircle },
};

type AddForm = {
  name: string; email: string; password: string; country: string; phone: string;
  region: string; specialization: string; experience: string;
  bio: string; languages: string; profileImage: string; responseTime: string;
};

const emptyAddForm: AddForm = {
  name: "", email: "", password: "", country: "", phone: "",
  region: "", specialization: "", experience: "0",
  bio: "", languages: "", profileImage: "", responseTime: "< 2 hr",
};

export default function AdminAgentsPage() {
  const [agents, setAgents] = React.useState<AgentEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<OnboardingStatus | "all">("all");
  const [viewAgent, setViewAgent] = React.useState<AgentEntry | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState<AddForm>(emptyAddForm);
  const [addError, setAddError] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const avatarRef = React.useRef<HTMLInputElement>(null);

  function readAsDataUrl(f: File): Promise<string> {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(f);
    });
  }

  async function uploadAvatarFile(f: File) {
    setAvatarUploading(true);
    const preview = await readAsDataUrl(f);
    setAvatarPreview(preview);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setAddForm((prev) => ({ ...prev, profileImage: url }));
      } else {
        setAddForm((prev) => ({ ...prev, profileImage: preview }));
      }
    } catch {
      setAddForm((prev) => ({ ...prev, profileImage: preview }));
    } finally {
      setAvatarUploading(false);
    }
  }

  async function fetchAgents() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/agents");
      if (res.ok) setAgents(await res.json());
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { fetchAgents(); }, []);

  const filtered = agents.filter((a) => {
    const matchSearch =
      a.user.name.toLowerCase().includes(search.toLowerCase()) ||
      a.user.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.user.country ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.onboardingStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: agents.length,
    pending: agents.filter((a) => a.onboardingStatus === "PENDING").length,
    approved: agents.filter((a) => a.onboardingStatus === "APPROVED").length,
    rejected: agents.filter((a) => a.onboardingStatus === "REJECTED").length,
  };

  async function updateStatus(agentId: string, status: OnboardingStatus) {
    await fetch("/api/admin/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, status }),
    });
    await fetchAgents();
    if (viewAgent?.userId === agentId) {
      setViewAgent((prev) => prev ? { ...prev, onboardingStatus: status } : null);
    }
  }

  async function handleAddAgent() {
    if (!addForm.name || !addForm.email) return;
    setSaving(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email,
          password: addForm.password || undefined,
          country: addForm.country || undefined,
          phone: addForm.phone || undefined,
          region: addForm.region || undefined,
          specialization: addForm.specialization
            ? addForm.specialization.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          experience: addForm.experience,
          bio: addForm.bio || undefined,
          languages: addForm.languages
            ? addForm.languages.split(",").map((l) => l.trim()).filter(Boolean)
            : [],
          profileImage: addForm.profileImage || undefined,
          responseTime: addForm.responseTime || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setAddError(err.error || "Failed to create agent");
        return;
      }
      setAddOpen(false);
      setAddForm(emptyAddForm);
      setAvatarPreview(null);
      await fetchAgents();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(userId: string) {
    await fetch(`/api/admin/agents/${userId}`, { method: "DELETE" });
    setDeleteId(null);
    await fetchAgents();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Management"
        description="Approve applications, add agents directly, and manage who appears on the home page."
        actions={
          <Button variant="gradient" onClick={() => { setAddForm(emptyAddForm); setAddError(""); setAddOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Agent
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Agents" value={stats.total} icon={Users} />
        <StatCard label="Pending Review" value={stats.pending} icon={Clock} hint="Needs action" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          Loading agents…
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, country…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!loading && filtered.length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                No agents found. Use "Add Agent" to create one.
              </div>
            )}
            {filtered.map((agent) => {
              const sc = STATUS_CONFIG[agent.onboardingStatus];
              const StatusIcon = sc.icon;
              const avatar = agent.profileImage || agent.user.avatar ||
                `https://i.pravatar.cc/48?u=${agent.userId}`;
              return (
                <div
                  key={agent.userId}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/40 hover:bg-accent/30 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>
                        {agent.user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {agent.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{agent.user.name}</span>
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded border flex items-center gap-1", sc.color)}>
                        <StatusIcon className="h-3 w-3" /> {sc.label}
                      </span>
                      {agent.isOnline && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          ONLINE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{agent.user.email}</div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      {agent.user.country && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {agent.user.country}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Briefcase className="h-3 w-3" /> {agent.experience}y exp
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {agent.rating}
                      </span>
                      <div className="flex gap-1 flex-wrap">
                        {agent.specialization.slice(0, 3).map((s) => (
                          <span key={s} className="text-[10px] bg-accent px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline" size="sm"
                      className="h-8 text-xs gap-1"
                      onClick={() => setViewAgent(agent)}
                    >
                      <Eye className="h-3 w-3" /> View
                    </Button>
                    {agent.onboardingStatus !== "APPROVED" && (
                      <Button
                        variant="default" size="sm"
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                        onClick={() => updateStatus(agent.userId, "APPROVED")}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Approve
                      </Button>
                    )}
                    {agent.onboardingStatus !== "REJECTED" && (
                      <Button
                        variant="outline" size="sm"
                        className="h-8 text-xs border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground gap-1"
                        onClick={() => updateStatus(agent.userId, "REJECTED")}
                      >
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                    )}
                    <Button
                      variant="ghost" size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(agent.userId)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ─── ADD AGENT DIALOG ─── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 max-h-[72vh] overflow-y-auto pr-1">
            {/* ── Avatar Upload ── */}
            <div className="flex flex-col items-center gap-2 pb-2">
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  await uploadAvatarFile(f);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => !avatarUploading && avatarRef.current?.click()}
                className="relative group"
                disabled={avatarUploading}
              >
                <Avatar className="h-20 w-20 border-2 border-dashed border-border group-hover:border-primary transition-colors">
                  <AvatarImage src={avatarPreview ?? undefined} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {addForm.name ? addForm.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0,2) : "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow">
                  <Camera className="h-3 w-3 text-primary-foreground" />
                </span>
              </button>
              <p className="text-xs text-muted-foreground">
                {avatarUploading ? "Uploading…" : "Click to upload profile photo from device"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="e.g. Arjun Mehta"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="agent@example.com"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Password <span className="text-xs text-muted-foreground">(default: Agent@123)</span></Label>
                <Input
                  type="password"
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Leave blank for default"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Country</Label>
                <Input
                  value={addForm.country}
                  onChange={(e) => setAddForm({ ...addForm, country: e.target.value })}
                  placeholder="e.g. India"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Region</Label>
                <Input
                  value={addForm.region}
                  onChange={(e) => setAddForm({ ...addForm, region: e.target.value })}
                  placeholder="e.g. South Asia"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Specializations <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
              <Input
                value={addForm.specialization}
                onChange={(e) => setAddForm({ ...addForm, specialization: e.target.value })}
                placeholder="Electronics, Fashion, Automotive"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Experience (years)</Label>
                <Input
                  type="number" min="0"
                  value={addForm.experience}
                  onChange={(e) => setAddForm({ ...addForm, experience: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Response Time</Label>
                <Input
                  value={addForm.responseTime}
                  onChange={(e) => setAddForm({ ...addForm, responseTime: e.target.value })}
                  placeholder="< 2 hr"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label>Languages <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
              <Input
                value={addForm.languages}
                onChange={(e) => setAddForm({ ...addForm, languages: e.target.value })}
                placeholder="English, Hindi, Mandarin"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                value={addForm.bio}
                onChange={(e) => setAddForm({ ...addForm, bio: e.target.value })}
                placeholder="Short description about the agent…"
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
            {addError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{addError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              variant="gradient"
              onClick={handleAddAgent}
              disabled={!addForm.name || !addForm.email || saving}
            >
              {saving ? "Creating…" : "Create Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── AGENT DETAIL DIALOG ─── */}
      <Dialog open={!!viewAgent} onOpenChange={() => setViewAgent(null)}>
        <DialogContent className="max-w-md">
          {viewAgent && (() => {
            const sc = STATUS_CONFIG[viewAgent.onboardingStatus];
            const StatusIcon = sc.icon;
            const avatar = viewAgent.profileImage || viewAgent.user.avatar ||
              `https://i.pravatar.cc/80?u=${viewAgent.userId}`;
            return (
              <>
                <DialogHeader>
                  <DialogTitle>Agent Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>
                        {viewAgent.user.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-base">{viewAgent.user.name}</div>
                      <div className="text-sm text-muted-foreground">{viewAgent.user.email}</div>
                      <span className={cn("mt-1 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border", sc.color)}>
                        <StatusIcon className="h-3 w-3" /> {sc.label}
                      </span>
                    </div>
                  </div>

                  {viewAgent.bio && (
                    <p className="text-sm text-muted-foreground">{viewAgent.bio}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Country</div>
                      <div className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {viewAgent.user.country || "—"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Region</div>
                      <div className="font-medium flex items-center gap-1">
                        <Globe2 className="h-3 w-3" /> {viewAgent.region || "—"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Experience</div>
                      <div className="font-medium">{viewAgent.experience} years</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Deals Done</div>
                      <div className="font-medium">{viewAgent.completedDeals}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Rating</div>
                      <div className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {viewAgent.rating}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Languages</div>
                      <div className="font-medium text-xs">{viewAgent.languages.join(", ") || "—"}</div>
                    </div>
                  </div>

                  {viewAgent.specialization.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Specializations</div>
                      <div className="flex flex-wrap gap-1.5">
                        {viewAgent.specialization.map((s) => (
                          <span key={s} className="text-xs bg-accent border border-border px-2 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter className="gap-2">
                  {viewAgent.onboardingStatus !== "APPROVED" && (
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                      onClick={() => updateStatus(viewAgent.userId, "APPROVED")}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve Agent
                    </Button>
                  )}
                  {viewAgent.onboardingStatus !== "REJECTED" && (
                    <Button
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground gap-1"
                      onClick={() => updateStatus(viewAgent.userId, "REJECTED")}
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  )}
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* ─── DELETE CONFIRM ─── */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Remove Agent?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete the agent and their user account from the platform.
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
