import type { Metadata } from "next";
import { CinematicLogin } from "@/components/login/cinematic-login";
import { EditorialLogin } from "@/components/login/editorial-login";
import { getTenant } from "@/server/tenant";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const tenant = await getTenant();
  return tenant.login.style === "cinematic" ? (
    <CinematicLogin tenant={tenant} login={tenant.login} />
  ) : (
    <EditorialLogin tenant={tenant} />
  );
}
