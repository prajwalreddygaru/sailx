"use client";
import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { PhoneCall, Mail, MapPin } from "lucide-react";

const staticServices = [
  { href: "/services/end-to-end-product-sourcing", label: "End-to-End Product Sourcing" },
  { href: "/services/china-side-sourcing-support", label: "China-Side Sourcing Support" },
  { href: "/services/translation-business-communication", label: "Translation & Business Communication" },
  { href: "/services/factory-inspections-quality-checks", label: "Factory Inspections & Quality Checks" },
  { href: "/services/supplier-payment-support", label: "Supplier Payment Support" },
  { href: "/services/price-negotiation-support", label: "Price Negotiation Support" }
];

export function MarketingFooter() {
  const [serviceLinks, setServiceLinks] = React.useState(staticServices);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/services");
        if (!r.ok) return;
        const arr = await r.json();
        if (Array.isArray(arr) && arr.length) {
          setServiceLinks(
            arr.map((s: any) => ({
              href: `/services/${s.slug ?? s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
              label: s.title
            }))
          );
        }
      } catch { /* ignore — static fallback remains */ }
    })();
  }, []);

  const sections = [
    {
      title: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: "/about/founder", label: "Founder" },
        { href: "/contact", label: "Contact" }
      ]
    },
    {
      title: "Our Services",
      links: serviceLinks
    },
    {
      title: "Resources",
      links: [
        { href: "/blog", label: "Blog" },
        { href: "/guides", label: "Guides" },
        { href: "/sourcing-reports", label: "Sourcing Reports" },
        { href: "/trust-center", label: "Trust Center" }
      ]
    },
    {
      title: "Policies",
      links: [
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/payment-policy", label: "Payment Policy" },
        { href: "/cancellation-policy", label: "Cancellation Policy" },
        { href: "/refund-policy", label: "Refund Policy" },
        { href: "/visa-policy", label: "Visa Policy" }
      ]
    }
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/footer-bg.jpg')" }}
      />
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/80 to-black/90" />
      {/* Red top accent line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />

      <div className="relative z-10 container py-10 sm:py-16">
        <div className="grid gap-6 lg:gap-10 grid-cols-2 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4 space-y-2">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="inline-flex"
            >
              <Logo />
            </button>
            <h3 className="text-lg font-bold text-white leading-relaxed">
              Chongqing Hongxi Culture Media Co.Ltd
            </h3>
            <div className="mt-3 space-y-2 text-white/85">
              <a
                href="tel:+918660752291"
                className="flex items-center gap-3 hover:text-red-500 transition-colors"
              >
                <span className="h-9 w-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                  <PhoneCall className="h-4 w-4 text-white fill-none stroke-white" />
                </span>
                <span className="text-sm">+91 866 075 2291</span>
              </a>
              <a
                href="mailto:info@sailxchina.com"
                className="flex items-center gap-3 hover:text-red-500 transition-colors"
              >
                <span className="h-9 w-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-white fill-none stroke-white" />
                </span>
                <span className="text-sm">info@sailxchina.com</span>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=No.%20239%2C%20Jianxin%20East%20Road%2C%20Wulidian%20Street%2C%20Liangjiang%20District%2C%20Chongqing%20City%2C%20China"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-red-500 transition-colors max-w-sm"
              >
                <span className="h-9 w-9 rounded-full bg-red-600 flex items-center justify-center mt-0.5 shrink-0">
                  <MapPin className="h-4 w-4 text-white fill-none stroke-white" />
                </span>
                <span className="text-sm leading-relaxed pt-1">No. 239, Jianxin East Road, Wulidian Street, Liangjiang District, Chongqing City, China</span>
              </a>
            </div>
          </div>
          {sections.map((s) => (
            <div key={s.title} className="lg:col-span-2">
              <div className="text-sm font-bold mb-3 sm:mb-4 text-white tracking-wide">{s.title}</div>
              <ul className="space-y-2 sm:space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/55 hover:text-red-400 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-xs text-white/40 order-3 sm:order-1">
            © {new Date().getFullYear()} SailX Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 order-1 sm:order-2">
            <a
              href="https://m.facebook.com/saahilhussain0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Facebook"
            >
              <img src="/images/FB LOGO.png" alt="Facebook" className="h-8 w-8 object-contain" />
            </a>
            <a
              href="https://www.youtube.com/@Saahilkannada"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Youtube"
            >
              <img src="/images/yt logo.png" alt="YouTube" className="h-8 w-8 object-contain" />
            </a>
            <a
              href="https://www.instagram.com/sailxchina"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <img src="/images/insta logo.png" alt="Instagram" className="h-8 w-8 object-contain" />
            </a>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "918660752291"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              aria-label="WhatsApp"
            >
              <img src="/images/whatsapp_logo.png" alt="WhatsApp" className="h-8 w-8 object-contain rounded-full bg-white" />
            </a>
          </div>
          <p className="text-xs text-white/40 order-2 sm:order-3">
            Made in India · Sourcing from the world
          </p>
        </div>
      </div>
    </footer>
  );
}
