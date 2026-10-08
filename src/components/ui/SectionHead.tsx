export default function SectionHead({ n, label, children, id }: { n: string; label: string; children: React.ReactNode; id?: string }) {
  return (
    <header>
      <span className="tag rv">{n} — {label}</span>
      <h2 className="h2 rv-mask" id={id}><span>{children}</span></h2>
    </header>
  );
}
