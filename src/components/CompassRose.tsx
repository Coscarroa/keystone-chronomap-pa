import React from 'react';

export const CompassRose: React.FC = () => {
  return (
    <div
      className="fixed bottom-32 left-6 z-20 opacity-40 pointer-events-none select-none hidden sm:flex flex-col items-center no-print"
      aria-hidden="true"
    >
      <svg
        width="96"
        height="96"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#D4AF37]"
      >
        {/* Outer archival degree ring */}
        <circle
          cx="60"
          cy="60"
          r="46"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeDasharray="2 3"
        />
        <circle
          cx="60"
          cy="60"
          r="38"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.6"
        />

        {/* Intercardinal diagonal lines */}
        <line
          x1="33"
          y1="33"
          x2="87"
          y2="87"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />
        <line
          x1="87"
          y1="33"
          x2="33"
          y2="87"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.5"
        />

        {/* North-South & East-West axis needles */}
        {/* North needle (filled half) */}
        <polygon points="60,12 65,55 60,50" fill="currentColor" />
        <polygon
          points="60,12 55,55 60,50"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />

        {/* South needle */}
        <polygon
          points="60,108 64,65 60,70"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <polygon
          points="60,108 56,65 60,70"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />

        {/* East needle */}
        <polygon
          points="108,60 65,56 70,60"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <polygon
          points="108,60 65,64 70,60"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />

        {/* West needle */}
        <polygon
          points="12,60 55,56 50,60"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <polygon
          points="12,60 55,64 50,60"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />

        {/* Center keystone & ring */}
        <circle
          cx="60"
          cy="60"
          r="4.5"
          stroke="currentColor"
          strokeWidth="1"
          fill="#0D0F12"
        />
        <circle cx="60" cy="60" r="1.5" fill="currentColor" />

        {/* Cardinal typography */}
        <text
          x="60"
          y="8.5"
          textAnchor="middle"
          fill="#F4F1EA"
          fontSize="8.5"
          fontFamily="Playfair Display, Georgia, serif"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          N
        </text>
        <text
          x="60"
          y="118"
          textAnchor="middle"
          fill="currentColor"
          fontSize="7"
          fontFamily="Playfair Display, Georgia, serif"
        >
          S
        </text>
        <text
          x="115"
          y="62.5"
          textAnchor="middle"
          fill="currentColor"
          fontSize="7"
          fontFamily="Playfair Display, Georgia, serif"
        >
          E
        </text>
        <text
          x="5"
          y="62.5"
          textAnchor="middle"
          fill="currentColor"
          fontSize="7"
          fontFamily="Playfair Display, Georgia, serif"
        >
          W
        </text>
      </svg>
      <span className="mt-1 font-mono text-[9px] tracking-[0.2em] text-[#A39E93] uppercase tabular-nums">
        40°58&apos;N · 77°44&apos;W
      </span>
    </div>
  );
};

export default CompassRose;
