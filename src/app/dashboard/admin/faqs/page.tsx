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
import { Pencil, Trash2, Plus, MessageCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  id: string;
  question: string;
  answer: string | null;
  askedBy: string | null;
  askedByEmail: string | null;
  isAnswered: boolean;
  isVisible: boolean;
  order: number;
  createdAt: string;
}

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = React.useState<FaqItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<FaqItem | null>(null);
  const [form, setForm] = React.useState({ question: "", answer: "", isVisible: true, order: 0 });
  const [tab, setTab] = React.useState<"all" | "unanswered">("all");

  React.useEffect(() => {
    load();
  }, [tab]);

  async function load() {
    setLoading(true);
    try {
      const url = tab === "unanswered" ? "/api/admin/faqs?unanswered=true" : "/api/admin/faqs";
      const r = await fetch(url);
      const d = await r.json();
      setFaqs(Array.isArray(d) ? d : []);
    } catch { setFaqs([]); }
    setLoading(false);
  }

  async function save() {
    try {
      if (editing) {
        await fetch(`/api/admin/faqs/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, isAnswered: !!form.answer?.trim() }),
        });
      }
      setOpen(false);
      setEditing(null);
      setForm({ question: "", answer: "", isVisible: true, order: 0 });
      load();
    } catch (e) { console.error("Save error:", e); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleVisibility(id: string, current: boolean) {
    await fetch(`/api/admin/faqs/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isVisible: !current }),
    });
    load();
  }

  function openEdit(f: FaqItem) {
    setEditing(f);
    setForm({
      question: f.question,
      answer: f.answer ?? "",
      isVisible: f.isVisible,
      order: f.order,
    });
    setOpen(true);
  }

  const visible = tab === "unanswered" ? faqs : faqs;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black">FAQs & Questions</h1>
        <div className="flex gap-2">
          <Button variant={tab === "all" ? "default" : "outline"} size="sm" onClick={() => setTab("all")}>All</Button>
          <Button variant={tab === "unanswered" ? "default" : "outline"} size="sm" onClick={() => setTab("unanswered")}>
            Unanswered
            {faqs.filter((f) => !f.isAnswered).length > 0 && (
              <span className="ml-1.5 bg-white text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {faqs.filter((f) => !f.isAnswered).length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : visible.length === 0 ? (
        <div className="text-muted-foreground">No questions yet.</div>
      ) : (
        <div className="space-y-3">
          {visible.map((f) => (
            <div key={f.id} className={cn(
              "rounded-xl border p-4 flex gap-4 items-start",
              !f.isAnswered && "border-amber-500/30 bg-amber-500/5"
            )}>
              <div className="mt-0.5">
                <MessageCircle className={cn("h-5 w-5", f.isAnswered ? "text-emerald-500" : "text-amber-500")} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm">{f.question}</div>
                    {f.askedBy && (
                      <div className="text-xs text-muted-foreground mt-0.5">Asked by {f.askedBy}{f.askedByEmail ? ` · ${f.askedByEmail}` : ""}</div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleVisibility(f.id, f.isVisible)}>
                      {f.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(f)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(f.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {f.answer ? (
                  <p className="text-sm text-muted-foreground mt-2">{f.answer}</p>
                ) : (
                  <p className="text-xs text-amber-600 mt-2 font-medium">No answer yet — click edit to add one</p>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className={cn("px-1.5 py-0.5 rounded", f.isAnswered ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600")}>
                    {f.isAnswered ? "Answered" : "Unanswered"}
                  </span>
                  <span className={cn("px-1.5 py-0.5 rounded", f.isVisible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    {f.isVisible ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Answer Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Question</Label>
              <Input value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                value={form.answer}
                onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                placeholder="Type your answer here..."
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isVisible} onCheckedChange={(v) => setForm((p) => ({ ...p, isVisible: v }))} />
              <Label className="cursor-pointer">Show on homepage</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={!form.question.trim()}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
