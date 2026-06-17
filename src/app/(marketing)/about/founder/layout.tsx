import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the Founder",
  description: "Meet Saahil Hussain, founder of SailX China. HSK Level 6 certified, 8+ years on-ground in China, 300K+ community reach.",
};

export default function FounderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
