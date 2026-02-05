import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#050505] transition-colors duration-300">
            <div className="relative flex flex-col items-center gap-4">
                {/* Techy Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-white/10"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
                    {/* <div className="absolute inset-4 rounded-full border-2 border-purple-500/50 border-b-transparent animate-spin-reverse"></div> */}
                </div>

                {/* Loading Text */}
                <div className="text-cyan-600 dark:text-cyan-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                    Initializing...
                </div>
            </div>
        </div>
    );
};

export default Loader;
