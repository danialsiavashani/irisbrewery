"use client";

export function KeyScene() {
  return (
    <svg
      viewBox="0 0 300 300"
      className="w-full max-w-xs"
      role="img"
      aria-label="Animation of a key being sketched"
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
        .key-path-1 { --dash: 170; stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0s; }
        .key-path-2 { --dash: 140; stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0.15s; }
        .key-path-3 { --dash: 70;  stroke-dasharray: var(--dash); animation: drawLine 8s ease-in-out infinite; animation-delay: 0.3s; }

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

      {/* Phase 1: flat-color "photo" layer — bow, shaft, teeth */}
      <g className="photo-layer">
        <circle cx="150" cy="90" r="32" fill="none" stroke="#c9a34a" strokeWidth="14" />
        <rect x="143" y="118" width="14" height="95" fill="#c9a34a" />
        <rect x="157" y="175" width="16" height="10" fill="#c9a34a" />
        <rect x="157" y="195" width="22" height="10" fill="#c9a34a" />
      </g>

      {/* Phase 2/3: hand-drawn sketch outline layer — bow first, shaft, teeth last */}
      <g className="sketch-layer">
        <path
          className="key-path-1"
          d="M 150,58 a 32,32 0 1,0 0.01,0"
        />
        <path
          className="key-path-2"
          d="M 143,118 L 143,213 L 157,213 L 157,118"
        />
        <path
          className="key-path-3"
          d="M 157,175 L 173,175 L 173,185 L 157,185 M 157,195 L 179,195 L 179,205 L 157,205"
        />
      </g>
    </svg>
  );
}