"use client";
import { useEffect, useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  const sec = useRef<HTMLElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const visible = useRef(true);

  // autoplay muted (browser policy); try sound after gesture unlock
  useEffect(() => {
    const v = vid.current; if (!v) return;
    const tryPlay = () => {
      v.muted = true;
      setSoundOn(false);
      v.play().then(() => setBlocked(true)).catch(() => setBlocked(true));
    };
    if (v.readyState >= 2) tryPlay();
    else {
      v.addEventListener("canplay", tryPlay, { once: true });
      v.load();
    }
    return () => v.removeEventListener("canplay", tryPlay);
  }, []);

  // unlock sound on the first gesture
  useEffect(() => {
    if (!blocked) return;
    const unlock = () => {
      const v = vid.current; if (!v) return;
      v.muted = false;
      v.play().then(() => { setSoundOn(true); setBlocked(false); }).catch(() => { v.muted = true; });
      ["pointerdown", "keydown", "touchend"].forEach((t) => window.removeEventListener(t, unlock));
    };
    ["pointerdown", "keydown", "touchend"].forEach((t) => window.addEventListener(t, unlock, { once: true }));
    return () => ["pointerdown", "keydown", "touchend"].forEach((t) => window.removeEventListener(t, unlock));
  }, [blocked]);

  // pause (and so silence) when < 35% of the hero is visible
  useEffect(() => {
    const el = sec.current, v = vid.current; if (!el || !v) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.intersectionRatio >= 0.35;
      if (visible.current) v.play().catch(() => {}); else v.pause();
    }, { threshold: [0, 0.35, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = vid.current; if (!v) return;
    v.muted = soundOn; setSoundOn(!soundOn); setBlocked(false);
    if (visible.current) v.play().catch(() => {});
  };

  return (
    <section id="top" ref={sec} className="hero" aria-label="Introduction">
      <div className="hero-ghost" aria-hidden>
        <div className="hero-track">
          <div className="hero-track-set"><span>VENGADESAN</span><span>VENGADESAN</span><span>VENGADESAN</span><span>VENGADESAN</span></div>
          <div className="hero-track-set"><span>VENGADESAN</span><span>VENGADESAN</span><span>VENGADESAN</span><span>VENGADESAN</span></div>
        </div>
      </div>
      <div className="hero-vidwrap">
        <video ref={vid} className="hero-vid" muted loop playsInline autoPlay preload="auto" poster="/portrait-full.webp?v=15" aria-label={`Animated intro of ${PROFILE.name}, speaking a short self-introduction`}>
          <source src="/hero/hero.mp4?v=15" type="video/mp4" />
        </video>
      </div>
      <div className="hero-bar wrap">
        <div className="hero-copy">
          <p className="mono hero-kicker rv">{PROFILE.name}</p>
          <h1 className="hero-h rv-mask"><span>Product<br />Designer.</span></h1>
          <p className="hero-sub rv" style={{ ["--i" as string]: 1 }}>{PROFILE.quote}</p>
        </div>
        <div className="hero-cta rv" style={{ ["--i" as string]: 2 }}>
          <button className="btn btn-primary" onClick={() => scrollToTarget("work")}>Explore work <span aria-hidden>→</span></button>
          <div className="hero-cta-row">
            <button className="btn btn-ghost" onClick={() => scrollToTarget("contact")}>Let&apos;s talk</button>
            <a className="btn btn-ghost" href={PROFILE.resume} download>Résumé ↓</a>
          </div>
        </div>
      </div>
      <button className={`hero-snd ${blocked ? "ping" : ""}`} onClick={toggle} aria-label={soundOn ? "Turn intro sound off" : "Turn intro sound on"} aria-pressed={soundOn}>
        {soundOn ? <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><rect x="3" y="2" width="3.5" height="12" rx="1" fill="#fff" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="#fff" /></svg>
          : <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="M4 2.5v11l9-5.5z" fill="#fff" /></svg>}
      </button>
      <style>{`
        .hero{--hero-bg:#f7f7f7;position:relative;min-height:100svh;overflow:hidden;background:var(--hero-bg)}
        .hero-ghost{position:absolute;left:0;right:0;top:18%;z-index:1;overflow:hidden;user-select:none;pointer-events:none}
        .hero-track{display:flex;width:max-content;animation:hero-run 32s linear infinite}
        .hero-track-set{display:flex;gap:.16em;padding-right:.16em;font-weight:800;letter-spacing:-.06em;line-height:.8;font-size:clamp(72px,18vw,300px);color:#d4d4d4;white-space:nowrap}
        @keyframes hero-run{to{transform:translateX(-50%)}}
        .hero-vidwrap{position:absolute;inset:0;z-index:2;display:grid;place-items:end center;pointer-events:none}
        .hero-vid{height:100%;width:auto;object-fit:contain;object-position:center bottom;display:block;margin-inline:auto}
        .hero-bar{position:absolute;z-index:3;left:0;right:0;bottom:clamp(28px,5.5vh,64px);display:flex;align-items:flex-end;justify-content:space-between;gap:28px;pointer-events:none}
        .hero-bar>*{pointer-events:auto}
        .hero-copy{display:flex;flex-direction:column;align-items:flex-start;gap:14px;max-width:min(11ch,44vw)}
        .hero-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute)}
        .hero-h{font-weight:700;letter-spacing:-.05em;line-height:.92;font-size:clamp(36px,5.4vw,76px);overflow:visible}
        .hero-sub{font-size:14px;line-height:1.45;color:var(--mute);max-width:22em}
        .hero-cta{display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex-shrink:0}
        .hero-cta-row{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:10px}
        .hero-snd{position:absolute;z-index:4;right:var(--gutter);top:22%;width:46px;height:46px;border-radius:50%;background:var(--ink);display:grid;place-items:center;transition:transform .5s var(--ease)}
        .hero-snd:hover{transform:scale(1.08)}
        .hero-snd.ping::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(13,13,13,.35);animation:ping 1.8s var(--ease) infinite}
        @keyframes ping{to{box-shadow:0 0 0 18px rgba(13,13,13,0)}}
        @media(max-width:700px){
          .hero-bar{flex-direction:column;align-items:flex-start;bottom:clamp(20px,4vh,36px)}
          .hero-copy{max-width:100%}
          .hero-cta,.hero-cta-row{align-items:flex-start;justify-content:flex-start}
          .hero-snd{top:84px}
          .hero-ghost{top:14%}
          .hero-track-set{font-size:clamp(52px,22vw,140px)}
          .hero-h{font-size:clamp(36px,12vw,64px)}
        }
      `}</style>
    </section>
  );
}
