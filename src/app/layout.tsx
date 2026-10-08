import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({ src: "../fonts/InterTight-Variable.woff2", variable: "--f-sans", display: "swap", weight: "100 900" });
const serif = localFont({
  src: [{ path: "../fonts/InstrumentSerif-Regular.woff2", style: "normal" }, { path: "../fonts/InstrumentSerif-Italic.woff2", style: "italic" }],
  variable: "--f-serif", display: "swap",
});
const mono = localFont({ src: "../fonts/JetBrainsMono-Variable.woff2", variable: "--f-mono", display: "swap", weight: "100 800" });

export const metadata: Metadata = {
  title: "Vengadesan R. — Product Designer (UX/UI)",
  description: "Product Designer with 3.5+ years delivering end-to-end SaaS and enterprise applications. Chennai, Tamil Nadu, India.",
  openGraph: { title: "Vengadesan R. — Product Designer (UX/UI)", description: "Portfolio of Vengadesan R., Product Designer (UX/UI).", images: ["/og.jpg"], type: "website" },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = { themeColor: "#f4f2ee", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
