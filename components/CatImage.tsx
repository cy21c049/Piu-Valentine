
import React from 'react';

interface CatImageProps {
  className?: string;
  variant?: 'default' | 'happy';
}

const CatImage: React.FC<CatImageProps> = ({ className, variant = 'default' }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cute white cat illustration"
    >
      {/* Background Circle */}
      <circle cx="100" cy="100" r="100" fill="#fce7f3" />
      
      {/* Ears */}
      <path d="M35 55 L60 95 L85 75 Z" fill="#fff" />
      <path d="M165 55 L140 95 L115 75 Z" fill="#fff" />
      <path d="M43 63 L55 85 L75 75 Z" fill="#fca5a5" />
      <path d="M157 63 L145 85 L125 75 Z" fill="#fca5a5" />

      {/* Head */}
      <ellipse cx="100" cy="110" rx="75" ry="65" fill="#fff" />

      {/* Eyes */}
      {variant === 'default' ? (
        <>
          <circle cx="70" cy="100" r="8" fill="#1f2937" />
          <circle cx="130" cy="100" r="8" fill="#1f2937" />
          <circle cx="73" cy="97" r="3" fill="#fff" />
          <circle cx="133" cy="97" r="3" fill="#fff" />
        </>
      ) : (
        <>
          {/* Happy closed eyes ^ ^ */}
          <path d="M60 100 Q70 90 80 100" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          <path d="M120 100 Q130 90 140 100" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
        </>
      )}

      {/* Nose */}
      <path d="M92 115 Q100 122 108 115" fill="none" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="118" r="4" fill="#fca5a5" />

      {/* Mouth */}
      <path d="M100 122 Q90 132 80 122" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 122 Q110 132 120 122" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />

      {/* Blush */}
      <ellipse cx="55" cy="120" rx="10" ry="6" fill="#fca5a5" opacity="0.4" />
      <ellipse cx="145" cy="120" rx="10" ry="6" fill="#fca5a5" opacity="0.4" />

      {/* Whiskers */}
      <path d="M30 110 L50 115" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <path d="M25 120 L50 120" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <path d="M170 110 L150 115" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <path d="M175 120 L150 120" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
};

export default CatImage;
