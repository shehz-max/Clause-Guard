import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 group cursor-pointer ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] transition-all duration-300"
      >
        {/* Architectural Shield Base */}
        <path
          d="M50 5L15 20V45C15 67.5 30 87.5 50 95C70 87.5 85 67.5 85 45V20L50 5Z"
          fill="currentColor"
          className="text-primary"
        />
        
        {/* Inner Stylized Document/Protection Lines */}
        <path
          d="M35 35H65M35 45H65M35 55H55"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* Right Corner Accent (The 'Analysis' marker) */}
        <circle cx="70" cy="70" r="8" fill="#10B981" />
        <circle cx="70" cy="70" r="12" stroke="#10B981" strokeOpacity="0.4" strokeWidth="2" className="animate-pulse" />
      </svg>
    </div>
  );
}

export function LogoText() {
  return (
    <div className="flex items-center gap-2">
      <Logo className="w-9 h-9" />
      <span className="text-xl font-heading font-bold tracking-tighter text-foreground">
        Clause<span className="text-primary">Guard</span>
      </span>
    </div>
  );
}
