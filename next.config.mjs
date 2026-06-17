import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appLinkPath = path.join(__dirname, "src/components/ui/app-link.tsx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/mainlogo.png" },
      { pathname: "/manilogo.png" },
      { pathname: "/images/**" },
      { pathname: "/footer-bg.jpg" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "flagcdn.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "assets.mixkit.co" },
    ],
  },
  async rewrites() {
    return [
      { source: "/manilogo.png", destination: "/mainlogo.png" },
    ];
  },
  turbopack: {
    resolveAlias: {
      "next/link": appLinkPath,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "next/link": appLinkPath,
    };
    return config;
  },
};

export default nextConfig;
