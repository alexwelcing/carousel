import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Svg,
  Circle,
  Line,
} from '@react-pdf/renderer';
import type { TailoredRole } from '../data/roles';
import { JOBS } from '../data/experience';

/** Pretext-measured per-glyph wordmark layout (built in scripts/pretext-fit). */
export interface WordmarkGlyph { ch: string; x: number; size: number; part: 'alex' | 'welcing' }
export interface Wordmark { glyphs: WordmarkGlyph[]; width: number; height: number }
const CARDO_ASCENT = 0.72; // baseline offset ratio for Cardo Bold, used to align tapered glyphs

/* ------------------------------------------------------------------ */
/*  Fonts (TTF only). Mono = JetBrains Mono · Serif = Cardo            */
/* ------------------------------------------------------------------ */
const JBM_REGULAR = 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Regular.ttf';
const JBM_BOLD = 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Bold.ttf';
const CARDO_REGULAR = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/cardo/Cardo-Regular.ttf';
const CARDO_BOLD = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/cardo/Cardo-Bold.ttf';

Font.register({ family: 'Mono', fonts: [{ src: JBM_REGULAR, fontWeight: 400 }, { src: JBM_BOLD, fontWeight: 700 }] });
Font.register({ family: 'Cardo', fonts: [{ src: CARDO_REGULAR, fontWeight: 400 }, { src: CARDO_BOLD, fontWeight: 700 }] });

function MoleculeIcon({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Line x1="12" y1="12" x2="4" y2="7" stroke={color} strokeWidth={1.6} />
      <Line x1="12" y1="12" x2="20" y2="9" stroke={color} strokeWidth={1.6} />
      <Line x1="12" y1="12" x2="12" y2="21" stroke={color} strokeWidth={1.6} />
      <Circle cx="4" cy="7" r="2.4" fill={color} />
      <Circle cx="20" cy="9" r="2.4" fill={color} />
      <Circle cx="12" cy="21" r="2.4" fill={color} />
      <Circle cx="12" cy="12" r="3.2" fill={color} />
    </Svg>
  );
}

type Palette = {
  bg: string; text: string; muted: string; faint: string;
  accent: string; cyan: string; magenta: string; border: string;
};
const DARK: Palette = { bg: '#050505', text: '#FFFFFF', muted: '#A8A8A8', faint: '#6B6B6B', accent: '#E6E7E8', cyan: '#33CCFF', magenta: '#FF3366', border: '#2A2A2A' };
const LIGHT: Palette = { bg: '#FFFFFF', text: '#0A0A0A', muted: '#3F3F46', faint: '#71717A', accent: '#18181B', cyan: '#0E7490', magenta: '#BE123C', border: '#D4D4D8' };

// k = global content scale (computed at build via Pretext measure-then-fit).
const makeStyles = (C: Palette, k = 1) => StyleSheet.create({
  page: { backgroundColor: C.bg, fontFamily: 'Mono', color: C.text, position: 'relative' },
  topBar: { height: 9, backgroundColor: C.magenta },
  topBarOff: { position: 'absolute', top: 9, left: 0, width: 150, height: 5, backgroundColor: C.text },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 9, backgroundColor: C.magenta },
  bottomBarOff: { position: 'absolute', bottom: 9, right: 0, width: 210, height: 5, backgroundColor: C.text },
  body: { paddingTop: 30, paddingBottom: 42, paddingHorizontal: 38 },

  /* Header — slanted tapering wordmark */
  wordmarkRow: { flexDirection: 'row', alignItems: 'flex-end', transform: 'rotate(-3.5deg)', marginTop: 8, marginLeft: 6, marginBottom: 16 },
  wmBig: { fontFamily: 'Cardo', fontWeight: 700, fontSize: 62, color: C.text, lineHeight: 1, letterSpacing: -1 },
  wmSmall: { fontFamily: 'Cardo', fontWeight: 700, fontSize: 34, color: C.magenta, lineHeight: 1, letterSpacing: -0.5, marginLeft: 12, marginBottom: 4 },

  /* Header — Pretext per-glyph wordmark */
  wmStage: { position: 'relative', transform: 'rotate(-3.5deg)', marginTop: 12, marginLeft: 8, marginBottom: 18 },
  wmGlyph: { position: 'absolute', fontFamily: 'Cardo', fontWeight: 700, lineHeight: 1 },
  roleLine: { fontFamily: 'Mono', fontSize: 8.5, letterSpacing: 1.4, color: C.faint, textTransform: 'uppercase' },
  tailoredFor: { fontFamily: 'Mono', fontWeight: 700, fontSize: 8.5, color: C.magenta, marginTop: 5 },
  tagline: { fontFamily: 'Cardo', fontSize: 12.5, color: C.muted, lineHeight: 1.4, marginTop: 7, maxWidth: 470 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 9 },
  contactItem: { fontFamily: 'Mono', fontSize: 8, color: C.muted },
  contactSep: { fontFamily: 'Mono', fontSize: 8, color: C.faint, marginHorizontal: 5 },
  contactLink: { fontFamily: 'Mono', fontSize: 8, color: C.cyan, textDecoration: 'none' },

  ruleHeavy: { height: 2.5, backgroundColor: C.text, marginTop: 12 },
  ruleThin: { height: 0.75, backgroundColor: C.faint, marginTop: 1.5, marginBottom: 14 },

  /* Two-column body */
  bodyRow: { flexDirection: 'row', alignItems: 'flex-start' },
  rail: { width: 208 },
  gutter: { width: 0.75, backgroundColor: C.border, marginHorizontal: 18, alignSelf: 'stretch' },
  main: { flex: 1 },

  sectionLabel: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 * k },
  sectionTick: { width: 5, height: 5, backgroundColor: C.magenta, marginRight: 6 },
  sectionText: { fontFamily: 'Cardo', fontWeight: 700, fontSize: 13.5 * k, color: C.accent, letterSpacing: 0.5 },
  group: { marginBottom: 16 * k },

  /* Projects */
  projHead: { flexDirection: 'row', alignItems: 'center' },
  projName: { fontFamily: 'Mono', fontWeight: 700, fontSize: 9 * k, color: C.text, marginLeft: 4 },
  projNameNoIcon: { fontFamily: 'Mono', fontWeight: 700, fontSize: 9 * k, color: C.text, marginTop: 10 * k },
  projDesc: { fontFamily: 'Mono', fontSize: 8 * k, color: C.muted, lineHeight: 1.45, marginTop: 2 * k },
  projLinks: { flexDirection: 'row', marginTop: 2 * k },
  projLink: { fontFamily: 'Mono', fontSize: 8 * k, color: C.cyan, textDecoration: 'none', marginRight: 10 },

  /* Skills */
  skillBlock: { marginBottom: 6 * k },
  skillLabel: { fontFamily: 'Mono', fontWeight: 700, fontSize: 8.5 * k, color: C.text },
  skillItems: { fontFamily: 'Mono', fontSize: 8 * k, color: C.muted, lineHeight: 1.45, marginTop: 1 * k },

  /* Education */
  eduSchool: { fontFamily: 'Cardo', fontWeight: 700, fontSize: 12.5 * k, color: C.text },
  eduDegree: { fontFamily: 'Mono', fontSize: 8 * k, color: C.muted, marginTop: 1 },

  /* Why */
  whyItem: { fontFamily: 'Mono', fontSize: 8.5 * k, color: C.muted, lineHeight: 1.5, marginBottom: 6 * k, textAlign: 'justify' },
  whyPoint: { color: C.text },
  dot: { color: C.magenta },

  /* Experience */
  job: { marginBottom: 13 * k },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  jobCompany: { fontFamily: 'Cardo', fontWeight: 700, fontSize: 13.5 * k, color: C.text },
  jobDate: { fontFamily: 'Mono', fontSize: 8 * k, color: C.faint },
  jobRole: { fontFamily: 'Mono', fontSize: 8.5 * k, color: C.cyan, marginTop: 1.5, marginBottom: 3 * k },
  bullet: { fontFamily: 'Mono', fontSize: 8.5 * k, color: C.muted, lineHeight: 1.5, marginBottom: 2.5 * k, textAlign: 'justify' },
});

function SectionLabel({ styles, children }: { styles: ReturnType<typeof makeStyles>; children: string }) {
  return (
    <View style={styles.sectionLabel}>
      <View style={styles.sectionTick} />
      <Text style={styles.sectionText}>{children}</Text>
    </View>
  );
}

export default function ResumePDFDocument(
  { role, theme = 'dark', scale = 1, wordmark }: { role?: TailoredRole; theme?: 'dark' | 'light'; scale?: number; wordmark?: Wordmark } = {},
) {
  const C = theme === 'light' ? LIGHT : DARK;
  const styles = makeStyles(C, scale);

  const tagline = role
    ? role.intro
    : 'Engineer turned product manager, relapsing back into engineering with AI — strategy and shipped code from one person, across 15 years of AI and enterprise platforms.';

  return (
    <Document
      title={role ? `Alex Welcing — ${role.company} — ${role.roleTitle}` : 'Alex Welcing — Technical Product Manager & AI Researcher'}
      author="Alex Welcing"
      subject={role ? `Resume tailored for ${role.company} (${role.roleTitle})` : 'Resume — Technical Product Manager & AI Researcher'}
    >
      <Page size="LEGAL" style={styles.page}>
        <View style={styles.topBar} />
        <View style={styles.topBarOff} />

        <View style={styles.body}>
          {/* ── HEADER ── */}
          {wordmark ? (
            <View style={[styles.wmStage, { width: wordmark.width, height: wordmark.height }]}>
              {wordmark.glyphs.map((g, i) => (
                <Text
                  key={`${g.ch}-${i}`}
                  style={[styles.wmGlyph, {
                    left: g.x,
                    top: CARDO_ASCENT * (wordmark.height - g.size),
                    fontSize: g.size,
                    color: g.part === 'alex' ? C.text : C.magenta,
                  }]}
                >
                  {g.ch}
                </Text>
              ))}
            </View>
          ) : (
            <View style={styles.wordmarkRow}>
              <Text style={styles.wmBig}>Alex</Text>
              <Text style={styles.wmSmall}>Welcing</Text>
            </View>
          )}
          <Text style={styles.roleLine}>Technical Product Manager · AI Researcher · 15 Years</Text>
          {role && <Text style={styles.tailoredFor}>{'▸ Tailored for '}{role.company}{' — '}{role.roleTitle}</Text>}
          <Text style={styles.tagline}>{tagline}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>New York, NY</Text>
            <Text style={styles.contactSep}>·</Text>
            <Text style={styles.contactItem}>alexwelcing@gmail.com</Text>
            <Text style={styles.contactSep}>·</Text>
            <Link src="https://github.com/alexwelcing" style={styles.contactLink}>github.com/alexwelcing</Link>
            <Text style={styles.contactSep}>·</Text>
            <Link src="https://linkedin.com/in/alexwelcing" style={styles.contactLink}>linkedin.com/in/alexwelcing</Link>
          </View>

          <View style={styles.ruleHeavy} />
          <View style={styles.ruleThin} />

          {/* ── BODY ── */}
          <View style={styles.bodyRow}>
            {/* RAIL */}
            <View style={styles.rail}>
              <View style={styles.group}>
                <SectionLabel styles={styles}>Selected Work</SectionLabel>
                <View style={styles.projHead}>
                  <MoleculeIcon color={C.cyan} />
                  <Text style={styles.projName}>lupi.live</Text>
                </View>
                <Text style={styles.projDesc}>R3F/WebGL molecule viewer for inspecting molecular structures and trajectories in the browser.</Text>
                <View style={styles.projLinks}>
                  <Link src="https://lupi.live" style={styles.projLink}>lupi.live</Link>
                  <Link src="https://github.com/alexwelcing/lupine" style={styles.projLink}>GitHub</Link>
                </View>

                <Text style={styles.projNameNoIcon}>lupine.science</Text>
                <Text style={styles.projDesc}>Company/research site for the mathematical layer: MLIP benchmarks, phase-change simulation, and Python scientific-computing pipelines.</Text>
                <View style={styles.projLinks}>
                  <Link src="https://lupine.science" style={styles.projLink}>lupine.science</Link>
                </View>

                <Text style={styles.projNameNoIcon}>alexwelcing.com</Text>
                <Text style={styles.projDesc}>3D content site with real-time physics and AI semantic search (Next.js, React Three Fiber, pgvector).</Text>
                <View style={styles.projLinks}>
                  <Link src="https://alexwelcing.com" style={styles.projLink}>alexwelcing.com</Link>
                  <Link src="https://github.com/alexwelcing/NextDocsSearch" style={styles.projLink}>GitHub</Link>
                </View>
              </View>

              <View style={styles.group}>
                <SectionLabel styles={styles}>Craft</SectionLabel>
                <View style={styles.skillBlock}>
                  <Text style={styles.skillLabel}>AI / Agents</Text>
                  <Text style={styles.skillItems}>Multi-agent orchestration · LLM integration · evals · RAG / pgvector · prompt engineering · model ops</Text>
                </View>
                <View style={styles.skillBlock}>
                  <Text style={styles.skillLabel}>Frontend</Text>
                  <Text style={styles.skillItems}>TypeScript · React · Next.js · React Three Fiber (3D) · Svelte · Tailwind · modern CSS</Text>
                </View>
                <View style={styles.skillBlock}>
                  <Text style={styles.skillLabel}>Backend / Infra</Text>
                  <Text style={styles.skillItems}>Python · Go · Node · FastAPI · Postgres / Supabase · GCP / Cloud Run · API design</Text>
                </View>
                <View style={styles.skillBlock}>
                  <Text style={styles.skillLabel}>Identity / Enterprise</Text>
                  <Text style={styles.skillItems}>SSO · SAML · OIDC · IAM · SOC2 · enterprise integration at billions-scale</Text>
                </View>
              </View>

              <View>
                <SectionLabel styles={styles}>Education</SectionLabel>
                <Text style={styles.eduSchool}>University of Texas at Dallas</Text>
                <Text style={styles.eduDegree}>B.S. Marketing</Text>
              </View>
            </View>

            <View style={styles.gutter} />

            {/* MAIN */}
            <View style={styles.main}>
              {role && (
                <View style={styles.group}>
                  <SectionLabel styles={styles}>{`Why ${role.company}`}</SectionLabel>
                  {role.whyFit.map((w) => (
                    <Text key={w.point} style={styles.whyItem}>
                      <Text style={styles.dot}>{'† '}</Text>
                      <Text style={styles.whyPoint}>{w.point}{w.point.match(/[:—;]$/) ? ' ' : '. '}</Text>
                      {w.detail}
                    </Text>
                  ))}
                </View>
              )}

              <SectionLabel styles={styles}>Experience</SectionLabel>
              {JOBS.map((j) => (
                <View key={j.company} style={styles.job}>
                  <View style={styles.jobTop}>
                    <Text style={styles.jobCompany}>{j.company}</Text>
                    <Text style={styles.jobDate}>{j.date}</Text>
                  </View>
                  <Text style={styles.jobRole}>{j.role}</Text>
                  {j.bullets.map((b) => (
                    <Text key={b.slice(0, 24)} style={styles.bullet}>
                      <Text style={styles.dot}>{'> '}</Text>{b}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomBarOff} />
        <View style={styles.bottomBar} />
      </Page>
    </Document>
  );
}
