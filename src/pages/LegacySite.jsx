import React, { useState } from 'react';

const LegacySite = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-80px)] mt-16 sm:mt-20 bg-white dark:bg-black relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-[#050505] z-10">
                    <div className="flex flex-col items-center gap-4">
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

