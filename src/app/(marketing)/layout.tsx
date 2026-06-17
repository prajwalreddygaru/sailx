import { MarketingNavbar } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MarketingNavbar />
      <main className="pt-0">{children}</main>
      <MarketingFooter />
    </>
  );
}
