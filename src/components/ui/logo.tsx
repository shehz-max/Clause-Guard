"use client";
import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { iconSize: 28, textSize: 'text-sm', iconWidth: 28 },
  md: { iconSize: 36, textSize: 'text-lg', iconWidth: 36 },
  lg: { iconSize: 48, textSize: 'text-2xl', iconWidth: 48 },
};

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const s = sizes[size];
  
  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {variant !== 'wordmark' && (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${s.iconWidth >= 36 ? 'w-9 h-9' : 'w-7 h-7'}`}
          style={{ width: s.iconSize, height: s.iconSize }}
        >
          {/* Document base */}
          <path
            d="M10 6C10 4.89543 10.8954 4 12 4H28C29.1046 4 30 4.89543 30 6V42C30 43.1046 29.1046 44 28 44H12C10.8954 44 10 43.1046 10 42V6Z"
            fill="#1E3A5F"
          />
          
          {/* Document fold corner */}
          <path
            d="M28 4L36 12V6C36 4.89543 35.1046 4 34 4H28Z"
            fill="#152C4A"
          />
          
          {/* Document lines */}
          <rect x="14" y="18" width="12" height="2" rx="1" fill="white" fillOpacity="0.9"/>
          <rect x="14" y="24" width="16" height="2" rx="1" fill="white" fillOpacity="0.6"/>
          <rect x="14" y="30" width="14" height="2" rx="1" fill="white" fillOpacity="0.6"/>
          <rect x="14" y="36" width="10" height="2" rx="1" fill="white" fillOpacity="0.4"/>
          
          {/* Shield overlay - positioned bottom right */}
          <path
            d="M34 28L42 32V38C42 40.2091 40.2091 42 38 42H34V28Z"
            fill="#0F766E"
          />
          
          {/* Checkmark in shield */}
          <path
            d="M35 36L37 38L41 34"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      
      {variant !== 'icon' && (
        <div className={`flex items-center ${s.textSize}`}>
          <span className="font-bold tracking-tight text-[#1E3A5F]">Clause</span>
          <span className="font-bold tracking-tight text-[#0F766E]">Guard</span>
        </div>
      )}
    </div>
  );
}

export function LogoText({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <Logo variant="wordmark" size={size} />;
}

export function LogoIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <Logo variant="icon" size={size} />;
}