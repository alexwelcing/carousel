import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { Flagship } from '@/data/projects';

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

function MoleculeGlyph({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <line x1="12" y1="12" x2="4" y2="7" stroke={color} strokeWidth="1.6" />
      <line x1="12" y1="12" x2="20" y2="9" stroke={color} strokeWidth="1.6" />
      <line x1="12" y1="12" x2="12" y2="21" stroke={color} strokeWidth="1.6" />
      <circle cx="4" cy="7" r="2.4" fill={color} />
      <circle cx="20" cy="9" r="2.4" fill={color} />
      <circle cx="12" cy="21" r="2.4" fill={color} />
      <circle cx="12" cy="12" r="3.2" fill={color} />
    </svg>
  );
}

export default function FlagshipCard({ project, index = 0 }: { project: Flagship; index?: number }) {
  const accent = project.accent;
  return (
    <motion.div
      className="flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easeOut }}
      whileHover={{ y: -3 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
    >
      {project.video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={project.image}
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            objectFit: 'cover',
            display: 'block',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-primary)',
          }}
        >
          {project.videoWebm && <source src={project.videoWebm} type="video/webm" />}
          <source src={project.video} type="video/mp4" />
        </video>
      ) : project.image ? (
        <div
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-primary)',
            backgroundImage: `url(${project.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : null}
      <div className="flex flex-col p-7">
        <div className="flex items-center justify-between mb-3">
          <span className="font-caption" style={{ color: accent }}>{project.tag}</span>
          <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>{project.status}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {project.molecule && <MoleculeGlyph color={accent} />}
          <h3 className="font-h2" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
        </div>

        <p className="font-body-small mb-5" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="font-caption"
              style={{
                padding: '4px 10px',
                borderRadius: '3px',
                backgroundColor: 'var(--bg-hover)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-auto">
            {project.links.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-nav inline-flex items-center gap-1.5 transition-colors duration-200"
                style={{ color: accent }}
              >
                {l.label} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
