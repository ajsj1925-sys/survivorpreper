/** Logo de Mi Plan B: escudo con casa. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sos-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f97316" />
          <stop offset="1" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="116" fill="url(#sos-g)" />
      <path d="M256 84 L392 134 V246 C392 336 336 398 256 430 C176 398 120 336 120 246 V134 Z" fill="#fff" />
      <path d="M256 186 L332 246 V330 Q332 342 320 342 H192 Q180 342 180 330 V246 Z" fill="#ea580c" />
      <rect x="236" y="276" width="40" height="66" rx="8" fill="#fff" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-8 w-8" />
      <span className="text-lg font-extrabold tracking-tight">
        Mi Plan <span className="text-brand-500">B</span>
      </span>
    </span>
  );
}
