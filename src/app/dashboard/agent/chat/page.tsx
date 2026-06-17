"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { Send, Loader2, Paperclip, X, ZoomIn, MessageSquare, Video, Receipt, IndianRupee, Package, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QuotationCard, type QuotationAttachment } from "@/components/chat/quotation-card";

interface Convo {
  id: string;
  updatedAt: string;
  unread: number;
  other: { id: string; name: string; role: string; avatar: string | null } | undefined;
  lastMessage: { content: string; sender: { name: string } } | null;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
  attachments?: any;
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  React.useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <button type="button" onClick={onClose} className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
        <X className="h-5 w-5" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Preview" className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

interface BuyerOrder {
  id: string;
  code: string;
  status: string;
  quantity: number;
  notes?: string | null;
  productTitle: string;
  product: { title: string; images: string[] };
  user: { name: string; email: string };
}

function AgentChatContent() {
  const { data: session } = useSession();
  const myId = (session?.user as any)?.id as string | undefined;

  const [convos, setConvos]             = React.useState<Convo[]>([]);
  const [selectedConvoId, setSelectedConvoId] = React.useState<string | null>(null);
  const [messages, setMessages]         = React.useState<Message[]>([]);
  const [input, setInput]               = React.useState("");
  const [sending, setSending]           = React.useState(false);
  const [loadingConvos, setLoadingConvos] = React.useState(true);
  const [file, setFile]                 = React.useState<File | null>(null);
  const [filePreview, setFilePreview]   = React.useState<string | null>(null);
  const [lightbox, setLightbox]         = React.useState<string | null>(null);

  // Send Quote state
  const [quoteOpen, setQuoteOpen]         = React.useState(false);
  const [buyerOrders, setBuyerOrders]     = React.useState<BuyerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<BuyerOrder | null>(null);
  const [quotePrice, setQuotePrice]       = React.useState("");
  const [quoteNotes, setQuoteNotes]       = React.useState("");
  const [sendingQuote, setSendingQuote]   = React.useState(false);

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const fileRef   = React.useRef<HTMLInputElement>(null);

  function readAsDataUrl(f: File): Promise<string> {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(f);
    });
  }

  async function openQuoteModal() {
    const buyerId = selectedConvo?.other?.id;
    if (!buyerId) { toast.error("Select a conversation first"); return; }
    setSelectedOrder(null); setQuotePrice(""); setQuoteNotes("");
    setQuoteOpen(true);
    setLoadingOrders(true);
    const res = await fetch(`/api/sample-orders?buyerId=${buyerId}`);
    if (res.ok) {
      const all = await res.json();
      setBuyerOrders((all as BuyerOrder[]).filter((o) => o.status === "REQUESTED"));
    }
    setLoadingOrders(false);
  }

  async function sendQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder || !quotePrice || !selectedConvoId) return;
    const price = parseFloat(quotePrice);
    if (!price || price <= 0) { toast.error("Enter a valid price"); return; }
    setSendingQuote(true);

    // 1. PATCH order → QUOTED
    const patchRes = await fetch(`/api/sample-orders/${selectedOrder.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quotedPrice: price, status: "QUOTED" }),
    });
    if (!patchRes.ok) { toast.error("Failed to update order"); setSendingQuote(false); return; }

    // 2. Send quotation message in chat
    const quotation: QuotationAttachment = {
      type: "quotation",
      orderId: selectedOrder.id,
      orderCode: selectedOrder.code,
      productTitle: selectedOrder.product?.title ?? selectedOrder.productTitle,
      productImage: selectedOrder.product?.images?.[0] ?? undefined,
      quantity: selectedOrder.quantity,
      price,
      notes: quoteNotes || undefined,
    };
    const content = `📋 Quotation for ${quotation.productTitle} — ₹${price.toLocaleString("en-IN")}`;
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedConvoId, content, attachments: [quotation] }),
    });

    toast.success("Quote sent to buyer!");
    setQuoteOpen(false);
    setSendingQuote(false);
    fetchConvos();
  }

  // Load conversations list
  async function fetchConvos() {
    const res = await fetch("/api/chat/conversations");
    if (res.ok) setConvos(await res.json());
    setLoadingConvos(false);
  }

  React.useEffect(() => {
    fetchConvos();
    const t = setInterval(fetchConvos, 5000);
    return () => clearInterval(t);
  }, []);

  // Load messages for selected conversation
  async function fetchMessages(convoId: string) {
    const res = await fetch(`/api/chat?convoId=${convoId}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages ?? []);
  }

  React.useEffect(() => {
    if (!selectedConvoId) return;
    fetchMessages(selectedConvoId);
    const t = setInterval(() => fetchMessages(selectedConvoId), 3000);
    return () => clearInterval(t);
  }, [selectedConvoId]);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && !file) return;
    if (!selectedConvoId) return;
    setSending(true);

    let attachments: any[] | null = null;
    let content = input.trim();
    if (file) {
      const isImage = file.type.startsWith("image/");
      const dataUrl = isImage ? await readAsDataUrl(file) : undefined;
      attachments = [{ name: file.name, type: file.type, size: file.size, ...(dataUrl ? { dataUrl } : {}) }];
      if (!content) content = isImage ? `📷 ${file.name}` : `📎 ${file.name}`;
    }

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: selectedConvoId, content, attachments }),
    });
    if (!res.ok) toast.error("Failed to send message");

    setInput("");
    setFile(null);
    setFilePreview(null);
    setSending(false);
    fetchConvos();
  }

  const selectedConvo = convos.find((c) => c.id === selectedConvoId);
  const otherName = selectedConvo?.other?.name ?? "Buyer";

  return (
    <>
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
      <div className="flex h-[calc(100vh-5rem)] border rounded-xl overflow-hidden">

        {/* ── Sidebar: conversations ── */}
        <div className="w-64 border-r flex flex-col bg-card shrink-0">
          <div className="p-4 border-b font-semibold text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Conversations
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin h-5 w-5 text-muted-foreground" /></div>
            ) : convos.length === 0 ? (
              <p className="text-xs text-muted-foreground p-4">No conversations yet. Buyers will appear here once they message you.</p>
            ) : convos.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConvoId(c.id)}
                className={cn(
                  "w-full text-left px-3 py-3 flex items-center gap-3 hover:bg-accent transition-colors border-b text-sm",
                  selectedConvoId === c.id && "bg-accent"
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarImage src={c.other?.avatar ?? undefined} />
                  <AvatarFallback>{(c.other?.name?.[0] ?? "?").toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium truncate">{c.other?.name ?? "Unknown"}</span>
                    {c.unread > 0 && (
                      <Badge className="h-4 min-w-4 px-1 text-[10px] bg-primary text-primary-foreground rounded-full shrink-0">
                        {c.unread}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.lastMessage?.content ?? "No messages yet"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat area ── */}
        {!selectedConvoId ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <MessageSquare className="h-10 w-10 opacity-20" />
            <p className="text-sm">Select a conversation to reply</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={selectedConvo?.other?.avatar ?? undefined} />
                  <AvatarFallback>{otherName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{otherName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{selectedConvo?.other?.role?.toLowerCase() ?? "buyer"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                  onClick={openQuoteModal}
                >
                  <Receipt className="h-4 w-4" /> Send Quote
                </Button>
                <Button size="sm" variant="outline" onClick={() => window.open("https://meet.google.com/new", "_blank")}>
                  <Video className="h-4 w-4 mr-2" /> Meet
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-8">No messages yet. Say hello!</p>
                )}
                {messages.map((m) => {
                  const mine = m.sender.id === myId;
                  return (
                    <div key={m.id} className={cn("flex gap-2", mine && "flex-row-reverse")}>
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-xs">{m.sender.name[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className={cn("max-w-xs lg:max-w-md", mine && "items-end flex flex-col")}>
                        <div className={cn("rounded-2xl overflow-hidden", mine ? "bg-primary text-primary-foreground" : "bg-muted")}>
                          {Array.isArray(m.attachments) && m.attachments[0]?.type === "quotation" ? (
                            <div className="p-1">
                              <QuotationCard
                                quotation={m.attachments[0]}
                                mine={mine}
                                paidOrderIds={new Set()}
                              />
                            </div>
                          ) : Array.isArray(m.attachments) && m.attachments[0]?.dataUrl && m.attachments[0]?.type?.startsWith("image/") ? (
                            <div>
                              <button type="button" className="relative group block w-full" onClick={() => setLightbox(m.attachments[0].dataUrl)}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={m.attachments[0].dataUrl} alt={m.attachments[0].name} className="max-w-[240px] max-h-[240px] object-cover rounded-t-2xl w-full" />
                                <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-2xl">
                                  <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </span>
                              </button>
                              {m.content.replace(/^📷 \S+/, "").trim() && (
                                <p className="px-3 py-2 text-sm">{m.content.replace(/^📷 \S+/, "").trim()}</p>
                              )}
                            </div>
                          ) : (
                            <div className="px-3 py-2 text-sm">
                              {Array.isArray(m.attachments) && m.attachments.length > 0 && !m.attachments[0]?.dataUrl
                                ? <span>📎 {m.content.replace(/^📎 /, "")}</span>
                                : m.content}
                            </div>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(m.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            {/* Composer */}
            <form onSubmit={sendMessage} className="p-3 border-t bg-card flex flex-col gap-2">
              {file && (
                <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1 text-xs w-fit max-w-[160px]">
                  {filePreview
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={filePreview} alt="preview" className="h-6 w-6 rounded object-cover shrink-0" />
                    : <span className="text-base">📎</span>}
                  <span className="truncate">{file.name.slice(0, 14)}</span>
                  <button type="button" onClick={() => { setFile(null); setFilePreview(null); }}><X className="h-3 w-3" /></button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                    if (f?.type.startsWith("image/")) setFilePreview(await readAsDataUrl(f));
                    else setFilePreview(null);
                    e.target.value = "";
                  }}
                />
                <Button type="button" size="icon" variant="ghost" onClick={() => fileRef.current?.click()}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input className="flex-1" placeholder="Type a message…" value={input} onChange={(e) => setInput(e.target.value)} />
                <Button type="submit" size="icon" disabled={sending || (!input.trim() && !file)}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Send Quote Dialog ── */}
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" /> Send a Quotation
            </DialogTitle>
          </DialogHeader>

          {loadingOrders ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : buyerOrders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              <Package className="h-10 w-10 opacity-20 mx-auto mb-3" />
              No pending orders from this buyer yet.
            </div>
          ) : (
            <form onSubmit={sendQuote} className="space-y-4">
              {/* Order picker */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Select Order</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {buyerOrders.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setSelectedOrder(o)}
                      className={cn(
                        "w-full text-left rounded-xl border p-3 transition-all text-sm flex items-center gap-3",
                        selectedOrder?.id === o.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40 hover:bg-accent"
                      )}
                    >
                      {o.product?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={o.product.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{o.product?.title ?? o.productTitle}</div>
                        <div className="text-xs text-muted-foreground">Qty: {o.quantity} · {o.code}</div>
                      </div>
                      {selectedOrder?.id === o.id && (
                        <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price input */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Your Price (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    placeholder="e.g. 4999"
                    className="w-full pl-9 pr-3 h-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold">Note <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder="Delivery time, MOQ, payment terms…"
                  rows={2}
                  className="text-sm resize-none"
                />
              </div>

              {/* Preview */}
              {selectedOrder && quotePrice && (
                <div className="rounded-xl border border-dashed border-primary/40 p-3 bg-primary/3">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Preview</p>
                  <QuotationCard
                    quotation={{
                      type: "quotation",
                      orderId: selectedOrder.id,
                      orderCode: selectedOrder.code,
                      productTitle: selectedOrder.product?.title ?? selectedOrder.productTitle,
                      productImage: selectedOrder.product?.images?.[0],
                      quantity: selectedOrder.quantity,
                      price: parseFloat(quotePrice) || 0,
                      notes: quoteNotes || undefined,
                    }}
                    mine
                  />
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setQuoteOpen(false)}
                  className="flex-1 h-10 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={sendingQuote || !selectedOrder || !quotePrice}
                  className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                  {sendingQuote ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send Quote"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
}

export default function AgentChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="animate-spin h-8 w-8" /></div>}>
      <AgentChatContent />
    </Suspense>
  );
}
