import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Tours & Trade Fairs",
  description: "Explore SailX business tours and trade fairs to China. Visit factories, meet suppliers, and grow your import business.",
};

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
