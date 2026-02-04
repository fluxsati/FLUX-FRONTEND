import React, { useState } from 'react';

const LegacySite = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Safety timeout: forced remove loader after 3 seconds
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] mt-16 sm:mt-20 bg-white dark:bg-black relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 transition-opacity duration-500">
                    <div className="flex flex-col items-center gap-4 bg-white/80 dark:bg-black/80 p-6 rounded-2xl backdrop-blur-sm border border-cyan-500/20 shadow-xl">
                        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500 dark:text-gray-400 font-mono text-sm tracking-widest animate-pulse">LOADING ARCHIVE...</p>
                    </div>
                </div>
            )}
            <iframe
                src="https://clubfluxold.netlify.app/"
                title="Flux Legacy Website"
                className="w-full h-full border-none"
                onLoad={() => setIsLoading(false)}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-pointer-lock"
                allow="accelerometer; autoplay; camera; encrypted-media; gyroscope; microphone; payment; usb; xr-spatial-tracking; fullscreen; display-capture"
            />
        </div>
    );
};

export default LegacySite;

