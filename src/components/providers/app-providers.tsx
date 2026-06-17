"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { LoginModalProvider } from "@/components/providers/login-modal-provider";
import { FloatingActionsProvider } from "@/components/providers/floating-actions";
import { EnquiryPopup } from "@/components/marketing/enquiry-popup";
import { ScrollToTopOnNavigate } from "@/components/providers/scroll-to-top";
import { ConsoleFilter } from "@/components/providers/console-filter";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleFilter />
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <QueryProvider>
          <AuthProvider>
            <LoginModalProvider>
              <ScrollToTopOnNavigate />
              {children}
              <FloatingActionsProvider />
              <EnquiryPopup />
            </LoginModalProvider>
            <Toaster
              richColors
              position="top-right"
              toastOptions={{ className: "font-sans" }}
            />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </>
  );
}
