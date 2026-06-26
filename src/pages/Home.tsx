import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Wordmark from '../components/Wordmark';
import BalancedText from '../components/BalancedText';
import FlagshipCard from '../components/FlagshipCard';
import RivePanel from '../components/RivePanel';
import { flagships } from '../data/projects';

const easeOut = [0, 0, 0.2, 1] as const;

const STATS = [
  { value: '12+ yrs', label: 'shipping product, code, and judgment end-to-end' },
  { value: 'Billions', label: 'monthly requests served by systems I re-platformed at LBR' },
  { value: '150+', label: 'enterprise SSO rollouts to AmLaw 200 firms' },
  { value: '0 → $M', label: 'ARR built from scratch at Manatt (legal SaaS)' },
];

const PROOF_POINTS = [
  {
    title: 'Identity at billions-scale',
    description: 'At Law Business Research I re-platformed the identity and subscription system serving billions of requests a month across 10+ products, unifying access models and unlocking new revenue.',
  },
  {
    title: 'AI agents that actually ship',
    description: 'Lupine.Live is the materials-science AI platform I built solo: machine-learned interatomic potentials, phase-change trajectory simulation, and a TypeScript/WebGL browser for real-time molecular visualization. Research-grade physics shipped as a product.',
  },
  {
    title: 'Document AI in regulated domains',
    description: 'At Manatt I built AI document scanning and led IAM for a research platform serving 1,000+ clients. Replaced manual error with structured extraction and knowledge-graph precision in legal publishing.',
  },
];

const OPERATING_POINTS = [
  {
    title: 'Pick the narrowest decision',
    body: 'At LBR I focused on unifying 10+ identity surfaces into one model — not a rebrand, not a migration. The narrow decision unlocked revenue. I look for the same in new problems.',
  },
  {
    title: 'Ship the code, not the deck',
    body: 'I write TypeScript and Python. The AI API workspace at LBR shipped in production with self-improving accuracy, and Lupine.Live runs MLIP benchmarks and phase-change simulation on a real-time WebGL surface — not a roadmap.',
  },
  {
    title: 'Make the interface inevitable',
    body: 'At Obsess I led the 3D platform for global enterprise brands — Alo, Moncler, Ralph Lauren. The motion and the product had to feel finished before the first call. Same bar I hold for this site.',
  },
];

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(el);
    const timeoutId = window.setTimeout(() => setRevealed(true), 1000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [threshold]);

  return { ref, revealed };
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-caption block mb-4" style={{ color: 'var(--accent)' }}>
      {children}
    </span>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const transition = prefersReducedMotion ? 'none' : 'power3.out';
      const y = prefersReducedMotion ? 0 : 16;

      gsap.fromTo('[data-hero-kicker]', { opacity: 0, y }, { opacity: 1, y: 0, duration: 0.6, ease: transition });
      gsap.fromTo('[data-hero-wordmark]', { opacity: 0, y: y + 8 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.04, ease: transition });
      gsap.fromTo('[data-hero-heading]', { opacity: 0, y: y + 10 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: transition });
      gsap.fromTo('[data-hero-copy]', { opacity: 0, y: y }, { opacity: 1, y: 0, duration: 0.7, delay: 0.18, ease: prefersReducedMotion ? 'none' : 'power2.out' });
      gsap.fromTo('[data-hero-action]', { opacity: 0, y: 10, scale: 0.99 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, delay: 0.24, stagger: 0.06, ease: prefersReducedMotion ? 'none' : 'power2.out' });
      gsap.fromTo('[data-hero-panel]', { opacity: 0, y: 20, scale: 0.99 }, { opacity: 1, y: 0, scale: 1, duration: 0.85, delay: 0.12, ease: transition });
      gsap.fromTo('[data-hero-stat]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, delay: 0.36, stagger: 0.06, ease: prefersReducedMotion ? 'none' : 'power2.out' });
      if (ruleRef.current) {
        gsap.fromTo(ruleRef.current, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: prefersReducedMotion ? 0.01 : 0.8, delay: 0.18, ease: transition });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden" style={{ paddingTop: 'clamp(64px, 9vh, 152px)', paddingBottom: 'clamp(56px, 8vh, 112px)' }}>
      <div className="content-max-width grid gap-8 lg:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="min-w-0">
          <div data-hero-kicker>
            <SectionLabel>welc.ing · Alex Welcing</SectionLabel>
          </div>

          <div data-hero-wordmark className="hidden sm:block mb-6 lg:mb-7">
            <Wordmark maxWidth={640} color="var(--text-primary)" accent="var(--accent)" slant={-1.1} />
          </div>
          <h2 className="sm:hidden font-display mb-6" style={{ color: "var(--text-primary)" }}>Alex Welcing</h2>

          <div data-hero-heading>
            <BalancedText as="h1" className="font-h1 mb-4 lg:mb-5" style={{ color: 'var(--text-primary)' }}>
              I build AI products from zero to shipped — solo when needed, at enterprise scale when it matters.
            </BalancedText>
          </div>

          <div data-hero-copy>
            <BalancedText as="p" className="font-body" style={{ color: 'var(--text-secondary)' }}>
              Twelve-plus years across enterprise platforms, AI agents, materials-science ML, and document understanding. LBR identity, Obsess 3D for Alo/Moncler/Ralph Lauren, Manatt document AI, Lupine.Live. Considering principal / staff / forward-deployed PM roles in New York.
            </BalancedText>
          </div>

          <div className="flex flex-wrap gap-3 mt-7 lg:mt-9">
            <Link
              to="/projects"
              data-hero-action
              className="font-nav inline-flex items-center gap-2 px-5 py-3 lg:px-6 transition-all duration-200"
              style={{
                backgroundColor: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                borderRadius: '999px',
                boxShadow: '0 14px 30px rgba(16, 21, 31, 0.14)',
              }}
            >
              VIEW WORK <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/contact"
              data-hero-action
              className="font-nav inline-flex items-center gap-2 px-5 py-3 lg:px-6 transition-all duration-200"
              style={{
                backgroundColor: 'rgba(255,255,255,0.7)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
              }}
            >
              GET IN TOUCH <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="mt-6 lg:mt-8 grid gap-3 grid-cols-1 sm:grid-cols-3 min-w-0">
            <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.72)] p-4">
              <span className="font-caption block mb-2" style={{ color: 'var(--text-tertiary)' }}>Recent</span>
              <p className="font-body-small" style={{ color: 'var(--text-primary)' }}>
                Took Manatt legal-publishing SaaS from beta to millions in ARR; built AI document scanning for 1,000+ clients.
              </p>
            </div>
            <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.72)] p-4">
              <span className="font-caption block mb-2" style={{ color: 'var(--text-tertiary)' }}>Now</span>
              <p className="font-body-small" style={{ color: 'var(--text-primary)' }}>
                Lupine.Live — materials-science AI built solo: MLIP benchmarks, phase-change simulation, and a TypeScript/WebGL browser for real-time molecular visualization.
              </p>
            </div>
            <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.72)] p-4">
              <span className="font-caption block mb-2" style={{ color: 'var(--text-tertiary)' }}>Targeting</span>
              <p className="font-body-small" style={{ color: 'var(--text-primary)' }}>
                Principal / staff product and forward-deployed PM roles at AI-native companies.
              </p>
            </div>
          </div>
        </div>

        <div data-hero-panel className="grid gap-4 min-w-0">
          <div className="hidden lg:block">
            <RivePanel
              title="welc.ing motion"
              subtitle="Live artboard: a breathing cream orb inside slowly rotating rings."
            />
          </div>

          <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.74)] p-5 lg:p-6 shadow-[0_18px_50px_rgba(16,20,28,0.08)] backdrop-blur-md">
            <span className="font-caption block mb-3" style={{ color: 'var(--text-tertiary)' }}>WHAT I AM RIGHT FOR</span>
            <BalancedText as="p" className="font-h3 mb-4 lg:mb-5" style={{ color: 'var(--text-primary)' }}>
              The narrow decision in a complex AI product, when the roadmap, the surface, and the execution path all need to line up.
            </BalancedText>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 border-t border-[var(--border-subtle)] pt-3">
                <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>SHIPPED</span>
                <span className="font-body-small sm:text-right" style={{ color: 'var(--text-primary)' }}>LBR identity, Obsess 3D for Alo/Moncler/Ralph Lauren, Manatt document AI, Lupine.Live</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 border-t border-[var(--border-subtle)] pt-3">
                <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>TARGET</span>
                <span className="font-body-small sm:text-right" style={{ color: 'var(--text-primary)' }}>Principal / staff product and forward-deployed PM roles</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 border-t border-[var(--border-subtle)] pt-3">
                <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>DEEP IN</span>
                <span className="font-body-small sm:text-right" style={{ color: 'var(--text-primary)' }}>AI agents, identity & access, document understanding, enterprise SaaS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={ruleRef} className="content-max-width mt-10 h-px bg-[var(--border-subtle)]" />
    </section>
  );
}

function StatsBar() {
  const { ref, revealed } = useReveal();
  return (
    <section ref={ref} className="content-max-width py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.72)] px-4 py-5 lg:px-5 lg:py-6 shadow-[0_12px_28px_rgba(16,20,28,0.04)] min-w-0"
            data-hero-stat
            initial={{ opacity: 0, y: 18 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.45, delay: index * 0.07, ease: easeOut }}
          >
            <div className="font-h2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="font-caption mt-3 leading-tight break-words" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ProofSection() {
  const { ref, revealed } = useReveal();
  return (
    <section ref={ref} className="section-padding">
      <div className="content-max-width">
        <SectionLabel>Why this stands out</SectionLabel>
        <div className="max-w-[780px] mb-10">
          <BalancedText as="h2" className="font-h1 mb-4" style={{ color: 'var(--text-primary)' }}>
            Identity re-platforming. AI agents in production. Document AI at scale.
          </BalancedText>
          <BalancedText as="p" className="font-body" style={{ color: 'var(--text-secondary)' }}>
            Identity re-platforming at billions of monthly requests. Lupine.Live materials-science AI shipped solo. Document AI in legal publishing with enterprise data governance.
          </BalancedText>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PROOF_POINTS.map((point, index) => (
            <motion.div
              key={point.title}
              className="rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.74)] p-6 shadow-[0_16px_40px_rgba(16,20,28,0.05)]"
              initial={{ opacity: 0, y: 16 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
            >
              <h3 className="font-h3 mb-3" style={{ color: 'var(--text-primary)' }}>{point.title}</h3>
              <p className="font-body-small" style={{ color: 'var(--text-secondary)' }}>{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelectedWork() {
  const { ref, revealed } = useReveal();
  return (
    <section ref={ref} className="section-padding">
      <div className="content-max-width">
        <SectionLabel>Selected Work</SectionLabel>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-end mb-10">
          <div className="max-w-[620px]">
            <BalancedText as="h2" className="font-h1 mb-4" style={{ color: 'var(--text-primary)' }}>
              Lupine.Live. Lupine. alexwelcing.com. High Era.
            </BalancedText>
            <BalancedText as="p" className="font-body" style={{ color: 'var(--text-secondary)' }}>
              Product systems, enterprise platforms, and AI work where the design has to carry both taste and operational credibility.
            </BalancedText>
          </div>
          <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.68)] p-5 lg:justify-self-end lg:max-w-[420px]">
            <span className="font-caption block mb-2" style={{ color: 'var(--text-tertiary)' }}>DEPLOYED LIVE</span>
            <p className="font-body-small" style={{ color: 'var(--text-primary)' }}>
              Lupine.Live at lupi.live. Lupine on GitHub. alexwelcing.com in production. High Era on Google Cloud.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {flagships.slice(0, 4).map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 22 }}
              animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
            >
              <FlagshipCard project={project} index={index} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/projects"
            className="font-nav inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              borderRadius: '999px',
            }}
          >
            SEE ALL WORK <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function OperatingModel() {
  const { ref, revealed } = useReveal();
  return (
    <section ref={ref} className="section-padding">
      <div className="content-max-width">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div>
            <SectionLabel>How I Work</SectionLabel>
            <BalancedText as="h2" className="font-h1 mb-4" style={{ color: 'var(--text-primary)' }}>
              Architect PM who ships the code alongside the roadmap.
            </BalancedText>
            <BalancedText as="p" className="font-body" style={{ color: 'var(--text-secondary)' }}>
              TypeScript and Python on weekdays. Product strategy and customer calls on the others. LBR was 10+ product surfaces unified into one identity model. Lupine.Live runs MLIP benchmarks on a real-time WebGL surface. Same operating mode, different shapes.
            </BalancedText>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {OPERATING_POINTS.map((item, index) => (
              <motion.div
                key={item.title}
                className="rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.74)] p-6 shadow-[0_12px_28px_rgba(16,20,28,0.04)]"
                initial={{ opacity: 0, y: 16 }}
                animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
              >
                <span className="font-caption block mb-3" style={{ color: 'var(--text-tertiary)' }}>{String(index + 1).padStart(2, '0')}</span>
                <h3 className="font-h3 mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="font-body-small" style={{ color: 'var(--text-secondary)' }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section className="section-padding">
      <div className="content-max-width">
        <div className="rounded-[32px] border border-[rgba(16,20,28,0.08)] bg-[#10151f] px-8 py-12 text-white shadow-[0_28px_80px_rgba(16,21,31,0.18)] lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-[700px]">
              <span className="font-caption block mb-4" style={{ color: 'rgba(255,255,255,0.64)' }}>
                OPEN TO PRINCIPAL / STAFF PRODUCT AND FORWARD-DEPLOYED ROLES
              </span>
              <BalancedText as="h2" className="font-h1 mb-4" style={{ color: 'white' }}>
                Looking for an architect PM who has shipped AI agents and identity at scale? Let's talk.
              </BalancedText>
              <BalancedText as="p" className="font-body" style={{ color: 'rgba(255,255,255,0.74)' }}>
                Selectively considering roles where AI, product judgment, and enterprise taste matter.
              </BalancedText>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Link
                to="/contact"
                className="font-nav inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
                style={{ backgroundColor: 'white', color: 'var(--text-primary)', borderRadius: '999px' }}
              >
                CONTACT <span aria-hidden="true">→</span>
              </Link>
              <a
                href="https://github.com/alexwelcing"
                target="_blank"
                rel="noopener noreferrer"
                className="font-nav inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '999px',
                }}
              >
                GITHUB <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="w-full" style={{ opacity: 0, animation: 'fade-in 0.6s ease-out forwards' }}>
      <HeroSection />
      <StatsBar />
      <ProofSection />
      <SelectedWork />
      <OperatingModel />
      <FooterCTA />
    </div>
  );
}
