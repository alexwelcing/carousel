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
  { value: '15 yrs', label: 'shipping product, code, and judgment' },
  { value: 'Billions', label: 'monthly requests re-platformed' },
  { value: '150+', label: 'enterprise clients onboarded' },
  { value: '0 → $M', label: 'ARR built from scratch' },
];

const PROOF_POINTS = [
  {
    title: 'Top startups and equity teams',
    description: 'welc.ing is tuned to read like a recommendation from someone already inside the room.',
  },
  {
    title: 'Product judgment plus technical depth',
    description: 'I can set the thesis, shape the interface, and stay close enough to the code to ship it cleanly.',
  },
  {
    title: 'Intentional motion, not decoration',
    description: 'The page should move like a considered editorial object: light, timed, and never needy.',
  },
];

const OPERATING_POINTS = [
  {
    title: 'Choose the thing worth building',
    body: 'I look for the narrowest decision that changes the outcome, then structure the product around that.',
  },
  {
    title: 'Make it feel inevitable',
    body: 'The interface, copy, and motion should make a sharp product feel obvious before the first call.',
  },
  {
    title: 'Keep the work legible',
    body: 'Teams should be able to look at the page and understand the craft, the fit, and the ambition quickly.',
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
      gsap.fromTo('[data-hero-note]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.28, stagger: 0.08, ease: prefersReducedMotion ? 'none' : 'power2.out' });
      gsap.fromTo('[data-hero-panel]', { opacity: 0, y: 20, scale: 0.99 }, { opacity: 1, y: 0, scale: 1, duration: 0.85, delay: 0.12, ease: transition });
      gsap.fromTo('[data-hero-stat]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, delay: 0.36, stagger: 0.06, ease: prefersReducedMotion ? 'none' : 'power2.out' });
      if (ruleRef.current) {
        gsap.fromTo(ruleRef.current, { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: prefersReducedMotion ? 0.01 : 0.8, delay: 0.18, ease: transition });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden" style={{ paddingTop: 'clamp(84px, 11vh, 152px)', paddingBottom: 'clamp(64px, 9vh, 112px)' }}>
      <div className="content-max-width grid gap-10 lg:grid-cols-[1.08fr_0.92fr] items-start">
        <div className="max-w-[760px]">
          <div data-hero-kicker>
            <SectionLabel>welc.ing · Alex Welcing</SectionLabel>
          </div>

          <div data-hero-wordmark className="mb-7">
            <Wordmark maxWidth={640} color="var(--text-primary)" accent="var(--accent)" slant={-1.1} />
          </div>

          <div data-hero-heading>
            <BalancedText as="h1" className="font-h1 mb-5" style={{ color: 'var(--text-primary)' }}>
              I help ambitious teams choose the right thing, then ship it with taste.
            </BalancedText>
          </div>

          <div data-hero-copy>
            <BalancedText as="p" className="font-body" style={{ color: 'var(--text-secondary)', maxWidth: '44rem' }}>
              This site is built for top startup and equity-team roles: clear product judgment, technical credibility, and motion that feels intentional rather than decorative.
            </BalancedText>
          </div>

          <div className="flex flex-wrap gap-4 mt-9">
            <Link
              to="/projects"
              data-hero-action
              className="font-nav inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
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
              className="font-nav inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
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

          <div className="mt-8 grid gap-3 sm:grid-cols-3 max-w-[760px]">
            <div data-hero-note className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.72)] p-4">
              <span className="font-caption block mb-2" style={{ color: 'var(--text-tertiary)' }}>Positioning</span>
              <p className="font-body-small" style={{ color: 'var(--text-primary)' }}>
                Built to feel like a private recommendation, not a generic portfolio.
              </p>
            </div>
            <div data-hero-note className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.72)] p-4">
              <span className="font-caption block mb-2" style={{ color: 'var(--text-tertiary)' }}>Motion</span>
              <p className="font-body-small" style={{ color: 'var(--text-primary)' }}>
                GSAP-led reveals, calm pacing, and nothing that feels like garnish.
              </p>
            </div>
            <div data-hero-note className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.72)] p-4">
              <span className="font-caption block mb-2" style={{ color: 'var(--text-tertiary)' }}>Audience</span>
              <p className="font-body-small" style={{ color: 'var(--text-primary)' }}>
                Top startups, equity teams, and people hiring for compounding advantage.
              </p>
            </div>
          </div>
        </div>

        <div data-hero-panel className="grid gap-4">
          <RivePanel
            title="A quiet motion surface"
            subtitle="A finished artboard asset keeps the motion lane editorial, even when the loop is static."
          />

          <div className="rounded-[24px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.74)] p-6 shadow-[0_18px_50px_rgba(16,20,28,0.08)] backdrop-blur-md">
            <span className="font-caption block mb-3" style={{ color: 'var(--text-tertiary)' }}>WORKING THESIS</span>
            <BalancedText as="p" className="font-h3 mb-5" style={{ color: 'var(--text-primary)' }}>
              The page should read like an inside-reference: selective, polished, and easy to trust fast.
            </BalancedText>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4 border-t border-[var(--border-subtle)] pt-3">
                <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>ROLE TARGET</span>
                <span className="font-body-small text-right" style={{ color: 'var(--text-primary)' }}>Principal product, staff product, forward-deployed roles</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-t border-[var(--border-subtle)] pt-3">
                <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>TONE</span>
                <span className="font-body-small text-right" style={{ color: 'var(--text-primary)' }}>Opinionated, well-read, calm</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-t border-[var(--border-subtle)] pt-3">
                <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>SIGNAL</span>
                <span className="font-body-small text-right" style={{ color: 'var(--text-primary)' }}>Strategy, craft, and execution in one person</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.72)] px-5 py-6 shadow-[0_12px_28px_rgba(16,20,28,0.04)]"
            data-hero-stat
            initial={{ opacity: 0, y: 18 }}
            animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.45, delay: index * 0.07, ease: easeOut }}
          >
            <div className="font-h2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
            <div className="font-caption mt-3" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
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
            Designed to feel selective, not busy.
          </BalancedText>
          <BalancedText as="p" className="font-body" style={{ color: 'var(--text-secondary)' }}>
            The site is framed as a recommendation asset: concise enough to scan, rich enough to remember, and composed like a serious product introduction.
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
              Projects with substance, not spectacle.
            </BalancedText>
            <BalancedText as="p" className="font-body" style={{ color: 'var(--text-secondary)' }}>
              Product systems, enterprise platforms, and AI work where the design has to carry both taste and operational credibility.
            </BalancedText>
          </div>
          <div className="rounded-[20px] border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.68)] p-5 lg:justify-self-end lg:max-w-[420px]">
            <span className="font-caption block mb-2" style={{ color: 'var(--text-tertiary)' }}>HOW TO READ THIS</span>
            <p className="font-body-small" style={{ color: 'var(--text-primary)' }}>
              The cards below are proof points, not decoration. Each one should feel like a specific reason you would want this person in the room.
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
              Strategy first, then the detail work that makes it believable.
            </BalancedText>
            <BalancedText as="p" className="font-body" style={{ color: 'var(--text-secondary)' }}>
              I’m most useful in the middle ground where the roadmap, the product surface, and the execution path all need to line up.
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
                Let’s build something that deserves the polish.
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
