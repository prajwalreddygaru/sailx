import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const lastModified = new Date();

  const routes = [
    "",
    "/about",
    "/about/founder",
    "/contact",
    "/tours",
    "/consultation",
    "/blog",
    "/guides",
    "/sourcing-reports",
    "/trust-center",
    "/terms",
    "/payment-policy",
    "/cancellation-policy",
    "/refund-policy",
    "/visa-policy",
  ];

  const services = [
    "end-to-end-product-sourcing",
    "china-side-sourcing-support",
    "translation-business-communication",
    "factory-inspections-quality-checks",
    "supplier-payment-support",
    "price-negotiation-support",
  ];

  const staticPages = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const servicePages = services.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages];
}
