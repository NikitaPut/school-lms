import React from 'react';

interface AzimovLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  dark?: boolean;
}

export default function AzimovLogo({ size = 'md', showText = true, dark = false }: AzimovLogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-base' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <svg width={s.icon} height={s.icon} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="azimov-grad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="12" fill="url(#azimov-grad)" />
        {/* Compass/Atom symbol */}
        <circle cx="24" cy="24" r="10" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="24" cy="24" r="3" fill="white" />
        <line x1="24" y1="10" x2="24" y2="38" stroke="white" strokeWidth="1.5" opacity="0.6" />
        <line x1="10" y1="24" x2="38" y2="24" stroke="white" strokeWidth="1.5" opacity="0.6" />
        {/* Orbiting dots */}
        <circle cx="24" cy="12" r="2" fill="white" />
        <circle cx="36" cy="24" r="2" fill="white" />
        <circle cx="24" cy="36" r="2" fill="white" />
        <circle cx="12" cy="24" r="2" fill="white" />
      </svg>
      {showText && (
        <span className={`font-bold ${s.text} ${dark ? 'text-white' : 'text-slate-900'}`}>
          Азимов
        </span>
      )}
    </div>
  );
}
