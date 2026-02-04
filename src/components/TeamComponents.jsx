import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export const TechFrame = memo(({ children, className = "", scanSpeed = "2s", isMobile, color = "cyan" }) => {
    const glowColor = color === 'purple' ? 'border-purple-500' : 'border-cyan-500';
    return (
        <div className={`relative group p-0.5 md:p-1 ${className}`}>
            {/* Tech Corners */}
            <div className={`absolute top-0 left-0 w-3 h-3 md:w-5 md:h-5 border-t-2 border-l-2 ${glowColor} z-10`} />
            <div className={`absolute top-0 right-0 w-3 h-3 md:w-5 md:h-5 border-t-2 border-r-2 ${glowColor} z-10`} />
            <div className={`absolute bottom-0 left-0 w-3 h-3 md:w-5 md:h-5 border-b-2 border-l-2 ${glowColor} z-10`} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-5 md:h-5 border-b-2 border-r-2 ${glowColor} z-10`} />

            {/* Updated: background is dark to prevent light bleed on images */}
            <div className="relative overflow-hidden rounded-sm bg-zinc-900 dark:bg-black h-full w-full">
                {!isMobile && (
                    <div
                        className={`absolute inset-0 bg-gradient-to-b from-transparent ${color === 'purple' ? 'via-purple-500/20' : 'via-cyan-500/20'} to-transparent h-1/2 w-full -translate-y-full group-hover:animate-scan z-20 pointer-events-none`}
                        style={{ animationDuration: scanSpeed }}
                    />
                )}
                <div className="w-full h-full relative">
                    {children}
                </div>
            </div>
        </div>
    );
});

export const LeaderCard = memo(({ member, color, isMobile }) => {
    const accentColor = color === 'purple' ? 'text-purple-500' : 'text-cyan-500';
    const borderColor = color === 'purple' ? 'border-purple-500' : 'border-cyan-500';
    const Wrapper = isMobile ? 'div' : motion.div;

    return (
        <Wrapper
            whileHover={!isMobile ? { y: -8 } : {}}
            className="group bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 h-full w-full flex flex-col cursor-pointer transition-colors"
        >
            <TechFrame color={color} className="aspect-[4/5] w-full" isMobile={isMobile}>
                <img
                    src={member.img}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={member.name}
                />
                {/* Updated: Removed whitish gradient (gray-200) and used a clean dark vignette for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-20" />
            </TechFrame>

            {/* TEXT AREA: Displaying Name, Role, and Academic Data */}
            <div className="px-3 md:px-5 py-4 md:py-6 flex flex-col justify-center h-28 md:h-36">
                <h4 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter mb-1 text-black dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                    {member.name}
                </h4>

                <div className="flex items-center gap-2 mb-2">
                    <div className={`h-[1px] w-4 ${borderColor.replace('border-', 'bg-')}`} />
                    <p className={`text-[8px] md:text-[10px] font-mono uppercase tracking-[0.2em] ${accentColor}`}>
                        {member.role}
                    </p>
                </div>

                {/* Dynamic Branch and Year Info */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] md:text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase opacity-80">
                    <span>{member.branch}</span>
                    <span className="opacity-30">|</span>
                    <span className="text-black dark:text-white/60">[{member.year}]</span>
                </div>
            </div>
        </Wrapper>
    );
});

export const AdaptiveScrollRow = memo(({ items, renderItem, reverse = false, duration = 30, isMobile }) => {
    // Logic: We want auto-sliding (marquee) on ALL devices now. 
    // We remove the conditional return for mobile.

    // Triple the items to ensure seamless infinity loop
    const content = [...items, ...items, ...items];

    return (
        <div className="flex overflow-hidden py-4 select-none">
            <motion.div
                className="flex gap-6 md:gap-10 flex-nowrap"
                animate={{ x: reverse ? ["-33.33%", "0%"] : ["0%", "-33.33%"] }}
                transition={{ duration, repeat: Infinity, ease: "linear" }}
                style={{ width: 'fit-content' }}
            >
                {content.map((item, i) => (
                    <div key={i} className="shrink-0 w-[280px] md:w-[350px]">
                        {renderItem(item)}
                    </div>
                ))}
            </motion.div>
        </div>
    );
});

