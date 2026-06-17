import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details",
  description: "View event details, itinerary, and book your spot with SailX China business tours.",
};

export default function EventLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
