"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Send, Video, Loader2, Paperclip, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QuotationCard } from "@/components/chat/quotation-card";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
  attachments?: any;
}

interface Agent {
  userId: string;
  user: { id: string; name: string; email: string };
}

function ChatContent() {
  const params        = useSearchParams();
  const { data: session } = useSession();
  const myId          = (session?.user as any)?.id as string | undefined;
  const defaultAgent  = params.get("agentId");

  const [agents, setAgents]           = React.useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = React.useState<string | null>(defaultAgent);
  const [convoId, setConvoId]         = React.useState<string | null>(null);
  const [messages, setMessages]       = React.useState<Message[]>([]);
  const [input, setInput]             = React.useState("");
  const [sending, setSending]         = React.useState(false);
  const [file, setFile]               = React.useState<File | null>(null);
  const [filePreview, setFilePreview]  = React.useState<string | null>(null);
  const [lightbox, setLightbox]        = React.useState<string | null>(null);
  const [payingOrderId, setPayingOrderId] = React.useState<string | null>(null);
  const [paidOrderIds, setPaidOrderIds]   = React.useState<Set<string>>(new Set());
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const fileRef   = React.useRef<HTMLInputElement>(null);

  async function handlePay(orderId: string) {
    setPayingOrderId(orderId);
    try {
      const res = await fetch(`/api/sample-orders/${orderId}/pay`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Payment failed"); return; }
      if (data.demo) {
        toast.success("Demo mode: payment marked as successful!");
        setPaidOrderIds((prev) => new Set([...prev, orderId]));
        return;
      }
      const { razorpayOrderId, amount, currency, keyId } = data;
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new (window as any).Razorpay({
          key: keyId,
          amount,
          currency,
          order_id: razorpayOrderId,
          name: "SailX",
          description: "Sample Order Payment",
          theme: { color: "#6366f1" },
          handler: async (response: any) => {
            await fetch(`/api/sample-orders/${orderId}/pay`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpayPaymentId: response.razorpay_payment_id }),
            });
            toast.success("Payment successful!");
            setPaidOrderIds((prev) => new Set([...prev, orderId]));
          },
        });
        rzp.open();
      };
      document.body.appendChild(script);
    } finally {
      setPayingOrderId(null);
    }
  }

  function readAsDataUrl(f: File): Promise<string> {
    return new Promise((res) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.readAsDataURL(f);
    });
  }

  // Load agents
  React.useEffect(() => {
    fetch("/api/admin/agents")
      .then((r) => r.json())
      .then((d) => setAgents(Array.isArray(d) ? d : []));
  }, []);

  // Load / poll conversation
  React.useEffect(() => {
    if (!selectedAgentId) return;
    const agentUserId = agents.find((a) => a.userId === selectedAgentId || a.user?.id === selectedAgentId)?.user?.id ?? selectedAgentId;

    async function fetchChat() {
      const res = await fetch(`/api/chat?agentId=${agentUserId}`);
      if (!res.ok) return;
      const data = await res.json();
      setConvoId(data.id);
      setMessages(data.messages ?? []);
    }

    fetchChat();
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [selectedAgentId, agents]);

  // Scroll to bottom on new messages
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && !file) return;
    if (!convoId) { toast.error("No conversation open"); return; }
    setSending(true);

    let attachments: any[] | null = null;
    let content = input.trim();
    if (file) {
      const isImage = file.type.startsWith("image/");
      const dataUrl = isImage ? await readAsDataUrl(file) : undefined;
      attachments = [{ name: file.name, type: file.type, size: file.size, ...(dataUrl ? { dataUrl } : {}) }];
      if (!content) content = isImage ? `📷 ${file.name}` : `📎 ${file.name}`;
    }

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: convoId, content, attachments }),
    });

    setInput("");
    setFile(null);
    setFilePreview(null);
    setSending(false);
  }

  function startMeet() {
    window.open("https://meet.google.com/new", "_blank");
  }

  const agentName = agents.find((a) => a.userId === selectedAgentId || a.user?.id === selectedAgentId)?.user?.name ?? "Agent";

  return (
    <>
    {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    <div className="flex h-[calc(100vh-5rem)] border rounded-xl overflow-hidden">
      {/* Sidebar: agents */}
      <div className="w-64 border-r flex flex-col bg-card">
        <div className="p-4 border-b font-semibold text-sm">Agents</div>
        <div className="flex-1 overflow-y-auto">
          {agents.length === 0 ? (
            <p className="text-xs text-muted-foreground p-4">No agents available.</p>
          ) : agents.map((a) => (
            <button
              key={a.userId}
              onClick={() => setSelectedAgentId(a.userId)}
              className={cn(
                "w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors border-b text-sm",
                selectedAgentId === a.userId && "bg-accent"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{(a.user?.name?.[0] ?? "A").toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="truncate">{a.user?.name ?? "Agent"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {!selectedAgentId ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select an agent to start chatting</div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9"><AvatarFallback>{agentName[0].toUpperCase()}</AvatarFallback></Avatar>
              <div>
                <p className="font-semibold text-sm">{agentName}</p>
                <p className="text-xs text-muted-foreground">Agent</p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={startMeet}>
              <Video className="h-4 w-4 mr-2" /> Start Google Meet
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((m) => {
                const mine = m.sender.id === myId;
                return (
                  <div key={m.id} className={cn("flex gap-2", mine && "flex-row-reverse")}>
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback className="text-xs">{m.sender.name[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={cn("max-w-xs lg:max-w-md", mine && "items-end flex flex-col")}>
                      <div className={cn(
                        "rounded-2xl overflow-hidden",
                        mine ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}>
                        {/* Image preview if attachment has dataUrl */}
                        {Array.isArray(m.attachments) && m.attachments[0]?.dataUrl && m.attachments[0]?.type?.startsWith("image/") ? (
                          <div className="space-y-0">
                            <button
                              type="button"
                              className="relative group block w-full"
                              onClick={() => setLightbox(m.attachments[0].dataUrl)}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={m.attachments[0].dataUrl}
                                alt={m.attachments[0].name}
                                className="max-w-[240px] max-h-[240px] object-cover rounded-t-2xl w-full"
                              />
                              <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-2xl">
                                <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                              </span>
                            </button>
                            {m.content.replace(/^📷 \S+/, "").trim() && (
                              <p className="px-3 py-2 text-sm">{m.content.replace(/^📷 \S+/, "").trim()}</p>
                            )}
                          </div>
                        ) : Array.isArray(m.attachments) && m.attachments[0]?.type === "quotation" ? (
                          <div className="p-1">
                            <QuotationCard
                              quotation={m.attachments[0]}
                              mine={mine}
                              paidOrderIds={paidOrderIds}
                              onPay={handlePay}
                              paying={payingOrderId === m.attachments[0].orderId}
                            />
                          </div>
                        ) : (
                          <div className="px-3 py-2 text-sm">
                            {m.attachments && !Array.isArray(m.attachments) || (Array.isArray(m.attachments) && m.attachments.length > 0 && !m.attachments[0]?.dataUrl) ? (
                              <span className="flex items-center gap-1">📎 {m.content.replace(/^📎 /, "")}</span>
                            ) : (
                              m.content
                            )}
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
          <form onSubmit={sendMessage} className="p-3 border-t bg-card flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                if (f && f.type.startsWith("image/")) {
                  setFilePreview(await readAsDataUrl(f));
                } else {
                  setFilePreview(null);
                }
                e.target.value = "";
              }}
            />
            <Button type="button" size="icon" variant="ghost" onClick={() => fileRef.current?.click()}>
              <Paperclip className="h-4 w-4" />
            </Button>
            {file && (
              <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1 text-xs max-w-[120px]">
                {filePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={filePreview} alt="preview" className="h-6 w-6 rounded object-cover shrink-0" />
                ) : (
                  <span className="text-base leading-none">📎</span>
                )}
                <span className="truncate">{file.name.slice(0, 14)}</span>
                <button type="button" onClick={() => { setFile(null); setFilePreview(null); }}>
                  <X className="h-3 w-3 shrink-0" />
                </button>
              </div>
            )}
            <Input
              className="flex-1"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={sending || (!input.trim() && !file)}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}
    </div>
    </>
  );
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Preview"
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="animate-spin h-8 w-8" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
