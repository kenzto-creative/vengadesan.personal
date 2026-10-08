"use client";
import { useRef, useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";
import SectionHead from "../ui/SectionHead";

function Hop({ text }: { text: string }) {
  return <>{text.split("").map((c, i) => c === " " ? " " : <span key={i} className="hop" aria-hidden onMouseEnter={(e) => { const el = e.currentTarget; el.classList.remove("go"); void el.offsetWidth; el.classList.add("go"); }}>{c}</span>)}</>;
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copy = async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); } catch { /* clipboard unavailable */ }
    setCopied(true); clearTimeout(t.current); t.current = setTimeout(() => setCopied(false), 2000);
  };
  const L = PROFILE.links;
  const rows: [string, string, string][] = [
    ["Phone", PROFILE.phone, PROFILE.phoneHref], ["LinkedIn", L.linkedin.label, L.linkedin.href], ["Portfolio", L.portfolio.label, L.portfolio.href],
    ["Behance", L.behance.label, L.behance.href], ["Dribbble", L.dribbble.label, L.dribbble.href],
  ];
  return (
    <section id="contact" className="section ct" aria-labelledby="ct-h">
      <div className="wrap">
        <span className="tag rv">07 — Contact</span>
        <h2 className="ct-h" id="ct-h" aria-label="Let's build something together.">
          <span aria-hidden><Hop text="Let's build" /></span><br />
          <span aria-hidden><Hop text="something " /><em className="serif-it"><Hop text="together." /></em></span>
        </h2>
        <div className="ct-mail rv">
          <a href={`mailto:${PROFILE.email}`} className="ct-em">{PROFILE.email}</a>
          <button className="btn btn-ghost" onClick={copy}>Copy</button>
          <span className="mono ct-ok" aria-live="polite">{copied ? "Copied ✓" : ""}</span>
        </div>
        <div className="ct-row">
          <ul className="ct-links">
            {rows.map(([k, v, h], i) => (
              <li key={k} className="rv" style={{ ["--i" as string]: i }}>
                <span className="mono">{k}</span>
                <a href={h} {...(h.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{v}</a>
              </li>
            ))}
          </ul>
          <svg className="badge" viewBox="0 0 120 120" role="img" aria-label="Say hello">
            <defs><path id="circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
            <g className="spin"><text className="mono" fontSize="10.5" letterSpacing="3.2"><textPath href="#circ">SAY HELLO · SAY HELLO · SAY HELLO · </textPath></text></g>
            <text x="60" y="68" textAnchor="middle" fontSize="26">↗</text>
          </svg>
        </div>
        <footer className="ft">
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <button onClick={() => scrollToTarget("top")}>Back to top ↑</button>
          <span>Built with Next.js</span>
        </footer>
      </div>
      <style>{`
        .ct-h{font-weight:700;letter-spacing:-.05em;line-height:.98;font-size:clamp(44px,10.5vw,170px);margin-top:4px}
        .hop{display:inline-block;transition:transform .5s var(--ease)} .hop.go{animation:hop .6s var(--ease)}
        @keyframes hop{30%{transform:translateY(-.14em)}to{transform:none}}
        .ct-mail{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:48px}
        .ct-em{font-size:clamp(20px,3.2vw,44px);font-weight:600;letter-spacing:-.04em;text-decoration:underline;text-underline-offset:8px;text-decoration-thickness:2px;overflow-wrap:anywhere}
        .ct-ok{font-size:13px;min-width:80px}
        .ct-row{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;margin-top:56px;flex-wrap:wrap}
        .ct-links{min-width:min(100%,420px);flex:1} .ct-links li{display:grid;grid-template-columns:100px 1fr;gap:12px;padding:14px 0;border-top:1px solid var(--line)}
        .ct-links .mono{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--mute);padding-top:3px} .ct-links a{overflow-wrap:anywhere;transition:opacity .3s} .ct-links a:hover{opacity:.55}
        .badge{width:132px;height:132px;flex:none} .badge text{fill:var(--ink)} .spin{transform-origin:60px 60px;animation:spin 18s linear infinite} @keyframes spin{to{transform:rotate(360deg)}}
        .ft{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-top:96px;padding-top:24px;border-top:1px solid var(--line);font-size:13px;color:var(--mute)} .ft button:hover{color:var(--ink)}
        @media(prefers-reduced-motion:reduce){.spin{animation:none}.hop.go{animation:none}}
      `}</style>
    </section>
  );
}
