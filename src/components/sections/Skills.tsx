"use client";
import { useMemo, useRef, useState } from "react";
import { FAMILIES, Family, SKILL_GROUPS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";
import TechLogo, { isBrand } from "../ui/TechLogo";
import { useInView } from "@/lib/hooks";

type El = { n: number; sym: string; name: string; family: Family };

function build(): El[] {
  const used = new Set<string>(); const out: El[] = []; let n = 1;
  (FAMILIES).forEach((f) => SKILL_GROUPS[f].forEach((name) => {
    const letters = name.replace(/[^A-Za-z]/g, "");
    let sym = "";
    outer: for (let i = 0; i < letters.length; i++) for (let j = i + 1; j < letters.length; j++) {
      const c = letters[i].toUpperCase() + letters[j].toLowerCase();
      if (!used.has(c)) { sym = c; break outer; }
    }
    used.add(sym); out.push({ n: n++, sym, name, family: f });
  }));
  return out;
}

const CTX = (e: El) => isBrand(e.name) ? `Listed under Tools on the résumé.` : `Listed under Core Competencies on the résumé.`;

export default function Skills() {
  const els = useMemo(build, []);
  const [fam, setFam] = useState<Family | null>(null);
  const [sel, setSel] = useState<El>(els[0]);
  const grid = useRef<HTMLDivElement>(null);
  const seen = useInView(grid, 0.1);
  const cols = 8;

  return (
    <section id="skills" className="section" aria-labelledby="sk-h">
      <div className="wrap">
        <SectionHead n="02" label="Skills" id="sk-h">What I work <em>with.</em></SectionHead>
        <p className="sk-sub rv">The periodic table of my stack — every element comes straight from the résumé.</p>
        <div className="sk-chips rv" role="group" aria-label="Filter by family">
          {FAMILIES.map((f) => (
            <button key={f} className={`chip ${fam === f ? "on" : ""}`} aria-pressed={fam === f} onClick={() => setFam(fam === f ? null : f)}>{f}</button>
          ))}
        </div>
        <div className="sk-layout">
          <div ref={grid} className={`sk-grid ${seen ? "in" : ""}`} role="list">
            {els.map((e, i) => (
              <button
                key={e.name} role="listitem" className={`tile ${fam && fam !== e.family ? "dim" : ""} ${sel.name === e.name ? "sel" : ""}`}
                style={{ ["--d" as string]: `${((Math.floor(i / cols)) + (i % cols)) * 40}ms` }}
                onMouseEnter={() => setSel(e)} onFocus={() => setSel(e)} onClick={() => setSel(e)} aria-label={`${e.name}, ${e.family}`}
              >
                <span className="mono t-n">{String(e.n).padStart(2, "0")}</span>
                <span className="t-s">{e.sym}</span>
                <span className="t-name">{e.name}</span>
              </button>
            ))}
          </div>
          <aside className="sk-insp card" aria-live="polite">
            <div key={sel.name} className="pop"><TechLogo name={sel.name} size={150} /></div>
            <p className="mono insp-fam">{sel.family} · №{String(sel.n).padStart(2, "0")}</p>
            <h3>{sel.name}</h3>
            <p className="muted">{CTX(sel)}</p>
          </aside>
        </div>
      </div>
      <style>{`
        .sk-sub{margin-top:20px;color:var(--mute);max-width:46ch}
        .sk-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:32px}
        .chip{height:38px;padding:0 16px;border-radius:99px;font-size:14px;font-weight:500;box-shadow:inset 0 0 0 1px rgba(13,13,13,.2);transition:all .4s var(--ease)}
        .chip:hover{box-shadow:inset 0 0 0 1px var(--ink)} .chip.on{background:var(--ink);color:#fff}
        .sk-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:32px;margin-top:36px;align-items:start}
        .sk-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:8px}
        .tile{aspect-ratio:1;background:var(--card);border-radius:14px;box-shadow:inset 0 0 0 1px var(--line);padding:8px;display:flex;flex-direction:column;align-items:flex-start;text-align:left;opacity:0;transform:translateY(14px) scale(.96);transition:opacity .8s var(--ease) var(--d),transform .8s var(--ease) var(--d),background .35s,color .35s,box-shadow .35s;min-width:0;overflow:hidden}
        .sk-grid.in .tile{opacity:1;transform:none}
        .sk-grid.in .tile.dim{opacity:.18;transition-delay:0s}
        .tile.sel,.tile:hover{background:var(--ink);color:#fff;box-shadow:none}
        .t-n{font-size:9px;color:var(--faint)} .t-s{font-size:clamp(18px,2.2vw,30px);font-weight:700;letter-spacing:-.04em;margin-top:auto;line-height:1}
        .t-name{font-size:clamp(7px,.75vw,10px);line-height:1.15;margin-top:4px;color:inherit;opacity:.7;width:100%;overflow-wrap:anywhere}
        .sk-insp{position:sticky;top:96px;padding:28px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px}
        .sk-insp h3{font-size:24px;font-weight:700;letter-spacing:-.03em}
        .insp-fam{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--mute);margin-top:8px}
        .pop{animation:pop .7s var(--ease)} @keyframes pop{from{transform:scale(.7);opacity:0}to{transform:none;opacity:1}}
        @media(max-width:1000px){.sk-layout{grid-template-columns:minmax(0,1fr)}.sk-insp{position:static}.sk-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.t-name{font-size:10px}}
      `}</style>
    </section>
  );
}
