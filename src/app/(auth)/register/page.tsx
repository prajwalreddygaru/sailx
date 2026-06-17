"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type Step = "details" | "verify" | "password";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>("details");
  const [loading, setLoading] = React.useState(false);

  // Details
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [occupation, setOccupation] = React.useState<string>("");
  const [dob, setDob] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [role, setRole] = React.useState<string>("BUYER");

  // OTP & Password
  const [otp, setOtp] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const OCCUPATIONS = [
    "Business Owner",
    "Procurement Manager",
    "Operations Manager",
    "Importer",
    "Exporter",
    "Entrepreneur",
    "Consultant",
    "Other",
  ];

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { toast.error("Enter your name"); return; }
    if (!email.trim()) { toast.error("Enter a valid email"); return; }
    if (!mobile.trim()) { toast.error("Enter your mobile number"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || "Failed to send verification code"); return; }
      if (d.devOtp) { setOtp(d.devOtp); toast.success(`Dev mode — code auto-filled: ${d.devOtp}`); }
      else { toast.success(`Verification code sent to ${email.trim().toLowerCase()}`); }
      setStep("verify");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.trim().length < 4) { toast.error("Enter the code sent to your email"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: otp.trim() }),
      });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || "Invalid or expired code"); return; }
      setPassword("");
      setConfirm("");
      setShowPassword(false);
      setShowConfirm(false);
      setStep("password");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.trim().toLowerCase(),
          address,
          occupation,
          dob: dob || undefined,
          mobile,
          role,
          otp: otp.trim(),
          password,
        }),
      });
      const d = await res.json();
      if (!res.ok) { toast.error(d.error || "Registration failed"); return; }
      // Auto-login using password mode
      const result = await signIn("credentials", { redirect: false, email: email.trim().toLowerCase(), password, mode: "password" });
      if (result?.error) {
        toast.success("Account created. Please sign in.");
        router.push(`/login?email=${encodeURIComponent(email.trim())}`);
      } else {
        toast.success("Welcome to SailX");
        router.push("/");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  const loadingMessage = {
    details: "Sending verification code...",
    verify: "Verifying code...",
    password: "Creating your account...",
  }[step];

  return (
    <div className="relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <Spinner size="lg" className="mb-3" />
          <p className="text-sm text-muted-foreground animate-pulse">{loadingMessage}</p>
        </div>
      )}

      {/* Top switch: Sign In / Sign Up */}
      <div className="mb-6 grid grid-cols-2 gap-2">
        <Link href="/login" className="h-10 rounded-lg border hover:bg-accent/60 text-center inline-flex items-center justify-center font-medium">Sign In</Link>
        <button className="h-10 rounded-lg border bg-accent text-foreground font-medium">Sign Up</button>
      </div>

      <h1 className="font-display text-3xl font-semibold tracking-tight">Create your account</h1>
      <p className="text-sm text-muted-foreground mt-1.5 mb-6">Sign up to access bookings and manage your profile.</p>

      {step === "details" && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, City, State, PIN" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Occupation</Label>
              <Select value={occupation} onValueChange={setOccupation}>
                <SelectTrigger><SelectValue placeholder="Select occupation"/></SelectTrigger>
                <SelectContent>
                  {OCCUPATIONS.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of birth</Label>
              <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile number</Label>
              <Input id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Account type</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BUYER">Buyer</SelectItem>
                  <SelectItem value="AGENT">Agent</SelectItem>
                  <SelectItem value="SUPPLIER">Supplier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading}>{loading ? "Sending code..." : "Send verification code"}</Button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A verification code was sent to <span className="font-medium text-foreground">{email.trim().toLowerCase()}</span>. Enter it below.
          </p>
          <div className="space-y-2">
            <Label htmlFor="otp">Verification code</Label>
            <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} inputMode="numeric" maxLength={6} placeholder="000000" className="text-center text-2xl tracking-widest h-14 font-mono" required />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Button type="button" variant="outline" onClick={() => setStep("details")}>← Edit details</Button>
            <Button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify"}</Button>
          </div>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleCreate} className="space-y-4" autoComplete="off">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="register-password">Set password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="register-password"
                  name="register-password"
                  type={showPassword ? "text" : "password"}
                  className="pl-9 pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="register-confirm">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="register-confirm"
                  name="register-confirm"
                  type={showConfirm ? "text" : "password"}
                  className="pl-9 pr-9"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Button type="button" variant="outline" onClick={() => setStep("verify")}>← Back</Button>
            <Button type="submit" className="h-11" disabled={loading}>{loading ? "Creating..." : "Create account & Sign in"}</Button>
          </div>
        </form>
      )}
    </div>
  );
}
