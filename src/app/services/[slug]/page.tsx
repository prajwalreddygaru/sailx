import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, CheckCircle2, Sparkles, ShieldCheck, Clock, Users, TrendingUp, Globe2, Wallet, Languages, Factory, FileCheck, HandshakeIcon } from "lucide-react";
import { ServiceConsultForm } from "@/components/marketing/service-consult-form";
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us";
import { MarketingFooter } from "@/components/marketing/footer";
import { BackButton } from "@/components/ui/back-button";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const staticMeta = SERVICES[slug];
  let db: any = null;
  try {
    const svcModel: any = (prisma as any).service;
    if (svcModel && typeof svcModel.findUnique === "function") {
      db = await svcModel.findUnique({ where: { slug } });
    }
  } catch {}
  const title = db?.title || staticMeta?.title || "Service";
  const description = db?.description || staticMeta?.description || "Professional sourcing support from SailX China.";
  return {
    title,
    description,
  };
}

type ServiceMeta = {
  title: string;
  short: string;
  description: string;
  accent: string;
  accentBg: string;
  accentLight: string;
  image: string;
  features: { icon: React.ElementType; title: string; desc: string }[];
  steps: { num: string; title: string; desc: string }[];
  faq: { q: string; a: string }[];
};

const SERVICES: Record<string, ServiceMeta> = {
  "end-to-end-product-sourcing": {
    title: "End-to-End Product Sourcing",
    short: "Full cycle import support",
    description: "From product discovery to doorstep delivery — we handle every step of sourcing from China so you can focus on growing your business.",
    accent: "from-orange-600 to-red-600",
    accentBg: "bg-orange-600",
    accentLight: "bg-orange-500/10 text-orange-600",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    features: [
      { icon: TrendingUp, title: "Product Research", desc: "We identify the right products and suppliers matching your quality and budget requirements." },
      { icon: Globe2, title: "Supplier Matching", desc: "Connect with verified manufacturers across key industrial zones in China." },
      { icon: FileCheck, title: "Quality Checks", desc: "On-ground inspection before payment to ensure standards are met." },
      { icon: Clock, title: "Timeline Tracking", desc: "Milestone-based updates from order to delivery, so you're never in the dark." },
      { icon: Wallet, title: "Payment Coordination", desc: "Secure milestone-based payments with supplier verification." },
      { icon: ShieldCheck, title: "Risk Mitigation", desc: "We verify credentials, track orders, and protect your investment." },
    ],
    steps: [
      { num: "01", title: "Share your product brief", desc: "Tell us what you need — category, specs, quantity, and budget." },
      { num: "02", title: "We find & verify suppliers", desc: "Our team shortlists 3-5 verified suppliers with quotations." },
      { num: "03", title: "Compare & decide", desc: "Review options side-by-side and select the best fit." },
      { num: "04", title: "Order, inspect & ship", desc: "We manage the order, inspect quality, and coordinate delivery." },
    ],
    faq: [
      { q: "How long does end-to-end sourcing take?", a: "Typically 3–6 weeks depending on product complexity and supplier responsiveness." },
      { q: "Do you handle shipping & customs?", a: "We coordinate shipping and can recommend freight partners. Customs is handled on your side." },
      { q: "What if the product quality is poor?", a: "We conduct pre-shipment inspections. If quality fails, we negotiate rework or find alternatives." },
    ],
  },
  "china-side-sourcing-support": {
    title: "China-Side Sourcing Support",
    short: "On-ground supplier access",
    description: "Already know what you want? Our China-based team connects you directly with suppliers, negotiates terms, and verifies everything on your behalf.",
    accent: "from-blue-600 to-indigo-600",
    accentBg: "bg-blue-600",
    accentLight: "bg-blue-500/10 text-blue-600",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    features: [
      { icon: Users, title: "Local Presence", desc: "Our team is on the ground in China visiting factories and meeting suppliers face-to-face." },
      { icon: Globe2, title: "Market Access", desc: "Tap into supplier networks on 1688, Alibaba, and direct factory connections." },
      { icon: Languages, title: "Bilingual Support", desc: "Fluent Mandarin + English communication eliminates language barriers." },
      { icon: FileCheck, title: "Quotation Comparison", desc: "Side-by-side quotes from multiple suppliers for informed decisions." },
      { icon: ShieldCheck, title: "Supplier Verification", desc: "Business license checks, factory audits, and reference validation." },
      { icon: Clock, title: "Fast Turnaround", desc: "Get quotations and supplier details within 3-5 business days." },
    ],
    steps: [
      { num: "01", title: "Share your product & target price", desc: "Send product links, specs, or samples you want matched." },
      { num: "02", title: "On-ground supplier hunt", desc: "We visit markets and factories to find the best match." },
      { num: "03", title: "Receive verified quotes", desc: "Get detailed quotations with supplier verification reports." },
      { num: "04", title: "Place order with confidence", desc: "We guide you through order placement and follow-up." },
    ],
    faq: [
      { q: "Can you visit specific factories I already know?", a: "Yes — we can visit factories you shortlist and provide independent verification reports." },
      { q: "Do I need to travel to China?", a: "Not at all. We act as your eyes and ears on the ground." },
      { q: "How are suppliers verified?", a: "We check business licenses, visit premises, and validate production capacity." },
    ],
  },
  "translation-business-communication": {
    title: "Translation & Business Communication",
    short: "4-language bridge support",
    description: "Bridge the language gap with professional Chinese ↔ English ↔ Hindi ↔ Kannada translation for every business interaction.",
    accent: "from-violet-600 to-purple-600",
    accentBg: "bg-violet-600",
    accentLight: "bg-violet-500/10 text-violet-600",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    features: [
      { icon: Languages, title: "4-Language Support", desc: "Chinese, English, Hindi, and Kannada for seamless communication." },
      { icon: Users, title: "Call & Video Support", desc: "Join supplier calls with our bilingual team for real-time translation." },
      { icon: FileCheck, title: "Document Translation", desc: "Contracts, product specs, invoices, and emails translated accurately." },
      { icon: ShieldCheck, title: "Cultural Context", desc: "We translate intent, not just words — avoiding costly misunderstandings." },
      { icon: Clock, title: "Quick Response", desc: "Most translations delivered within 24 hours." },
      { icon: Sparkles, title: "Business Etiquette", desc: "Navigate Chinese business culture with our guidance." },
    ],
    steps: [
      { num: "01", title: "Share your documents or call schedule", desc: "Upload files or let us know when your supplier meeting is." },
      { num: "02", title: "We assign a translator", desc: "Based on language pair and industry context." },
      { num: "03", title: "Real-time or async delivery", desc: "Join calls live or receive translated documents promptly." },
      { num: "04", title: "Follow-up support", desc: "We stay available for clarifications and next steps." },
    ],
    faq: [
      { q: "Which languages do you support?", a: "Chinese (Mandarin), English, Hindi, and Kannada. Other languages on request." },
      { q: "Can you join WeChat / WhatsApp calls?", a: "Yes — we can join calls on any platform and translate in real-time." },
      { q: "How fast is document translation?", a: "Standard documents within 24 hours. Urgent requests can be expedited." },
    ],
  },
  "factory-inspections-quality-checks": {
    title: "Factory Inspections & Quality Checks",
    short: "On-site verification & reports",
    description: "Don't ship blind. Our inspectors visit factories to verify quality, packaging, and compliance before your money leaves your account.",
    accent: "from-emerald-600 to-teal-600",
    accentBg: "bg-emerald-600",
    accentLight: "bg-emerald-500/10 text-emerald-600",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    features: [
      { icon: Factory, title: "Factory Visits", desc: "Physical visits to supplier premises to verify production capability." },
      { icon: FileCheck, title: "Detailed Reports", desc: "Photo + video evidence with written inspection summaries." },
      { icon: ShieldCheck, title: "Pre-Shipment Checks", desc: "Inspect before payment release to avoid nasty surprises." },
      { icon: CheckCircle2, title: "Packaging Audit", desc: "Verify labeling, barcodes, and packaging standards." },
      { icon: Clock, title: "48-Hour Reports", desc: "Inspection reports delivered within 48 hours of the visit." },
      { icon: TrendingUp, title: "Defect Analysis", desc: "Categorize and quantify defects with actionable recommendations." },
    ],
    steps: [
      { num: "01", title: "Book an inspection", desc: "Share supplier details, product specs, and inspection requirements." },
      { num: "02", title: "Inspector visits factory", desc: "Our inspector arrives unannounced or scheduled as per your preference." },
      { num: "03", title: "Receive evidence & report", desc: "Photos, videos, and a detailed written report within 48 hours." },
      { num: "04", title: "Decide with confidence", desc: "Approve shipment, request rework, or switch suppliers based on findings." },
    ],
    faq: [
      { q: "Can I get a video of the inspection?", a: "Yes — every inspection includes photos and optional live video." },
      { q: "What if defects are found?", a: "We negotiate rework with the supplier or help you find alternatives." },
      { q: "How much does an inspection cost?", a: "Starting from ₹3,500 per man-day depending on location and scope." },
    ],
  },
  "supplier-payment-support": {
    title: "Supplier Payment Support",
    short: "Safe & verified payment coordination",
    description: "Secure your payments with verified channels, milestone-based plans, and compliance checks that protect your money at every step.",
    accent: "from-yellow-500 to-amber-600",
    accentBg: "bg-amber-600",
    accentLight: "bg-amber-500/10 text-amber-600",
    image: "https://images.unsplash.com/photo-1605901309584-818e2594ec6a?auto=format&fit=crop&w=1200&q=80",
    features: [
      { icon: ShieldCheck, title: "Verified Channels", desc: "Payments through trusted, traceable banking and escrow channels." },
      { icon: Wallet, title: "Milestone Payments", desc: "Pay in stages tied to verified production milestones." },
      { icon: FileCheck, title: "Compliance Checks", desc: "Verify supplier banking details and business legitimacy." },
      { icon: Clock, title: "Fast Processing", desc: "Most payments processed within 1-2 business days." },
      { icon: Users, title: "Dispute Support", desc: "We mediate if payment or delivery issues arise." },
      { icon: TrendingUp, title: "FX Guidance", desc: "Get guidance on exchange rates and timing for better conversions." },
    ],
    steps: [
      { num: "01", title: "Share supplier banking details", desc: "We verify the account and business credentials." },
      { num: "02", title: "Set payment milestones", desc: "We design a milestone plan tied to production stages." },
      { num: "03", title: "Execute & confirm", desc: "We process payments and share proof of transfer." },
      { num: "04", title: "Release final payment", desc: "Final payment only after inspection and your approval." },
    ],
    faq: [
      { q: "Is my money safe?", a: "We only use verified banking channels and milestone-based releases." },
      { q: "What currencies do you support?", a: "USD, CNY, INR, and EUR. Other currencies on request." },
      { q: "Can I pay after receiving goods?", a: "We recommend milestone payments. Full post-delivery is rare but negotiable for repeat clients." },
    ],
  },
  "price-negotiation-support": {
    title: "Price Negotiation Support",
    short: "Better deals, fair terms",
    description: "Our Mandarin-speaking negotiators get you better pricing, lower MOQs, and fairer terms — while keeping supplier relationships healthy.",
    accent: "from-pink-600 to-rose-600",
    accentBg: "bg-rose-600",
    accentLight: "bg-rose-500/10 text-rose-600",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    features: [
      { icon: HandshakeIcon, title: "Expert Negotiators", desc: "Fluent Mandarin speakers who understand Chinese negotiation culture." },
      { icon: TrendingUp, title: "Better Pricing", desc: "Average 8-15% cost reduction through professional negotiation." },
      { icon: ShieldCheck, title: "Lower MOQs", desc: "Negotiate minimum order quantities that fit your business size." },
      { icon: Clock, title: "Faster Turnarounds", desc: "Speed up negotiation cycles with experienced local presence." },
      { icon: FileCheck, title: "Contract Terms", desc: "Payment terms, delivery timelines, and packaging all negotiated." },
      { icon: Sparkles, title: "Relationship Care", desc: "We keep supplier relationships professional for long-term partnership." },
    ],
    steps: [
      { num: "01", title: "Share target price & terms", desc: "Tell us your budget, MOQ needs, and ideal terms." },
      { num: "02", title: "We analyze the market", desc: "Benchmark pricing and terms across comparable suppliers." },
      { num: "03", title: "Negotiate on your behalf", desc: "Our team negotiates directly with suppliers in Mandarin." },
      { num: "04", title: "Present final offer", desc: "You receive the best deal with full transparency on concessions made." },
    ],
    faq: [
      { q: "How much can you typically save?", a: "Most clients see 8-15% savings on unit price, plus better payment terms." },
      { q: "Will this damage my supplier relationship?", a: "No — we negotiate professionally and preserve long-term relationships." },
      { q: "Can you negotiate existing orders?", a: "Yes — we can renegotiate ongoing orders if market conditions have changed." },
    ],
  },
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Try DB first, but guard if Service model not generated yet
  let db: any = null;
  try {
    const svcModel: any = (prisma as any).service;
    if (svcModel && typeof svcModel.findUnique === "function") {
      db = await svcModel.findUnique({ where: { slug } });
    }
  } catch { /* ignore and fallback */ }
  const staticMeta = SERVICES[slug];
  // Support DB-only services with a fallback template
  const meta: ServiceMeta = staticMeta || {
    title: db?.title || "Service",
    short: db?.short || "Professional sourcing support",
    description: db?.description || "Contact us to learn more about this service.",
    accent: "from-red-600 to-orange-600",
    accentBg: "bg-red-600",
    accentLight: "bg-red-500/10 text-red-600",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    features: [
      { icon: ShieldCheck, title: "Verified Process", desc: "Every step is documented and verified for your peace of mind." },
      { icon: Users, title: "Expert Team", desc: "Our China-based team handles the heavy lifting for you." },
      { icon: Clock, title: "Fast Response", desc: "Get quotes and updates within 24-48 hours." },
      { icon: Globe2, title: "Local Network", desc: "Access our verified supplier network across China." },
      { icon: FileCheck, title: "Transparent Reporting", desc: "Regular updates with photos, videos, and written reports." },
      { icon: HandshakeIcon, title: "End-to-End Support", desc: "From inquiry to delivery, we're with you at every step." },
    ],
    steps: [
      { num: "01", title: "Share your requirements", desc: "Tell us what you need — product, quantity, budget, and timeline." },
      { num: "02", title: "We evaluate & plan", desc: "Our team assesses feasibility and creates a tailored action plan." },
      { num: "03", title: "Execution on the ground", desc: "We carry out the work in China with regular updates." },
      { num: "04", title: "Delivery & handover", desc: "You receive the final output — products, reports, or verified suppliers." },
    ],
    faq: [
      { q: "How do I get started?", a: "Fill out the consultation form and our team will reach out within 24 hours." },
      { q: "How long does the process take?", a: "Timelines vary by service, typically 1–6 weeks. We'll give you a clear estimate after understanding your needs." },
      { q: "Is my investment safe?", a: "We use verified suppliers, milestone-based payments, and provide full documentation at every step." },
    ],
  };
  // If neither static nor DB has this slug, 404
  if (!staticMeta && !db) return notFound();
  // Merge DB overrides on top of meta
  const svc = db
    ? {
        ...meta,
        title: db.title || meta.title,
        description: db.description || meta.description,
        image: db.imageUrl || meta.image,
      }
    : meta;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className={`absolute inset-0 bg-gradient-to-br ${svc.accent} opacity-[0.08]`} />
        <div className={`absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br ${svc.accent} opacity-20 blur-3xl`} />
        <div className={`absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-gradient-to-tr ${svc.accent} opacity-10 blur-3xl`} />
        <div className="container relative py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-4">
                <BadgeCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-bold text-primary uppercase tracking-widest">Our Services</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black leading-tight">{svc.title}</h1>
              <p className="text-muted-foreground text-base md:text-lg mt-4 max-w-xl leading-relaxed">{svc.description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className={`rounded-xl font-bold h-11 px-6 bg-gradient-to-r ${svc.accent} text-white border-0`}>
                  <Link href="#consult">Request a consultation <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <BackButton
                  preferHomeSection
                  fallback="/#services"
                  label="Back to all services"
                  className="rounded-xl h-11 px-6 border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium"
                />
              </div>
            </div>
            <div className="mt-6 lg:mt-0">
              <div className="relative rounded-2xl lg:rounded-3xl border bg-card overflow-hidden shadow-xl lg:shadow-2xl">
                <img src={meta.image} alt={svc.title} className="w-full h-[200px] sm:h-[240px] lg:h-[280px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className={`h-1.5 w-8 rounded-full ${svc.accentBg}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${svc.accentLight.split(" ")[1]}`}>What You Get</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">Everything you need, handled for you</h2>
          </div>
          {/* Mobile: compact 2-col grid */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {meta.features.map(({ icon: Icon, title }) => (
              <div key={title} className="flex flex-col items-center text-center gap-2 rounded-xl border bg-card p-3">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${svc.accentLight}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <h3 className="text-xs font-semibold leading-tight">{title}</h3>
              </div>
            ))}
          </div>

          {/* Desktop: card grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {meta.features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border bg-card p-6 hover:shadow-lg transition-shadow group">
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${svc.accentLight} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 md:py-20 border-t bg-muted/10">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className={`h-1.5 w-8 rounded-full ${svc.accentBg}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${svc.accentLight.split(" ")[1]}`}>How It Works</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">Simple steps to get started</h2>
          </div>
          {/* Mobile: compact vertical steps */}
          <div className="flex flex-col gap-3 sm:hidden">
            {meta.steps.map(({ num, title, desc }) => (
              <div key={num} className="flex items-start gap-3 rounded-xl border bg-card p-3">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black shrink-0 ${svc.accentBg} text-white`}>{num}</span>
                <div>
                  <h3 className="text-sm font-bold mb-0.5">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: steps grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {meta.steps.map(({ num, title, desc }) => (
              <div key={num} className="relative">
                <div className={`text-5xl font-black ${svc.accentLight.split(" ")[1]} opacity-20 mb-2`}>{num}</div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation + FAQ */}
      <section id="consult" className="py-12 md:py-20">
        <div className="container grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* FAQ */}
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className={`h-1.5 w-8 rounded-full ${svc.accentBg}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${svc.accentLight.split(" ")[1]}`}>FAQ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-6">Common questions</h2>
            <div className="space-y-4">
              {meta.faq.map(({ q, a }) => (
                <div key={q} className="rounded-2xl border bg-card p-5">
                  <h3 className="font-semibold text-sm md:text-base mb-1">{q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <ServiceConsultForm serviceSlug={slug} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 md:py-16 border-t bg-muted/10">
        <div className="container">
          <div className={`rounded-3xl bg-gradient-to-r ${svc.accent} p-8 md:p-12 text-white text-center`}>
            <h2 className="text-2xl md:text-4xl font-black mb-3">Ready to get started?</h2>
            <p className="text-white/90 max-w-xl mx-auto mb-6">Tell us what you need and our China team will be in touch within 24 hours.</p>
            <Button asChild size="lg" variant="secondary" className="rounded-xl font-bold h-11 px-8">
              <Link href="#consult">Start your consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      <WhyChooseUsSection />
      <MarketingFooter />
    </div>
  );
}
