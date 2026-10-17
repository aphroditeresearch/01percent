import type { Metadata } from "next";
import { CinematicLogin } from "@/components/login/cinematic-login";
import { EditorialLogin } from "@/components/login/editorial-login";
import { IntroVideoGate } from "@/components/login/intro-video-gate";
import { getTenant } from "@/server/tenant";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const tenant = await getTenant();
  const login =
    tenant.login.style === "cinematic" ? (
      <CinematicLogin tenant={tenant} login={tenant.login} />
    ) : (
      <EditorialLogin tenant={tenant} />
    );

  // Opt-in per tenant (see config/tenants/types.ts) — omitted for every
  // existing tenant, so this changes nothing for them.
  return (
    <>
      {tenant.introVideo && <IntroVideoGate src={tenant.introVideo.src} poster={tenant.introVideo.poster} />}
      {login}
    </>
  );
}
