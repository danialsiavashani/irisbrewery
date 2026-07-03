"use client";

export function SketchScene() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full max-w-md"
      role="img"
      aria-label="Animation of a photo transforming into a pencil sketch"
    >
      <style>{`
        .photo-layer {
          animation: photoFade 5s ease-in-out infinite;
        }
        .sketch-layer path {
          fill: none;
          stroke: #333;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .sketch-path-1 { --dash: 220; stroke-dasharray: var(--dash); animation: drawLine 5s ease-in-out infinite; animation-delay: 0s; }
        .sketch-path-2 { --dash: 180; stroke-dasharray: var(--dash); animation: drawLine 5s ease-in-out infinite; animation-delay: 0.1s; }
        .sketch-path-3 { --dash: 90;  stroke-dasharray: var(--dash); animation: drawLine 5s ease-in-out infinite; animation-delay: 0.2s; }
        .sketch-path-4 { --dash: 300; stroke-dasharray: var(--dash); animation: drawLine 5s ease-in-out infinite; animation-delay: 0.15s; }

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

      {/* Phase 1: flat-color "photo" layer — no background rect, shapes float on page white */}
      <g className="photo-layer">
        <circle cx="320" cy="70" r="35" fill="#e8b04b" />
        <polygon points="20,220 170,90 280,220" fill="#6b8570" />
        <polygon points="140,220 260,120 380,220" fill="#4f6b57" />
        <path d="M 20,220 Q 200,215 380,220 L 380,235 Q 200,230 20,235 Z" fill="#d8cfbb" opacity="0.6" />
      </g>

      {/* Phase 2/3: hand-drawn sketch outline layer */}
      <g className="sketch-layer">
        <path
          className="sketch-path-1"
          d="M 20,220 L 170,90 L 280,220"
        />
        <path
          className="sketch-path-2"
          d="M 140,220 L 260,120 L 380,220"
        />
        <path
          className="sketch-path-3"
          d="M 285,70 a 35,35 0 1,0 70,0 a 35,35 0 1,0 -70,0"
        />
        <path
          className="sketch-path-4"
          d="M 20,220 L 380,220 M 60,238 L 110,236 M 170,244 L 230,242 M 280,236 L 340,238"
        />
      </g>
    </svg>
  );
}