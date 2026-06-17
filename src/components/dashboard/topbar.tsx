"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOutAndRedirect } from "@/lib/sign-out";
import { Search, HelpCircle, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function DashboardTopbar({ title }: { title?: string }) {
  const { data: session } = useSession();
  const name  = session?.user?.name  ?? "User";
  const email = session?.user?.email ?? "";
  const role  = (session?.user as any)?.role as string ?? "";

  const settingsHref =
    role === "ADMIN" ? "/dashboard/admin" :
    role === "AGENT" ? "/dashboard/agent" :
    "/dashboard/buyer";

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="h-full px-6 flex items-center gap-4">
        {title && (
          <div className="text-sm font-medium text-muted-foreground hidden md:block">{title}</div>
        )}
        <div className="flex-1 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders, products..."
              className="pl-9 h-9 bg-muted/40 border-muted"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors">
                <Avatar className="h-7 w-7">
                  <AvatarFallback>{initials(name)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-medium leading-tight">{name}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight capitalize">{role.toLowerCase()}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{initials(name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{name}</div>
                  <div className="text-xs text-muted-foreground truncate font-normal">{email}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={settingsHref}>
                  <User className="h-3.5 w-3.5" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => signOutAndRedirect("/login")}
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
