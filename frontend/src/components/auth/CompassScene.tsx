"use client";

export function CompassScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full max-w-xs"
      role="img"
      aria-label="Animation of a compass being sketched"
    >
      <style>{`
        .photo-layer {
          animation: photoFade 8s ease-in-out infinite;
        }
        .sketch-layer path {
          fill: none;
          stroke: #333;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .compass-path-1 { --dash: 220; stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0s; }
        .compass-path-2 { --dash: 60;  stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0.15s; }
        .compass-path-3 { --dash: 40;  stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0.3s; }

        @keyframes photoFade {
          0%   { opacity: 1; }
          30%  { opacity: 1; }
          50%  { opacity: 0; }
          90%  { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes drawLine {
          0%   { stroke-dashoffset: var(--dash); opacity: 0; }
          30%  { stroke-dashoffset: var(--dash); opacity: 1; }
          55%  { stroke-dashoffset: 0; opacity: 1; }
          90%  { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: var(--dash); opacity: 0; }
        }
      `}</style>

      {/* Phase 1: flat-color "photo" layer — outer ring, face, needle */}
      <g className="photo-layer">
        <circle cx="150" cy="150" r="65" fill="#e8dcc4" stroke="#c9a34a" strokeWidth="8" />
        <polygon points="150,100 160,150 150,200 140,150" fill="#a94a3f" />
        <circle cx="150" cy="150" r="6" fill="#3a3630" />
      </g>

      {/* Phase 2/3: hand-drawn sketch outline layer — ring first, needle, center pin last */}
      <g className="sketch-layer">
        <path
          className="compass-path-1"
          d="M 150,85 a 65,65 0 1,0 0.01,0"
        />
        <path
          className="compass-path-2"
          d="M 150,100 L 160,150 L 150,200 L 140,150 Z"
        />
        <path
          className="compass-path-3"
          d="M 150,144 a 6,6 0 1,0 0.01,0"
        />
      </g>
    </svg>
  );
}