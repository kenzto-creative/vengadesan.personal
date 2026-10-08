/* Single source of truth. Every string below comes from the résumé (Resume - Vengat.pdf).
   Link URLs are built as https:// + the text printed on the résumé. VERIFY them against the
   PDF's embedded hyperlinks before launch. */

export const PROFILE = {
  name: "Vengadesan R.",
  initials: "VR",
  role: "Product Designer (UX/UI)",
  email: "vengadesan.rasokkiyam@gmail.com",
  phone: "+91 70105 59179",
  phoneHref: "tel:+917010559179",
  location: "Chennai, Tamil Nadu, India",
  experienceYears: "3.5+ years",
  company: "Vyssr Solutions Pvt Ltd",
  resumeSummary:
    "Product Designer with 3.5+ years delivering end to end SaaS and enterprise applications. I lead product design from discovery through implementation defining UX strategy, building scalable design systems, and crafting interaction patterns that turn complex domains into intuitive experiences. Skilled at partnering across product, engineering, and stakeholder teams to align business goals while integrating AI-assisted workflows, accessibility compliance, and responsive design.",
  quote: "Turning complex domains into intuitive experiences.",
  resume: "/Vengadesan-R-Resume.pdf",
  languages: "Tamil (Native), English (Intermediate)",
  links: {
    linkedin: { label: "linkedin.com/in/vengadesanr", href: "https://linkedin.com/in/vengadesanr" },
    portfolio: { label: "vengadesan.design", href: "https://vengadesan.design" },
    behance: { label: "behance.net/vengadesanr", href: "https://behance.net/vengadesanr" },
    dribbble: { label: "dribbble.com/vengadesanr", href: "https://dribbble.com/vengadesanr" },
  },
} as const;

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export type Family = "Product & UX" | "UI & Systems" | "SaaS & Product" | "Tools";
export const FAMILIES: Family[] = ["Product & UX", "UI & Systems", "SaaS & Product", "Tools"];

/* Families are a grouping of the résumé's flat Core Competencies / Tools lists. */
export const SKILL_GROUPS: Record<Family, string[]> = {
  "Product & UX": ["Product Design", "UX Design & Strategy", "Product Discovery", "User Research", "Information Architecture", "User Journey Mapping", "Wireframing & Prototyping", "Interaction Design", "Agile & Product Thinking"],
  "UI & Systems": ["UI Design", "Design Systems & Tokens", "Component Libraries", "Responsive Design", "Accessibility (WCAG)", "Design QA & Developer Handoff"],
  "SaaS & Product": ["SaaS & Enterprise Design", "Stakeholder Management", "AI assisted Product Design"],
  Tools: ["Figma", "FigJam", "Framer", "Adobe Photoshop", "Adobe Illustrator", "Miro", "Jira", "Notion", "Maze", "Hotjar", "ChatGPT", "Claude", "Cursor"],
};

export const EXPERIENCE = {
  company: "Vyssr Solutions Pvt Ltd",
  location: "Chennai",
  role: "Product Designer (UX/UI)",
  period: "Feb 2023 – Present",
  yearLabel: "2023 — Present",
  bullets: [
    "Led end-to-end UX/UI for 12 enterprise SaaS platforms by conducting discovery research and mapping workflows, simplifying complex operations across logistics, insurance, and legal-tech.",
    "Designed scalable dashboards and workflow systems by restructuring multi-step processes into streamlined patterns, reducing operational friction and data-entry errors for enterprise users.",
    "Established a unified design system with reusable components and tokens, enabling three teams to ship cohesive UI and accelerating design-to-development handoff.",
    "Collaborated with product managers and engineers in agile sprints, translating strategic goals into prioritized features that aligned user needs with business objectives.",
    "Optimized user journeys by conducting usability testing, heuristic evaluations, and journey mapping — resolving critical drop-off points through actionable wireframes and prototypes.",
    "Delivered accessible, responsive experiences across desktop, tablet, and mobile by applying WCAG guidelines and device-specific interaction patterns for consistent usability.",
    "Improved developer confidence by producing annotated specifications and interactive prototypes with clear interaction states, reducing ambiguity and shortening QA cycles.",
    "Scaled brand coherence across marketing websites, landing pages, and product interfaces by creating a shared visual language that strengthened product trust across touchpoints.",
  ],
};

export const EDUCATION = {
  degree: "Bachelor of Commerce",
  institution: "National College, Trichy",
  period: "Jul 2019 – Jun 2022",
  yearLabel: "2019 — 2022",
};

/* Featured Product Experience categories only — no individual projects exist in the résumé. */
export const PROJECTS = [
  { title: "Enterprise SaaS Applications", count: 12, desc: "Dashboards, workflow systems, and business platforms.", extra: "UX/UI for multiple enterprise SaaS products spanning logistics, insurance, legal-tech, AI, and business automation." },
  { title: "Business Websites", count: 51, desc: "Responsive marketing sites, landing pages, and corporate experiences." },
  { title: "Mobile Applications", count: 6, desc: "Mobile-first experiences with scalable design systems." },
  { title: "Smart Watch Interface", count: 1, desc: "Wearable UI focused on usability and simplified interactions." },
  { title: "Brand & Marketing Design", count: 28, desc: "Visual assets aligned with digital product ecosystems." },
] as const;

export const CERTIFICATIONS = [
  { title: "Google UX Design Professional Certificate", issuer: "Coursera", period: "Jun 2025 – Sep 2025" },
  { title: "Graphics & UX/UI Design Certificate", issuer: "Buff Creative College, Chennai", period: "Jul 2022 – Jan 2023" },
];

export const ACHIEVEMENTS = [
  { label: "Enterprise SaaS", text: "Designed UX/UI for multiple enterprise SaaS products spanning logistics, insurance, legal-tech, AI, and business automation — owning the full design lifecycle." },
  { label: "Design Systems", text: "Established scalable design systems and component libraries that unified product UI across teams and improved design-to-development handoff." },
  { label: "Workflow Design", text: "Simplified complex workflows through research-driven interaction design, reducing task friction and improving task completion in enterprise tools." },
  { label: "Design QA", text: "Partnered with engineering throughout implementation — conducting design QA to ensure output matched design intent and accessibility standards." },
  { label: "Responsive & Accessible", text: "Delivered responsive experiences optimized for accessibility, performance, and cross-device consistency across desktop, tablet, and mobile." },
];

export const WORK_CTA = "Explore work";
