import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const SaarthiLogo: React.FC<LogoProps> = ({ size = 36, className = '', showText = true }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Emblem SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
        role="img"
        aria-label="Traffic Sign Saarthi AI Emblem"
      >
        <defs>
          {/* Vibrant Gradients */}
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3867FF" />
            <stop offset="0.5" stopColor="#7655F7" />
            <stop offset="1" stopColor="#FF9F43" />
          </linearGradient>
          <linearGradient id="roadGrad" x1="24" y1="20" x2="24" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E293B" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="saffronGrad" x1="0" y1="0" x2="48" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9F43" />
            <stop offset="1" stopColor="#FF5722" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3867FF" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Outer Shield (Octagonal Traffic Geometry with Rounded Angles) */}
        <path
          d="M15 4 L33 4 L44 15 L44 33 L33 44 L15 44 L4 33 L4 15 Z"
          fill="url(#shieldGrad)"
          filter="url(#glow)"
        />

        {/* Inner Dark Core */}
        <path
          d="M16 6 L32 6 L42 16 L42 32 L32 42 L16 42 L6 32 L6 16 Z"
          fill="#0B132B"
        />

        {/* Perspective Road Geometry */}
        <path
          d="M20 20 L28 20 L36 40 L12 40 Z"
          fill="url(#roadGrad)"
        />

        {/* Center Dashed Highway Line (Saffron) */}
        <line x1="24" y1="22" x2="24" y2="26" stroke="#FF9F43" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="29" x2="24" y2="34" stroke="#FF9F43" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="37" x2="24" y2="40" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />

        {/* Intelligent Vision Neural Crosshairs */}
        <circle cx="24" cy="20" r="4.5" fill="#3867FF" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="24" cy="20" r="1.8" fill="#FFFFFF" />

        {/* Indian Tricolor Subtle Horizon Arc */}
        <path d="M12 12 Q24 6 36 12" stroke="#FF9F43" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 14 Q24 9 34 14" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <path d="M16 16 Q24 12 32 16" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-saarthi-navy dark:text-white leading-tight">
              Traffic Sign <span className="bg-gradient-to-r from-saarthi-royal-blue to-saarthi-violet bg-clip-text text-transparent">Saarthi AI</span>
            </span>
            {/* Indian Flag Tricolor Micro-Pill */}
            <div className="flex flex-col w-1.5 h-3.5 rounded-xs overflow-hidden shadow-xs" title="IRC:67-2022 Indian Standard">
              <span className="h-1/3 bg-[#FF9F43]"></span>
              <span className="h-1/3 bg-white"></span>
              <span className="h-1/3 bg-[#10B981]"></span>
            </div>
          </div>
          <span className="text-[10px] font-semibold tracking-wider text-saarthi-royal-blue dark:text-blue-400 uppercase">
            Indian Road Safety Assistant
          </span>
        </div>
      )}
    </div>
  );
};
