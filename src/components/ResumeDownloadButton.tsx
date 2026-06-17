import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import ResumePDFDocument from './ResumePDF';

interface ResumeDownloadButtonProps {
  variant?: 'primary' | 'ghost' | 'card';
  className?: string;
}

function BlobDownloadButton({ onClick, variant, label, downloading }: {
  onClick: () => void;
  variant: string;
  label: string;
  downloading: boolean;
}) {
  if (variant === 'card') {
    return (
      <button
        onClick={onClick}
        disabled={downloading}
        className="font-nav inline-flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          color: 'var(--text-primary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent-glitch)';
          e.currentTarget.style.color = 'var(--bg-primary)';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {downloading ? 'GENERATING...' : label}
      </button>
    );
  }

  const isGhost = variant === 'ghost';
  return (
    <button
      onClick={onClick}
      disabled={downloading}
      className="font-nav inline-flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50"
      style={{
        padding: '12px 24px',
        backgroundColor: isGhost ? 'transparent' : 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '4px',
        color: 'var(--text-primary)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--accent-glitch)';
        e.currentTarget.style.color = 'var(--bg-primary)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isGhost ? 'transparent' : 'var(--bg-elevated)';
        e.currentTarget.style.color = 'var(--text-primary)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }}
    >
      {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {downloading ? 'GENERATING PDF...' : label}
    </button>
  );
}

export default function ResumeDownloadButton({ variant = 'primary', className = '' }: ResumeDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await pdf(<ResumePDFDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Alex-Welcing-Resume-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      // Keep spinner for a moment so user sees feedback
      setTimeout(() => setDownloading(false), 800);
    }
  }, []);

  return (
    <div className={className}>
      <BlobDownloadButton
        onClick={handleDownload}
        variant={variant}
        label="DOWNLOAD RESUME"
        downloading={downloading}
      />
    </div>
  );
}
