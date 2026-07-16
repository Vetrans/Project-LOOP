// The signature element: an intentionally unclosed ring. LOOP's whole
// premise is closing the gap between scattered feedback and a decision —
// so the mark stays open, with one small dot slowly completing the orbit
// the rest of the ring is missing. Motion is a single, slow, deliberate
// loop (18s) rather than anything that reads as decorative busywork.
export default function LoopMark({ size = 28 }) {
  const id = "loop-mark-gradient";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8F83F7" />
          <stop offset="100%" stopColor="#6A5CE0" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="12" stroke="#232838" strokeWidth="3" />
      <path d="M16 4a12 12 0 0 1 12 12" stroke={`url(#${id})`} strokeWidth="3" strokeLinecap="round" />
      <g style={{ transformOrigin: "16px 16px", animation: "loop-orbit 18s linear infinite" }}>
        <circle cx="28" cy="16" r="2.4" fill="#43D6C0" />
      </g>
      <style>{`
        @keyframes loop-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          g { animation: none !important; }
        }
      `}</style>
    </svg>
  );
}
