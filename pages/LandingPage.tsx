import React from 'react';
import { LogoIcon } from '../components/icons/LogoIcon';

interface LandingPageProps {
    onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center p-8">
                <LogoIcon className="mx-auto h-48 w-48" />
                <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    MindVerse
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                    An entire universe of learning intelligence.
                </p>
                <div className="mt-10">
                    <button
                        onClick={onGetStarted}
                        className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-105"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </main>
    );
};