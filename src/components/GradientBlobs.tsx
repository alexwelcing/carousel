import React from 'react';

interface GradientBlobsProps {
  className?: string;
}

const GradientBlobs = React.memo(function GradientBlobs({ className = '' }: GradientBlobsProps) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Cyan blob — upper right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(51, 204, 255, 0.04) 0%, transparent 70%)',
          filter: 'blur(80px)',
          top: '-10%',
          right: '-10%',
          animation: 'blob-float-1 20s ease-in-out infinite',
        }}
      />
      {/* Magenta blob — lower left */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 51, 102, 0.035) 0%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: '-10%',
          left: '-10%',
          animation: 'blob-float-2 25s ease-in-out infinite',
        }}
      />
      {/* White blob — center drift */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(230, 231, 232, 0.025) 0%, transparent 70%)',
          filter: 'blur(100px)',
          top: '30%',
          left: '30%',
          animation: 'blob-float-3 22s ease-in-out infinite',
        }}
      />

      <style>{`
        @keyframes blob-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(-5vw, 8vh) scale(1.1); }
          50% { transform: translate(3vw, 4vh) scale(0.95); }
          75% { transform: translate(-2vw, -6vh) scale(1.05); }
        }
        @keyframes blob-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(6vw, -5vh) scale(1.08); }
          66% { transform: translate(-4vw, 3vh) scale(0.92); }
        }
        @keyframes blob-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          20% { transform: translate(4vw, -7vh) scale(1.06); }
          40% { transform: translate(-6vw, 2vh) scale(0.94); }
          60% { transform: translate(3vw, 5vh) scale(1.03); }
          80% { transform: translate(-3vw, -3vh) scale(0.97); }
        }
      `}</style>
    </div>
  );
});

export default GradientBlobs;
