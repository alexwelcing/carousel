import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Download, Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import { generateResumePDF } from '@/lib/pdfGenerator';
import PageIntro from '@/components/PageIntro';

/* ─── Inline resume data (mirrors PDF) ─────────────────────────── */

const STATS = [
  { value: '12+', label: 'YEARS SHIPPING AI / PRODUCT SYSTEMS' },
  { value: 'Billions', label: 'MONTHLY REQUESTS MIGRATED AT LBR' },
  { value: '150+', label: 'ENTERPRISE SSO ROLLOUTS' },
  { value: '3+', label: 'PUBLIC TECHNICAL PRODUCTS LIVE' },
];

const EXPERIENCE = [
  {
    company: 'Law Business Research',
    role: 'Technical Product Manager',
    dates: 'Jan 2024 – Present',
    bullets: [
      'Launched AI API execution workspace with type safety, oRPC, and self-improving model usage accuracy across 3 separate APIs',
      'Replaced legacy platform handling billions of monthly requests — unified access, unlocked revenue growth',
      '"Architect PM" who prototypes and ships — rebuilt client apps cutting configuration time 60%',
      'Enterprise SSO integrations for 150+ clients including AmLaw 200 law firms',
    ],
  },
  {
    company: 'Obsess VR',
    role: 'Product Manager',
    dates: 'Apr 2022 – May 2023',
    bullets: [
      'Led 3D platform features: user auth, analytics, SOC 2 compliance for enterprise brands',
      'Shipped for Alo, Moncler, Ralph Lauren — set long-term SaaS platform strategy',
    ],
  },
  {
    company: 'Manatt, Phelps & Phillips',
    role: 'Developer → Consultant',
    dates: 'Aug 2017 – Apr 2022',
    bullets: [
      'Devised AI-based document scanning — enhanced knowledge graph precision, eliminated errors',
      'Built publishing SaaS from beta to millions in ARR with enterprise-grade data governance',
      'Led access management and IAM for legal research platform serving top 1000 clients',
    ],
  },
  {
    company: 'Arkadium',
    role: 'Partner Development',
    dates: 'Jul 2016 – Aug 2017',
    bullets: [
      'Pioneered NLP-driven AI partnerships leveraging contextual understanding for interactive content',
      'Spearheaded AI integration into partner initiatives — 25% faster GTM',
    ],
  },
];

const SKILLS = [
  { label: 'AI / ML', items: 'LLM Integration · AI APIs · NLP · Model Ops · Prompt Engineering · Agent Development' },
  { label: 'Frontend Engineering', items: 'TypeScript · React · Vue · Svelte · MDX · JAMstack · Modern CSS' },
  { label: 'Backend / Systems', items: 'Python · Go · Elixir · SQL · API Design · System Architecture' },
  { label: 'Platform', items: 'Enterprise SaaS · Data Products · Analytics · Scale · DevOps · Cloud' },
  { label: 'Product', items: '0→1 · Cross-Functional · Enterprise GTM · Developer Tools · AI Strategy' },
];

/* ─── Component ────────────────────────────────────────────────── */

export default function Resume() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await generateResumePDF();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Alex-Welcing-AI-Engineer-Resume-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  }, []);

  return (
    <div className="w-full relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="content-max-width min-w-0" style={{ paddingTop: 24, paddingBottom: 60 }}>

        {/* ─── Nav row ─── */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="font-nav inline-flex items-center gap-2 transition-colors duration-200 min-h-11"
            style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
          >
            <ArrowLeft size={12} /> BACK TO SITE
          </Link>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="font-nav inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 min-h-11"
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--accent)',
              borderRadius: '4px',
              color: 'var(--bg-primary)',
              fontSize: '0.8rem',
            }}
          >
            {downloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
            {downloading ? 'GENERATING...' : 'DOWNLOAD PDF'}
          </button>
        </div>

        <PageIntro
          kicker="Downloadable resume"
          title="Alex Welcing"
          description="Technical product leader and AI builder shipping enterprise platforms, agent workflows, scientific interfaces, and document intelligence from strategy through production code."
          meta={
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-2 gap-y-2 font-caption min-w-0" style={{ color: 'var(--text-tertiary)' }}>
              <span>New York, NY</span>
              <span className="hidden sm:inline">|</span>
              <a href="mailto:alexwelcing@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>alexwelcing@gmail.com</a>
              <span className="hidden sm:inline">|</span>
              <a href="https://github.com/alexwelcing" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover:text-[var(--accent)] transition-colors">
                github.com/alexwelcing
              </a>
              <span className="hidden sm:inline">|</span>
              <a href="https://linkedin.com/in/alexwelcing" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} className="hover:text-[var(--accent)] transition-colors">
                linkedin.com/in/alexwelcing
              </a>
            </div>
          }
        />

        {/* ═══════════ STATS ═══════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-8" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16 }}>
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-start rounded-[16px] border border-[var(--border-hover)] bg-[rgba(255,255,255,0.78)] p-4 min-w-0">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--text-primary)' }}>
                {s.value}
              </span>
              <span className="font-caption" style={{ color: 'var(--text-secondary)', fontSize: '0.68rem', marginTop: 6, lineHeight: 1.25 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ═══════════ SUMMARY ═══════════ */}
        <section style={{ marginBottom: 24 }}>
          <h2 className="font-nav" style={{ color: 'var(--accent)', letterSpacing: 0.08, fontSize: '0.75rem', marginBottom: 10, paddingBottom: 4, borderBottom: '1px solid var(--border-subtle)' }}>
            SUMMARY
          </h2>
          <p className="font-body-small" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            AI product builder with 12+ years shipping enterprise platforms, document AI, scientific visualization, and agent workflows. Hands-on in TypeScript/Python when needed; senior enough to align roadmap, UX, technical risk, and delivery across regulated enterprise environments.
          </p>
        </section>

        {/* ═══════════ EXPERIENCE ═══════════ */}
        <section style={{ marginBottom: 24 }}>
          <h2 className="font-nav" style={{ color: 'var(--accent)', letterSpacing: 0.08, fontSize: '0.75rem', marginBottom: 12, paddingBottom: 4, borderBottom: '1px solid var(--border-subtle)' }}>
            EXPERIENCE
          </h2>
          <div className="flex flex-col gap-5">
            {EXPERIENCE.map((job) => (
              <div key={job.company}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                  <div>
                    <h3 className="font-h3" style={{ fontSize: '1.08rem', color: 'var(--text-primary)', marginBottom: 1 }}>{job.company}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent)' }}>{job.role}</span>
                  </div>
                  <span className="font-caption" style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>{job.dates}</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {job.bullets.map((b, i) => (
                    <li key={i} className="font-body-small flex gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                      <span style={{ color: 'var(--accent)', flexShrink: 0 }}>{'>'}</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ SKILLS + EDUCATION ═══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.9fr] gap-8" style={{ marginBottom: 24 }}>
          <section>
            <h2 className="font-nav" style={{ color: 'var(--accent)', letterSpacing: 0.08, fontSize: '0.75rem', marginBottom: 12, paddingBottom: 4, borderBottom: '1px solid var(--border-subtle)' }}>
              SKILLS
            </h2>
            <div className="flex flex-col gap-4">
              {SKILLS.map((cat) => (
                <div key={cat.label}>
                  <h4 className="font-nav" style={{ color: 'var(--text-primary)', fontSize: '0.72rem', marginBottom: 3 }}>{cat.label}</h4>
                  <p className="font-body-small" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.5 }}>
                    {cat.items}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:border-l lg:border-[var(--border-subtle)] lg:pl-6">
            <h2 className="font-nav" style={{ color: 'var(--accent)', letterSpacing: 0.08, fontSize: '0.75rem', marginBottom: 12, paddingBottom: 4, borderBottom: '1px solid var(--border-subtle)' }}>
              HIGHLIGHTS
            </h2>
            <div
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: 14,
                marginBottom: 16,
              }}
            >
              <h4 className="font-nav" style={{ color: 'var(--accent)', fontSize: '0.7rem', letterSpacing: 0.06, marginBottom: 6 }}>OPEN SOURCE</h4>
              <p className="font-body-small" style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', lineHeight: 1.5 }}>
                352 repositories spanning AI marketing tools, materials science ML, Ethereum clients, and creative coding. Active contributor — 1,708 contributions last year.
              </p>
            </div>

            <h2 className="font-nav" style={{ color: 'var(--accent)', letterSpacing: 0.08, fontSize: '0.75rem', marginBottom: 10, paddingBottom: 4, borderBottom: '1px solid var(--border-subtle)' }}>
              EDUCATION
            </h2>
            <div>
              <h4 className="font-h3" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: 2 }}>University of Texas at Dallas</h4>
              <p className="font-body-small" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: 4 }}>B.S. Marketing</p>
              <p className="font-caption" style={{ color: 'var(--text-tertiary)', fontSize: '0.62rem' }}>
                Self-taught engineer — 12 years shipping production systems
              </p>
            </div>
          </section>
        </div>

        {/* ═══════════ FOOTER CTA ═══════════ */}
        <footer
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 8 }}
        >
          <div className="flex items-center gap-2">
            <span className="font-caption" style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>
              Full portfolio: <a href="https://alexwelcing.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>alexwelcing.com</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="font-nav inline-flex items-center gap-2 transition-all duration-200"
              style={{ color: 'var(--accent)', fontSize: '0.75rem', textDecoration: 'none' }}
            >
              GET IN TOUCH <ExternalLink size={10} />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
