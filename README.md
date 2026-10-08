# Vengadesan R. — Portfolio

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis (the only animation dependency).
All copy lives in `src/lib/data.ts` and comes from the résumé.

## Run

```bash
npm install
# one-time: add the fonts (see "Fonts") and logos (see "Logos")
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Fonts (self-hosted via next/font/local)
Put these in `src/fonts/` (all OFL-licensed; get them from Google Fonts / JetBrains):
`InterTight-Variable.woff2`, `InstrumentSerif-Regular.woff2`, `InstrumentSerif-Italic.woff2`, `JetBrainsMono-Variable.woff2`.

## Logos
`TechLogo` reads `/public/logos/<file>.svg` for the 13 tools (file names are listed in `src/components/ui/TechLogo.tsx`, `BRAND`).
Copy the official "original" SVGs from [devicon](https://github.com/devicons/devicon) (MIT) or paths from [simple-icons](https://github.com/simple-icons/simple-icons) (CC0), and keep each licence file next to them in `public/logos/`. Brand names and marks belong to their owners (Figma, Adobe, Atlassian, Notion, Miro, Framer, Hotjar, Maze, OpenAI, Anthropic, Cursor). A missing file falls back to a monogram tile.

## Sections
| # | id | Component | Notes |
|---|----|-----------|-------|
| – | top | hero/Hero | looping intro video, sound toggle, pauses below 35% visibility |
| 01 | about | sections/About + ui/IDCard | pendulum lanyard ID card, quick facts |
| 02 | skills | sections/Skills | periodic table, family filters, inspector |
| 03 | work | sections/Work | accordion of the 5 Featured Product Experience categories |
| 04 | certifications | sections/Certifications | ink-flood list (no nav link) |
| 05 | experience | sections/Experience | scroll-drawn timeline |
| 06 | achievements | sections/Achievements | pinned horizontal gallery |
| 07 | contact | sections/Contact | hop-letter heading, copy email, footer |

## Rebuilding the hero video
```bash
python3 scripts/build-hero-assets.py path/to/intro.mp4
```
Needs ffmpeg (libx264, libvpx-vp9, libopus, libwebp) and numpy. Crops 576×720 at x=352 (person centred in a 1280×720 source), whitens the backdrop, uses the first 10 s, cross-fades the last 0.5 s into the first 0.5 s (video via `xfade`, audio equal-power in numpy), and writes `public/hero/hero.mp4`, `hero.webm`, `public/portrait-bust.webp` and `public/og.jpg`. Edit `CROP` for a different source.

## Verify before launch
- Link URLs in `data.ts` are `https://` + the text printed on the résumé — confirm against the PDF's embedded hyperlinks.
- Run `npm run build`, then Playwright screenshots at 1440×900 and 390×844 (check `scrollWidth === innerWidth`) and Lighthouse.
