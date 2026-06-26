import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Wordmark from './Wordmark';

const navLinks = [
  { label: 'WORK', path: '/' },
  { label: 'CAREER', path: '/career' },
  { label: 'PROJECTS', path: '/projects' },
  { label: 'CONTACT', path: '/contact' },
  { label: 'RESUME', path: '/resume' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(245,241,232,0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(16, 20, 28, 0.08)' : '1px solid transparent',
      }}
    >
      <div className="content-max-width flex items-center justify-between min-h-[3.9rem] md:min-h-[4.5rem] py-2 md:py-3">
        {/* Brand — Pretext wordmark */}
        <Link
          to="/"
          aria-label="Alex Welcing — home"
          className="inline-flex items-center transition-transform duration-200 hover:scale-105"
          style={{ width: 148 }}
        >
          <Wordmark maxWidth={148} color="var(--text-primary)" accent="var(--accent)" slant={-2} />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="font-nav relative py-2 transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 h-[1px] w-full transition-transform duration-200 origin-left"
                  style={{
                    backgroundColor: 'var(--accent)',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-3 min-h-11 min-w-11 items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-[1px] transition-transform duration-200"
            style={{
              backgroundColor: 'var(--text-primary)',
              transform: menuOpen ? 'rotate(45deg) translateY(4px)' : 'none',
            }}
          />
          <span
            className="block w-5 h-[1px] transition-opacity duration-200"
            style={{ backgroundColor: 'var(--text-primary)', opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-5 h-[1px] transition-transform duration-200"
            style={{
              backgroundColor: 'var(--text-primary)',
              transform: menuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40 flex flex-col items-center justify-center gap-8"
          style={{ backgroundColor: 'rgba(245,241,232,0.96)', backdropFilter: 'blur(20px)' }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="font-h2 transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
