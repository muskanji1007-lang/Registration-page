import React from 'react';

export const CccLogo = ({ className = 'w-9 h-9' }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Interlocking CCC abstract shape */}
      <circle cx="38" cy="50" r="26" stroke="#000000" strokeWidth="12" strokeLinecap="round" strokeDasharray="125 40" strokeDashoffset="10" />
      <circle cx="62" cy="50" r="26" stroke="#000000" strokeWidth="12" strokeLinecap="round" strokeDasharray="125 40" strokeDashoffset="190" />
      <circle cx="38" cy="50" r="8" fill="#FF2E51" />
      <circle cx="62" cy="50" r="8" fill="#000000" />
    </svg>
  );
};

export default CccLogo;
