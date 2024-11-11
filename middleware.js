import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Define route permissions
const ROUTE_PERMISSIONS = {
  "/dashboard/admin": ["ADMINISTRATOR"],
  "/dashboard/evaluator": ["ADMINISTRATOR", "EVALUATOR"],
  "/dashboard": ["ADMINISTRATOR", "USER", "EVALUATOR"],
};

export async function middleware(request) {
  // Get token from cookie
  const token = request.cookies.get("auth-token")?.value;
  const path = request.nextUrl.pathname;

  // Check if the request is for the auth pages
  const isAuthPage = path.startsWith("/auth");

  // If there's no token and the page isn't an auth page, redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If there is a token
  if (token) {
    try {
      // Verify the token
      const payload = await verifyToken(token);

      // If on an auth page and token is valid, redirect to dashboard
      if (isAuthPage && payload) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // If token is invalid, remove it and redirect to login
      if (!payload) {
        const response = NextResponse.redirect(
          new URL("/auth/login", request.url)
        );
        response.cookies.delete("auth-token");
        return response;
      }

      // Check role-based access for protected routes
      for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
        if (path.startsWith(route) && !allowedRoles.includes(payload.role)) {
          // If user doesn't have required role, redirect to dashboard
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      }
    } catch (error) {
      // If token verification fails, remove it and redirect to login
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("auth-token");
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Apply to all routes except api, _next, and public assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
