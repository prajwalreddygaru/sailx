"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { User, Phone, Briefcase, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const OCCUPATIONS = [
  "Business Owner",
  "Importer / Exporter",
  "Manufacturer",
  "Retailer / Wholesaler",
  "Trader",
  "Consultant",
  "Logistics Professional",
  "Finance / Banking",
  "IT / Technology",
  "Healthcare",
  "Education",
  "Government / Public Sector",
  "Real Estate",
  "Agriculture",
  "Student",
  "Other",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OnboardingModal({ open, onClose }: Props) {
  const { data: session, update } = useSession();
  const email = session?.user?.email ?? "";

  const [name,       setName]       = React.useState(session?.user?.name ?? "");
  const [surname,    setSurname]    = React.useState("");
  const [mobile,     setMobile]     = React.useState("");
  const [age,        setAge]        = React.useState("");
  const [occupation, setOccupation] = React.useState("");
  const [dob,        setDob]        = React.useState("");
  const [loading,    setLoading]    = React.useState(false);

  React.useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !surname.trim() || !mobile.trim() || !age || !occupation || !dob) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, mobile, age, occupation, dob }),
      });
      if (!res.ok) { toast.error("Failed to save profile"); return; }
      const data = await res.json();
      await update({ name: data.name, profileComplete: true });
      toast.success("Profile saved! Welcome to SailX 🎉");
      onClose();
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-red-500/10 px-6 py-5 border-b border-border">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl md:text-3xl font-black">Complete your profile</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Just a few details to personalise your experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-1/3 animate-pulse" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ob-name">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="ob-name"
                  placeholder="Arjun"
                  className="pl-8"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-surname">Surname</Label>
              <Input
                id="ob-surname"
                placeholder="Sharma"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email — readonly */}
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={email} readOnly className="bg-muted/50 text-muted-foreground cursor-not-allowed" />
          </div>

          {/* Mobile */}
          <div className="space-y-1.5">
            <Label htmlFor="ob-mobile">Mobile Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="ob-mobile"
                type="tel"
                placeholder="+91 98765 43210"
                className="pl-8"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Age + DOB row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ob-age">Age</Label>
              <Input
                id="ob-age"
                type="number"
                min="18"
                max="100"
                placeholder="28"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ob-dob">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  id="ob-dob"
                  type="date"
                  className="pl-8"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <Label htmlFor="ob-occ">Occupation</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <select
                id="ob-occ"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                required
                className={cn(
                  "w-full pl-8 pr-3 py-2 text-sm rounded-md border border-input bg-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  !occupation && "text-muted-foreground"
                )}
              >
                <option value="" disabled>Select your occupation</option>
                {OCCUPATIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full h-11 font-bold mt-2" disabled={loading}>
            {loading ? "Saving…" : "Save & Continue →"}
          </Button>
        </form>
      </div>
    </div>
  );
}
