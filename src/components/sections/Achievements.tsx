"use client";
import { useEffect, useRef, useState } from "react";
import { ACHIEVEMENTS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

export default function Achievements() {
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [prog, setProg] = useState(0);
  const [mid, setMid] = useState(0);

  useEffect(() => {
    const measure = () => { const t = track.current; if (t) setTravel(Math.max(0, t.scrollWidth - window.innerWidth)); };
    measure();
    const ro = new ResizeObserver(measure); if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const o = outer.current, t = track.current; if (!o || !t) return;
      const p = travel > 0 ? Math.min(1, Math.max(0, -o.getBoundingClientRect().top / travel)) : 0;
      t.style.transform = `translate3d(${-p * travel}px,0,0)`;
      setProg(p);
      const c = window.innerWidth / 2; let best = 0, bd = Infinity;
      t.querySelectorAll<HTMLElement>("[data-card]").forEach((el, i) => { const r = el.getBoundingClientRect(); const d = Math.abs(r.left + r.width / 2 - c); if (d < bd) { bd = d; best = i; } });
      setMid(best);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [travel]);

  return (
    <section id="achievements" ref={outer} className="ach" style={{ height: `calc(100svh + ${travel}px)` }} aria-labelledby="ac-h">
      <div className="ach-pin">
        <div className="wrap ach-hd">
          <SectionHead n="06" label="Achievements" id="ac-h">What I&apos;ve <em>achieved.</em></SectionHead>
          <div className="ach-bar" role="progressbar" aria-label="Achievements scroll progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(prog * 100)}><i style={{ transform: `scaleX(${prog})` }} /></div>
        </div>
        <div className="ach-track" ref={track}>
          {ACHIEVEMENTS.map((a, i) => (
            <article key={a.label} data-card className={`ac ${mid === i ? "mid" : ""}`} tabIndex={0}>
              <header><span className="mono">{String(i + 1).padStart(2, "0")} / {String(ACHIEVEMENTS.length).padStart(2, "0")}</span><span className="mono lb">{a.label}</span></header>
              <div><h3>{a.label}</h3><p>{a.text}</p></div>
            </article>
          ))}
          <p className="ach-end serif-it" aria-hidden>and growing →</p>
        </div>
      </div>
      <style>{`
        .ach{position:relative}
        .ach-pin{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:clamp(20px,4vh,48px);overflow:hidden}
        .ach-hd{width:100%;display:flex;flex-direction:column;gap:20px} .ach-hd .h2{font-size:clamp(36px,5vw,76px)} .ach-hd .tag{margin-bottom:12px}
        .ach-bar{height:2px;background:var(--line);max-width:320px;position:relative;overflow:hidden} .ach-bar i{position:absolute;inset:0;background:var(--ink);transform-origin:left}
        .ach-track{display:flex;gap:24px;padding:24px var(--gutter) 40px;width:max-content;will-change:transform;align-items:center}
        .ac{flex:none;width:clamp(340px,40vw,540px);height:clamp(260px,36vh,310px);background:var(--card);border-radius:28px;box-shadow:inset 0 0 0 1px var(--line),0 12px 30px -22px rgba(0,0,0,.2);padding:26px 28px;display:flex;flex-direction:column;justify-content:space-between;transition:transform .8s var(--ease),box-shadow .8s var(--ease)}
        .ac.mid{transform:translateY(-12px);box-shadow:inset 0 0 0 1px var(--line),0 0 60px -10px rgba(13,13,13,.1),0 40px 70px -34px rgba(0,0,0,.4)}
        .ac header{display:flex;justify-content:space-between;font-size:12px;color:var(--mute)} .lb{text-transform:uppercase;letter-spacing:.06em}
        .ac h3{font-size:clamp(24px,2.4vw,34px);font-weight:700;letter-spacing:-.04em;line-height:1.05} .ac p{margin-top:10px;font-size:14.5px;line-height:1.55;color:var(--ink-2)}
        .ach-end{flex:none;font-size:clamp(40px,6vw,88px);padding-inline:40px 20vw;white-space:nowrap}
        @media(max-width:700px){.ac{width:min(84vw,360px);height:auto;min-height:280px;gap:18px}}
      `}</style>
    </section>
  );
}
