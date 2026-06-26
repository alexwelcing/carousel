import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from '@react-pdf/renderer';
import type { TailoredRole } from '../data/roles';
import { JOBS } from '../data/experience';

Font.registerHyphenationCallback((word) => [word]);

/** Pretext-measured per-glyph wordmark layout (kept for build API compatibility). */
export interface WordmarkGlyph { ch: string; x: number; size: number; part: 'alex' | 'welcing' }
export interface Wordmark { glyphs: WordmarkGlyph[]; width: number; height: number }

type Palette = {
  paper: string;
  ink: string;
  muted: string;
  faint: string;
  rule: string;
  panel: string;
  panelRule: string;
  accent: string;
  link: string;
};

const PALETTE: Palette = {
  paper: '#FFFFFF',
  ink: '#171717',
  muted: '#3F3F46',
  faint: '#5F6368',
  rule: '#D8D8D8',
  panel: '#F7F7F7',
  panelRule: '#E5E5E5',
  accent: '#111827',
  link: '#0B5CAD',
};

function brief(value: string, max = 220): string {
  const firstSentence = value.match(/^.*?[.!?](?=\s|$)/)?.[0]?.trim();
  const candidate = firstSentence && firstSentence.length >= 70 ? firstSentence : value.trim();
  if (candidate.length <= max) return candidate;
  const clipped = candidate.slice(0, max).replace(/\s+\S*$/, '').replace(/[,:;—-]+$/, '').trim();
  return clipped.endsWith('.') ? clipped : `${clipped}.`;
}

const makeStyles = (C: Palette, k = 1) => StyleSheet.create({
  page: {
    backgroundColor: C.paper,
    color: C.ink,
    fontFamily: 'Helvetica',
    fontSize: 8.4 * k,
    lineHeight: 1.28,
    paddingTop: 26,
    paddingBottom: 24,
    paddingHorizontal: 34,
  },

  header: {
    borderBottomWidth: 1.2,
    borderBottomColor: C.ink,
    paddingBottom: 11,
    marginBottom: 12,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameBlock: { flex: 1, paddingRight: 18 },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 25 * k,
    lineHeight: 1,
    letterSpacing: -0.4,
    color: C.ink,
  },
  positioning: {
    marginTop: 4,
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.4 * k,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: C.muted,
  },
  contact: {
    width: 178,
    textAlign: 'right',
    fontSize: 7.9 * k,
    lineHeight: 1.35,
    color: C.faint,
  },
  contactLink: { color: C.link, textDecoration: 'none' },
  target: {
    marginTop: 8,
    paddingTop: 7,
    borderTopWidth: 0.6,
    borderTopColor: C.rule,
    fontSize: 8.6 * k,
    lineHeight: 1.35,
    color: C.muted,
  },
  targetStrong: { fontFamily: 'Helvetica-Bold', color: C.ink },

  grid: { flexDirection: 'row', alignItems: 'flex-start' },
  rail: { width: 172, paddingRight: 17 },
  main: { flex: 1, paddingLeft: 17, borderLeftWidth: 0.7, borderLeftColor: C.rule },

  section: { marginBottom: 10 * k },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.5 * k,
    letterSpacing: 1.25,
    textTransform: 'uppercase',
    color: C.ink,
    marginBottom: 5 * k,
  },
  ruleTitle: {
    borderBottomWidth: 0.7,
    borderBottomColor: C.rule,
    paddingBottom: 3 * k,
    marginBottom: 6 * k,
  },

  fitBox: {
    backgroundColor: C.panel,
    borderWidth: 0.7,
    borderColor: C.panelRule,
    padding: 8 * k,
    marginBottom: 11 * k,
  },
  fitItem: { marginBottom: 5 * k },
  fitPoint: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.1 * k,
    color: C.ink,
    lineHeight: 1.25,
  },
  fitDetail: {
    marginTop: 1.5,
    fontSize: 7.8 * k,
    color: C.muted,
    lineHeight: 1.28,
  },

  proofItem: {
    flexDirection: 'row',
    marginBottom: 4.2 * k,
  },
  bulletMark: {
    width: 8,
    fontSize: 8 * k,
    color: C.ink,
  },
  proofText: {
    flex: 1,
    fontSize: 7.75 * k,
    color: C.muted,
    lineHeight: 1.3,
  },

  capability: { marginBottom: 7 * k },
  capabilityLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.8 * k,
    color: C.ink,
    marginBottom: 1.5,
  },
  capabilityText: {
    fontSize: 7.65 * k,
    color: C.muted,
    lineHeight: 1.28,
  },

  project: { marginBottom: 7 * k },
  projectTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  projectName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8 * k,
    color: C.ink,
  },
  projectLink: {
    fontSize: 7.2 * k,
    color: C.link,
    textDecoration: 'none',
  },
  projectDesc: {
    marginTop: 1.5,
    fontSize: 7.55 * k,
    color: C.muted,
    lineHeight: 1.26,
  },

  edu: { fontSize: 7.5 * k, color: C.muted, lineHeight: 1.3 },
  eduStrong: { fontFamily: 'Helvetica-Bold', color: C.ink },

  job: { marginBottom: 9.2 * k },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  company: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.2 * k,
    color: C.ink,
  },
  date: {
    fontSize: 7.1 * k,
    color: C.faint,
  },
  role: {
    marginTop: 1.5,
    marginBottom: 3.6 * k,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.7 * k,
    color: C.muted,
  },
  bulletRow: { flexDirection: 'row', marginBottom: 2.5 * k },
  bullet: {
    flex: 1,
    fontSize: 7.65 * k,
    color: C.muted,
    lineHeight: 1.28,
  },
});

function Section({ styles, title, children, ruled = false }: { styles: ReturnType<typeof makeStyles>; title: string; children: React.ReactNode; ruled?: boolean }) {
  return (
    <View style={styles.section}>
      <View style={ruled ? styles.ruleTitle : undefined}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function Bullet({ styles, children }: { styles: ReturnType<typeof makeStyles>; children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletMark}>•</Text>
      <Text style={styles.bullet}>{children}</Text>
    </View>
  );
}

function ProofItem({ styles, children }: { styles: ReturnType<typeof makeStyles>; children: React.ReactNode }) {
  return (
    <View style={styles.proofItem}>
      <Text style={styles.bulletMark}>—</Text>
      <Text style={styles.proofText}>{children}</Text>
    </View>
  );
}

export default function ResumePDFDocument(
  { role, scale = 1 }: { role?: TailoredRole; theme?: 'dark' | 'light'; scale?: number; wordmark?: Wordmark } = {},
) {
  const C = PALETTE;
  const styles = makeStyles(C, scale);
  const summary = role
    ? role.intro
    : 'Architect PM and product-minded engineer who ships AI products from strategy through production code: production agents, materials-science ML, document AI, 3D interfaces, enterprise identity, and developer platforms.';

  return (
    <Document
      title={role ? `Alex Welcing — ${role.company} — ${role.roleTitle}` : 'Alex Welcing — Technical Product Manager & AI Builder'}
      author="Alex Welcing"
      subject={role ? `Professional resume tailored for ${role.company} (${role.roleTitle})` : 'Professional resume — AI product, platform, and enterprise systems'}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.nameBlock}>
              <Text style={styles.name}>Alex Welcing</Text>
              <Text style={styles.positioning}>AI Product Builder · Technical PM · Enterprise Platform Operator</Text>
            </View>
            <Text style={styles.contact}>
              New York, NY{`\n`}
              alexwelcing@gmail.com{`\n`}
              <Link src="https://github.com/alexwelcing" style={styles.contactLink}>github.com/alexwelcing</Link>{`\n`}
              <Link src="https://linkedin.com/in/alexwelcing" style={styles.contactLink}>linkedin.com/in/alexwelcing</Link>
            </Text>
          </View>
          <Text style={styles.target}>
            <Text style={styles.targetStrong}>{role ? `${role.company} · ${role.roleTitle}` : 'Target · Principal / Staff Product, Forward-Deployed AI, Platform Leadership'}</Text>
            {' — '}{summary}
          </Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.rail}>
            {role && (
              <Section styles={styles} title="Target Fit">
                <View style={styles.fitBox}>
                  {role.whyFit.slice(0, 3).map((w) => (
                    <View key={w.point} style={styles.fitItem}>
                      <Text style={styles.fitPoint}>{w.point}</Text>
                      <Text style={styles.fitDetail}>{brief(w.detail)}</Text>
                    </View>
                  ))}
                </View>
              </Section>
            )}

            <Section styles={styles} title="Proof">
              {(role?.proof ?? [
                '12+ years shipping product, code, and judgment end-to-end',
                'Billions of monthly requests served by systems rebuilt at LBR',
                '150+ enterprise SSO rollouts to AmLaw 200 firms',
              ]).slice(0, 4).map((p) => <ProofItem key={p} styles={styles}>{p}</ProofItem>)}
            </Section>

            <Section styles={styles} title="Capabilities">
              <View style={styles.capability}>
                <Text style={styles.capabilityLabel}>AI / Agents</Text>
                <Text style={styles.capabilityText}>LLM products, agent workflows, evals, RAG / pgvector, AI API workspaces</Text>
              </View>
              <View style={styles.capability}>
                <Text style={styles.capabilityLabel}>Platform / Infra</Text>
                <Text style={styles.capabilityText}>TypeScript, Python, Go, Node, FastAPI, Postgres, Supabase, GCP</Text>
              </View>
              <View style={styles.capability}>
                <Text style={styles.capabilityLabel}>Enterprise Trust</Text>
                <Text style={styles.capabilityText}>SSO, SAML, OIDC, IAM, SOC 2, regulated workflows, enterprise deployment</Text>
              </View>
              <View style={styles.capability}>
                <Text style={styles.capabilityLabel}>Interfaces</Text>
                <Text style={styles.capabilityText}>React, Next.js, React Three Fiber, WebGL, document/search UX</Text>
              </View>
            </Section>

            <Section styles={styles} title="Selected Work">
              <View style={styles.project}>
                <View style={styles.projectTop}>
                  <Text style={styles.projectName}>lupi.live</Text>
                  <Link src="https://lupi.live" style={styles.projectLink}>lupi.live</Link>
                </View>
                <Text style={styles.projectDesc}>R3F/WebGL molecule viewer for molecular structures and trajectories.</Text>
              </View>
              <View style={styles.project}>
                <View style={styles.projectTop}>
                  <Text style={styles.projectName}>lupine.science</Text>
                  <Link src="https://lupine.science" style={styles.projectLink}>lupine.science</Link>
                </View>
                <Text style={styles.projectDesc}>Company/research layer for MLIP benchmarks and phase-change simulation.</Text>
              </View>
              <View style={styles.project}>
                <View style={styles.projectTop}>
                  <Text style={styles.projectName}>alexwelcing.com</Text>
                  <Link src="https://alexwelcing.com" style={styles.projectLink}>alexwelcing.com</Link>
                </View>
                <Text style={styles.projectDesc}>3D content site with realtime physics and AI semantic search over writing.</Text>
              </View>
            </Section>
          </View>

          <View style={styles.main}>
            <Section styles={styles} title="Experience" ruled>
              {JOBS.map((j) => (
                <View key={j.company} style={styles.job}>
                  <View style={styles.jobTop}>
                    <Text style={styles.company}>{j.company}</Text>
                    <Text style={styles.date}>{j.date}</Text>
                  </View>
                  <Text style={styles.role}>{j.role}</Text>
                  {j.bullets.map((b) => (
                    <Bullet key={b.slice(0, 32)} styles={styles}>{b}</Bullet>
                  ))}
                </View>
              ))}
            </Section>
          </View>
        </View>
      </Page>
    </Document>
  );
}
