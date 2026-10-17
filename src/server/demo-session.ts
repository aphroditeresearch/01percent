import "server-only";

import { cookies } from "next/headers";

const COOKIE = "demo-entered";

/**
 * ⚠️ DEMO GATE — NOT AUTHENTICATION.
 *
 * Tracks whether this visitor has clicked through the login screen, purely so
 * the member area isn't reachable without seeing it first. Phase 2 replaces
 * this with a real Supabase Auth session.
 */
export async function hasEnteredDemo(): Promise<boolean> {
  return (await cookies()).has(COOKIE);
}

export async function setDemoEntered(): Promise<void> {
  (await cookies()).set(COOKIE, "1", { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function clearDemoEntered(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
