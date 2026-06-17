"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SetupPage() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/setup/make-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Is the server running?");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold">One-Time Admin Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your registered email to promote your account to <strong>ADMIN</strong>.<br />
            This only works once — disabled after an admin exists.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400 text-sm">
            ✅ {message}
            <p className="mt-3 font-semibold text-white">
              👉 Now <a href="/api/auth/signout" className="underline text-primary">sign out</a> and sign back in — your role will be ADMIN.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Your Account Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {status === "error" && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-destructive text-sm">
                ❌ {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={status === "loading"}>
              {status === "loading" ? "Setting up..." : "Make Me Admin"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
