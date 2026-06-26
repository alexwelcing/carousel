import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Check, Download, Play, X } from 'lucide-react';
import AmbientField from '@/components/AmbientField';
import { applicationPacketOverrides, getApplicationPacketLinks } from '@/data/applicationPackets';
import { getRole } from '@/data/roles';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

// Defensive sanitization for candidate-facing strings sourced from data/roles.ts.
// Strip dangling separators that would otherwise produce awkward "I manatt",
// double-colon "::", mid-word truncation, or quoted-with-no-close artifacts.
function stripUnbalancedQuotes(s: string): string {
  const singles = (s.match(/'/g) || []).length;
  const doubles = (s.match(/"/g) || []).length;
  let out = s;
  if (singles % 2 === 1) out = out.replace(/['\u2018\u2019]/g, '');
  if (doubles % 2 === 1) out = out.replace(/["\u201c\u201d]/g, '');
  return out;
}

function sanitizeDisplay(value: string | undefined, cap = 200): string {
  if (!value) return '';
  let s = value.replace(/\s+/g, ' ').trim();
  // Strip leading dangling quote (open half of an unbalanced pair)
  s = s.replace(/^[\s"'\u2018\u2019]+/, '').trim();
  // Strip trailing brackets / pipes (decorative wrappers like [ AI · AGENTS · & ])
  s = s.replace(/[\])]+\s*$/, '').trim();
  // Strip trailing clusters of separator / quote characters
  s = s.replace(/[\s"'\u2018\u2019:;.―-]+$/g, '').trim();
  // Drop a trailing dangling `&` (engine produced `[ AI · AGENTS · & ]`)
  s = s.replace(/\s*&\s*$/, '').trim();
  // Strip mid-word truncation artifacts: a stray fragment followed by `…`
  s = s.replace(/\s+\S*…\s*$/, '').trim();
  // If the string ends mid-word without a sentence terminator (no . ! ? …),
  // chop it at the last sentence terminator so we don't render "...scanning an".
  if (s && !/[.!?…\]]$/.test(s)) {
    const lastTerm = Math.max(
      s.lastIndexOf('. '),
      s.lastIndexOf('! '),
      s.lastIndexOf('? '),
      s.lastIndexOf('.'),
    );
    if (lastTerm > 20) s = s.slice(0, lastTerm + 1);
  }
  // If quotes are still unbalanced after the above, drop them all so the
  // candidate-facing copy never shows a half-quoted sentence.
  s = stripUnbalancedQuotes(s);
  // Smart-end punctuation
  if (s.length > 0 && !/[.!?]$/.test(s)) s = s + '.';
  if (s.length > cap) {
    s = s.slice(0, cap).replace(/\s+\S*$/, '').trim();
    if (!/[.!?]$/.test(s)) s = s + '.';
  }
  return s;
}

function sanitizeWhyFit(items: Array<{ point: string; detail: string }> | undefined) {
  if (!items) return [];
  return items.map((it) => ({
    point: sanitizeDisplay(it.point, 80).replace(/[.!?]+$/, ''),
    detail: sanitizeDisplay(it.detail, 280).replace(/^[\s"'-]+/, ''),
  }));
}

function sanitizeProof(items: string[] | undefined): string[] {
  if (!items) return [];
  return items
    .map((p) => sanitizeDisplay(p, 180))
    // Filter out residual metadata-label strings that slipped through data.
    .filter((p) => !/^(AI\s+focus|Stage|Funding|Comp|Location|Type|Status)\s*:/i.test(p))
    .filter((p) => !/^[\d.]+[KMk]\s+raised/i.test(p))
    .filter((p) => !/[€$£]\s?\d/.test(p));
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: easeOut },
  }),
};

type PacketManifest = {
  packets?: Array<{
    slug: string;
    shareId: string;
    pitchVideoMp4?: string;
  }>;
};

export default function Role() {
  const { slug } = useParams<{ slug: string }>();
  const role = getRole(slug);

  // All hooks must be called in the same order on every render, so they
  // run BEFORE any early-return based on `role`.
  const accent = role?.accent ?? '#FF3366';
  const safeHeadline = sanitizeDisplay(role?.headline, 180);
  const safeIntro = sanitizeDisplay(role?.intro, 400).replace(/\.$/, '');
  const safeTagline = sanitizeDisplay(role?.tagline, 80);
  const safeWhyFit = sanitizeWhyFit(role?.whyFit);
  const safeProof = sanitizeProof(role?.proof);
  const packetLinks = role ? getApplicationPacketLinks(role.slug) : {
    resumePdf: '#', resumePrintPdf: '#', coverLetterTxt: '#', pitchHtml: '#',
  };
  const packetOverride = role ? applicationPacketOverrides[role.slug] : undefined;
  const [pitchVideoSrc, setPitchVideoSrc] = useState<string | undefined>(packetLinks.pitchVideoMp4);
  const [pitchMode, setPitchMode] = useState<'video' | 'frame'>(packetLinks.pitchVideoMp4 ? 'video' : 'frame');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!role) return;
    let cancelled = false;

    fetch('/applications/manifest.json', { cache: 'no-cache' })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`manifest ${response.status}`))))
      .then((manifest: PacketManifest) => {
        const packet = manifest.packets?.find((item) => item.slug === role.slug || item.shareId === slug);
        if (cancelled) return;
        if (packet?.pitchVideoMp4) {
          setPitchVideoSrc(packet.pitchVideoMp4);
          setPitchMode('video');
        } else {
          setPitchVideoSrc(undefined);
          setPitchMode('frame');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPitchVideoSrc(undefined);
          setPitchMode('frame');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [role, slug]);

  // Esc key closes the pitch lightbox.
  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  // Lock body scroll while lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen]);

  if (!role) {
    return (
      <div
        style={{
          minHeight: '80vh',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}
      >
        <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>
          [ 404 · NO TAILORED PAGE FOR "{slug}" ]
        </span>
        <h1 className="font-h1 text-center" style={{ color: 'var(--text-primary)' }}>
          That role page doesn't exist yet.
        </h1>
        <Link
          to="/"
          className="font-nav inline-flex items-center gap-2 px-6 py-3"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            color: 'var(--text-primary)',
          }}
        >
          <ArrowLeft className="w-4 h-4" /> HOME
        </Link>
      </div>
    );
  }

  return (
    <div style={{ opacity: 0, position: 'relative' }} className="animate-fade-in">
      <AmbientField particleCount={50} opacity={0.12} connectDistance={150} />

      {/* ============================================================ */}
      {/* HERO                                                         */}
      {/* ============================================================ */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          minHeight: 'auto',
          paddingTop: '48px',
          paddingBottom: '40px',
          backgroundColor: 'var(--bg-primary)',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="w-full max-w-[860px]">
          <motion.span
            className="font-caption block mb-6"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            {safeTagline}
          </motion.span>

          <motion.span
            className="font-caption block mb-4"
            style={{ color: 'var(--text-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.05, ease: easeOut }}
          >
            FOR {role.company.toUpperCase()} · {role.roleTitle.toUpperCase()} · {role.location.toUpperCase()}
          </motion.span>

          <motion.h1
            className="font-display mb-8"
            style={{
              fontSize: 'clamp(1.75rem, 4.4vw, 3.75rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              maxWidth: '100%',
              overflowWrap: 'break-word',
              wordBreak: 'normal',
              hyphens: 'auto',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            {safeHeadline}
          </motion.h1>

          <motion.p
            className="font-body mb-10"
            style={{ color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: 1.7, overflowWrap: 'break-word' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
          >
            {safeIntro}
          </motion.p>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
          >
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-3 w-full min-w-0">
              <a
                href={role.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-nav inline-flex items-center justify-center gap-2 px-5 py-3 transition-all duration-200 whitespace-nowrap min-w-0"
                style={{
                  backgroundColor: accent,
                  color: '#050505',
                  border: '1px solid transparent',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.88';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                APPLY / VIEW ROLE
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={packetLinks.resumePdf}
                download={`Alex-Welcing-${role.company.replace(/[^A-Za-z0-9]+/g, '-')}-Resume.pdf`}
                className="font-nav inline-flex items-center justify-center gap-2 px-5 py-3 transition-all duration-200 whitespace-nowrap min-w-0"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Download className="w-4 h-4" />
                RÉSUMÉ FOR {role.company.toUpperCase()}
              </a>

              <a
                href={packetLinks.coverLetterTxt}
                download={`Alex-Welcing-${role.company.replace(/[^A-Za-z0-9]+/g, '-')}-Cover-Letter.txt`}
                className="font-nav inline-flex items-center justify-center gap-2 px-5 py-3 transition-all duration-200 whitespace-nowrap min-w-0"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-tertiary)',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                }}
              >
                <Download className="w-4 h-4" />
                COVER LETTER
              </a>

              {packetLinks.coverLetterPdf && (
                <a
                  href={packetLinks.coverLetterPdf}
                  download={`Alex-Welcing-${role.company.replace(/[^A-Za-z0-9]+/g, '-')}-Cover-Letter.pdf`}
                  className="font-nav inline-flex items-center justify-center gap-2 px-5 py-3 transition-all duration-200 whitespace-nowrap min-w-0"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-tertiary)',
                    borderRadius: '4px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.color = accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-tertiary)';
                  }}
                >
                  <Download className="w-4 h-4" />
                  COVER LETTER PDF
                </a>
              )}

              <a
                href={packetLinks.resumePrintPdf}
                download={`Alex-Welcing-${role.company.replace(/[^A-Za-z0-9]+/g, '-')}-Resume-Print.pdf`}
                className="font-nav inline-flex items-center justify-center gap-2 px-5 py-3 transition-all duration-200 whitespace-nowrap min-w-0"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-tertiary)',
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accent;
                  e.currentTarget.style.color = accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-tertiary)';
                }}
              >
                <Download className="w-4 h-4" />
                PRINTER-FRIENDLY PDF
              </a>
            </div>

            <div
              className="max-w-[760px]"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '18px 20px',
              }}
            >
              <div className="font-caption mb-3" style={{ color: accent }}>
                [ APPLICATION PACKET READY ]
              </div>
              <p className="font-body-small" style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '10px' }}>
                {packetOverride?.summary || `Tailored packet for ${role.company}: role-specific resume, direct cover letter, and print-ready variant prepared for outreach.`}
              </p>
              {packetOverride?.recruiterNote && (
                <p className="font-caption" style={{ color: 'var(--text-tertiary)' }}>
                  {packetOverride.recruiterNote}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 30 SECOND ROLE PITCH                                         */}
      {/* ============================================================ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-primary)',
          paddingTop: 'clamp(40px, 5vh, 64px)',
          paddingBottom: 'clamp(56px, 7vh, 96px)',
          paddingLeft: 'clamp(20px, 5vw, 80px)',
          paddingRight: 'clamp(20px, 5vw, 80px)',
        }}
      >
        <div className="content-max-width grid grid-cols-1 lg:grid-cols-[0.74fr_1.26fr] gap-8 lg:gap-12 items-center min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <span className="font-caption block mb-5" style={{ color: accent }}>
              [ 30 SECOND ROLE PITCH ]
            </span>
            <h2 className="font-h2 mb-5" style={{ color: 'var(--text-primary)' }}>
              A quick video version of the packet.
            </h2>
            <p className="font-body-small mb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
              Built from the same role-specific data as the résumé and cover letter: company context, target title, mapped fit, proof points, and the anonymous packet URL.
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="font-nav inline-flex items-center gap-2 px-5 py-3 transition-all duration-200"
              style={{
                color: 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                backgroundColor: 'var(--bg-elevated)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.color = accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              <Play className="w-4 h-4" />
              PLAY 30s PITCH
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: easeOut }}
            style={{
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              backgroundColor: '#05070d',
              padding: '10px',
              boxShadow: '0 28px 80px rgba(16, 20, 28, 0.22)',
            }}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Play 30-second role pitch"
              className="block w-full"
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                overflow: 'hidden',
                borderRadius: '16px',
                cursor: 'pointer',
                border: 0,
                padding: 0,
                background: `radial-gradient(circle at 20% 10%, color-mix(in srgb, ${accent} 28%, transparent), transparent 34%), radial-gradient(circle at 82% 22%, rgba(51, 204, 255, 0.16), transparent 32%), linear-gradient(135deg, #05070d 0%, #0b1020 52%, #111827 100%)`,
                textAlign: 'left',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'clamp(20px, 4vw, 40px)',
                gap: '14px',
                color: '#f8fafc',
              }}>
                <span style={{
                  fontFamily: '"Courier New", monospace',
                  fontSize: 'clamp(10px, 1.2vw, 14px)',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: accent,
                }}>
                  {role.company} · 30s pitch
                </span>
                <h3 style={{
                  fontSize: 'clamp(1.1rem, 2.4vw, 2rem)',
                  lineHeight: 1.15,
                  fontWeight: 850,
                  letterSpacing: '-0.025em',
                  margin: 0,
                  overflowWrap: 'break-word',
                }}>
                  {safeHeadline}
                </h3>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px 24px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255,255,255,0.12)',
                }}>
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 'clamp(9px, 1vw, 12px)',
                    color: 'rgba(248,250,252,0.62)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}>For {role.company}</span>
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 'clamp(9px, 1vw, 12px)',
                    color: 'rgba(248,250,252,0.62)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}>{role.roleTitle}</span>
                  <span style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: 'clamp(9px, 1vw, 12px)',
                    color: 'rgba(248,250,252,0.62)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}>{role.location}</span>
                </div>
              </div>

              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 'clamp(64px, 9vw, 96px)',
                height: 'clamp(64px, 9vw, 96px)',
                borderRadius: '50%',
                backgroundColor: 'rgba(5,7,13,0.65)',
                border: `2px solid ${accent}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(6px)',
                boxShadow: `0 12px 40px color-mix(in srgb, ${accent} 30%, transparent)`,
              }}>
                <Play className="w-7 h-7" style={{ color: accent, marginLeft: 4 }} />
              </div>

              <div style={{
                position: 'absolute',
                left: 'clamp(14px, 2vw, 24px)',
                bottom: 'clamp(14px, 2vw, 24px)',
                fontFamily: '"Courier New", monospace',
                fontSize: 'clamp(9px, 1vw, 12px)',
                color: 'rgba(248,250,252,0.5)',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
              }}>
                Alex Welcing · AI product builder
              </div>
              <div style={{
                position: 'absolute',
                right: 'clamp(14px, 2vw, 24px)',
                bottom: 'clamp(14px, 2vw, 24px)',
                fontFamily: '"Courier New", monospace',
                fontSize: 'clamp(9px, 1vw, 12px)',
                color: 'rgba(248,250,252,0.62)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}>
                0:00 / 0:30
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Lightbox modal — renders the iframe at its native 1920x1080 size
          so the HyperFrames content scales correctly. Auto-closes on Esc /
          backdrop click. */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="pitch-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="30-second role pitch"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(2,4,10,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(12px, 3vw, 32px)',
              cursor: 'zoom-out',
            }}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
              aria-label="Close pitch"
              style={{
                position: 'absolute',
                top: 'clamp(12px, 2vw, 20px)',
                right: 'clamp(12px, 2vw, 20px)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#f8fafc',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.22, ease: easeOut }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: 'min(100%, calc((100vh - 96px) * 16 / 9))',
                aspectRatio: '16 / 9',
                maxHeight: 'calc(100vh - 96px)',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#05070d',
                cursor: 'default',
                boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
              }}
            >
              {pitchMode === 'video' && pitchVideoSrc ? (
                <video
                  src={pitchVideoSrc}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  style={{ width: '100%', height: '100%', display: 'block', backgroundColor: '#05070d' }}
                />
              ) : (
                <iframe
                  src={packetLinks.pitchHtml}
                  title={`${role.company} role pitch video`}
                  allow="autoplay"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin"
                  style={{ width: '100%', height: '100%', border: 0, display: 'block', backgroundColor: '#05070d' }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* WHY I FIT                                                    */}
      {/* ============================================================ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          paddingTop: 'clamp(48px, 6vh, 80px)',
          paddingBottom: 'clamp(48px, 6vh, 80px)',
        }}
      >
        <div className="content-max-width">
          <span className="font-caption block mb-8" style={{ color: 'var(--text-tertiary)' }}>
            [ WHY I FIT THIS ROLE ]
          </span>

          <div className="flex flex-col gap-6">
            {safeWhyFit.map((item, idx) => (
              <motion.div
                key={item.point}
                className="p-8"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                }}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full"
                    style={{ border: `2px solid ${accent}` }}
                  >
                    <Check className="w-3 h-3" style={{ color: accent }} />
                  </span>
                  <div>
                    <h3 className="font-h3 mb-2" style={{ color: 'var(--text-primary)' }}>
                      {item.point}
                    </h3>
                    <p className="font-body-small" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      {item.detail}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROOF                                                        */}
      {/* ============================================================ */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-primary)',
          paddingTop: 'clamp(48px, 6vh, 80px)',
          paddingBottom: 'clamp(48px, 6vh, 80px)',
        }}
      >
        <div className="content-max-width">
          <span className="font-caption block mb-8" style={{ color: 'var(--text-tertiary)' }}>
            [ PROOF ]
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safeProof.map((p, idx) => (
              <motion.div
                key={p}
                className="p-6"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                }}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
              >
                <span className="font-body-small" style={{ color: 'var(--text-primary)' }}>
                  <span style={{ color: accent }}>&gt; </span>
                  {p}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA FOOTER                                                   */}
      {/* ============================================================ */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          paddingTop: 'clamp(48px, 6vh, 80px)',
          paddingBottom: 'clamp(48px, 6vh, 80px)',
        }}
      >
        <div className="content-max-width flex flex-col items-center text-center gap-8">
          <h2 className="font-h1" style={{ color: 'var(--text-primary)' }}>
            LET'S TALK, {role.company.toUpperCase()}.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={role.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-nav inline-flex items-center justify-center gap-2 px-6 py-3"
              style={{ backgroundColor: accent, color: '#050505', borderRadius: '4px' }}
            >
              APPLY / VIEW ROLE <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              to="/contact"
              className="font-nav inline-flex items-center justify-center gap-2 px-6 py-3"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '4px',
              }}
            >
              CONTACT ME <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <Link
            to="/"
            className="font-caption inline-flex items-center gap-2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <ArrowLeft className="w-3 h-3" /> BACK TO SITE
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes role-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: role-fade-in 600ms ease-out forwards; }
      `}</style>
    </div>
  );
}
