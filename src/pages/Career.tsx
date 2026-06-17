import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Award,
  Zap,
  Trophy,
  Flame,
  Snowflake,
  ArrowRight,
} from 'lucide-react';
import AmbientField from '@/components/AmbientField';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Role {
  company: string;
  title: string;
  period: string;
  bullets: string[];
  side: 'left' | 'right';
}

const roles: Role[] = [
  {
    company: 'Law Business Research',
    title: 'Technical Product Manager — Identity & Platform',
    period: 'Jan 2024 – Jun 2026',
    bullets: [
      'Launched AI API execution workspace with type safety, oRPC, and self-improving model usage accuracy across 3 separate APIs',
      'Replaced legacy platform handling billions of monthly requests — unified access, unlocked revenue growth',
      'Architect PM who prototypes and ships — rebuilt client apps cutting configuration time 60%',
      'Enterprise SSO integrations for 150+ clients including AmLaw 200 law firms',
    ],
    side: 'left',
  },
  {
    company: 'Obsess VR',
    title: 'Product Manager',
    period: 'Apr 2022 – May 2023',
    bullets: [
      'Led 3D platform features: user auth, analytics, SOC2 compliance for enterprise brands',
      'Shipped for Alo, Moncler, Ralph Lauren — set long-term SaaS platform strategy',
    ],
    side: 'right',
  },
  {
    company: 'Manatt, Phelps & Phillips',
    title: 'Developer → Consultant',
    period: 'Aug 2017 – Apr 2022',
    bullets: [
      'Devised AI-based document scanning for publication — enhanced knowledge graph precision, eliminated errors',
      'Built publishing SaaS from beta to millions in ARR with enterprise-grade data governance',
      'Led access management and IAM for legal research platform serving top 1000 clients',
    ],
    side: 'left',
  },
  {
    company: 'Arkadium',
    title: 'Partner Development',
    period: 'Jul 2016 – Aug 2017',
    bullets: [
      'Pioneered NLP-driven AI partnerships leveraging contextual understanding for interactive content',
      'Spearheaded AI integration into partner initiatives — 25% faster GTM, cross-platform adoption KPIs',
    ],
    side: 'right',
  },
];

interface SkillCategory {
  name: string;
  color: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'AI/ML',
    color: '#FF3366',
    skills: [
      'LLM Integration',
      'AI APIs',
      'NLP',
      'Model Ops',
      'Prompt Engineering',
      'Agent Development',
    ],
  },
  {
    name: 'Frontend',
    color: '#33CCFF',
    skills: [
      'TypeScript',
      'React',
      'Vue',
      'Svelte',
      'MDX',
      'JAMstack',
      'Modern CSS',
    ],
  },
  {
    name: 'Backend/Systems',
    color: '#E6E7E8',
    skills: ['Python', 'Go', 'Elixir', 'SQL', 'API Design', 'System Architecture'],
  },
  {
    name: 'Platform',
    color: '#3178C6',
    skills: [
      'Enterprise SaaS',
      'Data Products',
      'Analytics',
      'Scale',
      'DevOps',
      'Cloud',
    ],
  },
  {
    name: 'Product',
    color: '#41B883',
    skills: [
      '0→1',
      'Cross-Functional',
      'Enterprise GTM',
      'Developer Tools',
      'AI Strategy',
    ],
  },
];

interface Achievement {
  name: string;
  icon: React.ReactNode;
}

const achievements: Achievement[] = [
  { name: 'Pair Extraordinaire', icon: <Award className="w-6 h-6" /> },
  { name: 'Quickdraw', icon: <Zap className="w-6 h-6" /> },
  { name: 'Pull Shark \u00d73', icon: <Trophy className="w-6 h-6" /> },
  { name: 'YOLO', icon: <Flame className="w-6 h-6" /> },
  {
    name: 'Arctic Code Vault Contributor',
    icon: <Snowflake className="w-6 h-6" />,
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const easeOut = [0, 0, 0.2, 1] as [number, number, number, number];

const timelineCardLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: easeOut },
  }),
};

const timelineCardRight = {
  hidden: { opacity: 0, x: 30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: easeOut },
  }),
};

const dotScale = {
  hidden: { scale: 0 },
  visible: (i: number) => ({
    scale: 1,
    transition: {
      delay: i * 0.12 + 0.2,
      duration: 0.5,
      ease: [0.68, -0.15, 0.265, 1.25] as [number, number, number, number],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const skillTag = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOut },
  }),
};

const fadeUpSingle = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

/* ------------------------------------------------------------------ */
/*  RadarChart (canvas)                                                */
/* ------------------------------------------------------------------ */

function RadarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(canvasRef, { once: true, amount: 0.3 });

  const axes = [
    'AI/ML Engineering',
    'Frontend Architecture',
    'Backend Systems',
    'Product Strategy',
    'DevOps/Cloud',
    'Open Source',
  ];
  const values = [0.95, 0.9, 0.75, 0.88, 0.7, 0.92];
  const color = '#33CCFF';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInView) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = Math.min(cx, cy) - 50;
    const levels = 5;
    const angleStep = (Math.PI * 2) / axes.length;

    let progress = 0;
    const duration = 1500;
    const startTime = performance.now();

    function draw(p: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, rect.width, rect.height);

      /* grid */
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 1;
      for (let l = 1; l <= levels; l++) {
        const r = (radius / levels) * l;
        ctx.beginPath();
        for (let i = 0; i <= axes.length; i++) {
          const angle = i * angleStep - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      /* axes */
      for (let i = 0; i < axes.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.stroke();
      }

      /* data polygon */
      const currentValues = values.map((v) => v * Math.min(p, 1));
      ctx.beginPath();
      for (let i = 0; i <= axes.length; i++) {
        const idx = i % axes.length;
        const angle = idx * angleStep - Math.PI / 2;
        const r = currentValues[idx] * radius;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(51, 204, 255, 0.15)';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      /* data points */
      for (let i = 0; i < axes.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const r = currentValues[i] * radius;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      /* labels */
      ctx.font = "10px 'IBM Plex Mono', monospace";
      ctx.fillStyle = '#A0A0A0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < axes.length; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const labelR = radius + 24;
        const x = cx + Math.cos(angle) * labelR;
        const y = cy + Math.sin(angle) * labelR;
        ctx.fillText(axes[i], x, y);
      }
    }

    function animate(now: number) {
      const elapsed = now - startTime;
      progress = Math.min(elapsed / duration, 1);
      draw(progress);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [isInView]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
      className="min-h-[320px]"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Career Page                                                        */
/* ------------------------------------------------------------------ */

export default function Career() {
  return (
    <div style={{ opacity: 0, position: 'relative' }} className="animate-fade-in">
      <AmbientField particleCount={50} opacity={0.12} connectDistance={150} />
      {/* ============================================================ */}
      {/* SECTION 1 — Page Header                                      */}
      {/* ============================================================ */}
      <section
        className="relative flex items-center overflow-hidden"
        style={{
          minHeight: '60vh',
          backgroundColor: 'var(--bg-primary)',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
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
            [ PROFESSIONAL HISTORY ]
          </motion.span>

          <motion.h1
            className="font-display mb-6"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 6rem)',
              color: 'var(--text-primary)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          >
            15 YEARS OF BUILDING
          </motion.h1>

          <motion.p
            className="font-body mb-8"
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              lineHeight: 1.7,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
          >
            From NLP-driven AI partnerships in 2011 to modern multi-agent systems
            today. Fifteen years of technical product management, frontend
            architecture, and enterprise SaaS at scale — strategy and shipped code,
            from the same person.
          </motion.p>

          <motion.span
            className="font-caption block"
            style={{ color: 'var(--text-tertiary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: easeOut }}
          >
            2011–2026 | AI → PUBLISHING → VR → ENTERPRISE PLATFORMS
          </motion.span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — Career Timeline                                  */}
      {/* ============================================================ */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          paddingTop: '120px',
          paddingBottom: '120px',
        }}
      >
        {/* Section label */}
        <div className="content-max-width mb-16">
          <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>
            [ CAREER TIMELINE ]
          </span>
        </div>

        {/* Timeline container */}
        <div className="content-max-width relative">
          {/* Central vertical line — desktop only */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
            style={{
              width: '2px',
              backgroundColor: '#FF3366',
            }}
          />

          {/* Mobile vertical line */}
          <div
            className="lg:hidden absolute top-0 bottom-0 left-[19px]"
            style={{
              width: '2px',
              backgroundColor: '#FF3366',
            }}
          />

          {/* Roles */}
          <div className="flex flex-col gap-16">
            {roles.map((role, idx) => (
              <TimelineRole key={role.company} role={role} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — Skills Matrix                                    */}
      {/* ============================================================ */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-primary)',
          paddingTop: 'clamp(80px, 10vh, 160px)',
          paddingBottom: 'clamp(80px, 10vh, 160px)',
        }}
      >
        <div className="content-max-width">
          <span
            className="font-caption block mb-12"
            style={{ color: 'var(--text-tertiary)' }}
          >
            [ SKILLS MATRIX ]
          </span>

          <div className="flex flex-col lg:flex-row gap-16">
            {/* Left column — skill categories */}
            <div className="flex-1 flex flex-col gap-10">
              {skillCategories.map((cat) => (
                <SkillCategoryBlock key={cat.name} category={cat} />
              ))}
            </div>

            {/* Right column — radar chart */}
            <div className="flex-1 flex items-center justify-center min-h-[320px]">
              <RadarChart />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — GitHub Achievements                              */}
      {/* ============================================================ */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div className="content-max-width">
          <span
            className="font-caption block mb-10"
            style={{ color: 'var(--text-tertiary)' }}
          >
            [ GITHUB ACHIEVEMENTS ]
          </span>

          <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-2">
            {achievements.map((ach, idx) => (
              <motion.div
                key={ach.name}
                className="flex-shrink-0 flex flex-col items-start gap-3 p-6"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  minWidth: '200px',
                }}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideInRight}
                whileHover={{
                  borderColor: 'var(--accent-cyan)',
                  y: -2,
                  transition: { duration: 0.2 },
                }}
              >
                <span style={{ color: 'var(--accent)' }}>{ach.icon}</span>
                <span
                  className="font-h3 text-[0.875rem]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {ach.name}
                </span>
                <span
                  className="font-caption"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  github.com/alexwelcing
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — Education                                        */}
      {/* ============================================================ */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-primary)',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <motion.div
          className="content-max-width flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpSingle}
        >
          <div
            className="w-full max-w-[800px] p-12"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
            }}
          >
            <span
              className="font-caption block mb-4"
              style={{ color: 'var(--text-tertiary)' }}
            >
              [ EDUCATION ]
            </span>

            <h2
              className="font-h2 mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              UNIVERSITY OF TEXAS AT DALLAS
            </h2>

            <p className="font-body mb-6" style={{ color: 'var(--text-primary)' }}>
              B.S. Marketing
            </p>

            <div
              className="w-full mb-6"
              style={{
                height: '1px',
                backgroundColor: 'var(--border-subtle)',
              }}
            />

            <p
              className="font-body-small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Self-taught engineer. 350+ repositories and 15 years of shipping
              production software speak louder than a CS degree.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 6 — CTA                                              */}
      {/* ============================================================ */}
      <section
        className="overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-primary)',
          paddingTop: 'clamp(80px, 10vh, 160px)',
          paddingBottom: 'clamp(80px, 10vh, 160px)',
        }}
      >
        <motion.div
          className="content-max-width flex flex-col items-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUpSingle}
        >
          <h2
            className="font-h1 mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            READY TO BUILD SOMETHING?
          </h2>

          <p
            className="font-body mb-10 max-w-[600px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Available for AI Engineering roles, technical consulting, and open
            source collaboration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="font-nav inline-flex items-center justify-center gap-2 px-6 py-3 transition-all duration-200"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FF3366';
                e.currentTarget.style.color = '#050505';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              CONTACT ME
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/projects"
              className="font-nav inline-flex items-center justify-center gap-2 px-6 py-3 transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF3366';
                e.currentTarget.style.color = '#FF3366';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
            >
              VIEW PROJECTS
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Global fade-in animation style */}
      <style>{`
        @keyframes career-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: career-fade-in 600ms ease-out forwards;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TimelineRole sub-component                                         */
/* ------------------------------------------------------------------ */

function TimelineRole({ role, idx }: { role: Role; idx: number }) {
  const isLeft = role.side === 'left';

  return (
    <div
      className={`relative flex items-start gap-8 ${
        isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } flex-row`}
    >
      {/* Card */}
      <motion.div
        className={`w-full lg:w-[calc(50%-40px)] ${isLeft ? 'lg:mr-auto' : 'lg:ml-auto'}`}
        style={{
          marginLeft: isLeft ? undefined : 'auto',
          marginRight: isLeft ? 'auto' : undefined,
        }}
        custom={idx}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={isLeft ? timelineCardLeft : timelineCardRight}
      >
        <div
          className="p-8 transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FF3366';
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          {/* Company */}
          <span
            className="font-caption block mb-2"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {role.company}
          </span>

          {/* Role title */}
          <h3 className="font-h2 mb-2" style={{ color: 'var(--text-primary)' }}>
            {role.title}
          </h3>

          {/* Period */}
          <span
            className="font-caption block mb-4"
            style={{ color: 'var(--accent-cyan)' }}
          >
            {role.period}
          </span>

          {/* Bullets */}
          <ul className="flex flex-col gap-2">
            {role.bullets.map((bullet) => (
              <li
                key={bullet.slice(0, 30)}
                className="font-body-small flex gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                <span style={{ color: 'var(--accent-cyan)' }}>&gt;</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Timeline dot */}
      <motion.div
        className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-8 z-10 w-3 h-3 rounded-full items-center justify-center"
        style={{
          border: '2px solid var(--accent)',
          backgroundColor: 'var(--bg-primary)',
        }}
        custom={idx}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={dotScale}
      />

      {/* Mobile dot */}
      <div
        className="lg:hidden absolute left-[14px] top-8 z-10 w-3 h-3 rounded-full"
        style={{
          border: '2px solid var(--accent)',
          backgroundColor: 'var(--bg-primary)',
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SkillCategoryBlock sub-component                                   */
/* ------------------------------------------------------------------ */

function SkillCategoryBlock({ category }: { category: SkillCategory }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="flex flex-col gap-3"
    >
      <div
        className="pl-4"
        style={{ borderLeft: `3px solid ${category.color}` }}
      >
        <span
          className="font-h3 text-[0.875rem] block mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          {category.name}
        </span>

        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <motion.span
              key={skill}
              className="font-caption px-3 py-1 transition-all duration-200 cursor-default"
              style={{
                backgroundColor: 'var(--bg-hover)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '2px',
                color: 'var(--text-primary)',
              }}
              variants={skillTag}
              whileHover={{ borderColor: '#33CCFF' }}
            >
              &gt; {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
