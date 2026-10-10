import React from 'react'

export const ReminderCatIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[140px]' }) => {
  return (
    <svg
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Kucing Pengingat Lucu"
    >
      <defs>
        <radialGradient id="remGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF1CC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura background */}
      <circle cx="80" cy="70" r="55" fill="url(#remGlow)" />

      {/* Leaf Branch Decoration */}
      <path
        d="M20 110 Q50 95 80 115"
        stroke="#21845F"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="36" cy="98" rx="8" ry="4" transform="rotate(-30 36 98)" fill="#21845F" opacity="0.8" />
      <ellipse cx="56" cy="104" rx="9" ry="4.5" transform="rotate(25 56 104)" fill="#21845F" opacity="0.8" />
      <ellipse cx="76" cy="112" rx="7" ry="3.5" transform="rotate(-15 76 112)" fill="#21845F" opacity="0.8" />

      {/* Cat Body */}
      <ellipse cx="80" cy="100" rx="38" ry="32" fill="#E2E8F0" />
      <ellipse cx="80" cy="104" rx="22" ry="18" fill="#F8FAFC" />

      {/* Cat Paws holding medicine pill */}
      <ellipse cx="64" cy="112" rx="9" ry="7" fill="#CBD5E1" />
      <ellipse cx="96" cy="112" rx="9" ry="7" fill="#CBD5E1" />

      {/* Pill capsule between paws */}
      <g transform="translate(73, 105) rotate(-20)">
        <rect x="0" y="0" width="16" height="8" rx="4" fill="#E11D48" />
        <rect x="8" y="0" width="8" height="8" rx="0" fill="#FFF1CC" />
        <line x1="8" y1="0" x2="8" y2="8" stroke="#FFFFFF" strokeWidth="1" />
      </g>

      {/* Cat Ears */}
      <polygon points="52,48 42,22 68,36" fill="#94A3B8" />
      <polygon points="53,44 47,28 64,36" fill="#FCE7E5" />
      <polygon points="108,48 118,22 92,36" fill="#94A3B8" />
      <polygon points="107,44 113,28 96,36" fill="#FCE7E5" />

      {/* Cat Head */}
      <circle cx="80" cy="62" r="30" fill="#CBD5E1" />

      {/* Cat Cheeks */}
      <ellipse cx="60" cy="68" rx="6" ry="4" fill="#F43F5E" opacity="0.35" />
      <ellipse cx="100" cy="68" rx="6" ry="4" fill="#F43F5E" opacity="0.35" />

      {/* Big Sparkling Eyes */}
      <ellipse cx="68" cy="58" rx="5" ry="6" fill="#24312C" />
      <circle cx="66" cy="56" r="2" fill="#FFFFFF" />
      <circle cx="70" cy="61" r="1" fill="#FFFFFF" />
      <ellipse cx="92" cy="58" rx="5" ry="6" fill="#24312C" />
      <circle cx="90" cy="56" r="2" fill="#FFFFFF" />
      <circle cx="94" cy="61" r="1" fill="#FFFFFF" />

      {/* Nose and Mouth */}
      <polygon points="80,66 77,63 83,63" fill="#F43F5E" />
      <path d="M80 66 V69" stroke="#24312C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M74 69 Q80 73 86 69" stroke="#24312C" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Whiskers */}
      <line x1="56" y1="67" x2="40" y2="65" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="56" y1="71" x2="42" y2="74" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="104" y1="67" x2="120" y2="65" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="104" y1="71" x2="118" y2="74" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />

      {/* Floating Sparkle & Heart */}
      <path
        d="M125 35 C122 30 115 30 112 35 C109 40 115 46 125 52 C135 46 141 40 138 35 C135 30 128 30 125 35 Z"
        fill="#E11D48"
        opacity="0.8"
        transform="scale(0.7) translate(40, -10)"
      />
    </svg>
  )
}
