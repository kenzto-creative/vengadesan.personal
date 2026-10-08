import { CERTIFICATIONS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

export default function Certifications() {
  return (
    <section id="certifications" className="section cert" aria-labelledby="ce-h">
      <div className="wrap cert-grid">
        <div className="cert-l">
          <SectionHead n="04" label="Certifications" id="ce-h">Always <em>learning.</em></SectionHead>
          <p className="mono rv cert-count">{CERTIFICATIONS.length} certifications</p>
        </div>
        <ol className="cert-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="rv" style={{ ["--i" as string]: i }}>
              <div className="row" tabIndex={0}>
                <span className="mono ci">{String(i + 1).padStart(2, "0")} —</span>
                <span className="cm"><strong>{c.title}</strong><span>{c.issuer}</span></span>
                <span className="mono cp">{c.period}</span>
                <span className="car" aria-hidden>↗</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .cert{background:var(--card);border-block:1px solid var(--line)}
        .cert-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:48px;align-items:start}
        .cert-l{position:sticky;top:110px} .cert-count{margin-top:24px;color:var(--mute);font-size:13px}
        .row{position:relative;display:grid;grid-template-columns:48px 1fr auto 28px;gap:16px;align-items:center;padding:28px 22px;border-top:1px solid var(--line);overflow:hidden;isolation:isolate;transition:color .5s var(--ease)}
        .cert-list li:last-child .row{border-bottom:1px solid var(--line)}
        .row::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:left;transition:transform .7s var(--ease);z-index:-1}
        .row:hover,.row:focus-visible{color:#fff} .row:hover::before,.row:focus-visible::before{transform:scaleX(1)}
        .cm{display:flex;flex-direction:column;gap:4px} .cm strong{font-size:clamp(18px,1.7vw,24px);letter-spacing:-.03em;font-weight:600} .cm span{font-size:14px;opacity:.6}
        .cp{font-size:12px;opacity:.6;white-space:nowrap} .ci{font-size:12px}
        .car{display:inline-block;transform:translate(-14px,6px);opacity:0;transition:all .6s var(--ease);font-size:20px} .row:hover .car,.row:focus-visible .car{opacity:1;transform:none}
        @media(max-width:900px){.cert-grid{grid-template-columns:1fr}.cert-l{position:static}.row{grid-template-columns:36px 1fr 24px}.cp{grid-column:2;grid-row:2}}
      `}</style>
    </section>
  );
}
