import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { onboardingCompleted: true }
    });

    if (!user) {
      // If the user was deleted from DB but still has a valid JWT cookie,
      // redirect to signout to destroy the cookie and prevent infinite redirect loops.
      return NextResponse.redirect(new URL("/api/auth/signout?callbackUrl=/login", request.url));
    }

    if (user.onboardingCompleted) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  } catch (error) {
    console.error("Login redirect error:", error);
    return NextResponse.redirect(new URL("/home", request.url)); // Fallback
  }
}
