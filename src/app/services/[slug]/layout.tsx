import { ServicePageExit } from "@/components/marketing/service-page-exit";

export default function ServiceDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServicePageExit />
      {children}
    </>
  );
}
