import type { CSSProperties } from "react";
import type { LoginConfig, TenantConfig } from "@/config/tenants";
import { enterDemo } from "@/app/login/actions";
import { burstLines } from "@/lib/burst";
import { cn } from "@/lib/cn";
import { isHexColor } from "@/lib/theme";
import { AmbientAudio } from "./ambient-audio";
import { AmbientVideo } from "./ambient-video";
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
  return src ? <AmbientVideo src={src} poster={poster} /> : <div className={s.ambientFallback} aria-hidden />;
}

/**
 * Red-circle emblem for the split layout's left panel — a traditional
 * three-tomoe (mitsudomoe) motif, the generic swirl design that symbols like
 * the Sharingan reference are themselves built on. Drawn fresh as original
 * vector art (not a copy of any copyrighted character artwork) so the brand
 * mark is actually ownable.
 */
function TomoeEmblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="96" fill="var(--t-accent)" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#050506" strokeOpacity="0.3" strokeWidth="1.5" />
      {[0, 120, 240].map((angle) => (
        <path
          key={angle}
          d="M100,100 Q100,38 142,26 Q112,58 100,100 Z"
          fill="#050506"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="11" fill="var(--t-accent)" stroke="#050506" strokeWidth="3" />
    </svg>
  );
}

/**
 * Two-panel layout for `login.split`: brand + emblem on the left, boxed
 * Discord sign-in on the right, cut by a diagonal seam line — the "1% on
 * one side, Discord on the other" drafted reference. Opt-in per tenant;
 * `CinematicLogin` falls back to the classic centred panel when omitted.
 */
function SplitPanels({
  tenant,
  login,
  split,
}: {
  tenant: TenantConfig;
  login: Cinematic;
  split: NonNullable<Cinematic["split"]>;
}) {
  return (
    <div className={s.split}>
      <div className={s.seamLine} aria-hidden />

      <section className={cn(s.splitLeft, s.e3)} aria-hidden>
        <TomoeEmblem className={s.emblem} />
        <div className={s.heroTitle}>
          <span className={s.heroWord}>{login.heroWord}</span>
          {login.heroKana && <span className={s.heroKana}>{login.heroKana}</span>}
        </div>
        <p className={s.splitTagline}>{split.tagline}</p>
      </section>

      <section className={cn(s.splitRight, s.e2)}>
        <div className={s.panel}>
          <h1 className={s.signIn}>Sign in</h1>
          <p className={s.muted}>{tenant.loginBlurb}</p>
          <div className={s.e4}>
            {/* Demo: enters the sample portal. Real Discord OAuth arrives in Phase 2. */}
            <form action={enterDemo}>
              <button type="submit" className={s.button}>
                <LoginIcon />
                Continue with Discord
              </button>
            </form>
            <p className={s.demoNote}>Demo mode: Discord isn&rsquo;t connected yet. This opens the sample portal.</p>
            {login.ambientAudio && (
              <AmbientAudio youtubeId={login.ambientAudio.youtubeId} startSeconds={login.ambientAudio.startSeconds} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
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

      <main className={cn(s.main, login.split && s.mainSplit)}>
        {login.split ? (
          <SplitPanels tenant={tenant} login={login} split={login.split} />
        ) : (
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
        )}
      </main>

      <p className={s.footer}>{tenant.footerNote}</p>
    </div>
  );
}
