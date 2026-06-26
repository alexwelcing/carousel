import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { TailoredRole } from '../data/roles';
import { JOBS } from '../data/experience';

/**
 * A deliberately plain, conventional one-page résumé (US Letter).
 * Single column, built-in Helvetica, black on white — maximally normal and
 * ATS-friendly. No wordmark, color bars, or branding.
 */

const INK = '#111111';
const SUB = '#444444';
const FAINT = '#666666';
const RULE = '#BBBBBB';
const LINK = '#1A4D8F';

const s = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    color: INK,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.4,
    paddingTop: 38,
    paddingBottom: 24,
    paddingHorizontal: 54,
  },

  /* Header */
  name: { fontFamily: 'Helvetica-Bold', fontSize: 22, letterSpacing: 0.5, lineHeight: 1.1, marginBottom: 5 },
  title: { fontSize: 10.5, color: SUB },
  contact: { fontSize: 9, color: FAINT, marginTop: 4 },
  contactLink: { color: LINK, textDecoration: 'none' },

  headRule: { borderBottomWidth: 1, borderBottomColor: RULE, marginTop: 8, marginBottom: 8 },

  /* Sections */
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    letterSpacing: 1.5,
    color: INK,
    marginBottom: 5,
  },
  section: { marginBottom: 9 },

  summary: { fontSize: 9.5, color: SUB, lineHeight: 1.5 },

  /* Experience */
  job: { marginBottom: 6 },
  jobRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  company: { fontFamily: 'Helvetica-Bold', fontSize: 10.5 },
  date: { fontSize: 9, color: FAINT },
  role: { fontSize: 9.5, color: SUB, fontFamily: 'Helvetica-Oblique', marginTop: 1, marginBottom: 3 },
  bulletRow: { flexDirection: 'row', marginBottom: 2, paddingRight: 6 },
  bulletDot: { width: 10, fontSize: 9.5, color: FAINT },
  bulletText: { flex: 1, fontSize: 9.5, color: SUB, lineHeight: 1.4 },

  /* Two-up rows for skills/projects */
  line: { flexDirection: 'row', marginBottom: 3 },
  lineLabel: { width: 92, fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: INK },
  lineBody: { flex: 1, fontSize: 9.5, color: SUB },

  /* Projects */
  projRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 },
  projName: { fontFamily: 'Helvetica-Bold', fontSize: 9.5 },
  projLink: { fontSize: 9, color: LINK, textDecoration: 'none' },
  projDesc: { fontSize: 9.5, color: SUB, marginBottom: 3 },

  /* Education */
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  eduSchool: { fontFamily: 'Helvetica-Bold', fontSize: 9.5 },
  eduDegree: { fontSize: 9.5, color: SUB },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function ResumePlainPDFDocument(
  { role }: { role?: TailoredRole } = {},
) {
  const summary = role
    ? role.intro
    : 'Product-minded engineer who owns problems end to end — from strategy to production code. Fifteen years across AI and enterprise platforms: multi-agent systems, LLM products, and identity infrastructure at billions-scale, built with the autonomy and pace of a founding engineer.';

  return (
    <Document
      title={role ? `Alex Welcing — Resume — ${role.company}` : 'Alex Welcing — Resume'}
      author="Alex Welcing"
      subject="Resume — Technical Product Manager & AI Researcher"
    >
      <Page size="LETTER" style={s.page}>
        {/* Header */}
        <Text style={s.name}>Alex Welcing</Text>
        <Text style={s.title}>Technical Product Manager · AI Researcher</Text>
        <Text style={s.contact}>
          New York, NY  ·  alexwelcing@gmail.com  ·{' '}
          <Link src="https://github.com/alexwelcing" style={s.contactLink}>github.com/alexwelcing</Link>
          {'  ·  '}
          <Link src="https://linkedin.com/in/alexwelcing" style={s.contactLink}>linkedin.com/in/alexwelcing</Link>
        </Text>

        <View style={s.headRule} />

        <Section title="SUMMARY">
          <Text style={s.summary}>{summary}</Text>
        </Section>

        <Section title="EXPERIENCE">
          {JOBS.map((j) => (
            <View key={j.company} style={s.job}>
              <View style={s.jobRow}>
                <Text style={s.company}>{j.company}</Text>
                <Text style={s.date}>{j.date}</Text>
              </View>
              <Text style={s.role}>{j.role}</Text>
              {j.bullets.map((b) => (
                <View key={b.slice(0, 24)} style={s.bulletRow}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </Section>

        <Section title="SKILLS">
          <View style={s.line}>
            <Text style={s.lineLabel}>AI / Agents</Text>
            <Text style={s.lineBody}>Multi-agent orchestration, LLM integration, evals, RAG / pgvector, prompt engineering, model ops</Text>
          </View>
          <View style={s.line}>
            <Text style={s.lineLabel}>Frontend</Text>
            <Text style={s.lineBody}>TypeScript, React, Next.js, React Three Fiber (3D), Svelte, Tailwind, modern CSS</Text>
          </View>
          <View style={s.line}>
            <Text style={s.lineLabel}>Backend / Infra</Text>
            <Text style={s.lineBody}>Python, Go, Node, FastAPI, Postgres / Supabase, GCP / Cloud Run, API design</Text>
          </View>
          <View style={s.line}>
            <Text style={s.lineLabel}>Identity / Ent.</Text>
            <Text style={s.lineBody}>SSO, SAML, OIDC, IAM, SOC 2, enterprise integration at billions-scale</Text>
          </View>
        </Section>

        <Section title="SELECTED PROJECTS">
          <View style={s.projRow}>
            <Text style={s.projName}>Lupine.Live</Text>
            <Link src="https://lupi.live" style={s.projLink}>lupi.live</Link>
          </View>
          <Text style={s.projDesc}>Materials-science computing and million-atom molecular visualization, live in the browser.</Text>

          <View style={s.projRow}>
            <Text style={s.projName}>Lupine</Text>
            <Link src="https://github.com/alexwelcing/lupine" style={s.projLink}>github.com/alexwelcing/lupine</Link>
          </View>
          <Text style={s.projDesc}>MLIP benchmarks, phase-change simulation, and molecular visualization tooling.</Text>

          <View style={s.projRow}>
            <Text style={s.projName}>alexwelcing.com</Text>
            <Link src="https://alexwelcing.com" style={s.projLink}>alexwelcing.com</Link>
          </View>
          <Text style={s.projDesc}>3D content site with real-time physics and AI semantic search (Next.js, React Three Fiber, pgvector).</Text>
        </Section>

        <Section title="EDUCATION">
          <View style={s.eduRow}>
            <Text style={s.eduSchool}>University of Texas at Dallas</Text>
            <Text style={s.eduDegree}>B.S. Marketing</Text>
          </View>
        </Section>
      </Page>
    </Document>
  );
}
