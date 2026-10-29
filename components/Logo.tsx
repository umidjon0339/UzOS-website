// The UzOS mark: the three bands of the flag with its thin red lines,
// in a rounded square, followed by the name.
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <clipPath id="uz-logo-clip">
          <rect width="32" height="32" rx="8" />
        </clipPath>
      </defs>
      <g clipPath="url(#uz-logo-clip)">
        <rect width="32" height="11" fill="#0099b5" />
        <rect y="11" width="32" height="10" fill="#fff" />
        <rect y="21" width="32" height="11" fill="#1eb53a" />
        <rect y="10.5" width="32" height="1.2" fill="#ce1126" />
        <rect y="20.3" width="32" height="1.2" fill="#ce1126" />
        {/* the crescent from the flag, in the blue band */}
        <circle cx="8" cy="5.5" r="3.2" fill="#fff" />
        <circle cx="9.3" cy="5.5" r="2.7" fill="#0099b5" />
      </g>
      <rect width="32" height="32" rx="8" fill="none" stroke="#0000001a" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-semibold tracking-tight">
      <LogoMark />
      <span className="text-lg">
        Uz<span className="text-brand-600 dark:text-brand-300">OS</span>
      </span>
    </span>
  );
}
