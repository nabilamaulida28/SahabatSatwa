import React from 'react'

export const ProfilePetsIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[240px]' }) => {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hewan Sahabat Bahagia"
    >
      <defs>
        <radialGradient id="profGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E6F3E7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FAF6EF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="140" cy="140" rx="110" ry="25" fill="#E6F3E7" />
      <circle cx="140" cy="90" r="75" fill="url(#profGlow)" />

      {/* Floating Flowers and Hearts */}
      <circle cx="45" cy="60" r="12" fill="#FCE7E5" />
      <circle cx="235" cy="55" r="14" fill="#EEE6FA" />
      <path
        d="M140 20 C136 14 128 14 124 20 C120 26 128 34 140 42 C152 34 160 26 156 20 C152 14 144 14 140 20 Z"
        fill="#E11D48"
        opacity="0.85"
      />

      {/* Happy Golden Pup waving */}
      <g id="happy-puppy">
        <ellipse cx="100" cy="115" rx="38" ry="32" fill="#F5D0A9" />
        <circle cx="95" cy="80" r="28" fill="#E5A663" />
        {/* Floppy Ear */}
        <path d="M72 65 Q60 80 66 100 Q74 95 76 75 Z" fill="#C98642" />
        {/* Eye */}
        <path d="M84 75 Q89 71 94 75" stroke="#24312C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M102 75 Q107 71 112 75" stroke="#24312C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Snout */}
        <ellipse cx="98" cy="85" rx="12" ry="9" fill="#FFF5EB" />
        <ellipse cx="98" cy="80" rx="5" ry="3.5" fill="#24312C" />
        <path d="M98 83 V87" stroke="#24312C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M93 87 Q98 92 103 87" stroke="#24312C" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        <path d="M96 89 Q98 95 100 89 Z" fill="#F43F5E" />
        {/* Blush */}
        <ellipse cx="80" cy="84" rx="4" ry="3" fill="#F43F5E" opacity="0.3" />
        <ellipse cx="116" cy="84" rx="4" ry="3" fill="#F43F5E" opacity="0.3" />
        {/* Paw waving */}
        <ellipse cx="120" cy="70" rx="7" ry="9" transform="rotate(-30 120 70)" fill="#E5A663" />
      </g>

      {/* Sweet White Cat with Winking Eye */}
      <g id="sweet-cat">
        <ellipse cx="180" cy="118" rx="34" ry="28" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="175" cy="86" r="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Pointy ears */}
        <polygon points="156,72 150,50 168,64" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <polygon points="156,70 152,55 165,65" fill="#FCE7E5" />
        <polygon points="194,72 200,50 182,64" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <polygon points="194,70 198,55 185,65" fill="#FCE7E5" />
        {/* Eyes: one open, one wink */}
        <circle cx="166" cy="84" r="3.5" fill="#24312C" />
        <circle cx="165" cy="83" r="1.2" fill="#FFFFFF" />
        <path d="M182 84 Q186 80 190 84" stroke="#24312C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Pink nose */}
        <polygon points="175,88 173,86 177,86" fill="#F43F5E" />
        <path d="M172 90 Q175 93 178 90" stroke="#24312C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Whiskers */}
        <line x1="156" y1="88" x2="146" y2="86" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
        <line x1="156" y1="91" x2="148" y2="93" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
        <line x1="194" y1="88" x2="204" y2="86" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
        <line x1="194" y1="91" x2="202" y2="93" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  )
}
