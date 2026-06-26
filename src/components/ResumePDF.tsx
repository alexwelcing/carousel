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
  accent: string;
  link: string;
};

const PALETTE: Palette = {
  paper: '#FFFFFF',
  ink: '#111111',
  muted: '#35363A',
  faint: '#5F6368',
  rule: '#C9CDD2',
  panel: '#F5F6F7',
  accent: '#0F172A',
  link: '#0B5CAD',
};

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/[,:;—-]+\.$/, '.').trim();
}

function fitText(value: string, max = 96): string {
  const text = clean(value);
  if (text.length <= max) return text;
  const stopWords = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'to', 'for', 'with', 'in', 'on', 'at', 'by', 'from']);
  let words = text.slice(0, max).replace(/[,:;—-]+$/, '').trim().split(/\s+/);
  while (words.length && stopWords.has(words[words.length - 1].toLowerCase())) words = words.slice(0, -1);
  const clipped = words.join(' ').replace(/[,:;—-]+$/, '').trim();
  return clipped.endsWith('.') ? clipped : `${clipped}.`;
}

const defaultProof = [
  '12+ years shipping product, code, and judgment end-to-end',
  'Billions of monthly requests served by systems rebuilt at LBR',
  '150+ enterprise SSO rollouts to Am Law 200 firms',
];

const capabilities = [
  ['AI / Agents', 'LLM products, agent workflows, evals, RAG / pgvector, AI API workspaces'],
  ['Platform / Infra', 'TypeScript, Python, Go, Node, FastAPI, Postgres, Supabase, GCP'],
  ['Enterprise Trust', 'SSO, SAML, OIDC, IAM, SOC 2, regulated workflows, enterprise deployment'],
  ['Interfaces', 'React, Next.js, React Three Fiber, WebGL, document/search UX'],
];

const projects = [
  ['lupi.live', 'https://lupi.live', 'R3F/WebGL molecule viewer for molecular structures and trajectories.'],
  ['lupine.science', 'https://lupine.science', 'Company/research layer for MLIP benchmarks and phase-change simulation.'],
  ['alexwelcing.com', 'https://alexwelcing.com', '3D content site with real-time physics and AI semantic search over writing.'],
] as const;

const makeStyles = (C: Palette, k = 1) => StyleSheet.create({
  page: {
    backgroundColor: C.paper,
    color: C.ink,
    fontFamily: 'Helvetica',
    fontSize: 8.8 * k,
    lineHeight: 1.28,
    paddingTop: 21,
    paddingBottom: 21,
    paddingHorizontal: 34,
  },

  header: {
    borderBottomWidth: 1.1,
    borderBottomColor: C.ink,
    paddingBottom: 7,
    marginBottom: 7,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nameBlock: { flex: 1, paddingRight: 16 },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 21.5 * k,
    lineHeight: 0.98,
    letterSpacing: -0.35,
    color: C.ink,
  },
  positioning: {
    marginTop: 3,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.7 * k,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
    color: C.muted,
  },
  contact: {
    width: 182,
    textAlign: 'right',
    fontSize: 7.7 * k,
    lineHeight: 1.34,
    color: C.faint,
  },
  contactLink: { color: C.link, textDecoration: 'none' },
  target: {
    marginTop: 5,
    fontSize: 8.35 * k,
    lineHeight: 1.3,
    color: C.muted,
  },
  targetStrong: { fontFamily: 'Helvetica-Bold', color: C.ink },

  band: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 6,
  },
  card: {
    flex: 1,
    backgroundColor: C.panel,
    borderWidth: 0.35,
    borderColor: C.rule,
    paddingVertical: 5 * k,
    paddingHorizontal: 7 * k,
    minHeight: 41 * k,
  },
  cardTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.7 * k,
    color: C.ink,
    lineHeight: 1.14,
    marginBottom: 2,
  },
  cardText: {
    fontSize: 7.2 * k,
    color: C.muted,
    lineHeight: 1.18,
  },

  proofStrip: {
    flexDirection: 'row',
    borderTopWidth: 0.65,
    borderBottomWidth: 0.65,
    borderColor: C.rule,
    paddingVertical: 4.5,
    marginBottom: 8,
  },
  proofItem: {
    flex: 1,
    paddingRight: 9,
    flexDirection: 'row',
  },
  proofMark: {
    width: 8,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.8 * k,
    color: C.accent,
  },
  proofText: {
    flex: 1,
    fontSize: 7.35 * k,
    color: C.muted,
    lineHeight: 1.16,
  },

  section: { marginBottom: 9.5 * k },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.75,
    borderBottomColor: C.rule,
    paddingBottom: 3.5,
    marginBottom: 6.5,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.8 * k,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: C.ink,
  },
  sectionNote: {
    marginLeft: 7,
    fontSize: 7.1 * k,
    color: C.faint,
  },

  jobGrid: { flexDirection: 'column' },
  job: {
    width: '100%',
    paddingRight: 0,
    marginBottom: 8.8 * k,
  },
  jobTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  company: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.45 * k,
    color: C.ink,
    maxWidth: 360,
  },
  date: {
    fontSize: 7.75 * k,
    color: C.faint,
  },
  role: {
    marginTop: 1.4,
    marginBottom: 3.8,
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.95 * k,
    color: C.muted,
  },
  bulletRow: { flexDirection: 'row', marginBottom: 2.75 * k, paddingRight: 14 },
  bulletMark: {
    width: 8,
    fontSize: 7.4 * k,
    color: C.ink,
  },
  bullet: {
    flex: 1,
    fontSize: 7.75 * k,
    color: C.muted,
    lineHeight: 1.27,
  },

  bottomGrid: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 3,
  },
  bottomCol: { flex: 1 },
  capabilityGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  capability: {
    width: '50%',
    paddingRight: 9,
    marginBottom: 6.4 * k,
  },
  capabilityLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.75 * k,
    color: C.ink,
    marginBottom: 1,
  },
  capabilityText: {
    fontSize: 7.75 * k,
    color: C.muted,
    lineHeight: 1.18,
  },
  project: {
    marginBottom: 6.4 * k,
  },
  projectName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.9 * k,
    color: C.ink,
  },
  projectLink: {
    color: C.link,
    textDecoration: 'none',
  },
  projectDesc: {
    marginTop: 1,
    fontSize: 7.75 * k,
    color: C.muted,
    lineHeight: 1.18,
  },
  footerProof: {
    marginTop: 18 * k,
    paddingTop: 7 * k,
    borderTopWidth: 0.65,
    borderTopColor: C.rule,
    flexDirection: 'row',
    gap: 10,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7.35 * k,
    letterSpacing: 0.65,
    textTransform: 'uppercase',
    color: C.ink,
    marginBottom: 2,
  },
  footerText: {
    fontSize: 7.45 * k,
    color: C.muted,
    lineHeight: 1.24,
  },
});

function Section({ styles, title, note, children }: { styles: ReturnType<typeof makeStyles>; title: string; note?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {note ? <Text style={styles.sectionNote}>{note}</Text> : null}
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

function fitCards(role?: TailoredRole) {
  if (role) return role.whyFit.slice(0, 3).map((w) => [w.point, fitText(w.detail)] as const);
  return [
    ['AI product shipped as working systems', 'Builds production AI products from strategy through TypeScript/Python implementation, with deployed outcomes over demos.'],
    ['Enterprise platform judgment', 'Rebuilt identity, subscription, SSO/SAML/OIDC, and API systems serving high-trust enterprise customers.'],
    ['Research-to-product range', 'Connects materials-science ML, document AI, 3D interfaces, and developer platforms into usable products.'],
  ] as const;
}

export default function ResumePDFDocument(
  { role, scale = 1 }: { role?: TailoredRole; theme?: 'dark' | 'light'; scale?: number; wordmark?: Wordmark } = {},
) {
  const C = PALETTE;
  const styles = makeStyles(C, scale);
  const summary = role
    ? clean(role.intro)
    : 'Architect PM and product-minded engineer who ships AI products from strategy through production code: production agents, materials-science ML, document AI, 3D interfaces, enterprise identity, and developer platforms.';
  const proof = (role?.proof ?? defaultProof).slice(0, 3);

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
            <Text style={styles.targetStrong}>{role ? `${role.company} · ${role.roleTitle}` : 'Target · Principal / Staff Product Manager, Forward-Deployed AI, Platform Leadership'}</Text>
            {' — '}{summary}
          </Text>
        </View>

        <View style={styles.band}>
          {fitCards(role).map(([point, detail]) => (
            <View key={point} style={styles.card}>
              <Text style={styles.cardTitle}>{point}</Text>
              <Text style={styles.cardText}>{detail}</Text>
            </View>
          ))}
        </View>

        <View style={styles.proofStrip}>
          {proof.map((p) => (
            <View key={p} style={styles.proofItem}>
              <Text style={styles.proofMark}>—</Text>
              <Text style={styles.proofText}>{p}</Text>
            </View>
          ))}
        </View>

        <Section styles={styles} title="Experience">
          <View style={styles.jobGrid}>
            {JOBS.map((j) => (
              <View key={j.company} style={styles.job}>
                <View style={styles.jobTop}>
                  <Text style={styles.company}>{j.company}</Text>
                  <Text style={styles.date}>{j.date}</Text>
                </View>
                <Text style={styles.role}>{j.role}</Text>
                {j.bullets.map((b) => (
                  <Bullet key={b.slice(0, 48)} styles={styles}>{b}</Bullet>
                ))}
              </View>
            ))}
          </View>
        </Section>

        <View style={styles.bottomGrid}>
          <View style={styles.bottomCol}>
            <Section styles={styles} title="Capabilities">
              <View style={styles.capabilityGrid}>
                {capabilities.map(([label, text]) => (
                  <View key={label} style={styles.capability}>
                    <Text style={styles.capabilityLabel}>{label}</Text>
                    <Text style={styles.capabilityText}>{text}</Text>
                  </View>
                ))}
              </View>
            </Section>
          </View>

          <View style={styles.bottomCol}>
            <Section styles={styles} title="Selected Work">
              {projects.map(([name, url, desc]) => (
                <View key={name} style={styles.project}>
                  <Text style={styles.projectName}><Link src={url} style={styles.projectLink}>{name}</Link></Text>
                  <Text style={styles.projectDesc}>{desc}</Text>
                </View>
              ))}
            </Section>
          </View>
        </View>

        <View style={styles.footerProof}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Operator range</Text>
            <Text style={styles.footerText}>Roadmap, customer discovery, systems design, implementation, and launch ownership.</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Enterprise trust</Text>
            <Text style={styles.footerText}>Identity, permissions, deployment paths, data boundaries, and regulated workflows.</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>AI product taste</Text>
            <Text style={styles.footerText}>Evals, workflow UX, agents, RAG, developer tools, and production feedback loops.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
