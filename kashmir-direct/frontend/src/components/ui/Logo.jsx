'use client';

export default function Logo({ className = "h-12" }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 1000 240" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background rectangle for reference, set to transparent */}
      <rect width="1000" height="240" fill="transparent"/>

      {/* Simplified, Elegant Mountains */}
      <path d="M50 140L110 75L170 140" stroke="#1B4332" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M100 140L180 50L260 140" stroke="#1B4332" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>

      {/* Minimalist Jammu Temple */}
      <path d="M300 140L320 80L340 140" fill="#BC6C25" opacity="0.9"/>
      <rect x="310" y="140" width="20" height="30" fill="#BC6C25" opacity="0.6"/>

      {/* Saffron Petal Symbol (Abstract) */}
      <circle cx="155" cy="155" r="8" fill="#9D4EDD" opacity="0.3"/>
      <path d="M155 135C150 145 150 150 155 155C160 150 160 145 155 135Z" fill="#E76F51"/>

      {/* Elegant Vertical Divider */}
      <line x1="365" y1="60" x2="365" y2="180" stroke="#1B4332" strokeWidth="1" opacity="0.1"/>

      {/* Refined Brand Typography */}
      <text x="400" y="100" fontFamily="serif, 'Times New Roman'" fontSize="28" fontWeight="400" fill="#1B4332" letterSpacing="6">
        DIRECT FROM
      </text>
      <text x="400" y="160" fontFamily="Arial, sans-serif" fontSize="68" fontWeight="800" fill="#1B4332" letterSpacing="-2">
        Kashmir<tspan fill="#BC6C25">Jammu</tspan>
      </text>

      {/* Subtext - Ultra Subtle */}
      <text x="400" y="200" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="700" fill="#1B4332" letterSpacing="12" opacity="0.4">
        AUTHENTIC • HERITAGE
      </text>
    </svg>
  );
}
