"use client";
import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: 'text-sm', iconSize: 'w-7 h-7' },
  md: { icon: 36, text: 'text-lg', iconSize: 'w-9 h-9' },
  lg: { icon: 48, text: 'text-2xl', iconSize: 'w-12 h-12' },
  xl: { icon: 60, text: 'text-3xl', iconSize: 'w-14 h-14' },
};

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const s = sizes[size];
  
  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${s.iconSize} drop-shadow-lg`}
      >
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer glow effect */}
        <ellipse cx="50" cy="50" rx="35" ry="40" fill="url(#glowGradient)" opacity="0.15" filter="url(#glow)" />
        
        {/* Shield base */}
        <path
          d="M50 10 L80 25 L80 55 Q80 75 50 90 Q20 75 20 55 L20 25 Z"
          fill="url(#shieldGradient)"
          className="drop-shadow-lg"
        />
        
        {/* Shield inner highlight */}
        <path
          d="M50 15 L75 28 L75 53 Q75 70 50 83 Q25 70 25 53 L25 28 Z"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
        
        {/* Neural network pattern */}
        <g opacity="0.9">
          {/* Central node */}
          <circle cx="50" cy="50" r="6" fill="white" />
          
          {/* Top node */}
          <circle cx="50" cy="28" r="4" fill="rgba(255,255,255,0.8)" />
          
          {/* Bottom node */}
          <circle cx="50" cy="72" r="4" fill="rgba(255,255,255,0.8)" />
          
          {/* Left node */}
          <circle cx="32" cy="50" r="4" fill="rgba(255,255,255,0.8)" />
          
          {/* Right node */}
          <circle cx="68" cy="50" r="4" fill="rgba(255,255,255,0.8)" />
          
          {/* Connection lines */}
          <line x1="50" y1="32" x2="50" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="50" y1="56" x2="50" y2="68" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="36" y1="50" x2="44" y2="50" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="56" y1="50" x2="64" y2="50" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          
          {/* Diagonal connections */}
          <line x1="35" y1="35" x2="45" y2="45" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="55" y1="55" x2="65" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="65" y1="35" x2="55" y2="45" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="45" y1="55" x2="35" y2="65" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Small accent nodes */}
          <circle cx="35" cy="35" r="2" fill="rgba(255,255,255,0.5)" />
          <circle cx="65" cy="35" r="2" fill="rgba(255,255,255,0.5)" />
          <circle cx="35" cy="65" r="2" fill="rgba(255,255,255,0.5)" />
          <circle cx="65" cy="65" r="2" fill="rgba(255,255,255,0.5)" />
        </g>
        
        {/* Sparkle accents */}
        <circle cx="20" cy="20" r="1.5" fill="#F472B6" opacity="0.8" />
        <circle cx="82" cy="25" r="1" fill="#818CF8" opacity="0.6" />
        <circle cx="18" cy="60" r="1" fill="#A855F7" opacity="0.5" />
      </svg>
      
      {variant === 'full' && (
        <div className="flex items-center">
          <span className={`font-bold tracking-tight text-white ${s.text}`}>
            Clause
          </span>
          <span className={`font-bold tracking-tight text-gradient-animated ${s.text}`}>
            Guard
          </span>
        </div>
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