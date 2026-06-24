import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import AmbientField from '@/components/AmbientField';
import FlagshipCard from '@/components/FlagshipCard';
import PageIntro from '@/components/PageIntro';
import { flagships } from '@/data/projects';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

export default function Projects() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', position: 'relative' }} className="animate-fade-in">
      <AmbientField particleCount={24} opacity={0.03} color="var(--accent)" lineColor="rgba(29, 63, 212, 0.04)" connectDistance={140} />

      <PageIntro
        kicker="[ SELECTED WORK ]"
        title="Work with depth, not decoration."
        description="Multi-agent systems, enterprise platforms, 3D web, and materials-science AI — designed and shipped, usually end to end."
      />

      {/* Flagship grid */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-primary)',
          paddingBottom: 'clamp(64px, 8vh, 120px)',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1100px]">
          {flagships.map((p, i) => (
            <FlagshipCard key={p.slug} project={p} index={i} />
          ))}
        </div>

        <div className="mt-12">
          <a
            href="https://github.com/alexwelcing"
            target="_blank"
            rel="noopener noreferrer"
            className="font-nav inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
            style={{ backgroundColor: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: '999px' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          >
            <Github className="w-4 h-4" /> More on GitHub
          </a>
        </div>
      </section>

      {/* CTA */}
      <section
        className="flex flex-col items-center justify-center text-center"
        style={{ padding: 'clamp(80px, 10vh, 140px) clamp(24px, 5vw, 80px)', backgroundColor: 'var(--bg-elevated)' }}
      >
        <motion.div
          className="flex flex-col items-center gap-6 max-w-[640px]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <h2 className="font-h1" style={{ color: 'var(--text-primary)' }}>BUILD SOMETHING WITH ME</h2>
          <p className="font-body" style={{ color: 'var(--text-secondary)' }}>
            Open to Principal / Staff Product, Forward-Deployed Engineering, and founding roles where AI meets enterprise scale.
          </p>
          <Link
            to="/contact"
            className="font-nav inline-flex items-center gap-2 px-6 py-3 transition-all duration-200"
            style={{ backgroundColor: 'var(--text-primary)', border: '1px solid var(--text-primary)', color: 'var(--bg-primary)', borderRadius: '999px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-primary)'; }}
          >
            GET IN TOUCH <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      <style>{`
        @keyframes proj-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: proj-fade-in 500ms ease-out; }
      `}</style>
    </div>
  );
}
