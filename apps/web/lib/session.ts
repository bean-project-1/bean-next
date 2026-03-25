// =======================================================
// BEAN — Simple Cookie Session Helper
// apps/web/lib/session.ts
// =======================================================
import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE = 'bean_user_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Set the userId cookie on an API response.
 * Use this after creating / finding a user.
 */
export function setUserCookie(res: NextResponse, userId: string): void {
  res.cookies.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    // secure: process.env.NODE_ENV === 'production',
  });
}

/**
 * Read the userId from the request cookies.
 * Returns null if not present.
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  return req.cookies.get(SESSION_COOKIE)?.value ?? null;
}

/**
 * Read the userId from Server Component cookies.
 * Returns null if not present.
 */
export function getUserIdFromCookies(): string | null {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}
