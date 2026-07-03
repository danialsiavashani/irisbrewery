"use client";

export function LockScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full max-w-xs"
      role="img"
      aria-label="Animation of a padlock being sketched"
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
        .lock-path-1 { --dash: 140; stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0s; }
        .lock-path-2 { --dash: 260; stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0.15s; }
        .lock-path-3 { --dash: 60;  stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0.3s; }

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

      {/* Phase 1: flat-color "photo" layer — shackle, body, keyhole */}
      <g className="photo-layer">
        <path
          d="M 105,130 L 105,95 a 45,45 0 0,1 90,0 L 195,130"
          fill="none"
          stroke="#a8a29a"
          strokeWidth="14"
        />
        <rect x="80" y="130" width="140" height="110" rx="14" fill="#c9a34a" />
        <circle cx="150" cy="175" r="12" fill="#3a3630" />
        <rect x="144" y="182" width="12" height="24" rx="4" fill="#3a3630" />
      </g>

      {/* Phase 2/3: hand-drawn sketch outline layer — shackle first, then body, then keyhole */}
      <g className="sketch-layer">
        <path
          className="lock-path-1"
          d="M 105,130 L 105,95 a 45,45 0 0,1 90,0 L 195,130"
        />
        <path
          className="lock-path-2"
          d="M 80,130 h 140 v 110 h -140 Z"
        />
        <path
          className="lock-path-3"
          d="M 150,163 a 12,12 0 1,0 0.01,0 M 150,182 L 150,206"
        />
      </g>
    </svg>
  );
}