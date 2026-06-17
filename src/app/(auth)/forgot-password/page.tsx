"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);

  return (
    <div>
      <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
      </Link>

      {sent ? (
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Check your inbox</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a password reset link to your email. It expires in 1 hour.
          </p>
          <Button variant="outline" className="mt-6" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Reset password</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Enter your account email and we'll send you a reset link.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-4 mt-6"
          >
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" placeholder="you@company.com" className="pl-9" required />
              </div>
            </div>
            <Button type="submit" variant="gradient" className="w-full h-11">
              Send reset link
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
