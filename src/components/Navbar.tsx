import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Wordmark from './Wordmark';

const navLinks = [
  { label: 'WORK', path: '/' },
  { label: 'CAREER', path: '/career' },
  { label: 'PROJECTS', path: '/projects' },
  { label: 'CONTACT', path: '/contact' },
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
        backgroundColor: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="content-max-width flex items-center justify-between h-16">
        {/* Brand — Pretext wordmark */}
        <Link
          to="/"
          aria-label="Alex Welcing — home"
          className="inline-flex items-center transition-transform duration-200 hover:scale-105"
          style={{ width: 150 }}
        >
          <Wordmark maxWidth={150} slant={-3.5} />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="font-nav relative py-1 transition-colors duration-200"
                style={{
                  color: isActive ? '#FF3366' : '#FFFFFF',
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 h-[1px] w-full transition-transform duration-200 origin-left"
                  style={{
                    backgroundColor: '#FF3366',
                    transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-[1px] bg-[#FFFFFF] transition-transform duration-200"
            style={{
              transform: menuOpen ? 'rotate(45deg) translateY(4px)' : 'none',
            }}
          />
          <span
            className="block w-5 h-[1px] bg-[#FFFFFF] transition-opacity duration-200"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-5 h-[1px] bg-[#FFFFFF] transition-transform duration-200"
            style={{
              transform: menuOpen ? 'rotate(-45deg) translateY(-4px)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40 flex flex-col items-center justify-center gap-8"
          style={{ backgroundColor: '#0A0A0A' }}
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="font-h2 transition-colors duration-200"
                style={{
                  color: isActive ? '#FF3366' : '#FFFFFF',
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
