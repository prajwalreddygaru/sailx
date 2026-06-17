"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Step = "email" | "password" | "verification";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { status } = useSession();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const [step, setStep]           = React.useState<Step>("email");
  const [isAdmin, setIsAdmin]     = React.useState(false);
  const [email, setEmail]         = React.useState("");
  const [password, setPassword]   = React.useState("");
  const [verifyCode, setVerifyCode] = React.useState("");
  const [showPw, setShowPw]       = React.useState(false);
  const [loading, setLoading]     = React.useState(false);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/login-type?email=${encodeURIComponent(email.trim())}`);
      const { isAdmin: admin } = await res.json();
      setIsAdmin(admin);
      setPassword("");
      setVerifyCode("");
      setStep("password");
    } catch {
      toast.error("Network error — is the server running?");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (isAdmin) {
      try {
        const res = await fetch("/api/auth/admin/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Invalid credentials");
          setLoading(false);
          return;
        }
        if (data.devOtp) {
          toast.info(`Dev mode — verification code: ${data.devOtp}`);
        } else {
          toast.success("Verification code sent to admin verification emails");
        }
        setStep("verification");
      } catch {
        toast.error("Network error — is the server running?");
      } finally {
        setLoading(false);
      }
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: email.trim(),
      password,
      mode: "password",
    });
    setLoading(false);
    if (result?.error) {
      toast.error("Invalid credentials");
    } else {
      toast.success("Signed in!");
      const callbackUrl = params.get("callbackUrl") || "/";
      const embedded = params.get("embedded") === "1";
      if (embedded && typeof window !== "undefined") {
        window.parent?.postMessage({ type: "auth:success", callbackUrl }, window.location.origin);
      } else {
        router.replace(callbackUrl);
      }
    }
  }

  async function handleVerificationLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!verifyCode.trim()) return;
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: email.trim(),
      password,
      otp: verifyCode.trim(),
      mode: "admin",
    });
    setLoading(false);
    if (result?.error) {
      toast.error("Invalid verification code");
    } else {
      toast.success("Welcome, Admin");
      const embedded = params.get("embedded") === "1";
      const cb = params.get("callbackUrl") || "/";
      if (embedded && typeof window !== "undefined") {
        window.parent?.postMessage({ type: "auth:success", callbackUrl: cb }, window.location.origin);
      } else {
        router.replace(cb);
      }
    }
  }

  async function resendVerification() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to resend code");
      } else if (data.devOtp) {
        toast.info(`Dev mode — verification code: ${data.devOtp}`);
      } else {
        toast.success("Verification code resent");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight mb-6">Welcome back</h1>
      <div className="mb-6 grid grid-cols-2 gap-2">
        <button className="h-10 rounded-lg border bg-accent text-foreground font-medium">Sign In</button>
        <Link href="/register" className="h-10 rounded-lg border hover:bg-accent/60 text-center inline-flex items-center justify-center font-medium">
          Sign Up
        </Link>
      </div>

      {step === "email" && (
        <>
          <p className="text-sm text-muted-foreground mt-1.5 mb-6">
            Enter your email to continue.
          </p>
          <form onSubmit={handleContinue} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="login-email"
                  name="login-email"
                  type="email"
                  placeholder="you@company.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  autoComplete="email"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Checking..." : <>Continue <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?
            <Link href="/register" className="ml-1 text-primary font-medium hover:underline">Sign up</Link>
          </div>
        </>
      )}

      {step === "password" && (
        <>
          <div className="flex items-center gap-2 mb-1">
            {isAdmin && <ShieldCheck className="h-5 w-5 text-primary" />}
            <h1 className="font-display text-2xl font-semibold">Sign in</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{email}</p>
          {isAdmin && (
            <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-xs">
              <span className="font-semibold text-yellow-600">Admin</span> — after password confirmation, the same verification code is sent to both admin verification emails.
            </div>
          )}
          <form onSubmit={handlePasswordLogin} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor={isAdmin ? "admin-password" : "login-password"}>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  key={`${email}-${isAdmin ? "admin" : "user"}`}
                  id={isAdmin ? "admin-password" : "login-password"}
                  name={isAdmin ? "admin-password" : "login-password"}
                  type={showPw ? "text" : "password"}
                  className="pl-9 pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  autoComplete={isAdmin ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (isAdmin ? "Sending code..." : "Signing in...") : (isAdmin ? "Continue" : "Sign In")}
            </Button>
            <button
              type="button"
              onClick={() => { setPassword(""); setVerifyCode(""); setStep("email"); }}
              className="w-full text-xs text-muted-foreground hover:text-foreground text-center"
            >
              ← Use a different email
            </button>
          </form>
        </>
      )}

      {step === "verification" && (
        <>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl font-semibold">Verify admin login</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Enter the 6-digit code sent to the admin verification emails.
          </p>
          <form onSubmit={handleVerificationLogin} className="space-y-4" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="admin-verify-code">Verification code</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-verify-code"
                  name="admin-verify-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="000000"
                  className="pl-9 tracking-widest text-center text-lg"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  autoFocus
                  autoComplete="one-time-code"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading || verifyCode.length !== 6}>
              {loading ? "Verifying..." : "Complete Sign In"}
            </Button>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={resendVerification}
                disabled={loading}
                className="w-full text-xs text-primary hover:underline text-center"
              >
                Resend verification code
              </button>
              <button
                type="button"
                onClick={() => setStep("password")}
                className="w-full text-xs text-muted-foreground hover:text-foreground text-center"
              >
                ← Back to password
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-10" />}>
      <LoginForm />
    </Suspense>
  );
}
