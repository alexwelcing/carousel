import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Career from './pages/Career';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Role from './pages/Role';

const Resume = lazy(() => import('./pages/Resume'));

function ResumeSkeleton() {
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>Loading resume...</span>
    </div>
  );
}

/* Per-route SEO — sets document title, description, robots, canonical, and OG on navigation. */
const PAGE_SEO: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Alex Welcing — Technical Product Manager & AI Engineer (NYC) · Multi-Agent Systems, Enterprise Identity',
    description:
      'NYC-based Technical Product Manager and AI engineer. 15 years building AI products, multi-agent systems, developer tools, and enterprise identity/SSO platforms at scale — strategy plus shipped code. Open to Principal/Staff Product and Forward-Deployed AI roles.',
  },
  '/career': {
    title: 'Career — Alex Welcing · 15 Years: AI Partnerships to Enterprise Identity to Multi-Agent Systems',
    description:
      'Career timeline: Law Business Research (enterprise identity & platform at billions of requests/mo, SSO/SAML/OIDC for 150+ AmLaw 200 firms), Obsess VR 3D commerce, Manatt document AI, Arkadium NLP partnerships.',
  },
  '/projects': {
    title: 'Projects — Alex Welcing · CreateSuite Multi-Agent Platform, Lupi.Live, Enterprise AI',
    description:
      'Selected work: CreateSuite (solo-built multi-agent orchestration across six model providers), Lupi.Live materials-science AI, alexwelcing.com 3D + semantic search, and enterprise AI platforms.',
  },
  '/contact': {
    title: 'Contact Alex Welcing — Open to Principal/Staff Product & Forward-Deployed AI Roles (NYC)',
    description:
      'Get in touch with Alex Welcing — Technical Product Manager and AI engineer in New York. Open to Principal/Staff Product, AI Product Lead, and Forward-Deployed Engineering roles.',
  },
  '/resume': {
    title: 'Resume — Alex Welcing, Technical Product Manager & AI Engineer (NYC)',
    description:
      'Resume of Alex Welcing: 15 years of AI product management, multi-agent systems, enterprise identity/SSO, and developer tools. Download PDF.',
  },
};

const DEFAULT_SEO = PAGE_SEO['/'];

function setMeta(selector: string, attr: string, key: string, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/* ── Cookieless open-pulse ──────────────────────────────────────────────
   First-party engagement signal with NO cookies and NO browser storage.
   On the first external entry to the site it POSTs a single ping to a
   private ntfy topic so opens of shared 1:1 packet links surface in
   real time. Skips automated and internal navigations. Privacy: sends
   only the path/slug, the ?src channel tag, and the referrer host. */
const PULSE_TOPIC = 'welcing-pulse-a9f3k7q2x5';
let pulsed = false;

function pulseOpen(pathname: string, search: string) {
  if (pulsed) return;
  pulsed = true;
  try {
    if (typeof navigator !== 'undefined' && navigator.webdriver) return; // skip bots/automation
    const ref = document.referrer || '';
    if (ref.indexOf('welc.ing') !== -1) return; // skip internal navigations
    const isPacket = pathname.startsWith('/role/') || pathname.startsWith('/r/');
    const label = isPacket ? (pathname.split('/').filter(Boolean).pop() || pathname) : pathname;
    const src = new URLSearchParams(search).get('src') || '';
    let host = 'direct';
    try { if (ref) host = new URL(ref).host; } catch { host = 'unknown'; }
    const body = `${isPacket ? 'OPEN' : 'visit'} ${label}${src ? ' · src=' + src : ''} · ref=${host} · ${new Date().toISOString()}`;
    fetch('https://ntfy.sh/' + PULSE_TOPIC, {
      method: 'POST',
      headers: {
        Title: (isPacket ? 'Packet opened: ' : 'welc.ing visit: ') + label,
        Tags: isPacket ? 'eyes,fire' : 'eyes',
        Priority: isPacket ? '4' : '2',
      },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let analytics break the page */
  }
}

function Seo() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const isPrivate = pathname.startsWith('/role/') || pathname.startsWith('/r/');
    const cfg = PAGE_SEO[pathname] ?? DEFAULT_SEO;
    const title = isPrivate ? 'Alex Welcing — Application Packet' : cfg.title;
    const description = isPrivate ? 'A tailored application packet from Alex Welcing.' : cfg.description;

    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', isPrivate ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', `https://welc.ing${pathname}`);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', isPrivate ? 'https://welc.ing/' : `https://welc.ing${pathname}`);

    pulseOpen(pathname, search);
  }, [pathname, search]);

  return null;
}

export default function App() {
  return (
    <Layout>
      <Seo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/career" element={<Career />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        {/* /role/:slug is intentionally unlisted — shared 1:1, never indexed or linked publicly */}
        <Route path="/role/:slug" element={<Role />} />
        <Route path="/r/:slug" element={<Role />} />
        <Route path="/resume" element={<Suspense fallback={<ResumeSkeleton />}><Resume /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
