import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleGlobe from '../components/ParticleGlobe';
import MatrixRain from '../components/MatrixRain';
import AmbientField from '../components/AmbientField';
import NeuralMesh from '../components/NeuralMesh';
import FlagshipCard from '../components/FlagshipCard';
import Wordmark from '../components/Wordmark';
import BalancedText from '../components/BalancedText';
import { flagships } from '../data/projects';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: '15 yrs', label: '> SHIPPING PRODUCT & CODE' },
  { value: 'Billions', label: '> MONTHLY REQUESTS RE-PLATFORMED' },
  { value: '150+', label: '> ENTERPRISE CLIENTS (AMLAW 200)' },
  { value: '0→$M', label: '> ARR BUILT FROM SCRATCH' },
];

interface Capability {
  icon: string;
  title: string;
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: '</>',
    title: 'Frontend, Hands-On',
    description:
      'TypeScript-first across React, Next.js, Vue, and Svelte — plus real-time 3D (React Three Fiber) and pgvector-backed semantic search. The interface is where products win or lose, and I build it myself.',
  },
  {
    icon: '⚡',
    title: 'AI Agent Architecture',
    description:
      'From NLP partnerships in 2016 to multi-agent orchestration today. I designed and built CreateSuite — autonomous agents coordinating across six model providers — and ship LLM systems with evals, not vibes.',
  },
  {
    icon: '◈',
    title: 'Enterprise Scale & Identity',
    description:
      'Re-platformed identity and subscription systems serving billions of requests a month, and ran SSO/SAML/OIDC onboarding for 150+ AmLaw 200 firms. I know how regulated enterprises buy, deploy, and trust software.',
  },
];

/* ------------------------------------------------------------------ */
/*  Hook: intersection-observer reveal (fails open → always visible)   */
/* ------------------------------------------------------------------ */

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
    // Fail open: if anything goes wrong, reveal after a beat so nothing stays hidden.
    const t = setTimeout(() => setRevealed(true), 1200);
    return () => { observer.disconnect(); clearTimeout(t); };
  }, [threshold]);

  return { ref, revealed };
}

/* ------------------------------------------------------------------ */
/*  Section 1: Hero                                                    */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100dvh', backgroundColor: '#050505' }}
    >
      {/* Tamed globe — a backdrop, pushed right and dimmed so it never fights the name */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.4, transform: 'translateX(22%)' }}
      >
        <ParticleGlobe />
      </div>

      <div
        className="relative z-10 flex flex-col justify-center content-max-width"
        style={{ minHeight: '100dvh' }}
      >
        <span className="font-caption mb-4" style={{ color: '#9A9A9A' }}>
          {'> TECHNICAL PRODUCT MANAGER · AI RESEARCHER · 15 YEARS'}
        </span>
        <Wordmark maxWidth={760} className="mb-6" style={{ maxWidth: 760 }} />
        <BalancedText as="p" className="font-body mb-8" style={{ color: '#C4C4C4', maxWidth: '42rem' }}>
          The rare product leader who sets the strategy and writes the code. Fifteen years across
          AI and enterprise platforms — frontend craft, AI depth, and enterprise scale, in one person.
        </BalancedText>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-nav px-6 py-3 transition-all duration-200"
            style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FF3366'; e.currentTarget.style.color = '#050505'; e.currentTarget.style.borderColor = 'transparent'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#222222'; }}
          >
            VIEW WORK {'→'}
          </Link>
          <a
            href="/resume.pdf"
            className="inline-flex items-center gap-2 font-nav px-6 py-3 transition-all duration-200"
            style={{ backgroundColor: 'transparent', border: '1px solid #222222', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF3366'; e.currentTarget.style.color = '#FF3366'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.color = '#FFFFFF'; }}
          >
            DOWNLOAD RESUME {'↓'}
          </a>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4">
          <a
            href="/resume-light.pdf"
            className="font-caption inline-block transition-colors duration-200"
            style={{ color: '#8A8A8A' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3366'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A'; }}
          >
            {'> printer-friendly version'}
          </a>
          <a
            href="/resume-plain.pdf"
            className="font-caption inline-block transition-colors duration-200"
            style={{ color: '#8A8A8A' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3366'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#8A8A8A'; }}
          >
            {'> plain text version'}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 2: Stats Bar                                               */
/* ------------------------------------------------------------------ */

function StatsBar() {
  const { ref, revealed } = useReveal();
  return (
    <section ref={ref} className="w-full relative" style={{ backgroundColor: '#0A0A0A' }}>
      <AmbientField particleCount={40} opacity={0.12} connectDistance={160} />
      <div className="content-max-width py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-6 md:py-0"
              style={{
                opacity: 1,
                transform: revealed ? 'translateY(0)' : 'translateY(16px)',
                transition: `transform 500ms ease-out ${i * 80}ms`,
                borderRight: i < STATS.length - 1 ? '1px solid #222222' : 'none',
              }}
            >
              <span className="font-jetbrains font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: '#FFFFFF' }}>
                {stat.value}
              </span>
              <span className="font-caption mt-2 text-center px-2" style={{ color: '#8A8A8A' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 3: Selected Work (flagships)                               */
/* ------------------------------------------------------------------ */

function SelectedWork() {
  return (
    <section className="w-full section-padding relative" style={{ backgroundColor: '#050505' }}>
      <AmbientField particleCount={45} opacity={0.1} connectDistance={150} />
      <div className="content-max-width">
        <span className="font-caption block mb-4" style={{ color: '#33CCFF' }}>[ SELECTED WORK ]</span>
        <BalancedText as="h2" className="font-h1 text-[#FFFFFF] mb-4">THINGS I BUILT</BalancedText>
        <BalancedText as="p" className="font-body-small mb-12" style={{ color: '#C4C4C4', maxWidth: '42rem' }}>
          Multi-agent systems, enterprise platforms, 3D web, and materials-science AI — designed and shipped.
        </BalancedText>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {flagships.slice(0, 4).map((p, i) => (
            <FlagshipCard key={p.slug} project={p} index={i} />
          ))}
        </div>

        <div className="mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 font-nav px-6 py-3 transition-all duration-200"
            style={{ backgroundColor: 'transparent', border: '1px solid #222222', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF3366'; e.currentTarget.style.color = '#FF3366'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.color = '#FFFFFF'; }}
          >
            SEE ALL WORK {'→'}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 4: How I Work                                              */
/* ------------------------------------------------------------------ */

function AIFocus() {
  const { ref, revealed } = useReveal();
  return (
    <section ref={ref} className="w-full section-padding relative" style={{ backgroundColor: '#0A0A0A' }}>
      <NeuralMesh opacity={0.18} />
      <AmbientField particleCount={30} opacity={0.08} color="#E6E7E8" lineColor="rgba(230, 231, 232, 0.03)" connectDistance={130} />
      <div className="content-max-width">
        <div className="mb-12" style={{ opacity: 1, transform: revealed ? 'translateY(0)' : 'translateY(16px)', transition: 'transform 600ms ease-out' }}>
          <span className="font-caption block mb-4" style={{ color: '#33CCFF' }}>[ HOW I WORK ]</span>
          <BalancedText as="h2" className="font-h1 text-[#FFFFFF] mb-6">STRATEGY + SHIPPED</BalancedText>
          <BalancedText as="p" className="font-body" style={{ color: '#C4C4C4', maxWidth: '42rem' }}>
            Most product leaders hand off a spec and hope. After 15 years I do both halves: I own the
            roadmap and the revenue case, then sit in the codebase and ship it.
          </BalancedText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap, i) => (
            <div
              key={cap.title}
              className="p-8 transition-all duration-200"
              style={{
                backgroundColor: '#050505',
                border: '1px solid #222222',
                borderRadius: '6px',
                opacity: 1,
                transform: revealed ? 'translateY(0)' : 'translateY(20px)',
                transition: `transform 600ms ease-out ${i * 100}ms, border-color 0.2s ease`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#33CCFF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; }}
            >
              <span className="block font-jetbrains text-[2rem] mb-4" style={{ color: '#33CCFF' }}>{cap.icon}</span>
              <h3 className="font-h3 text-[#FFFFFF] mb-3">{cap.title}</h3>
              <p className="font-body-small" style={{ color: '#C4C4C4' }}>{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Section 5: Footer CTA                                              */
/* ------------------------------------------------------------------ */

function FooterCTA() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#0A0A0A', paddingTop: 'clamp(80px, 10vh, 160px)', paddingBottom: 'clamp(80px, 10vh, 160px)' }}
    >
      <MatrixRain opacity={0.08} />
      <div className="relative z-10 content-max-width text-center">
        <span className="font-caption mb-4 block" style={{ color: '#9A9A9A' }}>
          {'> STATUS :: OPEN TO PRINCIPAL PRODUCT & FORWARD-DEPLOYED ROLES'}
        </span>
        <h2 className="font-display text-[#FFFFFF] mb-6" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
          LET'S BUILD.
        </h2>
        <BalancedText as="p" className="font-body mx-auto mb-10" style={{ color: '#C4C4C4', maxWidth: '36rem' }}>
          Selectively considering Principal / Staff Product, Forward-Deployed Engineering, and founding roles where AI meets enterprise scale.
        </BalancedText>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 font-nav px-6 py-3 transition-all duration-200"
            style={{ backgroundColor: '#0A0A0A', border: '1px solid #222222', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FF3366'; e.currentTarget.style.color = '#050505'; e.currentTarget.style.borderColor = 'transparent'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0A0A0A'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = '#222222'; }}
          >
            GET IN TOUCH {'→'}
          </Link>
          <a
            href="https://github.com/alexwelcing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-nav px-6 py-3 transition-all duration-200"
            style={{ backgroundColor: 'transparent', border: '1px solid #222222', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF3366'; e.currentTarget.style.color = '#FF3366'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.color = '#FFFFFF'; }}
          >
            GITHUB {'↗'}
          </a>
          <a
            href="https://linkedin.com/in/alexwelcing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-nav px-6 py-3 transition-all duration-200"
            style={{ backgroundColor: 'transparent', border: '1px solid #222222', color: '#FFFFFF' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF3366'; e.currentTarget.style.color = '#FF3366'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.color = '#FFFFFF'; }}
          >
            LINKEDIN {'↗'}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Home Page                                                          */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="w-full" style={{ opacity: 0, animation: 'fade-in 0.6s ease-out forwards' }}>
      <HeroSection />
      <StatsBar />
      <SelectedWork />
      <AIFocus />
      <FooterCTA />
    </div>
  );
}
