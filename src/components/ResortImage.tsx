// Stylised placeholder art per resort category. Pure SVG so the demo needs no
// external image hosting; hue varies per resort slug so cards do not look cloned.

function hueShift(slug: string, range: number) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) % 997;
  return (h % (range * 2)) - range;
}

const scenes: Record<string, { from: string; to: string; art: (id: string) => React.ReactNode }> = {
  BEACH: {
    from: "#2563ab",
    to: "#1f7d75",
    art: (id) => (
      <>
        <circle cx="82" cy="22" r="11" fill="#f9edd6" opacity="0.9" />
        <path d="M0 46 Q 12 42 25 46 T 50 46 T 75 46 T 100 46 V 60 H 0 Z" fill={`url(#${id}-w)`} opacity="0.55" />
        <path d="M0 52 Q 12 48 25 52 T 50 52 T 75 52 T 100 52 V 60 H 0 Z" fill="#ffffff" opacity="0.18" />
      </>
    ),
  },
  BUSH: {
    from: "#8a6a1f",
    to: "#3d5a1e",
    art: (id) => (
      <>
        <circle cx="78" cy="20" r="10" fill="#f2d9a8" opacity="0.9" />
        <ellipse cx="50" cy="58" rx="70" ry="14" fill={`url(#${id}-w)`} opacity="0.5" />
        <path d="M22 46 L22 34 M22 34 C 15 30 15 24 20 22 C 18 16 26 12 30 16 C 36 12 42 18 38 23 C 44 26 41 33 34 34 L 22 34" stroke="#1f2f10" strokeWidth="2.4" fill="#2d4415" opacity="0.85" />
        <path d="M62 50 L62 42 M62 42 C 57 40 57 35 61 34 C 60 30 66 28 68 31 C 72 28 76 32 73 35 C 77 37 74 42 69 42 L 62 42" stroke="#1f2f10" strokeWidth="1.8" fill="#2d4415" opacity="0.7" />
      </>
    ),
  },
  MOUNTAIN: {
    from: "#3b5b83",
    to: "#41657a",
    art: (id) => (
      <>
        <path d="M0 52 L 22 24 L 34 40 L 48 18 L 66 44 L 78 30 L 100 52 V 60 H 0 Z" fill={`url(#${id}-w)`} opacity="0.75" />
        <path d="M44 26 L 48 18 L 53 26 Z" fill="#ffffff" opacity="0.85" />
        <path d="M18 30 L 22 24 L 26 30 Z" fill="#ffffff" opacity="0.7" />
      </>
    ),
  },
};

export function ResortImage({
  slug,
  category,
  className = "",
}: {
  slug: string;
  category: string;
  className?: string;
}) {
  const scene = scenes[category] ?? scenes.BEACH;
  const shift = hueShift(slug, 14);
  const id = `ri-${slug}`;
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden style={{ filter: `hue-rotate(${shift}deg)` }}>
      <svg viewBox="0 0 100 60" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img">
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={scene.from} />
            <stop offset="100%" stopColor={scene.to} />
          </linearGradient>
          <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="100" height="60" fill={`url(#${id}-g)`} />
        {scene.art(id)}
      </svg>
    </div>
  );
}
