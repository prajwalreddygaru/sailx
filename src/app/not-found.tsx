import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-background">
      <div className="container max-w-xl mx-auto p-6 text-center border rounded-2xl bg-card shadow-sm">
        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-red-500/15 text-red-600 flex items-center justify-center">
          <Search className="h-6 w-6" />
        </div>
        <h1 className="text-2xl md:text-3xl font-black mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-5">
          The page you are looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button asChild className="font-semibold">
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild variant="outline" className="font-semibold">
            <Link href="/tours">Browse Tours</Link>
          </Button>
          <Button asChild variant="outline" className="font-semibold">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
