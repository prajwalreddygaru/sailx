import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, Globe2, Users, BadgeCheck, CheckCircle2, Instagram, Youtube, Mail } from "lucide-react";

export default function FounderAboutPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="pt-20 md:pt-28 pb-12 md:pb-16 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden border-b">
        <div className="absolute -top-16 right-1/3 h-64 w-64 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-black uppercase tracking-widest">
              About the Founder
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mt-4">
              Saahil Hussain
              <span className="block text-foreground/80 text-xl md:text-2xl font-semibold mt-2">Founder, SAILX China</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Bridging India and China through language, culture and business. Helping entrepreneurs source, verify and scale with confidence.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-xl font-bold h-11 px-6">
                <Link href="/consultation">Book a Consultation</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl h-11 px-6">
                <Link href="/#social">Follow our journey</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-bold">HSK Level 6</div>
                  <div className="text-xs text-muted-foreground">Fluent Mandarin</div>
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
                <Globe2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-bold">8+ Years</div>
                  <div className="text-xs text-muted-foreground">On-ground in China</div>
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-bold">300K+</div>
                  <div className="text-xs text-muted-foreground">Community reach</div>
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-4 flex items-center gap-3">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-bold">Govt. Recognitions</div>
                  <div className="text-xs text-muted-foreground">Awards & features</div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-5 order-first md:order-last">
            <div className="relative w-full max-w-sm md:max-w-md mx-auto md:ml-auto mt-0 md:mt-8 mb-6 md:mb-0">
              <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-tr from-red-500/20 via-orange-500/20 to-transparent blur-2xl" />
              <img
                src="/images/founder-hero.png"
                alt="Founder portrait"
                className="relative w-full h-auto rounded-3xl border object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-black">My Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hi, I&rsquo;m <span className="font-semibold text-foreground">Saahil Hussain</span>, founder of <span className="font-semibold text-foreground">SAILX China</span>. Originally from Karnataka, India. I&rsquo;ve lived in China for over eight years, building a trusted bridge between the two countries through language, culture and business.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I first came to China in 2017 for my undergraduate studies in Nanchang city. After graduation I moved to Chongqing city to complete an intensive program in Mandarin. Today, I&rsquo;m <span className="font-semibold">HSK Level 6</span> certified and work closely with Chinese businesses, government organizations and local communities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Along the way, I&rsquo;ve built a community of <span className="font-semibold">300,000+</span> followers across platforms, collaborated with local governments, and produced content that showcases China&rsquo;s culture, innovation and opportunities to global audiences.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="text-xl font-black mb-3">What we do at SAILX China</h3>
                <ul className="grid sm:grid-cols-1 gap-3 text-sm">
                  <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>End‑to‑end product sourcing, from discovery to delivery</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>On‑ground factory verification and quality inspections</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Supplier negotiations and secure, transparent payments</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Business tours and trade fair visits tailored to your category</span></li>
                </ul>
              </div>
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="text-xl font-black mb-3">Why work with us</h3>
                <ul className="grid sm:grid-cols-1 gap-3 text-sm">
                  <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Fluent Mandarin and deep cultural context reduce friction</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Trusted local network across key manufacturing hubs</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Transparent process with milestone‑based updates</span></li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /><span>Proven outcomes for startups and established importers</span></li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-black mb-4">Milestones</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-2xl border bg-card p-5">
                  <div className="text-xs font-bold text-muted-foreground">2017 - 2023</div>
                  <div className="font-semibold mt-1">Undergrad in Nanchang</div>
                  <p className="text-sm text-muted-foreground mt-1">Built a foundation in Chinese language and culture.</p>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <div className="text-xs font-bold text-muted-foreground">2020 - now</div>
                  <div className="font-semibold mt-1">Content & Community</div>
                  <p className="text-sm text-muted-foreground mt-1">Grew a 300K+ audience; collaborated with local governments.</p>
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <div className="text-xs font-bold text-muted-foreground">2023 - now</div>
                  <div className="font-semibold mt-1">Founded SAILX China</div>
                  <p className="text-sm text-muted-foreground mt-1">Providing sourcing, tours and end‑to‑end import solutions.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-black mb-3">Quick Facts</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> HSK Level 6 (Fluent Mandarin)</li>
                <li className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-primary" /> 8+ years on‑ground in China</li>
                <li className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> 300K+ followers across platforms</li>
                <li className="flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Recognized by local governments</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-black mb-3">Connect</h3>
              <div className="flex flex-wrap items-center gap-3">
                <a href="mailto:info@sailxchina.com" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"><Mail className="h-4 w-4" /> Email</a>
                <a href="https://www.instagram.com/saahilkannada" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"><Instagram className="h-4 w-4" /> Instagram</a>
                <a href="https://www.youtube.com/@Saahilkannada" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"><Youtube className="h-4 w-4" /> YouTube</a>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-black mb-2">Work with us</h3>
              <p className="text-sm text-muted-foreground mb-4">Looking to source from China or plan a business tour?</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="rounded-xl">
                  <Link href="/#services">Book Consultation</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/tours">Explore Tours</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
