import type { CSSProperties } from "react";
import type { LoginConfig, TenantConfig } from "@/config/tenants";
import { enterDemo } from "@/app/login/actions";
import { burstLines } from "@/lib/burst";
import { cn } from "@/lib/cn";
import { isHexColor } from "@/lib/theme";
import { AmbientAudio } from "./ambient-audio";
import { AmbientLoopVideo } from "./ambient-loop-video";
import s from "./cinematic.module.css";

type Cinematic = Extract<LoginConfig, { style: "cinematic" }>;

const LINES = burstLines();

const STREAKS = [
  { left: "10%", top: "70%", delay: "2.4s" },
  { left: "30%", top: "85%", delay: "4.1s", width: 340, blue: true },
  { left: "55%", top: "60%", delay: "5.6s", width: 180 },
  { left: "0%", top: "95%", delay: "7.3s" },
  { left: "40%", top: "75%", delay: "9.2s", width: 220, blue: true },
];

function LoginIcon() {
  // Arrow entering a door frame.
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M3 12h11" />
      <path d="m10 8 4 4-4 4" />
    </svg>
  );
}

function Backdrop({ src, poster }: { src?: string; poster?: string }) {
  return src ? <AmbientLoopVideo src={src} poster={poster} /> : <div className={s.ambientFallback} aria-hidden />;
}

export function CinematicLogin({ tenant, login }: { tenant: TenantConfig; login: Cinematic }) {
  const style = {
    "--streak": isHexColor(login.streakColor) ? login.streakColor : tenant.theme.accent,
  } as CSSProperties;

  return (
    <div className={s.root} style={style}>
      {/* Intro burst. Decorative, plays once per page load, skipped for reduced motion. */}
      <div className={s.intro} aria-hidden>
        <div className={cn(s.shutter, s.shutterTop)} />
        <div className={cn(s.shutter, s.shutterBottom)} />
        <div className={s.lines}>
          <div className={s.linesInner}>
            {LINES.map((l, i) => (
              <div
                key={i}
                className={s.line}
                style={{
                  transform: `rotate(${l.angle}deg) translateX(${l.offset}px)`,
                  width: l.length,
                  height: l.thickness,
                  opacity: l.opacity,
                }}
              />
            ))}
          </div>
        </div>
        <div className={s.flash} />
        <div className={s.introStack}>
          <div className={s.introTitle}>
            <span className={s.introWord}>{login.heroWord}</span>
            {login.heroKana && <span className={s.introKana}>{login.heroKana}</span>}
          </div>
          <div className={s.introSub}>{login.introSubtitle}</div>
        </div>
        <div className={s.seam} />
        <div className={cn(s.flash, s.flashLate)} />
      </div>

      <div className={s.ambient} aria-hidden>
        <Backdrop src={login.video?.ambient} poster={login.video?.poster} />
        <div className={s.shade} />
        <div className={cn(s.halftone, s.halftoneTopRight)} />
        <div className={cn(s.halftone, s.halftoneBottomLeft)} />
        {STREAKS.map((st, i) => (
          <div
            key={i}
            className={cn(s.streak, st.blue && s.streakBlue)}
            style={{ left: st.left, top: st.top, animationDelay: st.delay, width: st.width }}
          />
        ))}
      </div>

      <header className={cn(s.header, s.e1)}>
        <span className={s.wordmark}>{tenant.wordmark}</span>
      </header>

      <main className={s.main}>
        <div className={s.mainInner}>
          <section className={cn(s.heroArt, s.e3)} aria-hidden>
            <div className={s.heroTitle}>
              <span className={s.heroWord}>{login.heroWord}</span>
              {login.heroKana && <span className={s.heroKana}>{login.heroKana}</span>}
            </div>
            <p className={s.heroCaption}>{login.introSubtitle}</p>
          </section>

          <div className={s.panel}>
            <h1 className={cn(s.signIn, s.e2)}>Sign in</h1>
            <p className={cn(s.muted, s.e2)}>{tenant.loginBlurb}</p>
            <div className={s.e4}>
              {/* Demo: enters the sample portal. Real Discord OAuth arrives in Phase 2. */}
              <form action={enterDemo}>
                <button type="submit" className={s.button}>
                  <LoginIcon />
                  Continue with Discord
                </button>
              </form>
              <p className={s.demoNote}>
                Demo mode: Discord isn&rsquo;t connected yet. This opens the sample portal.
              </p>
              {login.ambientAudio && (
                <AmbientAudio youtubeId={login.ambientAudio.youtubeId} startSeconds={login.ambientAudio.startSeconds} />
              )}
            </div>
          </div>
        </div>
      </main>

      <p className={s.footer}>{tenant.footerNote}</p>
    </div>
  );
}
