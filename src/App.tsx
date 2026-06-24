import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Career from './pages/Career'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Role from './pages/Role'

const Resume = lazy(() => import('./pages/Resume'));

function ResumeSkeleton() {
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span className="font-caption" style={{ color: 'var(--text-tertiary)' }}>Loading resume...</span>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/career" element={<Career />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        {/* /role/:slug is intentionally unlisted — shared 1:1, never indexed or linked publicly */}
        <Route path="/role/:slug" element={<Role />} />
        <Route path="/r/:slug" element={<Role />} />
        <Route path="/resume" element={<Suspense fallback={<ResumeSkeleton />}><Resume /></Suspense>} />
      </Routes>
    </Layout>
  )
}
