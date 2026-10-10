import React from 'react'

export const EmptyStateIllustration: React.FC<{ className?: string; message?: string }> = ({
  className = 'w-36 h-36 mx-auto',
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="80" cy="70" r="50" fill="#FAF6EF" stroke="#E9E4DC" strokeWidth="2" strokeDasharray="4 4" />
        {/* Empty Pet Bowl */}
        <ellipse cx="80" cy="95" rx="35" ry="12" fill="#E6F3E7" stroke="#21845F" strokeWidth="2" />
        <path d="M45 95 L52 112 Q80 120 108 112 L115 95 Z" fill="#21845F" opacity="0.15" />
        <ellipse cx="80" cy="93" rx="26" ry="7" fill="#FFFFFF" stroke="#21845F" strokeWidth="1.5" />
        {/* Paw Icon inside bowl */}
        <circle cx="80" cy="93" r="2.5" fill="#21845F" />
        <circle cx="75" cy="90" r="1.5" fill="#21845F" />
        <circle cx="85" cy="90" r="1.5" fill="#21845F" />
        {/* Peeking little kitten head */}
        <circle cx="80" cy="50" r="18" fill="#FCE7E5" stroke="#E9E4DC" strokeWidth="1.5" />
        <polygon points="66,42 62,28 73,38" fill="#FCE7E5" stroke="#E9E4DC" strokeWidth="1.5" />
        <polygon points="94,42 98,28 87,38" fill="#FCE7E5" stroke="#E9E4DC" strokeWidth="1.5" />
        {/* Cute Curious Eyes */}
        <circle cx="74" cy="48" r="2.5" fill="#24312C" />
        <circle cx="86" cy="48" r="2.5" fill="#24312C" />
        {/* Little triangle nose */}
        <polygon points="80,52 78,50 82,50" fill="#F43F5E" />
      </svg>
      {message && <p className="mt-3 text-sm font-medium text-[#718078]">{message}</p>}
    </div>
  )
}
