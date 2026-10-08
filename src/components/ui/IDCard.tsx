"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE, SKILL_GROUPS } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/hooks";

const WHAT_I_DO = [...SKILL_GROUPS["Product & UX"], ...SKILL_GROUPS["UI & Systems"], ...SKILL_GROUPS["SaaS & Product"]];

/** Lanyard + flipping ID card with a damped pendulum driven by pointer velocity. */
export default function IDCard({ boundsRef }: { boundsRef: React.RefObject<HTMLElement | null> }) {
  const swing = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const el = swing.current, host = boundsRef.current;
    if (!el || !host) return;
    const rm = prefersReducedMotion();
    let angle = 0, vel = 0, force = 0, last = { x: 0, t: 0 }, raf = 0, visible = true;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      if (last.t) force += Math.max(-1, Math.min(1, (e.clientX - last.x) / Math.max(8, now - last.t))) * 0.9;
      last = { x: e.clientX, t: now };
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf && !rm) raf = requestAnimationFrame(loop); });
    const t0 = performance.now();
    function loop(t: number) {
      raf = 0; if (!visible) return;
      vel += force; force = 0;
      vel += -angle * 0.06; vel *= 0.965;               // spring + damping
      angle += vel;
      const idle = Math.sin((t - t0) / 1400) * 1.4;      // idle sway
      el!.style.transform = `rotate(${(angle + idle).toFixed(3)}deg)`;
      raf = requestAnimationFrame(loop);
    }
    host.addEventListener("pointermove", move); io.observe(host);
    if (!rm) raf = requestAnimationFrame(loop);
    return () => { host.removeEventListener("pointermove", move); io.disconnect(); cancelAnimationFrame(raf); };
  }, [boundsRef]);

  return (
    <div className="idw">
      <div className="id-swing" ref={swing}>
        <div className="id-cord" aria-hidden />
        <div className="id-strap" aria-hidden>
          <div className="id-strap-in"><span>VENGADESAN R. · PRODUCT DESIGNER · VENGADESAN R. · PRODUCT DESIGNER · </span><span>VENGADESAN R. · PRODUCT DESIGNER · VENGADESAN R. · PRODUCT DESIGNER · </span></div>
        </div>
        <div className="id-clip" aria-hidden />
        <div
          className={`id-card ${flip ? "flip" : ""}`} role="button" tabIndex={0} aria-pressed={flip}
          aria-label="Designer ID card. Press to flip between front and back."
          onPointerEnter={(e) => e.pointerType === "mouse" && setFlip(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setFlip(false)}
          onClick={(e) => { if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") setFlip((f) => !f); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlip((f) => !f); } }}
        >
          <div className="id-face id-front">
            <div className="id-band mono">DESIGNER ID</div>
            <div className="id-photo"><span className="id-halo" aria-hidden /><img src="/portrait-bust.webp" width={128} height={156} alt={`Portrait of ${PROFILE.name}`} /></div>
            <div className="id-meta">
              <h3>{PROFILE.name}</h3>
              <p>{PROFILE.role}</p>
              <dl className="mono"><div><dt>Dept.</dt><dd>Product Design</dd></div></dl>
            </div>
            <div className="id-foot"><div className="id-bar" aria-hidden /><div className="id-holo" aria-hidden /></div>
          </div>
          <div className="id-face id-back">
            <h3>What I do</h3>
            <ul>{WHAT_I_DO.map((w) => <li key={w}>{w}</li>)}</ul>
            <p className="id-sig serif-it">Vengadesan R.</p>
            <p className="id-found mono">If found, say hello · {PROFILE.email}</p>
          </div>
        </div>
      </div>
      <style>{`
        .idw{position:relative;display:flex;justify-content:center;height:100%;min-height:560px}
        .idw{--cord:calc(clamp(96px,14vh,160px) + 210px)}.id-swing{position:absolute;top:calc(-1 * var(--cord));display:flex;flex-direction:column;align-items:center;transform-origin:50% 0;will-change:transform}
        .id-cord{width:1px;height:var(--cord);background:var(--faint)}
        .id-strap{width:30px;height:56px;background:var(--ink);border-radius:3px;overflow:hidden;position:relative}
        .id-strap-in{position:absolute;inset:0;display:flex;flex-direction:column;animation:strapup 14s linear infinite}
        .id-strap-in span{writing-mode:vertical-rl;color:#fff;font-size:7px;letter-spacing:.2em;font-weight:600;padding:4px 0 0 11px;white-space:nowrap;height:auto;flex:none;font-family:var(--f-mono)}
        @keyframes strapup{to{transform:translateY(-50%)}}
        .id-clip{width:22px;height:20px;border-radius:4px 4px 8px 8px;background:var(--faint);box-shadow:inset 0 0 0 1px rgba(0,0,0,.2);margin-bottom:-4px;position:relative;z-index:2}
        .id-card{width:300px;height:404px;position:relative;perspective:1200px;cursor:pointer;outline-offset:6px;border-radius:24px}
        .id-face{position:absolute;inset:0;background:var(--card);border-radius:24px;box-shadow:inset 0 0 0 1px var(--line),0 30px 60px -24px rgba(0,0,0,.28);backface-visibility:hidden;-webkit-backface-visibility:hidden;transition:transform .9s var(--ease);overflow:hidden}
        .id-front{transform:rotateY(0)} .id-back{transform:rotateY(180deg);padding:22px 22px 16px;display:flex;flex-direction:column}
        .id-card.flip .id-front{transform:rotateY(-180deg)} .id-card.flip .id-back{transform:rotateY(0)}
        .id-band{background:var(--ink);color:#fff;font-size:11px;letter-spacing:.3em;text-align:center;padding:12px 0}
        .id-photo{position:relative;width:128px;height:156px;margin:22px auto 0;border-radius:18px;padding:3px;background:linear-gradient(145deg,#d8d6d1,#8a8883 50%,#e9e6e0)}
        .id-photo img{width:100%;height:100%;object-fit:cover;border-radius:15px;display:block;transition:transform .8s var(--ease)}
        .id-photo{overflow:hidden} .id-card:hover .id-photo img{transform:scale(1.07)}
        .id-halo{position:absolute;inset:-18px;background:radial-gradient(closest-side,rgba(13,13,13,.1),transparent);z-index:-1}
        .id-meta{text-align:center;margin-top:16px;padding-inline:16px}
        .id-meta h3{font-size:22px;font-weight:700;letter-spacing:-.03em} .id-meta p{font-size:14px;color:var(--mute);margin-top:2px}
        .id-meta dl{margin-top:12px;font-size:11px;display:flex;justify-content:center} .id-meta dl div{display:flex;gap:10px} .id-meta dt{color:var(--faint);text-transform:uppercase}
        .id-foot{position:absolute;left:20px;right:20px;bottom:16px;display:flex;align-items:flex-end;justify-content:space-between;gap:14px}
        .id-bar{flex:1;height:34px;background:repeating-linear-gradient(90deg,var(--ink) 0 2px,transparent 2px 4px,var(--ink) 4px 5px,transparent 5px 8px,var(--ink) 8px 11px,transparent 11px 13px)}
        .id-holo{width:34px;height:34px;border-radius:50%;background:conic-gradient(#e9e6e0,#a9a6a0,#fff,#77756f,#e9e6e0);box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
        .id-back h3{font-size:20px;font-weight:700;letter-spacing:-.03em;margin-bottom:10px}
        .id-back ul{display:flex;flex-wrap:wrap;gap:4px;align-content:flex-start;overflow:hidden;flex:1}
        .id-back li{font-size:9.5px;padding:3px 8px;border-radius:99px;box-shadow:inset 0 0 0 1px var(--line);white-space:nowrap}
        .id-sig{font-size:28px;margin-top:8px;color:var(--ink)} .id-found{font-size:9.5px;color:var(--mute);margin-top:4px}
        @media(prefers-reduced-motion:reduce){.id-strap-in{animation:none}}
        @media(max-width:1000px){.idw{--cord:70px;min-height:520px}.id-swing{top:0}}
      `}</style>
    </div>
  );
}
