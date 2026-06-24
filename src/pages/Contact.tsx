import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, FileText, MapPin, ArrowUpRight } from 'lucide-react';
import AmbientField from '@/components/AmbientField';
import PageIntro from '@/components/PageIntro';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

interface Method {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  download?: boolean;
}

const METHODS: Method[] = [
  { icon: <Mail className="w-5 h-5" />, label: 'Email', value: 'alexwelcing@gmail.com', href: 'mailto:alexwelcing@gmail.com' },
  { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', value: 'in/alexwelcing', href: 'https://linkedin.com/in/alexwelcing' },
  { icon: <Github className="w-5 h-5" />, label: 'GitHub', value: 'github.com/alexwelcing', href: 'https://github.com/alexwelcing' },
  { icon: <FileText className="w-5 h-5" />, label: 'Résumé', value: 'Download PDF', href: '/resume.pdf', download: true },
];

export default function Contact() {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', position: 'relative', minHeight: '100dvh' }} className="animate-fade-in">
      <AmbientField particleCount={40} opacity={0.1} connectDistance={140} />

      <PageIntro
        kicker="[ CONTACT ]"
        title="Get in touch"
        description="Open to Principal / Staff Product, Forward-Deployed Engineering, and founding roles where AI meets enterprise scale. The fastest way to reach me is email."
      />

      <section
        className="relative"
        style={{
          paddingBottom: 'clamp(80px, 10vh, 140px)',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}
      >
        <div className="max-w-[760px]">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[640px]">
            {METHODS.map((m, i) => (
              <motion.a
                key={m.label}
                href={m.href}
                {...(m.download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
                className="group flex items-center gap-4 p-5 transition-all duration-200"
                style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: easeOut }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <span style={{ color: 'var(--accent)' }}>{m.icon}</span>
                <span className="flex flex-col">
                  <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>{m.label}</span>
                  <span className="font-body-small" style={{ color: 'var(--text-primary)' }}>{m.value}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 ml-auto" style={{ color: 'var(--text-tertiary)' }} />
              </motion.a>
            ))}
          </div>

          <motion.div
            className="flex items-center gap-2 mt-10 font-caption"
            style={{ color: 'var(--text-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <MapPin className="w-3.5 h-3.5" /> New York, NY
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes contact-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: contact-fade-in 500ms ease-out; }
      `}</style>
    </div>
  );
}
