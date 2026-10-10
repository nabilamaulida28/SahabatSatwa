import React from 'react'

export const SidebarPetIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto max-w-[190px]' }) => {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sahabat Satwa Bahagia"
    >
      <defs>
        <linearGradient id="sbGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6F3E7" />
          <stop offset="100%" stopColor="#FAF6EF" />
        </linearGradient>
      </defs>

      {/* Cloud/Pillow Base */}
      <ellipse cx="100" cy="98" rx="85" ry="18" fill="url(#sbGlow)" />
      
      {/* Tiny Hearts */}
      <path
        d="M100 20 C97 15 90 15 87 20 C84 25 90 32 100 38 C110 32 116 25 113 20 C110 15 103 15 100 20 Z"
        fill="#E11D48"
        opacity="0.8"
      />
      <circle cx="65" cy="30" r="3" fill="#21845F" opacity="0.3" />
      <circle cx="138" cy="28" r="2.5" fill="#21845F" opacity="0.3" />

      {/* Sleeping Golden Puppy (Left) */}
      <g id="sleeping-puppy">
        <ellipse cx="78" cy="80" rx="36" ry="24" fill="#F5D0A9" />
        {/* Puppy Head resting */}
        <circle cx="58" cy="74" r="22" fill="#E5A663" />
        {/* Puppy Ear */}
        <path d="M42 66 Q36 78 44 88 Q50 86 48 72 Z" fill="#C98642" />
        {/* Sleeping Eye */}
        <path d="M52 74 Q56 78 60 74" stroke="#24312C" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Snout */}
        <ellipse cx="64" cy="79" rx="8" ry="6" fill="#FFF5EB" />
        <ellipse cx="66" cy="77" rx="3" ry="2" fill="#24312C" />
        {/* Paws */}
        <ellipse cx="62" cy="94" rx="8" ry="5" fill="#E5A663" />
      </g>

      {/* Snuggling Gray Kitten (Right) */}
      <g id="snuggling-kitten">
        <ellipse cx="125" cy="82" rx="30" ry="22" fill="#94A3B8" />
        {/* Kitten Head */}
        <circle cx="112" cy="74" r="18" fill="#CBD5E1" />
        {/* Cat ears */}
        <path d="M102 60 L108 50 L115 58 Z" fill="#94A3B8" />
        <path d="M104 59 L108 53 L113 58 Z" fill="#FCE7E5" />
        <path d="M120 60 L126 50 L132 60 Z" fill="#94A3B8" />
        <path d="M121 59 L126 53 L130 59 Z" fill="#FCE7E5" />
        {/* Sleeping Eye */}
        <path d="M110 74 Q114 78 118 74" stroke="#24312C" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Pink nose */}
        <polygon points="116,77 114,75 118,75" fill="#F43F5E" />
        {/* Curled Tail */}
        <path d="M152 82 Q162 76 158 68 Q154 66 150 72" stroke="#94A3B8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}
