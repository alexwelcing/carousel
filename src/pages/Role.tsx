import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink, Check, Download } from 'lucide-react';
import AmbientField from '@/components/AmbientField';
import { applicationPacketOverrides, getApplicationPacketLinks } from '@/data/applicationPackets';
import { getRole } from '@/data/roles';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: easeOut },
  }),
};

export default function Role() {
  const { slug } = useParams<{ slug: string }>();
  const role = getRole(slug);

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

  const accent = role.accent ?? '#FF3366';
  const packetLinks = getApplicationPacketLinks(role.slug);
  const packetOverride = applicationPacketOverrides[role.slug];

  return (
    <div style={{ opacity: 0, position: 'relative' }} className="animate-fade-in">
      <AmbientField particleCount={50} opacity={0.12} connectDistance={150} />

      {/* ============================================================ */}
      {/* HERO                                                         */}
      {/* ============================================================ */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          minHeight: '70vh',
          backgroundColor: 'var(--bg-primary)',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
          paddingTop: '64px',
        }}
      >
        <div className="max-w-[860px]">
          <motion.span
            className="font-caption block mb-6"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            {role.tagline}
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
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              color: 'var(--text-primary)',
              lineHeight: 1.05,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            {role.headline}
          </motion.h1>

          <motion.p
            className="font-body mb-10"
            style={{ color: 'var(--text-secondary)', maxWidth: '640px', lineHeight: 1.7 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
          >
            {role.intro}
          </motion.p>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={role.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-nav inline-flex items-center justify-center gap-2 px-6 py-3 transition-all duration-200"
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
                className="font-nav inline-flex items-center justify-center gap-2 px-6 py-3 transition-all duration-200"
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
                className="font-nav inline-flex items-center justify-center gap-2 px-6 py-3 transition-all duration-200"
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

              <a
                href={packetLinks.resumePrintPdf}
                download={`Alex-Welcing-${role.company.replace(/[^A-Za-z0-9]+/g, '-')}-Resume-Print.pdf`}
                className="font-nav inline-flex items-center justify-center gap-2 px-6 py-3 transition-all duration-200"
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
                PRINTER-FRIENDLY
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
      {/* WHY I FIT                                                    */}
      {/* ============================================================ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          paddingTop: 'clamp(80px, 10vh, 140px)',
          paddingBottom: 'clamp(80px, 10vh, 140px)',
        }}
      >
        <div className="content-max-width">
          <span className="font-caption block mb-12" style={{ color: 'var(--text-tertiary)' }}>
            [ WHY I FIT THIS ROLE ]
          </span>

          <div className="flex flex-col gap-6">
            {role.whyFit.map((item, idx) => (
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
          paddingTop: 'clamp(64px, 8vh, 120px)',
          paddingBottom: 'clamp(64px, 8vh, 120px)',
        }}
      >
        <div className="content-max-width">
          <span className="font-caption block mb-10" style={{ color: 'var(--text-tertiary)' }}>
            [ PROOF ]
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {role.proof.map((p, idx) => (
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
          paddingTop: 'clamp(64px, 8vh, 120px)',
          paddingBottom: 'clamp(64px, 8vh, 120px)',
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
