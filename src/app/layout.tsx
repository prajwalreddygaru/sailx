import type { Metadata } from "next";
import "./globals.css";
import { Sora } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SITE_URL } from "@/lib/site-url";


export const metadata: Metadata = {
  title: {
    default: "SailX — Global Sourcing & Import, Reimagined",
    template: "%s · SailX"
  },
  description:
    "SailX is the operating system for cross-border procurement. Source directly from verified Chinese suppliers through trusted agents, with full visibility from RFQ to delivery.",
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "512x512", type: "image/png" },
      { url: "/images/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "SailX — Global Sourcing & Import, Reimagined",
    description:
      "Source from verified suppliers in China with sourcing agents, real-time chat, quotation comparison, and end-to-end shipment tracking.",
    type: "website"
  }
};

const display = Sora({ subsets: ["latin"], weight: ["600", "700", "800"] , variable: "--font-display" });

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} font-sans antialiased min-h-screen`}>
        <div className="overflow-x-hidden">
          <AppProviders>{children}</AppProviders>
        </div>
      </body>
    </html>
  );
}
