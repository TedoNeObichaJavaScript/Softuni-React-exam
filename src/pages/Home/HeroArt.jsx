const PINES = [
  { x: 72, y: 356, scale: 1 },
  { x: 92, y: 352, scale: 0.8 },
  { x: 438, y: 334, scale: 1.1 },
  { x: 462, y: 338, scale: 0.85 },
  { x: 486, y: 340, scale: 1 },
  { x: 36, y: 424, scale: 1.2 },
  { x: 520, y: 418, scale: 1.3 },
];

function Pine({ x, y, scale }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${scale})`}
      d="M0 -34 L11 -14 L6 -14 L14 0 L-14 0 L-6 -14 L-11 -14 Z"
      fill="#1f523d"
    />
  );
}

export default function HeroArt({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 560 460"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hero-art-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6f1e2" />
          <stop offset="1" stopColor="#e4efe9" />
        </linearGradient>
      </defs>

      <rect width="560" height="460" fill="url(#hero-art-sky)" />

      <circle cx="404" cy="112" r="74" fill="#f2a541" opacity="0.16" />
      <circle cx="404" cy="112" r="44" fill="#f2a541" />

      <path
        d="M118 104 q8 -8 16 0 q8 -8 16 0 M168 132 q6 -6 12 0 q6 -6 12 0"
        fill="none"
        stroke="#5d6862"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Far range with snow caps */}
      <path
        d="M0 280 L60 230 L105 255 L180 160 L235 215 L285 185 L350 240 L430 150 L500 210 L560 180 V460 H0 Z"
        fill="#c3dacc"
      />
      <path d="M180 160 L162.6 182 L171 177 L180 186 L189 177 L200 180 Z" fill="#f4f7f3" />
      <path d="M430 150 L410.5 172 L420 167 L429 176 L440 166 L453 170 Z" fill="#f4f7f3" />

      {/* Middle range, the trail ends on its highest peak */}
      <path
        d="M0 330 L70 285 L130 310 L215 235 L300 315 L360 280 L440 330 L500 300 L560 325 V460 H0 Z"
        fill="#8db69f"
      />

      <path
        d="M0 375 C60 345 120 340 190 360 C260 380 320 350 390 335 C450 322 510 335 560 350 V460 H0 Z"
        fill="#4d876a"
      />

      <path
        d="M0 420 C80 395 170 395 250 412 C330 430 420 400 560 405 V460 H0 Z"
        fill="#1e5a43"
      />

      {PINES.map((pine) => (
        <Pine key={`${pine.x}-${pine.y}`} {...pine} />
      ))}

      <path
        d="M300 460 C285 432 252 424 242 398 C232 372 262 352 248 322 C238 300 226 270 217 242"
        fill="none"
        stroke="#fbf6e9"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="1 11"
      />

      <path d="M215 236 V204" stroke="#14201b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M216 204 L238 211 L216 219 Z" fill="#f2a541" />
    </svg>
  );
}
