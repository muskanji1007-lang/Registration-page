import React from 'react';

export const Crewmate = ({ variant = 'default', size = 'md', className = '' }) => {
  // Dimensions
  const sizes = {
    sm: 'w-12 h-14',
    md: 'w-20 h-24',
    lg: 'w-28 h-32',
    xl: 'w-36 h-44',
  };

  const dimension = sizes[size] || sizes.md;

  if (variant === 'terminal') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 240 180"
          className="w-full max-w-[280px] drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Retro Computer Monitor */}
          <rect x="25" y="30" width="130" height="95" rx="8" fill="#F4EFE6" stroke="#000" strokeWidth="3" />
          <rect x="35" y="40" width="110" height="75" rx="4" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
          
          {/* Monitor Stand */}
          <path d="M75 125 L105 125 L115 145 L65 145 Z" fill="#E5E0D6" stroke="#000" strokeWidth="3" />
          <rect x="50" y="145" width="80" height="10" rx="3" fill="#333333" stroke="#000" strokeWidth="2.5" />

          {/* Screen Content */}
          <rect x="42" y="48" width="96" height="40" fill="#FFF1F2" stroke="#FF2E51" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x="50" y="62" fill="#E11D48" fontSize="8" fontFamily="monospace" fontWeight="bold">
            ERR: 0x882_NULL_PTR
          </text>
          <text x="50" y="74" fill="#000" fontSize="7" fontFamily="monospace">
            &gt; site_check.js:42
          </text>

          {/* Crewmate Body */}
          <g transform="translate(130, 45)">
            {/* Backpack */}
            <rect x="4" y="24" width="16" height="40" rx="7" fill="#DC2626" stroke="#000" strokeWidth="3.5" />
            
            {/* Main Body */}
            <path
              d="M 22 18 C 22 8, 54 8, 54 18 L 54 62 C 54 66, 48 70, 48 76 L 48 88 C 48 93, 40 93, 40 88 L 40 76 L 36 76 L 36 88 C 36 93, 28 93, 28 88 L 28 76 C 28 70, 22 66, 22 62 Z"
              fill="#EF4444"
              stroke="#000"
              strokeWidth="3.5"
            />
            {/* Body Shadow Layer */}
            <path
              d="M 23 48 C 23 60, 28 74, 30 76 L 46 76 C 48 72, 53 60, 53 48 Z"
              fill="#B91C1C"
              opacity="0.3"
            />

            {/* Cyan Visor */}
            <rect x="36" y="24" width="28" height="18" rx="9" fill="#38BDF8" stroke="#000" strokeWidth="3" />
            <ellipse cx="44" cy="30" rx="6" ry="3" fill="#FFFFFF" opacity="0.8" />
            
            {/* Magnifying Glass held in hand */}
            <circle cx="20" cy="50" r="14" fill="#E0F2FE" fillOpacity="0.7" stroke="#000" strokeWidth="3" />
            <line x1="10" y1="60" x2="3" y2="70" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            <path d="M 16 46 L 24 54 M 24 46 L 16 54" stroke="#FF2E51" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'celebrate') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 240 210"
          className="w-full max-w-[260px] drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glowing Platform Rings */}
          <ellipse cx="120" cy="178" rx="82" ry="16" fill="#F0F9FF" stroke="#38BDF8" strokeWidth="3" />
          <ellipse cx="120" cy="178" rx="66" ry="11" fill="none" stroke="#0284C7" strokeWidth="2" strokeDasharray="5 3" />
          <ellipse cx="120" cy="178" rx="45" ry="7" fill="#E0F2FE" />

          {/* Baby Bug Pet (Left) */}
          <g transform="translate(10, 8)">
            {/* Bug Legs */}
            <line x1="62" y1="162" x2="54" y2="170" stroke="#000" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="165" x2="68" y2="173" stroke="#000" strokeWidth="3" strokeLinecap="round" />
            <line x1="84" y1="165" x2="86" y2="173" stroke="#000" strokeWidth="3" strokeLinecap="round" />
            <line x1="94" y1="162" x2="100" y2="170" stroke="#000" strokeWidth="3" strokeLinecap="round" />

            {/* Bug Backpack */}
            <rect x="58" y="142" width="8" height="18" rx="4" fill="#B91C1C" stroke="#000" strokeWidth="2.5" />

            {/* Bug Body */}
            <ellipse cx="78" cy="150" rx="20" ry="16" fill="#EF4444" stroke="#000" strokeWidth="3.5" />

            {/* Ladybug Dots */}
            <circle cx="70" cy="144" r="3" fill="#000" />
            <circle cx="70" cy="156" r="3" fill="#000" />
            <circle cx="80" cy="141" r="2.5" fill="#000" />
            <circle cx="80" cy="159" r="2.5" fill="#000" />

            {/* Bug Visor */}
            <rect x="84" y="143" width="16" height="11" rx="5.5" fill="#38BDF8" stroke="#000" strokeWidth="2.5" />
            <ellipse cx="89" cy="147" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.8" />
          </g>

          {/* Red Crewmate Body */}
          <g transform="translate(15, 0)">
            {/* Backpack */}
            <rect x="76" y="66" width="22" height="54" rx="10" fill="#DC2626" stroke="#000" strokeWidth="4.5" />

            {/* Main Body */}
            <path
              d="M 98 48 C 98 28, 148 28, 148 48 L 148 132 C 148 140, 140 144, 140 152 L 140 168 C 140 174, 126 174, 126 168 L 126 152 L 118 152 L 118 168 C 118 174, 104 174, 104 168 L 104 152 C 104 144, 98 140, 98 132 Z"
              fill="#EF4444"
              stroke="#000"
              strokeWidth="4.5"
            />
            {/* Shadow curve */}
            <path
              d="M 101 110 C 101 130, 108 150, 112 152 L 134 152 C 138 148, 144 130, 144 110 Z"
              fill="#B91C1C"
              opacity="0.3"
            />

            {/* Cyan Visor */}
            <rect x="122" y="55" width="40" height="26" rx="13" fill="#38BDF8" stroke="#000" strokeWidth="4.5" />
            <ellipse cx="134" cy="64" rx="9" ry="5" fill="#FFFFFF" opacity="0.85" />

            {/* Thumbs-Up Hand (Right) */}
            <g transform="translate(148, 68)">
              {/* Arm / Cuff */}
              <ellipse cx="14" cy="24" rx="7" ry="10" fill="#DC2626" stroke="#000" strokeWidth="3" />
              {/* Fist */}
              <circle cx="24" cy="22" r="10" fill="#EF4444" stroke="#000" strokeWidth="3.5" />
              {/* Fingers fold */}
              <line x1="20" y1="18" x2="28" y2="18" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="19" y1="23" x2="28" y2="23" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="20" y1="28" x2="27" y2="28" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              {/* Thumb pointing up */}
              <path
                d="M 23 15 C 23 8, 30 8, 30 15 L 30 20 Z"
                fill="#EF4444"
                stroke="#000"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${dimension} ${className}`}>
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Backpack */}
        <rect x="8" y="35" width="22" height="52" rx="10" fill="#DC2626" stroke="#000" strokeWidth="4.5" />

        {/* Main Body */}
        <path
          d="M 30 25 C 30 10, 78 10, 78 25 L 78 84 C 78 89, 70 94, 70 102 L 70 114 C 70 120, 58 120, 58 114 L 58 102 L 50 102 L 50 114 C 50 120, 38 120, 38 114 L 38 102 C 38 94, 30 89, 30 84 Z"
          fill="#EF4444"
          stroke="#000"
          strokeWidth="4.5"
        />

        {/* Visor */}
        <rect x="52" y="32" width="38" height="24" rx="12" fill="#38BDF8" stroke="#000" strokeWidth="4.5" />
        <ellipse cx="64" cy="40" rx="9" ry="4" fill="#FFFFFF" opacity="0.85" />

        {/* Optional Magnifying Glass */}
        {variant === 'magnifier' && (
          <g>
            <circle cx="28" cy="65" r="16" fill="#E0F2FE" fillOpacity="0.8" stroke="#000" strokeWidth="4" />
            <circle cx="28" cy="65" r="10" stroke="#FF2E51" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="18" y1="76" x2="6" y2="92" stroke="#000" strokeWidth="5" strokeLinecap="round" />
            {/* Bug in lens */}
            <circle cx="28" cy="65" r="3.5" fill="#DC2626" stroke="#000" strokeWidth="1.5" />
            <line x1="25" y1="62" x2="31" y2="68" stroke="#000" strokeWidth="1" />
            <line x1="25" y1="68" x2="31" y2="62" stroke="#000" strokeWidth="1" />
          </g>
        )}
      </svg>
      
      {variant !== 'magnifier' && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="px-2 py-0.5 bg-[#FF2E51] text-white text-[9px] font-mono font-bold tracking-wider uppercase border border-black shadow-neo-sm rounded-none">
            CREWMATE: ACTIVE
          </span>
        </div>
      )}
    </div>
  );
};

export default Crewmate;
