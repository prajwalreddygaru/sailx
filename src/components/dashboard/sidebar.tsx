"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Package,
  Ship,
  Bell,
  Settings,
  Plus,
  ShieldCheck,
  Truck,
  Box,
  BarChart3,
  Users,
  Building2,
  AlertTriangle,
  DollarSign,
  Search,
  Video,
  TestTube,
  Award,
  ChevronsLeft,
  ShoppingBag,
  Image,
  LayoutGrid,
  Globe,
  Ticket,
  Star,
  HelpCircle,
  BookOpen,
  KeyRound,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SidebarRole = "buyer" | "agent" | "supplier" | "admin";

const navByRole: Record<
  SidebarRole,
  {
    section: string;
    items: { href: string; label: string; icon: any; badge?: string }[];
  }[]
> = {
  buyer: [
    {
      section: "Overview",
      items: [
        { href: "/dashboard/buyer", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/buyer/orders", label: "My Orders", icon: Package },
        { href: "/dashboard/buyer/events", label: "My Events", icon: Ticket },
        { href: "/dashboard/buyer/bookings", label: "Booking History", icon: ShoppingBag }
      ]
    },
    {
      section: "Quick Actions",
      items: [
        { href: "/", label: "Browse Events", icon: Globe }
      ]
    }
  ],
  agent: [
    {
      section: "Overview",
      items: [
        { href: "/dashboard/agent", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/agent/rfqs", label: "Assigned RFQs", icon: FileText }
      ]
    },
    {
      section: "Sourcing",
      items: [
        { href: "/dashboard/agent/sourcing", label: "Sourcing", icon: Search },
        {
          href: "/dashboard/agent/verification",
          label: "Verification",
          icon: ShieldCheck
        }
      ]
    },
    {
      section: "Account",
      items: [
        { href: "/dashboard/agent/settings", label: "Settings", icon: Settings }
      ]
    }
  ],
  supplier: [
    {
      section: "Overview",
      items: [
        { href: "/dashboard/supplier", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/supplier/rfqs", label: "RFQs Received", icon: FileText }
      ]
    },
    {
      section: "Catalog",
      items: [
        { href: "/dashboard/supplier/products", label: "Products", icon: Box },
        {
          href: "/dashboard/supplier/certifications",
          label: "Certifications",
          icon: Award
        }
      ]
    },
    {
      section: "Orders",
      items: [
        { href: "/dashboard/supplier/orders", label: "Orders", icon: Package },
        { href: "/dashboard/supplier/shipments", label: "Shipments", icon: Truck }
      ]
    },
    {
      section: "Account",
      items: [
        { href: "/dashboard/supplier/settings", label: "Settings", icon: Settings }
      ]
    }
  ],
  admin: [
    {
      section: "Overview",
      items: [
        { href: "/dashboard/admin", label: "Dashboard", icon: LayoutDashboard }
      ]
    },
    {
      section: "Events & Tours",
      items: [
        { href: "/dashboard/admin/events",    label: "Events & Tours", icon: Ticket },
        { href: "/dashboard/admin/catalogue", label: "Catalogue",      icon: BookOpen },
        { href: "/dashboard/admin/enquiries", label: "Enquiries",      icon: MessageSquare },
        { href: "/dashboard/admin/consultations", label: "Consultations", icon: MessageSquare },
      ]
    },
    {
      section: "Orders",
      items: [
        { href: "/dashboard/admin/orders", label: "All Orders", icon: ShoppingBag }
      ]
    },
    {
      section: "Content",
      items: [
        { href: "/dashboard/admin/banners", label: "Banners & Posters", icon: Image },
        { href: "/dashboard/admin/memories", label: "Memories", icon: Image },
        { href: "/dashboard/admin/services", label: "Services", icon: LayoutGrid },
        { href: "/dashboard/admin/reviews", label: "Reviews", icon: Star },
        { href: "/dashboard/admin/faqs", label: "FAQs", icon: HelpCircle },
        { href: "/dashboard/admin/social", label: "Social Media", icon: Video },
      ]
    },
    {
      section: "Operations",
      items: [
        { href: "/dashboard/admin/logins", label: "Login Logs", icon: KeyRound },
        {
          href: "/dashboard/admin/assignments",
          label: "RFQ Assignment",
          icon: FileText
        },
        {
          href: "/dashboard/admin/disputes",
          label: "Disputes",
          icon: AlertTriangle
        },
        {
          href: "/dashboard/admin/fraud",
          label: "Fraud Monitoring",
          icon: ShieldCheck
        }
      ]
    },
    {
      section: "Account",
      items: [
        { href: "/dashboard/admin/settings", label: "API Settings", icon: Settings }
      ]
    }
  ]
};

export function DashboardSidebar({ role }: { role: SidebarRole }) {
  const pathname = usePathname();
  const sections = navByRole[role];

  const newActionMap: Partial<Record<SidebarRole, { href: string; label: string }>> = {
    agent: { href: "/dashboard/agent/sourcing", label: "Add Supplier" },
    supplier: { href: "/dashboard/supplier/products", label: "Add Product" }
    // admin and buyer intentionally have no quick action button
  };
  const newAction = newActionMap[role];

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/30 sticky top-0 h-screen">
      <div className="h-16 px-5 flex items-center border-b border-border">
        <Logo />
      </div>
      {newAction && (
        <div className="p-3">
          <Button asChild variant="gradient" className="w-full justify-start">
            <Link href={newAction.href}>
              <Plus className="h-4 w-4" />
              {newAction.label}
            </Link>
          </Button>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4 space-y-5">
        {sections.map((s) => (
          <div key={s.section}>
            <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {s.section}
            </div>
            <div className="space-y-0.5">
              {s.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== `/dashboard/${role}` &&
                    pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative",
                      active
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId={`sidebar-active-${role}`}
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-primary rounded-r"
                      />
                    )}
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
