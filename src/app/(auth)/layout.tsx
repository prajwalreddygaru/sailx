import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative flex flex-col p-6 md:p-8">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex-1 flex items-center justify-center py-8 md:py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} SailX · <Link href="/" className="hover:text-foreground">Home</Link>
        </div>
      </div>
      <div className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-background">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-1/4 right-0 h-64 w-64 rounded-full bg-brand-500/10 blur-2xl" />
        <div className="absolute bottom-1/4 left-0 h-48 w-48 rounded-full bg-brand-700/10 blur-2xl" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-xl text-white">
            <div className="font-display text-5xl font-semibold tracking-tight leading-tight mb-4">SailX</div>
            <div className="text-xl text-white/85 leading-relaxed">
              Easy business travel. Easy import from China.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
