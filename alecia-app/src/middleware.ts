import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const SUDO_COOKIE_NAME = "alecia_sudo_session";

/**
 * Middleware for authentication and role-based access control.
 * 
 * Protects:
 * - /admin routes via NextAuth
 * - /sudo routes via custom cookie (independent of NextAuth)
 */
export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  
  // =========================================================================
  // SUDO PANEL PROTECTION (Independent of NextAuth)
  // =========================================================================
  if (pathname.startsWith("/sudo")) {
    const isOnSudoLogin = pathname === "/sudo/login";
    const sudoCookie = req.cookies.get(SUDO_COOKIE_NAME);
    const isSudoAuthenticated = sudoCookie?.value === "authenticated";
    
    // Allow access to sudo login page
    if (isOnSudoLogin) {
      if (isSudoAuthenticated) {
        return NextResponse.redirect(new URL("/sudo", req.url));
      }
      return NextResponse.next();
    }
    
    // Protect all other sudo routes
    if (!isSudoAuthenticated) {
      return NextResponse.redirect(new URL("/sudo/login", req.url));
    }
    
    return NextResponse.next();
  }
  
  // =========================================================================
  // ADMIN PANEL PROTECTION (NextAuth)
  // =========================================================================
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as { role?: string } | undefined)?.role;
  const isOnAdmin = pathname.startsWith("/admin");
  const isOnAdminLogin = pathname === "/admin/login";

  // Allow access to login page
  if (isOnAdminLogin) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Protect all admin routes - require authentication
  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Role-based protection for sensitive admin routes
  // Only "admin" role can access these
  const adminOnlyRoutes = [
    "/admin/users",
    "/admin/settings",
    "/admin/api-keys",
  ];
  
  const isAdminOnlyRoute = adminOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminOnlyRoute && userRole !== "admin") {
    console.warn(
      `[Middleware] Unauthorized access attempt to ${pathname} by role: ${userRole}`
    );
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/sudo/:path*"],
};
