interface RivePanelProps {
  title: string;
  subtitle: string;
  label?: string;
}

export default function RivePanel({ title, subtitle, label = 'ARTBOARD' }: RivePanelProps) {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.7)] shadow-[0_18px_50px_rgba(16,20,28,0.08)]"
      style={{ minHeight: 420 }}
    >
      <div className="absolute inset-0">
        <img
          src="/animations/hero-brand.svg"
          alt="Editorial motion artboard"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,241,232,0.14),rgba(245,241,232,0.74)_82%,rgba(245,241,232,0.88))]" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <span className="font-caption mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <h3 className="font-h2 mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="font-body-small" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>
      </div>
    </div>
  );
}