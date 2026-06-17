import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact SailX",
  description: "Get in touch with SailX for product sourcing, factory verification, and business tours in China.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
