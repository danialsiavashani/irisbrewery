"use client";

export function PhotoToSketchScene() {
  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full max-w-xs"
      role="img"
      aria-label="Diagram of a photo turning into a sketch"
    >
      <style>{`
        .photo-icon {
          animation: holdFade 6s ease-in-out infinite;
        }
        .arrow {
          animation: arrowPulse 6s ease-in-out infinite;
        }
        .sketch-icon path {
          fill: none;
          stroke: #333;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .sk-path-1 { --dash: 90; stroke-dasharray: var(--dash); animation: drawLine 6s ease-in-out infinite; animation-delay: 0s; }
        .sk-path-2 { --dash: 60; stroke-dasharray: var(--dash); animation: drawLine 6s ease-in-out infinite; animation-delay: 0.15s; }
        .sk-path-3 { --dash: 30; stroke-dasharray: var(--dash); animation: drawLine 6s ease-in-out infinite; animation-delay: 0.3s; }

        @keyframes holdFade {
          0%, 100% { opacity: 1; }
        }

        @keyframes arrowPulse {
          0%   { opacity: 0.3; }
          50%  { opacity: 1; }
          100% { opacity: 0.3; }
        }

        @keyframes drawLine {
          0%   { stroke-dashoffset: var(--dash); opacity: 0; }
          30%  { stroke-dashoffset: var(--dash); opacity: 1; }
          55%  { stroke-dashoffset: 0; opacity: 1; }
          90%  { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: var(--dash); opacity: 0; }
        }
      `}</style>

      {/* Photo icon — flat colored square with a simple scene inside */}
      <g className="photo-icon">
        <rect x="10" y="30" width="100" height="100" rx="10" fill="#e8e2d5" stroke="#c9c2b0" strokeWidth="2" />
        <circle cx="80" cy="55" r="10" fill="#e8b04b" />
        <polygon points="20,110 55,65 80,110" fill="#6b8570" />
        <polygon points="50,110 85,75 100,110" fill="#4f6b57" />
      </g>

      {/* Arrow */}
      <g className="arrow">
        <line x1="125" y1="80" x2="180" y2="80" stroke="#999" strokeWidth="2" />
        <polyline points="170,72 180,80 170,88" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Sketch icon — same scene, line-art, drawing in on loop */}
      <g className="sketch-icon" transform="translate(200, 0)">
        <rect x="10" y="30" width="100" height="100" rx="10" fill="none" stroke="#ccc" strokeWidth="1.5" />
        <path className="sk-path-1" d="M 20,110 L 55,65 L 80,110" />
        <path className="sk-path-2" d="M 50,110 L 85,75 L 100,110" />
        <path className="sk-path-3" d="M 80,45 a 10,10 0 1,0 0.01,0" />
      </g>
    </svg>
  );
}