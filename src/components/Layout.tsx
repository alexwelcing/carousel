import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import GradientBlobs from './GradientBlobs';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      {/* Site-wide floating gradient orbs */}
      <GradientBlobs />
      <Navbar />
      <main className="flex-1 relative">{children}</main>
      <Footer />
    </div>
  );
}
