import React, { useEffect, useState, useRef } from 'react';
import { HistoricalEra } from '../data/paCountiesData';

interface TimelineTransitionOverlayProps {
  activeEra: HistoricalEra;
}

/**
 * Returns the CSS filter string for the map canvas to achieve a smooth
 * duration-700 atmospheric transition across the 6 historical eras.
 */
export function getEraMapFilterStyle(eraId: string): string {
  switch (eraId) {
    case '1681':
      return 'sepia(0.32) saturate(0.92) contrast(1.04) brightness(0.97)';
    case '1776':
      return 'sepia(0.24) saturate(0.95) contrast(1.05) brightness(0.98)';
    case '1861':
      return 'sepia(0.14) saturate(0.82) contrast(1.12) brightness(0.96)';
    case '1870':
      return 'sepia(0.10) saturate(0.85) contrast(1.14) brightness(0.97)';
    case '1950':
      return 'sepia(0.05) saturate(0.95) contrast(1.04) brightness(0.99)';
    case 'present':
    default:
      return 'sepia(0) saturate(1) contrast(1) brightness(1)';
  }
}

export const TimelineTransitionOverlay: React.FC<
  TimelineTransitionOverlayProps
> = ({ activeEra }) => {
  const [showSeal, setShowSeal] = useState(false);
  const [displayedEra, setDisplayedEra] = useState<HistoricalEra>(activeEra);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setDisplayedEra(activeEra);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setShowSeal(true);
    const timer = window.setTimeout(() => {
      setShowSeal(false);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [activeEra]);

  // Era-specific atmospheric glaze over the viewport
  const getAtmosphereOverlayStyle = (eraId: string): React.CSSProperties => {
    switch (eraId) {
      case '1681':
      case '1776':
        return {
          background:
            'radial-gradient(circle at center, rgba(212, 175, 55, 0.06) 0%, rgba(197, 160, 89, 0.14) 100%)',
        };
      case '1861':
      case '1870':
        return {
          background:
            'radial-gradient(circle at center, rgba(29, 53, 87, 0.05) 0%, rgba(13, 15, 18, 0.35) 100%)',
        };
      case '1950':
        return {
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(22, 25, 32, 0.22) 100%)',
        };
      case 'present':
      default:
        return {
          background: 'transparent',
        };
    }
  };

  return (
    <>
      {/* Smooth duration-700 atmospheric color glaze */}
      <div
        className="fixed inset-0 pointer-events-none z-10 transition-all duration-700 ease-out no-print"
        style={getAtmosphereOverlayStyle(activeEra.id)}
        aria-hidden="true"
      />

      {/* Centered 900ms Floating Typographic Seal on Era Change */}
      <div
        className={`fixed inset-0 pointer-events-none z-40 flex items-center justify-center transition-all duration-300 no-print ${
          showSeal ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        aria-live="polite"
      >
        <div className="bg-[#161920]/90 backdrop-blur-2xl border border-[#D4AF37]/50 rounded-2xl px-8 py-6 shadow-2xl text-center max-w-md mx-4">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#A39E93] font-medium">
            ARCHIVO CARTOGRÁFICO DE PENSILVANIA
          </div>

          <div className="mt-1 font-serif text-4xl sm:text-5xl font-bold text-[#D4AF37] tracking-tight tabular-nums">
            {displayedEra.yearLabel}
          </div>

          <div className="my-2.5 mx-auto w-16 border-t border-[#D4AF37]/40" />

          <div className="font-serif text-base sm:text-lg font-semibold text-[#F4F1EA]">
            {displayedEra.title}
          </div>

          <div className="mt-1 text-xs text-[#A39E93]">
            {displayedEra.subtitle}
          </div>
        </div>
      </div>
    </>
  );
};

export default TimelineTransitionOverlay;
