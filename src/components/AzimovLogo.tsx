import React from 'react';

interface AzimovLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  dark?: boolean;
}

const LOGO_URL = 'https://avatars.mds.yandex.net/get-altay/5485733/2a00000180acef3afc3eb3a278f3cdbc9282/XS';

export default function AzimovLogo({ size = 'md', showText = true, dark = false }: AzimovLogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-base' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-2xl' },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2.5">
      <img 
        src={LOGO_URL} 
        alt="Азимов" 
        width={s.icon} 
        height={s.icon}
        className="rounded-lg object-cover"
        style={{ width: s.icon, height: s.icon }}
      />
      {showText && (
        <span className={`font-bold ${s.text} ${dark ? 'text-white' : 'text-slate-900'}`}>
          Азимов
        </span>
      )}
    </div>
  );
}
