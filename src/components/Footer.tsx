import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="w-full py-12"
      style={{
        borderTop: '1px solid #222222',
        backgroundColor: '#050505',
      }}
    >
      <div className="content-max-width flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-jetbrains text-[0.875rem] font-bold tracking-[0.02em] uppercase text-[#FFFFFF]">
            AW
          </span>
          <span className="font-caption text-[#525252]">
            AI Engineer :: Open Source Builder
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-nav text-[#A0A0A0] hover:text-[#FF3366] transition-colors duration-200"
          >
            HOME
          </Link>
          <Link
            to="/career"
            className="font-nav text-[#A0A0A0] hover:text-[#FF3366] transition-colors duration-200"
          >
            CAREER
          </Link>
          <Link
            to="/projects"
            className="font-nav text-[#A0A0A0] hover:text-[#FF3366] transition-colors duration-200"
          >
            PROJECTS
          </Link>
          <Link
            to="/contact"
            className="font-nav text-[#A0A0A0] hover:text-[#FF3366] transition-colors duration-200"
          >
            CONTACT
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/alexwelcing"
            target="_blank"
            rel="noopener noreferrer"
            className="font-caption text-[#525252] hover:text-[#33CCFF] transition-colors duration-200"
          >
            GITHUB ↗
          </a>
          <a
            href="https://linkedin.com/in/alexwelcing"
            target="_blank"
            rel="noopener noreferrer"
            className="font-caption text-[#525252] hover:text-[#33CCFF] transition-colors duration-200"
          >
            LINKEDIN ↗
          </a>
        </div>
      </div>

      <div className="content-max-width mt-8 pt-6 flex justify-center">
        <span className="font-caption text-[#525252]">
          © {new Date().getFullYear()} Alex Welcing. Built with code.
        </span>
      </div>
    </footer>
  );
}
