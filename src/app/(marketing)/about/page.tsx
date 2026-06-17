import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe2, Users, HandshakeIcon, Award, ShieldCheck, Building2, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About SailX",
  description: "Learn about SailX — your trusted bridge to China's manufacturing ecosystem. Verified suppliers, factory checks, and global reach.",
};

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="pt-24 md:pt-28 pb-10 md:pb-16 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden border-b">
        <div className="absolute -top-16 right-1/3 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest">About SailX</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mt-4">Your bridge to China’s manufacturing ecosystem</h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">Easy business travel. Easy import from China. We help you discover products, verify factories, and ship with confidence.</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-xl font-bold h-11 px-6">
                <Link href="/consultation">Book a Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl h-11 px-6">
                <Link href="/tours">Explore Tours</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-bold">Verified Suppliers</div>
                  <div className="text-xs text-muted-foreground">Quality-first sourcing</div>
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-bold">Factory Checks</div>
                  <div className="text-xs text-muted-foreground">On-ground QC</div>
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
                <Globe2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-bold">Global Reach</div>
                  <div className="text-xs text-muted-foreground">Ship worldwide</div>
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-bold">Dedicated Team</div>
                  <div className="text-xs text-muted-foreground">Support at each step</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 hidden md:block">
            <div className="rounded-3xl border bg-card p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Focus</div>
                  <div className="font-bold">End-to-end</div>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Language</div>
                  <div className="font-bold">Chinese to English</div>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Checks</div>
                  <div className="font-bold">Factory QC</div>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <div className="text-xs text-muted-foreground">Tours</div>
                  <div className="font-bold">Trade Fairs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro copy */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>At <strong className="text-foreground">SAILX</strong>, we help global businesses explore sourcing, manufacturing, and trade opportunities in China.</p>
            <p>Whether you’re an experienced importer, a growing business, or taking your first step into international trade, we provide practical support to help you navigate the Chinese market with confidence and connect with reliable suppliers across China.</p>
            <p>Our team offers on‑ground market insights, supplier discovery, factory visits, quality inspections, product sourcing, and end‑to‑end business support. We bridge the gap between global buyers and Chinese manufacturers by providing local expertise, trusted connections, and reliable information that helps you make informed decisions.</p>
            <p>We also organize business tours to China for entrepreneurs, importers, and business owners. These tours provide direct access to trade fairs, wholesale markets, manufacturing hubs, and factory visits — helping you build relationships with suppliers and experience China’s ecosystem firsthand.</p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-xl font-black mb-3">What we help you achieve</h3>
            <ul className="grid gap-3 text-sm">
              <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Find reliable suppliers matched to your product goals</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Verify factories and ensure robust quality control</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Negotiate pricing and manage secure, transparent payments</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Plan trade fair visits and on‑ground business tours</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-10 md:py-16 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border bg-card p-6">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Globe2 className="h-4 w-4" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">To become the world’s most trusted bridge between global businesses and China’s manufacturing ecosystem, empowering entrepreneurs and companies with direct access to sourcing opportunities, market intelligence, and reliable trade solutions.</p>
            <p className="text-muted-foreground leading-relaxed mt-3">We envision a future where businesses of every size can confidently connect with world‑class manufacturers, build strong supply chains, and grow beyond borders.</p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <HandshakeIcon className="h-4 w-4" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">To simplify international sourcing and trade through transparent guidance, on‑ground support, business tours, and practical solutions that help companies discover products, build supplier relationships, and execute successful transactions with confidence.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
