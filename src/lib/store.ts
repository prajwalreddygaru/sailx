"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/lib/types";

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeRole: UserRole;
  setActiveRole: (r: UserRole) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      activeRole: "BUYER",
      setActiveRole: (r) => set({ activeRole: r })
    }),
    { name: "sailx-ui" }
  )
);
