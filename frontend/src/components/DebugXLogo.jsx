import React, { useId } from 'react';

export const DebugXLogo = ({ size = 'md', className = '' }) => {
  const uniqueId = useId().replace(/:/g, '');

  const sizes = {
    xs: 'h-6',
    sm: 'h-8',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const heightClass = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center ${className}`}>
      <svg
        viewBox="0 0 252 70"
        className={`${heightClass} w-auto select-none`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Halftone White Dot Pattern for DeBug */}
          <pattern
            id={`dots-${uniqueId}`}
            x="0"
            y="0"
            width="5.5"
            height="5.5"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2.75" cy="2.75" r="1.3" fill="#FFFFFF" />
          </pattern>
        </defs>

        {/* DeBug (Dark base with white halftone dots & outline) */}
        <text
          x="4"
          y="52"
          className="debugx-text-base"
          fontFamily="'Space Grotesk', 'Chakra Petch', Impact, sans-serif"
          fontStyle="italic"
          fontWeight="900"
          fontSize="58"
          letterSpacing="1"
          fill="#111827"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        >
          DeBug
        </text>
        <text
          x="4"
          y="52"
          fontFamily="'Space Grotesk', 'Chakra Petch', Impact, sans-serif"
          fontStyle="italic"
          fontWeight="900"
          fontSize="58"
          letterSpacing="1"
          fill={`url(#dots-${uniqueId})`}
          stroke="none"
        >
          DeBug
        </text>

        {/* X (Balanced spacing matching Screenshot 3 at x="200") */}
        <text
          x="200"
          y="52"
          className="debugx-x-base"
          fontFamily="'Space Grotesk', 'Chakra Petch', Impact, sans-serif"
          fontStyle="italic"
          fontWeight="900"
          fontSize="58"
          letterSpacing="1"
          fill="#FF2E51"
          stroke="#000000"
          strokeWidth="3.5"
          strokeLinejoin="round"
        >
          X
        </text>
        <text
          x="200"
          y="52"
          fontFamily="'Space Grotesk', 'Chakra Petch', Impact, sans-serif"
          fontStyle="italic"
          fontWeight="900"
          fontSize="58"
          letterSpacing="1"
          fill={`url(#dots-${uniqueId})`}
          stroke="none"
        >
          X
        </text>
      </svg>
    </div>
  );
};

export default DebugXLogo;
