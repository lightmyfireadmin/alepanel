import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getMaintenanceMode } from "@/lib/actions/sudo";

const SUDO_COOKIE_NAME = "alecia_sudo_session";

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const sudoCookie = req.cookies.get(SUDO_COOKIE_NAME);
  const isSudoAuthenticated = sudoCookie?.value === "authenticated";

  // Skip for maintenance page itself and public assets
  if (pathname === "/maintenance" || pathname.startsWith("/assets") || pathname.startsWith("/icon.svg")) {
    return NextResponse.next();
  }

  // Check Maintenance Mode
  const isMaintenance = await getMaintenanceMode();
  if (isMaintenance && !pathname.startsWith("/sudo") && !isSudoAuthenticated) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }
  
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

  // Protect all admin routes - require authentication and specific roles
  if (isOnAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // Require role "admin" or "sudo" for ANY /admin access
    if (userRole !== "admin" && userRole !== "sudo") {
      console.warn(
        `[Middleware] Unauthorized access attempt to ${pathname} by role: ${userRole}`
      );
      // Redirect to home page or show forbidden page?
      // For now, redirect to home page to avoid infinite loops if we redirected to login
      // or we could signOut but that requires client side action.
      // Redirecting to root is safer.
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/sudo/:path*"],
};
