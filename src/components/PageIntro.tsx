import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const easeOut = [0, 0, 0.2, 1] as const;

interface PageIntroProps {
  kicker: string;
  title: string;
  description: string;
  meta?: ReactNode;
  align?: 'left' | 'center';
}

export default function PageIntro({ kicker, title, description, meta, align = 'left' }: PageIntroProps) {
  const isCenter = align === 'center';

  return (
    <header className={`relative overflow-hidden ${isCenter ? 'text-center' : ''}`} style={{ paddingTop: 'clamp(48px, 8vh, 120px)', paddingBottom: 'clamp(40px, 7vh, 88px)' }}>
      <div className={`content-max-width ${isCenter ? 'flex flex-col items-center' : ''}`}>
        <motion.span
          className="font-caption block mb-5"
          style={{ color: 'var(--accent)' }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          {kicker}
        </motion.span>

        <motion.h1
          className="font-h1 mb-5 max-w-[13ch] sm:max-w-[14ch] break-words"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: easeOut }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="font-body max-w-[46rem] min-w-0"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.14, ease: easeOut }}
        >
          {description}
        </motion.p>

        {meta ? (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18, ease: easeOut }}
          >
            {meta}
          </motion.div>
        ) : null}
      </div>
    </header>
  );
}