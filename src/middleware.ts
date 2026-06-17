import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = (req as any).nextauth?.token;
    const role = token?.role as string;

    /* Role-based dashboard guards */
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }
    if (pathname.startsWith("/dashboard/agent") && role !== "AGENT" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/buyer", req.url));
    }

    /* /dashboard -> role-specific dashboard */
    if (pathname === "/dashboard") {
      const dest =
        role === "ADMIN" ? "/dashboard/admin" :
        role === "AGENT" ? "/dashboard/agent" :
        "/dashboard/buyer";
      return NextResponse.redirect(new URL(dest, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
