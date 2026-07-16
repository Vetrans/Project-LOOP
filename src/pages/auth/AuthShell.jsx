export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-ink-950 bg-loop-radial px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="mb-4">
            <circle cx="16" cy="16" r="12" stroke="#2A3349" strokeWidth="3" />
            <path d="M16 4a12 12 0 0 1 12 12" stroke="#7C6FF0" strokeWidth="3" strokeLinecap="round" />
            <circle cx="28" cy="16" r="2.5" fill="#2DD9B9" />
          </svg>
          <h1 className="font-display text-2xl font-bold text-mist-100">{title}</h1>
          <p className="mt-1.5 text-sm text-mist-400">{subtitle}</p>
        </div>
        <div className="panel p-7">{children}</div>
      </div>
    </div>
  );
}
