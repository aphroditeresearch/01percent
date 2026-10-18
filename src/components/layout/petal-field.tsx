import type { CSSProperties } from "react";
import type { TenantConfig } from "@/config/tenants";
import { sakuraPetals } from "@/lib/petals";
import { isHexColor } from "@/lib/theme";
import s from "./petal-field.module.css";

const PETALS = sakuraPetals();

/** One branch + a handful of blossom clusters, positioned by hand to read as a corner sprig. */
const BRANCH_LINES = [
  { top: 18, right: 40, width: 150, rotate: -38 },
  { top: 52, right: 90, width: 70, rotate: -75 },
  { top: 70, right: 10, width: 60, rotate: -15 },
];

const BRANCH_BLOOMS = [
  { top: 6, right: 148, size: 26, opacity: 0.85 },
  { top: 2, right: 118, size: 18, opacity: 0.6 },
  { top: 22, right: 158, size: 16, opacity: 0.55 },
  { top: 38, right: 118, size: 22, opacity: 0.75 },
  { top: 44, right: 150, size: 14, opacity: 0.5 },
  { top: 56, right: 70, size: 18, opacity: 0.7 },
  { top: 68, right: 92, size: 12, opacity: 0.45 },
  { top: 78, right: 24, size: 20, opacity: 0.8 },
  { top: 92, right: 4, size: 13, opacity: 0.5 },
];

/**
 * Decorative layer fixed behind every page's content (not just Home — it's
 * rendered once in SidebarShell so the theme carries across Library,
 * Lessons, Homework, Journal, Booking and Account too). Opt in per tenant
 * via `home: { style: "sakura" }` — tenants that omit it render nothing
 * here. Two variants:
 * - Default: falling sakura petals + a blossom-branch corner flourish (see
 *   tempo.ts).
 * - `home.overlayVideo` set: flat black background + a looping blend-mode
 *   video instead (see onepercent.ts, HomeConfig.overlayVideo doc).
 */
export function PetalField({ tenant }: { tenant: TenantConfig }) {
  if (tenant.home?.style !== "sakura") return null;
  const color = tenant.home.petalColor && isHexColor(tenant.home.petalColor) ? tenant.home.petalColor : tenant.theme.accent;
  const vars = { "--petal": color } as CSSProperties;

  // Opt-in replacement for the whole decorative layer below: solid black,
  // plus a blend-mode video in the same fixed/behind-content slot, instead
  // of the petal/glow/branch graphic. See HomeConfig.overlayVideo doc.
  if (tenant.home.overlayVideo) {
    return (
      <div className={s.fieldVideo} aria-hidden>
        <video className={s.overlayVideo} src={tenant.home.overlayVideo.src} autoPlay muted loop playsInline />
      </div>
    );
  }

  return (
    <div className={s.field} aria-hidden>
      <div className={s.glow} style={{ ...vars, top: "-12%", right: "-6%", width: 420, height: 420 }} />
      <div className={s.glow} style={{ ...vars, bottom: "-10%", left: "-8%", width: 320, height: 320 }} />

      <div className={s.branch} style={vars}>
        {BRANCH_LINES.map((l, i) => (
          <div
            key={i}
            className={s.branchLine}
            style={{ top: `${l.top}%`, right: `${l.right}px`, width: l.width, height: 3, transform: `rotate(${l.rotate}deg)` }}
          />
        ))}
        {BRANCH_BLOOMS.map((b, i) => (
          <div
            key={i}
            className={s.bloom}
            style={{ top: `${b.top}%`, right: `${b.right}px`, width: b.size, height: b.size, opacity: b.opacity }}
          />
        ))}
      </div>

      {PETALS.map((p, i) => (
        <span
          key={i}
          className={s.petal}
          style={
            {
              "--petal": color,
              "--left": `${p.left}%`,
              "--size": `${p.size}px`,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--drift": `${p.drift}px`,
              "--rotate": `${p.rotate}deg`,
              "--opacity": p.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
