import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Linkedin, X, User, ExternalLink, Activity, GraduationCap, Layers 
} from 'lucide-react';
import { TEAM_DATA } from '../data/teamData';

/* ===================== HOOKS ===================== */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

/* ===================== SUB-COMPONENTS ===================== */

const TechFrame = memo(({ children, className = "", scanSpeed = "2s", isMobile, color = "cyan" }) => {
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

const LeaderCard = memo(({ member, color, isMobile }) => {
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

const AdaptiveScrollRow = memo(({ items, renderItem, reverse = false, duration = 30, isMobile }) => {
  if (isMobile) {
    return (
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 px-4 no-scrollbar">
        {items.map((item, i) => (
          <div key={i} className="snap-center shrink-0 w-[75vw] sm:w-[280px]">
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  }

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
          <div key={i} className="shrink-0 w-[280px] md:w-[350px]">{renderItem(item)}</div>
        ))}
      </motion.div>
    </div>
  );
});

/* ===================== MAIN COMPONENT ===================== */

const FluxTeam = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white pt-24 md:pt-32 pb-20 overflow-x-hidden font-sans transition-colors duration-500">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8">
        <header className="mb-20 md:mb-32 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] tracking-[0.5em] uppercase">
            <Activity size={12} className="animate-pulse" /> System_Access_Active
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
              The_Flux_Units
            </span>
          </h1>
        </header>

        {/* 1. CONVENORS */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-2 bg-cyan-500 rotate-45" />
            <h3 className="text-xs font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.4em]">Class_A // Commanders</h3>
            <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          <AdaptiveScrollRow 
            items={TEAM_DATA.convenors} 
            isMobile={isMobile}
            renderItem={(m) => (
              <div onClick={() => setSelectedItem(m)} className="h-full">
                <LeaderCard member={m} color="cyan" isMobile={isMobile} />
              </div>
            )}
          />
        </section>

        {/* 2. CO-CONVENORS */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12 flex-row-reverse">
            <div className="w-2 h-2 bg-purple-500 rotate-45" />
            <h3 className="text-xs font-mono text-purple-600 dark:text-purple-400 uppercase tracking-[0.4em]">Sub_Class // Strategists</h3>
            <div className="h-px w-full bg-gradient-to-l from-purple-500/50 to-transparent" />
          </div>
          <AdaptiveScrollRow 
            items={TEAM_DATA.coConvenors} 
            reverse 
            isMobile={isMobile}
            renderItem={(m) => (
              <div onClick={() => setSelectedItem(m)} className="h-full">
                <LeaderCard member={m} color="purple" isMobile={isMobile} />
              </div>
            )}
          />
        </section>

        {/* 3. THIRD YEAR REGISTRY */}
        <section className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rotate-45" />
            <h3 className="text-xs font-mono text-slate-500 uppercase tracking-[0.4em]">Member_Registry // 3rd Year</h3>
            <div className="h-px w-full bg-gradient-to-r from-black/10 dark:from-white/10 to-transparent" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEAM_DATA.thirdYear.map((member, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative group overflow-hidden bg-gray-50 dark:bg-black/60 border border-gray-200 dark:border-white/5 p-4 flex items-center justify-between hover:border-cyan-500 transition-all duration-300 h-20"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 group-hover:border-cyan-500 transition-colors">
                    <User size={16} className="text-slate-400 group-hover:text-cyan-500" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-black uppercase tracking-widest text-black dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 truncate">{member.name}</h4>
                    <p className="text-[8px] font-mono text-slate-500 uppercase truncate">{member.branch}</p>
                  </div>
                </div>
                {/* <a href={member.link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={12} className="text-gray-300 dark:text-white/10 group-hover:text-cyan-500 transition-colors cursor-pointer shrink-0" />
                </a> */}
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* MODAL / LIGHTBOX */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-white/90 dark:bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="max-w-3xl w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 relative overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 aspect-square bg-zinc-950">
                  <img src={selectedItem.img} alt={selectedItem.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="p-8 md:p-12 flex-1 space-y-6 relative">
                  <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-slate-400 hover:text-black dark:hover:text-white">
                    <X size={24} />
                  </button>
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 tracking-[0.4em] uppercase">Auth_Identity</div>
                    <h2 className="text-4xl font-black italic uppercase text-black dark:text-white tracking-tighter">{selectedItem.name}</h2>
                    <p className="font-mono text-slate-400 dark:text-white/40 text-[10px] uppercase">{selectedItem.role}</p>
                  </div>

                  <div className="flex gap-6 border-y border-gray-100 dark:border-white/5 py-4 my-2">
                    <div className="space-y-1">
                       <span className="flex items-center gap-1 text-[8px] font-mono text-slate-400 uppercase"><Layers size={10}/> Sector</span>
                       <span className="text-[10px] font-black uppercase tracking-wider block text-black dark:text-white">{selectedItem.branch}</span>
                    </div>
                    <div className="w-px h-8 bg-gray-100 dark:bg-white/5" />
                    <div className="space-y-1">
                       <span className="flex items-center gap-1 text-[8px] font-mono text-slate-400 uppercase"><GraduationCap size={10}/> Clearance</span>
                       <span className="text-[10px] font-black uppercase tracking-wider block text-black dark:text-white">{selectedItem.year}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-light italic">
                    {selectedItem.bio || "Core tactical unit member specialized in technical orchestration and development excellence."}
                  </p>

                  <div className="flex pt-4">
                     <a 
                       href={selectedItem.link || "#"} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-full py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2 hover:bg-cyan-600 dark:hover:bg-cyan-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                     >
                       <Linkedin size={14}/> LinkedIn_Profile
                     </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes scan { 
          0% { transform: translateY(-100%); } 
          100% { transform: translateY(300%); } 
        }
        .animate-scan { animation: scan linear infinite; }
      `}</style>
    </div>
  );
};

export default FluxTeam;