import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <svg 
        className={className} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MindVerse Logo"
        role="img"
    >
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
        </defs>
        <g stroke="url(#logo-gradient)" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            {/* Brain */}
            <path d="M100 20 C 50 20, 40 70, 40 100 C 40 130, 50 180, 100 180" />
            <path d="M100 20 C 150 20, 160 70, 160 100 C 160 130, 150 180, 100 180" />
            <path d="M100 20 V 180" />
            <path d="M70 60 C 60 70, 60 80, 70 90" />
            <path d="M130 60 C 140 70, 140 80, 130 90" />
            <path d="M60 110 C 50 120, 50 130, 60 140" />
            <path d="M140 110 C 150 120, 150 130, 140 140" />
            
            {/* Cerebellum */}
            <path d="M70,150 C 80,160 120,160 130,150" />
            <path d="M75,155 C 85,165 115,165 125,155" />
            <path d="M80,160 C 90,170 110,170 120,160" />
        </g>
        <g fill="url(#logo-gradient)" stroke="none">
            {/* Cap */}
            <path d="M50 40 L 100 15 L 150 40 L 100 65 Z"/>
            <path d="M140 37 L 150 37 L 150 45 Z" />
            
            {/* Pencil */}
            <path d="M90 170 L 110 170 L 100 195 Z" />
        </g>
        {/* Book */}
        <g fill="#f8fafc">
            <rect x="80" y="90" width="40" height="25" rx="2" />
            <g stroke="url(#logo-gradient)" strokeWidth="3" strokeLinecap="round">
                <line x1="100" y1="90" x2="100" y2="115" />
                {/* left page lines */}
                <line x1="85" y1="95" x2="95" y2="95" />
                <line x1="85" y1="102" x2="95" y2="102" />
                <line x1="85" y1="109" x2="95" y2="109" />
                {/* right page lines */}
                <line x1="105" y1="95" x2="115" y2="95" />
                <line x1="105" y1="102" x2="115" y2="102" />
                <line x1="105" y1="109" x2="115" y2="109" />
            </g>
        </g>
    </svg>
);