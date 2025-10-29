import React from 'react';

export const UserGroupIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg 
        className={className} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.25 0m-5.25 0a3.75 3.75 0 00-5.25 0M3 13.5a3 3 0 116 0v-1.5a3 3 0 00-6 0v1.5zm10.5-11.25h.008v.008h-.008V2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5a1.5 1.5 0 01.724-1.342A6.75 6.75 0 0112 15a6.75 6.75 0 016.776 3.158a1.5 1.5 0 01.724 1.342" />
    </svg>
);