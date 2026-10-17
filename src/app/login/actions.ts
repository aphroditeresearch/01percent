"use server";

import { redirect } from "next/navigation";
import { clearDemoEntered, setDemoEntered } from "@/server/demo-session";

/** Demo stand-in for Discord OAuth: marks the visitor as "in" and sends them home. */
export async function enterDemo() {
  await setDemoEntered();
  redirect("/");
}

/** Demo stand-in for sign-out: forgets the visitor so they see the login screen again. */
export async function leaveDemo() {
  await clearDemoEntered();
  redirect("/login");
}
