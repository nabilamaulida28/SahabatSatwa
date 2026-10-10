import React from 'react'

export const HeroPetIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[280px] md:max-w-[340px]' }) => {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ilustrasi Anjing dan Kucing SahabatSatwa"
    >
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF1CC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FAF6EF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dogFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D0A9" />
          <stop offset="100%" stopColor="#E5A663" />
        </linearGradient>
        <linearGradient id="catFur" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>

      {/* Warm Background Aura & Decorative Elements */}
      <circle cx="200" cy="160" r="130" fill="url(#heroGlow)" />
      
      {/* Gentle Floating Pastel Shapes */}
      <circle cx="60" cy="80" r="16" fill="#EEE6FA" opacity="0.8" />
      <circle cx="340" cy="90" r="22" fill="#E6F3E7" opacity="0.9" />
      <circle cx="80" cy="220" r="14" fill="#FCE7E5" opacity="0.8" />
      <circle cx="330" cy="230" r="18" fill="#FFF1CC" opacity="0.8" />

      {/* Floating Hearts */}
      <path
        d="M200 45 C195 38 185 38 180 45 C175 52 185 62 200 72 C215 62 225 52 220 45 C215 38 205 38 200 45 Z"
        fill="#E11D48"
        opacity="0.85"
      />
      <path
        d="M320 60 C317 55 310 55 306 60 C302 65 310 72 320 79 C330 72 338 65 334 60 C330 55 323 55 320 60 Z"
        fill="#F43F5E"
        opacity="0.75"
        transform="scale(0.8) translate(80, 10)"
      />

      {/* Decorative Leaves */}
      <path
        d="M60 140 C50 125 70 115 80 120 C90 125 75 145 60 140 Z"
        fill="#21845F"
        opacity="0.6"
      />
      <path
        d="M335 150 C345 135 325 125 315 130 C305 135 320 155 335 150 Z"
        fill="#21845F"
        opacity="0.6"
      />

      {/* Paw Prints */}
      <g opacity="0.45" fill="#21845F">
        <circle cx="95" cy="55" r="4" />
        <circle cx="106" cy="50" r="3.5" />
        <circle cx="115" cy="56" r="3.5" />
        <ellipse cx="106" cy="62" rx="6" ry="5" />
      </g>
      <g opacity="0.45" fill="#21845F">
        <circle cx="295" cy="180" r="4" />
        <circle cx="306" cy="175" r="3.5" />
        <circle cx="315" cy="181" r="3.5" />
        <ellipse cx="306" cy="187" rx="6" ry="5" />
      </g>

      {/* Ground Pillow / Grass Base */}
      <ellipse cx="200" cy="260" rx="150" ry="22" fill="#E6F3E7" />
      <ellipse cx="200" cy="258" rx="130" ry="16" fill="#D3ECD6" />

      {/* DOG (Golden retriever mix on the left/center) */}
      <g id="dog">
        {/* Tail */}
        <path
          d="M100 220 Q70 200 80 170 Q90 160 98 185 Q105 210 100 220 Z"
          fill="url(#dogFur)"
        />
        {/* Body */}
        <ellipse cx="160" cy="210" rx="55" ry="46" fill="url(#dogFur)" />
        {/* Belly patch */}
        <ellipse cx="165" cy="220" rx="36" ry="30" fill="#FFF5EB" />

        {/* Paws */}
        <ellipse cx="135" cy="250" rx="14" ry="10" fill="#E5A663" />
        <ellipse cx="175" cy="250" rx="14" ry="10" fill="#E5A663" />
        {/* Paw toes */}
        <circle cx="130" cy="252" r="3" fill="#FFF5EB" />
        <circle cx="135" cy="254" r="3" fill="#FFF5EB" />
        <circle cx="140" cy="252" r="3" fill="#FFF5EB" />
        <circle cx="170" cy="252" r="3" fill="#FFF5EB" />
        <circle cx="175" cy="254" r="3" fill="#FFF5EB" />
        <circle cx="180" cy="252" r="3" fill="#FFF5EB" />

        {/* Dog Collar */}
        <path d="M130 160 Q155 170 180 160" stroke="#21845F" strokeWidth="8" strokeLinecap="round" />
        <circle cx="155" cy="168" r="6" fill="#FFF1CC" stroke="#21845F" strokeWidth="2" />

        {/* Head */}
        <circle cx="155" cy="125" r="42" fill="url(#dogFur)" />
        {/* Cheeks */}
        <ellipse cx="130" cy="138" rx="8" ry="5" fill="#F87171" opacity="0.4" />
        <ellipse cx="180" cy="138" rx="8" ry="5" fill="#F87171" opacity="0.4" />

        {/* Floppy Ears */}
        <path
          d="M120 105 Q100 120 105 155 Q115 165 125 135 Z"
          fill="#C98642"
        />
        <path
          d="M190 105 Q210 120 205 155 Q195 165 185 135 Z"
          fill="#C98642"
        />

        {/* Muzzle */}
        <ellipse cx="155" cy="136" rx="20" ry="16" fill="#FFF5EB" />
        {/* Nose */}
        <ellipse cx="155" cy="128" rx="8" ry="6" fill="#24312C" />
        {/* Mouth */}
        <path d="M155 134 V140" stroke="#24312C" strokeWidth="2" strokeLinecap="round" />
        <path d="M147 140 Q155 146 163 140" stroke="#24312C" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Happy Tongue */}
        <path d="M152 142 Q155 152 158 142 Z" fill="#F43F5E" />

        {/* Eyes (Happy arcs) */}
        <path d="M136 118 Q142 112 148 118" stroke="#24312C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M162 118 Q168 112 174 118" stroke="#24312C" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        {/* Eyebrow dots */}
        <circle cx="142" cy="108" r="2.5" fill="#C98642" />
        <circle cx="168" cy="108" r="2.5" fill="#C98642" />
      </g>

      {/* CAT (Cute British shorthair kitten on the right) */}
      <g id="cat">
        {/* Tail curled up */}
        <path
          d="M290 230 Q330 220 325 180 Q320 160 305 165 Q310 180 295 210 Z"
          fill="url(#catFur)"
        />

        {/* Cat Body */}
        <ellipse cx="255" cy="215" rx="42" ry="38" fill="url(#catFur)" />
        <ellipse cx="250" cy="222" rx="26" ry="24" fill="#F1F5F9" />

        {/* Cat Paws */}
        <ellipse cx="235" cy="250" rx="11" ry="8" fill="#CBD5E1" />
        <ellipse cx="265" cy="250" rx="11" ry="8" fill="#CBD5E1" />

        {/* Cat Bell Collar */}
        <path d="M232 175 Q252 185 272 175" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" />
        <circle cx="252" cy="183" r="4.5" fill="#FDE047" stroke="#8B5CF6" strokeWidth="1.5" />

        {/* Pointy Ears */}
        <path d="M228 120 L220 85 L245 105 Z" fill="url(#catFur)" />
        <path d="M228 116 L224 93 L242 107 Z" fill="#FCE7E5" />
        <path d="M276 120 L284 85 L259 105 Z" fill="url(#catFur)" />
        <path d="M276 116 L280 93 L262 107 Z" fill="#FCE7E5" />

        {/* Cat Head */}
        <circle cx="252" cy="138" r="34" fill="url(#catFur)" />
        
        {/* Blush */}
        <ellipse cx="230" cy="148" rx="6" ry="4" fill="#F43F5E" opacity="0.3" />
        <ellipse cx="274" cy="148" rx="6" ry="4" fill="#F43F5E" opacity="0.3" />

        {/* Eyes (big sparkly cute eyes) */}
        <circle cx="238" cy="135" r="5" fill="#24312C" />
        <circle cx="236" cy="133" r="2" fill="#FFFFFF" />
        <circle cx="266" cy="135" r="5" fill="#24312C" />
        <circle cx="264" cy="133" r="2" fill="#FFFFFF" />

        {/* Nose & Mouth */}
        <polygon points="252,143 249,140 255,140" fill="#F43F5E" />
        <path d="M252 143 V147" stroke="#24312C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M246 147 Q252 151 258 147" stroke="#24312C" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <line x1="225" y1="144" x2="210" y2="142" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="225" y1="148" x2="212" y2="151" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="279" y1="144" x2="294" y2="142" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="279" y1="148" x2="292" y2="151" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Sparkles */}
      <path d="M120 70 L122 76 L128 78 L122 80 L120 86 L118 80 L112 78 L118 76 Z" fill="#F59E0B" opacity="0.7" />
      <path d="M280 65 L281 69 L285 70 L281 71 L280 75 L279 71 L275 70 L279 69 Z" fill="#F59E0B" opacity="0.7" />
    </svg>
  )
}
