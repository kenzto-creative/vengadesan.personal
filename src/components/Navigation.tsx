"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, PROFILE } from "@/lib/data";
import { lockScroll, scrollToTarget } from "@/lib/scroll";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [far, setFar] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [prog, setProg] = useState(0);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [ind, setInd] = useState({ x: 0, w: 0, show: false });

  useEffect(() => {
    const on = () => {
      const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      setScrolled(y > 40); setFar(y > 120); setProg(max > 0 ? y / max : 0);
    };
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const secs = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach((s) => io.observe(s));
    const hero = document.getElementById("top");
    const ioh = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), { rootMargin: "-45% 0px -50% 0px" });
    if (hero) ioh.observe(hero);
    return () => { io.disconnect(); ioh.disconnect(); };
  }, []);

  useLayoutEffect(() => {
    const el = linkRefs.current[active];
    if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth, show: true }); else setInd((s) => ({ ...s, show: false }));
  }, [active, scrolled]);

  useEffect(() => {
    lockScroll(open);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => { window.removeEventListener("keydown", k); lockScroll(false); };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToTarget(id), open ? 350 : 0); };

  return (
    <>
      <div className="nv-prog" style={{ transform: `scaleX(${prog})` }} aria-hidden />
      <header className="nv">
        <a href="#top" onClick={go("top")} className="nv-brand" aria-label="Back to top">
          <span className={`nv-mark ${scrolled ? "on" : ""}`}>{PROFILE.initials}</span>
          <span className={`nv-name ${far ? "off" : ""}`}>{PROFILE.name}</span>
        </a>
        <nav aria-label="Primary" className={`nv-pill ${scrolled ? "glass" : ""}`}>
          <span className="nv-ind" style={{ transform: `translateX(${ind.x}px)`, width: ind.w, opacity: ind.show ? 1 : 0 }} aria-hidden />
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} ref={(el) => { linkRefs.current[n.id] = el; }} onClick={go(n.id)} className={active === n.id ? "act" : ""} aria-current={active === n.id ? "true" : undefined}>{n.label}</a>
          ))}
        </nav>
        <button className="nv-menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>{open ? "Close" : "Menu"}</button>
      </header>
      <div id="mobile-menu" className={`nv-ov ${open ? "open" : ""}`} aria-hidden={!open} inert={!open}>
        <ol>
          {NAV.map((n, i) => (
            <li key={n.id} style={{ ["--i" as string]: i }}>
              <a href={`#${n.id}`} onClick={go(n.id)}><span className="mono">0{i + 1}</span>{n.label}</a>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .nv-prog{position:fixed;inset:0 0 auto 0;height:2px;background:var(--ink);transform-origin:left;z-index:70}
        .nv{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;align-items:center;justify-content:space-between;padding:22px var(--gutter);pointer-events:none}
        .nv>*{pointer-events:auto}
        .nv-brand{display:flex;align-items:center;gap:12px;font-weight:600;letter-spacing:-.02em}
        .nv-mark{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;box-shadow:inset 0 0 0 1.5px var(--ink);transition:background .5s var(--ease),color .5s var(--ease),transform .8s var(--ease);background:transparent}
        .nv-mark.on{background:var(--ink);color:#fff}
        .nv-brand:hover .nv-mark{transform:rotate(360deg)}
        .nv-name{transition:opacity .5s var(--ease),transform .5s var(--ease);font-size:15px} .nv-name.off{opacity:0;transform:translateX(-8px)}
        .nv-pill{position:relative;display:flex;align-items:center;gap:2px;padding:4px;border-radius:999px;margin-left:auto;transition:background .5s var(--ease),box-shadow .5s var(--ease)}
        .nv-pill.glass{background:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line),0 10px 30px -14px rgba(0,0,0,.25)}
        .nv-pill a{position:relative;z-index:1;padding:8px 14px;font-size:14px;font-weight:500;border-radius:999px;color:var(--ink-2);transition:color .4s var(--ease)}
        .nv-pill a:hover{color:var(--ink)}
        .nv-pill a.act{color:#fff}
        .nv-ind{position:absolute;top:4px;bottom:4px;left:0;background:var(--ink);border-radius:999px;transition:transform .6s var(--ease),width .6s var(--ease),opacity .3s}
        .nv-menu{display:none;height:42px;padding:0 20px;border-radius:999px;background:rgba(255,255,255,.8);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px var(--line);font-weight:600;font-size:14px;position:relative;z-index:81;margin-left:auto}
        .nv-ov{position:fixed;inset:0;z-index:80;background:var(--paper);clip-path:inset(0 0 100% 0);transition:clip-path .8s var(--ease),visibility 0s .8s;display:flex;align-items:center;padding:0 var(--gutter);visibility:hidden}
        .nv-ov.open{clip-path:inset(0);visibility:visible;transition:clip-path .8s var(--ease),visibility 0s}
        .nv-ov li a{display:flex;align-items:baseline;gap:14px;font-size:clamp(40px,12vw,72px);font-weight:700;letter-spacing:-.045em;line-height:1.15;opacity:0;transform:translateY(30px);transition:opacity .7s var(--ease),transform .7s var(--ease)}
        .nv-ov.open li a{opacity:1;transform:none;transition-delay:calc(.15s + var(--i)*70ms)}
        .nv-ov li .mono{font-size:12px;color:var(--mute);font-weight:400}
        @media(max-width:900px){.nv-pill{display:none}.nv-menu{display:block}}
      `}</style>
    </>
  );
}
