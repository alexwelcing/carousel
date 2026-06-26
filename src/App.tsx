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

/* Per-route SEO — sets document title, description, robots, canonical, and OG on navigation.
   No dependencies; helps Google (which renders JS) index each route distinctly. */
const PAGE_SEO: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Alex Welcing — AI product builder. Solo founder-speed, enterprise-scale judgment. (NYC · Principal / Staff PM)',
    description:
      'Architect PM and product-minded engineer who ships AI products end to end: production agents, materials-science ML, document AI, 3D commerce, and enterprise platforms. Considering principal / staff product and forward-deployed PM roles in New York.',
  },
  '/career': {
    title: 'Career — Alex Welcing · 12+ Years: AI Products, 3D Interfaces, Document AI, Scientific ML',
    description:
      'Career timeline: Law Business Research (enterprise identity & platform at billions of requests/mo, SSO/SAML/OIDC for 150+ AmLaw 200 firms), Obsess VR 3D commerce for Alo/Moncler/Ralph Lauren, Manatt document AI, Arkadium NLP partnerships.',
  },
  '/projects': {
    title: 'Projects — Alex Welcing · lupi.live, lupine.science, High Era, alexwelcing.com',
    description:
      'Selected work, built end-to-end: lupi.live R3F molecule viewer, lupine.science company and scientific research site, Lupine MLIP / phase-change pipelines, alexwelcing.com 3D + semantic search, High Era on Google Cloud.',
  },
  '/contact': {
    title: 'Contact Alex Welcing — Open to Principal / Staff Product & Forward-Deployed PM Roles (NYC)',
    description:
      'Get in touch with Alex Welcing — Architect PM in New York. Open to principal / staff product, AI product lead, and forward-deployed PM roles at AI-native companies.',
  },
  '/resume': {
    title: 'Resume — Alex Welcing, Architect PM (AI Agents, Identity, Enterprise Platforms · NYC)',
    description:
      'Resume of Alex Welcing: twelve-plus years of AI product management, multi-agent systems, enterprise identity/SSO, document AI, and developer tools. One-page PDF download.',
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

function Seo() {
  const { pathname } = useLocation();
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
  }, [pathname]);

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
