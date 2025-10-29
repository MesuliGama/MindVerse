import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { Role, User } from '../types';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { StarIcon } from './icons/StarIcon';

interface HeaderProps {
    user: User | null;
    credits: number;
    onLogout: () => void;
    theme: string;
    toggleTheme: () => void;
    onUpgradeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, credits, onLogout, theme, toggleTheme, onUpgradeClick }) => {
    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <LogoIcon className="h-8 w-8"/>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">MindVerse</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="flex items-center space-x-4">
                                {!user.isPro ? (
                                     <div className="flex items-center space-x-2">
                                        <div className="text-center px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                Credits: <span className="font-bold text-indigo-600 dark:text-indigo-400">{credits}</span> / 5
                                            </p>
                                        </div>
                                        <button 
                                            onClick={onUpgradeClick}
                                            className="flex items-center space-x-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-800/80 px-3 py-1.5 rounded-full transition-colors"
                                        >
                                            <StarIcon className="w-4 h-4" />
                                            <span>Go Pro</span>
                                        </button>
                                     </div>
                                ) : (
                                     <div className="text-center px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
                                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                            <StarIcon className="w-4 h-4" />
                                            <span>Pro Plan</span>
                                        </div>
                                    </div>
                                )}
                                <div className="text-sm text-right">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                                    <span className="block text-slate-500 dark:text-slate-400">{user.role}</span>
                                </div>
                                <button 
                                    onClick={onLogout}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="h-10 w-10 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};