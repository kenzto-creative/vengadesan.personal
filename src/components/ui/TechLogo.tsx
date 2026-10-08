"use client";
import { useState } from "react";

/* BRAND: official logos live in /public/logos/<file>.svg (devicon "original" / simple-icons).
   See README for the exact files to copy. If a file is missing the tile falls back to a monogram. */
export const BRAND: Record<string, { file: string; tint: string }> = {
  Figma: { file: "figma.svg", tint: "#f24e1e" },
  FigJam: { file: "figjam.svg", tint: "#a259ff" },
  Framer: { file: "framer.svg", tint: "#0055ff" },
  "Adobe Photoshop": { file: "photoshop.svg", tint: "#31a8ff" },
  "Adobe Illustrator": { file: "illustrator.svg", tint: "#ff9a00" },
  Miro: { file: "miro.svg", tint: "#ffd02f" },
  Jira: { file: "jira.svg", tint: "#0052cc" },
  Notion: { file: "notion.svg", tint: "#000000" },
  Maze: { file: "maze.svg", tint: "#2b2b2b" },
  Hotjar: { file: "hotjar.svg", tint: "#fd3a5c" },
  ChatGPT: { file: "chatgpt.svg", tint: "#10a37f" },
  Claude: { file: "claude.svg", tint: "#d97757" },
  Cursor: { file: "cursor.svg", tint: "#000000" },
};

type P = { d: string };
/* CONCEPT: thin line icons (24×24, stroke 1.4), one path string each. */
export const CONCEPT: Record<string, P> = {
  Product: { d: "M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8" },
  UX: { d: "M5 5h14v10H9l-4 4zM9 9h6M9 12h4" },
  UI: { d: "M4 5h16v14H4zM4 9h16M8 13h5M8 16h8" },
  SaaS: { d: "M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18zM9 14h6" },
  Research: { d: "M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15.5 15.5L20 20" },
  Structure: { d: "M12 4v5M6 9h12M6 9v4M18 9v4M4 13h4v4H4zM16 13h4v4h-4zM10 13h4v4h-4z" },
  Journey: { d: "M4 18c4 0 3-12 8-12s4 12 8 12M4 18h.01M20 18h.01" },
  Wireframe: { d: "M4 4h16v16H4zM4 10h16M10 10v10" },
  Interaction: { d: "M9 11V5a1.5 1.5 0 013 0v5l5 1.5V17a4 4 0 01-4 4h-2a5 5 0 01-4-2l-3-4 2-1z" },
  System: { d: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM17 13v7M13.5 16.5h7" },
  Accessibility: { d: "M12 5.5a1 1 0 100-.01M5 9l7 1.5L19 9M12 10.5V15M9 20l3-5 3 5" },
  QA: { d: "M5 12l4 4 10-10M4 20h16" },
  People: { d: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 19a6 6 0 0112 0M16 6a3 3 0 010 5M18 19a6 6 0 00-2-4.5" },
  Agile: { d: "M20 12a8 8 0 01-14 5.3M4 12A8 8 0 0118 6.7M18 3v4h-4M6 21v-4h4" },
  AI: { d: "M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8zM18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" },
};
export const CONCEPT_FOR: Record<string, keyof typeof CONCEPT> = {
  "Product Design": "Product", "UX Design & Strategy": "UX", "UI Design": "UI", "SaaS & Enterprise Design": "SaaS",
  "Product Discovery": "Research", "User Research": "Research", "Information Architecture": "Structure",
  "User Journey Mapping": "Journey", "Wireframing & Prototyping": "Wireframe", "Interaction Design": "Interaction",
  "Design Systems & Tokens": "System", "Component Libraries": "System", "Responsive Design": "UI",
  "Accessibility (WCAG)": "Accessibility", "Design QA & Developer Handoff": "QA", "Stakeholder Management": "People",
  "Agile & Product Thinking": "Agile", "AI assisted Product Design": "AI",
};
export const isBrand = (name: string) => name in BRAND;

export default function TechLogo({ name, size = 150, label }: { name: string; size?: number; label?: string }) {
  const [broken, setBroken] = useState(false);
  const alt = label ?? name;
  if (isBrand(name) && !broken) {
    const b = BRAND[name];
    return (
      <span className="tl" style={{ width: size, height: size }}>
        <span className="tl-glow" style={{ background: b.tint }} aria-hidden />
        <img src={`/logos/${b.file}`} alt={`${alt} logo`} width={size * 0.62} height={size * 0.62} onError={() => setBroken(true)} />
        <style>{`.tl{position:relative;display:grid;place-items:center}.tl-glow{position:absolute;inset:14%;border-radius:50%;filter:blur(26px);opacity:.16}.tl img{position:relative;object-fit:contain}`}</style>
      </span>
    );
  }
  const c = CONCEPT[CONCEPT_FOR[name]];
  return (
    <span style={{ width: size, height: size, display: "grid", placeItems: "center" }} role="img" aria-label={`${alt} icon`}>
      {c ? (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#0d0d0d" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={c.d} /></svg>
      ) : (
        <span style={{ fontSize: size * 0.34, fontWeight: 700, letterSpacing: "-.04em" }}>{name.slice(0, 2)}</span>
      )}
    </span>
  );
}
