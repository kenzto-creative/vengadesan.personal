"use client";
import { useRef } from "react";
import { EDUCATION, EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import SectionHead from "../ui/SectionHead";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref, 0.62);
  const stops = [0.02, 0.62, 0.9];
  return (
    <section id="experience" className="section" aria-labelledby="ex-h">
      <div className="wrap">
        <SectionHead n="05" label="Experience" id="ex-h">My <em>journey.</em></SectionHead>
        <div className="tl-wrap" ref={ref}>
          <div className="spine" aria-hidden><i style={{ transform: `scaleY(${p})` }} /></div>
          <div className={`stop ${p >= stops[0] ? "lit" : ""}`}>
            <span className="dot" aria-hidden />
            <p className="mono yr">{EXPERIENCE.yearLabel}</p>
            <div>
              <h3>{EXPERIENCE.role}</h3>
              <p className="pl">{EXPERIENCE.company}, {EXPERIENCE.location} <span className="mono">· {EXPERIENCE.period}</span></p>
              <ul className="bl">{EXPERIENCE.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          </div>
          <div className={`stop ${p >= stops[1] ? "lit" : ""}`}>
            <span className="dot" aria-hidden />
            <p className="mono yr">{EDUCATION.yearLabel}</p>
            <div><h3>{EDUCATION.degree}</h3><p className="pl">{EDUCATION.institution}</p><p className="mono muted" style={{ fontSize: 13, marginTop: 6 }}>{EDUCATION.period}</p></div>
          </div>
          <div className={`stop next ${p >= stops[2] ? "lit" : ""}`}>
            <span className="dot" aria-hidden />
            <p className="mono yr">→</p>
            <div className="dash"><h3>Next — Your team?</h3></div>
          </div>
        </div>
      </div>
      <style>{`
        .tl-wrap{position:relative;margin-top:64px;padding-left:clamp(28px,5vw,64px)}
        .spine{position:absolute;left:6px;top:8px;bottom:8px;width:2px;background:var(--line)} .spine i{position:absolute;inset:0;background:var(--ink);transform-origin:top;will-change:transform}
        .stop{position:relative;display:grid;grid-template-columns:minmax(120px,200px) minmax(0,1fr);gap:24px;padding-bottom:64px;opacity:.28;transition:opacity .8s var(--ease)}
        .stop.lit{opacity:1} .dot{position:absolute;left:calc(-1 * clamp(28px,5vw,64px) + 1px);top:6px;width:12px;height:12px;border-radius:50%;background:var(--paper);box-shadow:inset 0 0 0 2px var(--faint);transition:all .6s var(--ease)}
        .stop.lit .dot{background:var(--ink);box-shadow:0 0 0 6px rgba(13,13,13,.08)}
        .yr{font-size:13px;color:var(--mute);padding-top:4px} .stop h3{font-size:clamp(24px,2.8vw,40px);font-weight:700;letter-spacing:-.04em;line-height:1.05}
        .pl{margin-top:8px;font-size:17px;color:var(--ink-2)} .pl .mono{font-size:12px;color:var(--mute)}
        .bl{margin-top:22px;display:grid;gap:12px;max-width:68ch} .bl li{position:relative;padding-left:20px;font-size:15px;line-height:1.6;color:var(--ink-2)} .bl li::before{content:"";position:absolute;left:0;top:.72em;width:8px;height:1px;background:var(--ink)}
        .dash{border:1.5px dashed var(--faint);border-radius:24px;padding:28px;max-width:420px} .stop.next{padding-bottom:0}
        @media(max-width:700px){.stop{grid-template-columns:1fr;gap:8px}}
      `}</style>
    </section>
  );
}
