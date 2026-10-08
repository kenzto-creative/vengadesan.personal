"use client";
import { useRef } from "react";
import { PROFILE } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import IDCard from "../ui/IDCard";

const facts: [string, React.ReactNode][] = [
  ["Location", PROFILE.location],
  ["Education", "Bachelor of Commerce, National College, Trichy"],
  ["Experience", PROFILE.experienceYears],
  ["Current role", PROFILE.role],
  ["Company", PROFILE.company],
  ["Languages", PROFILE.languages],
  ["Email", <a key="e" href={`mailto:${PROFILE.email}`} className="u">{PROFILE.email}</a>],
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const L = PROFILE.links;
  return (
    <section id="about" ref={ref} className="section about" aria-labelledby="about-h">
      <div className="wrap">
        <SectionHead n="01" label="About" id="about-h">About <em>me.</em></SectionHead>
        <div className="ab-grid">
          <div className="ab-l">
            <p className="ab-hi rv">Hi, I&apos;m Vengadesan.</p>
            <p className="ab-sum rv" style={{ ["--i" as string]: 1 }}>{PROFILE.resumeSummary}</p>
            <div className="ab-btns rv" style={{ ["--i" as string]: 2 }}>
              <a className="btn btn-primary" href={PROFILE.resume} download>Résumé</a>
              <a className="btn btn-ghost" href={L.linkedin.href} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="btn btn-ghost" href={L.behance.href} target="_blank" rel="noopener noreferrer">Behance</a>
              <a className="btn btn-ghost" href={L.dribbble.href} target="_blank" rel="noopener noreferrer">Dribbble</a>
            </div>
          </div>
          <div className="ab-c"><IDCard boundsRef={ref} /></div>
          <aside className="ab-r card rv" aria-label="Quick facts">
            <h3>Quick facts</h3>
            <dl>{facts.map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}</dl>
            <blockquote className="serif-it">&ldquo;{PROFILE.quote}&rdquo;</blockquote>
          </aside>
        </div>
      </div>
      <style>{`
        .about{overflow:clip}
        .ab-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px minmax(0,1fr);gap:clamp(20px,3vw,48px);margin-top:56px;align-items:stretch}
        .ab-hi{font-size:clamp(24px,2.6vw,34px);font-weight:700;letter-spacing:-.035em}
        .ab-sum{margin-top:18px;font-size:clamp(15px,1.15vw,17px);line-height:1.65;color:var(--ink-2)}
        .ab-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
        .ab-r{padding:28px;display:flex;flex-direction:column;gap:20px}
        .ab-r h3{font-size:22px;font-weight:700;letter-spacing:-.03em}
        .ab-r dl{display:flex;flex-direction:column}
        .ab-r dl>div{display:grid;grid-template-columns:92px 1fr;gap:12px;padding:11px 0;border-top:1px solid var(--line);font-size:14px}
        .ab-r dt{color:var(--mute);font-size:11px;text-transform:uppercase;letter-spacing:.06em;padding-top:3px}
        .ab-r dd{overflow-wrap:anywhere}
        .ab-r blockquote{margin-top:auto;font-size:24px;line-height:1.2}
        .u{text-decoration:underline;text-underline-offset:3px}
        @media(max-width:1000px){.ab-grid{grid-template-columns:minmax(0,1fr)}.ab-c{order:3;min-height:520px;position:relative;margin-top:60px}.ab-r{order:2}}
      `}</style>
    </section>
  );
}
