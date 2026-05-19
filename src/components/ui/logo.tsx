"use client";
import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { icon: 32, text: 'text-base', iconSize: 'w-8 h-8' },
  md: { icon: 40, text: 'text-xl', iconSize: 'w-10 h-10' },
  lg: { icon: 48, text: 'text-2xl', iconSize: 'w-12 h-12' },
};

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const s = sizes[size];
  
  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={s.iconSize}
      >
        {/* Document Stack Base */}
        <rect x="20" y="12" width="45" height="58" rx="4" fill="#1E3A5F" opacity="0.3" transform="rotate(-8 20 12)" />
        <rect x="22" y="10" width="45" height="58" rx="4" fill="#2C5282" opacity="0.5" transform="rotate(-4 22 10)" />
        
        {/* Main Document */}
        <rect x="25" y="8" width="50" height="64" rx="5" fill="#1E3A5F" className="drop-shadow-lg" />
        
        {/* Document Lines (representing text/clauses) */}
        <rect x="33" y="22" width="22" height="3" rx="1.5" fill="#60A5FA" opacity="0.8" />
        <rect x="33" y="30" width="28" height="2.5" rx="1.25" fill="#93C5FD" opacity="0.7" />
        <rect x="33" y="36" width="24" height="2.5" rx="1.25" fill="#93C5FD" opacity="0.7" />
        <rect x="33" y="42" width="18" height="2.5" rx="1.25" fill="#93C5FD" opacity="0.6" />
        <rect x="33" y="48" width="26" height="2.5" rx="1.25" fill="#93C5FD" opacity="0.5" />
        
        {/* Checkmark Badge (representing verified/protected) */}
        <circle cx="70" cy="65" r="16" fill="#059669" className="drop-shadow-md" />
        <path 
          d="M62 65L67 70L78 59" 
          stroke="white" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Small accent dots for visual interest */}
        <circle cx="28" cy="18" r="2" fill="#60A5FA" opacity="0.5" />
        <circle cx="32" cy="18" r="1.5" fill="#60A5FA" opacity="0.3" />
      </svg>
      
      {variant === 'full' && (
        <span className={`font-bold tracking-tight text-slate-800 ${s.text}`}>
          Clause<span className="text-emerald-600">Guard</span>
        </span>
      )}
    </div>
  );
}

export function LogoText({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <Logo variant="full" size={size} />;
}

export function LogoIcon({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <Logo variant="icon" size={size} />;
}