import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], // Providers that require Prisma are left out of edge middleware
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                          nextUrl.pathname.startsWith("/register") || 
                          nextUrl.pathname.startsWith("/forgot-password") || 
                          nextUrl.pathname.startsWith("/reset-password");
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      
      if (isApiAuthRoute) return true;

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/api/auth/login-redirect", nextUrl));
        }
        return true;
      }

      const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard") || 
                               nextUrl.pathname.startsWith("/home") || 
                               nextUrl.pathname.startsWith("/profile") ||
                               nextUrl.pathname.startsWith("/onboarding");

      if (isProtectedRoute && !isLoggedIn) {
        if (nextUrl.pathname.startsWith("/onboarding")) {
          return Response.redirect(new URL("/register", nextUrl));
        }
        return false; // Redirects to signIn page
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
