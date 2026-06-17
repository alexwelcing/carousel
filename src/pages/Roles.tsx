import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AmbientField from '@/components/AmbientField';
import { roles } from '@/data/roles';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: easeOut },
  }),
};

export default function Roles() {
  return (
    <div style={{ opacity: 0, position: 'relative' }} className="animate-fade-in">
      <AmbientField particleCount={50} opacity={0.12} connectDistance={150} />

      {/* Header */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          minHeight: '50vh',
          backgroundColor: 'var(--bg-primary)',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
          paddingTop: '64px',
        }}
      >
        <div className="max-w-[800px]">
          <motion.span
            className="font-caption block mb-6"
            style={{ color: 'var(--text-tertiary)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            [ TAILORED FOR EACH TEAM ]
          </motion.span>
          <motion.h1
            className="font-display mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: 'var(--text-primary)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            WHY I FIT
          </motion.h1>
          <motion.p
            className="font-body"
            style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.7 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
          >
            A page built for the exact role and team. Each one maps my experience to your
            problem — and links straight to the application.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          paddingTop: 'clamp(64px, 8vh, 120px)',
          paddingBottom: 'clamp(80px, 10vh, 160px)',
        }}
      >
        <div className="content-max-width grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role, idx) => {
            const accent = role.accent ?? '#FF3366';
            return (
              <motion.div
                key={role.slug}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
              >
                <Link
                  to={`/role/${role.slug}`}
                  className="block h-full p-8 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = accent;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span className="font-caption block mb-3" style={{ color: accent }}>
                    {role.company.toUpperCase()}
                  </span>
                  <h3 className="font-h2 mb-2" style={{ color: 'var(--text-primary)' }}>
                    {role.roleTitle}
                  </h3>
                  <span className="font-caption block mb-5" style={{ color: 'var(--text-tertiary)' }}>
                    {role.location}
                  </span>
                  <p className="font-body-small mb-6" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {role.headline}
                  </p>
                  <span className="font-nav inline-flex items-center gap-2" style={{ color: accent }}>
                    OPEN PAGE <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <style>{`
        @keyframes roles-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: roles-fade-in 600ms ease-out forwards; }
      `}</style>
    </div>
  );
}
