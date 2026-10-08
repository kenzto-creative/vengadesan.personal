"use client";
import { useState } from "react";
import { PROJECTS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

/* Pure CSS/JSX grayscale mock — clearly labelled as illustrative, never a real screenshot. */
function Mock({ i }: { i: number }) {
  const bar = (w: string, h = 8, d = 0.14) => <i style={{ display: "block", width: w, height: h, borderRadius: 4, background: `rgba(13,13,13,${d})` }} />;
  const body = [
    <div key="0" style={{ display: "grid", gridTemplateColumns: "54px 1fr", gap: 10, height: "100%" }}><div style={{ display: "grid", gap: 6, alignContent: "start" }}>{bar("100%", 8, .5)}{bar("80%")}{bar("90%")}{bar("70%")}</div><div style={{ display: "grid", gap: 8, alignContent: "start" }}><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>{[0, 1, 2].map((k) => <b key={k} style={{ height: 38, borderRadius: 8, background: "rgba(13,13,13,.07)" }} />)}</div><div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 70 }}>{[40, 62, 35, 80, 55, 90, 48].map((h, k) => <b key={k} style={{ flex: 1, height: `${h}%`, borderRadius: 4, background: k === 5 ? "var(--ink)" : "rgba(13,13,13,.16)" }} />)}</div>{bar("100%", 6)}{bar("85%", 6)}</div></div>,
    <div key="1" style={{ display: "grid", gap: 8 }}><div style={{ display: "flex", justifyContent: "space-between" }}>{bar("26%", 8, .5)}{bar("34%", 8)}</div><b style={{ height: 70, borderRadius: 10, background: "rgba(13,13,13,.08)" }} />{bar("70%", 12, .5)}{bar("92%", 6)}{bar("60%", 6)}<span style={{ width: 70, height: 22, borderRadius: 99, background: "var(--ink)" }} /></div>,
    <div key="2" style={{ width: 92, margin: "0 auto", height: "100%", borderRadius: 16, boxShadow: "inset 0 0 0 2px rgba(13,13,13,.3)", padding: 8, display: "grid", gap: 6, alignContent: "start" }}>{bar("50%", 7, .5)}<b style={{ height: 40, borderRadius: 8, background: "rgba(13,13,13,.08)" }} />{bar("90%", 6)}{bar("70%", 6)}{bar("80%", 6)}</div>,
    <div key="3" style={{ width: 84, height: 84, margin: "0 auto", borderRadius: 24, boxShadow: "inset 0 0 0 3px rgba(13,13,13,.35)", display: "grid", placeItems: "center", alignContent: "center", gap: 6 }}><span className="mono" style={{ fontSize: 18, fontWeight: 600 }}>10:09</span>{bar("46px", 6)}</div>,
    <div key="4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}><b style={{ gridRow: "span 2", height: 110, borderRadius: 12, background: "var(--ink)" }} /><b style={{ height: 51, borderRadius: 12, background: "rgba(13,13,13,.1)" }} /><b style={{ height: 51, borderRadius: 12, background: "rgba(13,13,13,.18)" }} /></div>,
  ];
  return <div className="mock" aria-hidden><div className="mock-in">{body[i]}</div><span className="mono mock-lbl">Illustrative UI</span></div>;
}

export default function Work() {
  const [open, setOpen] = useState(0);
  return (
    <section id="work" className="section" aria-labelledby="wk-h">
      <div className="wrap">
        <SectionHead n="03" label="Selected work" id="wk-h">Selected <em>work.</em></SectionHead>
        <div className="wk" role="list">
          {PROJECTS.map((p, i) => {
            const on = open === i;
            return (
              <article key={p.title} role="listitem" className={`pn ${on ? "on" : ""}`}>
                <button className="pn-hd" aria-expanded={on} aria-controls={`pn-${i}`} onClick={() => setOpen(i)} onMouseEnter={() => matchMedia("(hover:hover)").matches && setOpen(i)}>
                  <span className="mono pn-i">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pn-t">{p.title}</span>
                </button>
                <div id={`pn-${i}`} className="pn-body" role="region" aria-label={p.title} hidden={false}>
                  <div className="pn-in">
                    <Mock i={i} />
                    <div>
                      <p className="pn-count"><b>{p.count}</b><span className="mono">featured</span></p>
                      <p className="pn-desc">{p.desc}</p>
                      {"extra" in p && <p className="muted pn-ex">{p.extra}</p>}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <style>{`
        .wk{display:flex;gap:10px;height:clamp(440px,64vh,600px);margin-top:56px}
        .pn{flex:1 1 0;min-width:0;position:relative;background:var(--card);border-radius:26px;box-shadow:inset 0 0 0 1px var(--line);overflow:hidden;transition:flex-grow .9s var(--ease),box-shadow .6s var(--ease)}
        .pn.on{flex-grow:5.2;box-shadow:inset 0 0 0 1px var(--line),0 40px 80px -40px rgba(0,0,0,.3)}
        .pn-hd{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-start;padding:24px;text-align:left;width:100%}
        .pn-i{font-size:12px;color:var(--mute)}
        .pn-t{font-size:20px;font-weight:700;letter-spacing:-.03em;writing-mode:vertical-rl;transform:rotate(180deg);align-self:flex-start;transition:opacity .4s var(--ease)}
        .pn.on .pn-t{writing-mode:horizontal-tb;transform:none;position:absolute;left:24px;bottom:24px;font-size:clamp(26px,3vw,44px);letter-spacing:-.04em;width:calc(100% - 48px);max-width:14ch;line-height:1}
        .pn-body{position:absolute;inset:0;padding:24px 24px 110px;opacity:0;pointer-events:none;transition:opacity .5s var(--ease)}
        .pn.on .pn-body{opacity:1;transition-delay:.35s;pointer-events:auto}
        .pn-in{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;margin-top:34px;height:calc(100% - 34px)}
        .pn-count{display:flex;align-items:baseline;gap:8px} .pn-count b{font-size:clamp(48px,6vw,88px);font-weight:700;letter-spacing:-.05em;line-height:1}
        .pn-count span{font-size:11px;text-transform:uppercase;color:var(--mute)}
        .pn-desc{margin-top:14px;font-size:17px;line-height:1.45;color:var(--ink-2);max-width:32ch} .pn-ex{margin-top:12px;font-size:14px;line-height:1.55;max-width:38ch}
        .mock{position:relative;border-radius:16px;background:var(--paper);box-shadow:inset 0 0 0 1px var(--line);padding:16px;overflow:hidden;min-height:180px}
        .mock-in{height:calc(100% - 20px)} .mock-lbl{position:absolute;left:14px;bottom:10px;font-size:9.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}
        @media(max-width:900px){
          .wk{flex-direction:column;height:auto}.pn{flex:none;height:68px;transition:height .8s var(--ease)}.pn.on{height:430px}
          .pn-hd{flex-direction:row;align-items:center;gap:14px;padding:0 20px}.pn-t{writing-mode:horizontal-tb;transform:none;font-size:18px}
          .pn.on .pn-t{position:static;font-size:20px;max-width:none;width:auto}.pn.on .pn-hd{height:68px;bottom:auto}.pn-hd{inset:0 0 auto 0;height:68px}
          .pn-body{padding:76px 20px 20px}.pn-in{grid-template-columns:1fr;margin-top:0;height:auto;gap:14px}
        }
      `}</style>
    </section>
  );
}
