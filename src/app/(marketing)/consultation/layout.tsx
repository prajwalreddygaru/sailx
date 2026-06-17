import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Book a free consultation with SailX. Get expert advice on sourcing from China, supplier verification, and import strategy.",
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
