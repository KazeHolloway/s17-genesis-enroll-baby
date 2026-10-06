import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full' }) => {
  const isWhite = variant === 'white';
  const textColor = isWhite ? 'text-white' : 'text-[#134e43] dark:text-emerald-100';
  const baselineColor = isWhite ? 'text-emerald-100/80' : 'text-[#55756d] dark:text-emerald-300/80';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon emblem matching Enroll Baby emblem */}
      <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#134e43] dark:text-emerald-300">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Outer heart-shaped leaf embrace */}
          <path
            d="M24 43C24 43 7 32 7 18.5C7 11.5 12.5 6 19.5 6C21.8 6 23.5 6.8 24 7.6C24.5 6.8 26.2 6 28.5 6C35.5 6 41 11.5 41 18.5C41 32 24 43 24 43Z"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isWhite ? 'fill-white/10' : 'fill-[#134e43]/5 dark:fill-emerald-400/10'}
          />
          {/* Baby head & silhouette inside */}
          <circle cx="24" cy="18" r="4.2" fill="currentColor" />
          {/* Gentle cradling arms / wings */}
          <path
            d="M17 28C17 23.5 20.2 21 24 21C27.8 21 31 23.5 31 28C31 33 27 35.5 24 35.5C21 35.5 17 33 17 28Z"
            fill="currentColor"
            opacity="0.9"
          />
          {/* Little green sprout accent leaf on top */}
          <path
            d="M24 6C23 3 25.5 1 28 2C27 4.5 25 5.5 24 6Z"
            fill={isWhite ? '#a7f3d0' : '#2dd4bf'}
          />
        </svg>
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col text-left">
          <span className={`text-[1.35rem] leading-none font-bold tracking-tight font-serif ${textColor}`}>
            Enroll Baby
          </span>
          <span className={`text-[0.72rem] font-medium tracking-normal mt-1 ${baselineColor}`}>
            Un avenir en bonne santé
          </span>
        </div>
      )}
    </div>
  );
};
