import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { 
  EffectCoverflow, Pagination, Navigation, 
  Autoplay, Keyboard 
} from 'swiper/modules';
import { 
  ChevronDown, Info, 
  Download, ChevronLeft, ChevronRight
} from 'lucide-react';

// Import the static data
import { ARCHIVE_DATA } from '../data/archiveData';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

/* ===================== EVENT CARD COMPONENT ===================== */

const EventCard = ({ event, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
      
      {/* Visual Carousel Section */}
      <div className={`lg:col-span-7 ${index % 2 !== 0 ? 'lg:order-last' : ''}`}>
        <div className="relative group">
          <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl bg-black">
            <Swiper
              effect={'coverflow'}
              grabCursor={true}
              centeredSlides={true}
              slidesPerView={'auto'}
              keyboard={{ enabled: true }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              navigation={{ nextEl: `.next-${index}`, prevEl: `.prev-${index}` }}
              pagination={{ clickable: true, dynamicBullets: true }}
              coverflowEffect={{ 
                rotate: 5, 
                stretch: 0, 
                depth: 100, 
                modifier: 2, 
                slideShadows: false 
              }}
              modules={[EffectCoverflow, Pagination, Navigation, Autoplay, Keyboard]}
              className="w-full aspect-video"
            >
              {event.images.map((img, idx) => (
                <SwiperSlide key={idx} className="w-full h-full relative">
                  <img 
                    src={img} 
                    className="w-full h-full object-cover opacity-90 transition-opacity duration-500" 
                    alt={`${event.title} view ${idx + 1}`} 
                  />
                  <div className="absolute top-4 right-6 pointer-events-none">
                    <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
                      Frame_0{idx + 1}
                    </span>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Controls */}
            <button className={`prev-${index} absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 backdrop-blur-md`}>
              <ChevronLeft size={20}/>
            </button>
            <button className={`next-${index} absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 backdrop-blur-md`}>
              <ChevronRight size={20}/>
            </button>
          </div>
        </div>
      </div>

      {/* Text Content Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-4">
          <span className="inline-block bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[9px] font-black px-4 py-1.5 rounded-full border border-cyan-500/20 uppercase tracking-[0.2em]">
            {event.tag}
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-none text-slate-900 dark:text-white">
            {event.title}
          </h2>
        </div>

        {/* Terminal Text Block */}
        <div className="relative bg-[#050505] p-6 rounded-[1.5rem] border border-cyan-500/10 font-mono text-[12px] text-cyan-400/90 leading-relaxed shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
          <pre className="whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
            {event.terminal}
          </pre>
        </div>

        {/* Mission Data Toggle */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl group transition-all hover:border-cyan-500/40 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Info size={18} className="text-cyan-500" />
            <span className="text-xs font-black uppercase tracking-widest">Archive_Brief</span>
          </div>
          <ChevronDown size={18} className={`transition-transform duration-500 ${isExpanded ? 'rotate-180 text-cyan-500' : ''}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              className="overflow-hidden space-y-4"
            >
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-6">
                <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed italic">
                  {event.summary}
                </p>

                {event.reportUrl && (
                  <a 
                    href={event.reportUrl} download
                    className="flex items-center justify-center gap-2 w-full py-4 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-xl transition-all text-xs font-bold uppercase tracking-widest border border-cyan-500/20"
                  >
                    <Download size={14} /> Download_Archive_Brief.pdf
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ===================== MAIN ARCHIVE CONTAINER ===================== */

const FluxArchive = () => {
  const years = Object.keys(ARCHIVE_DATA).sort((a, b) => b - a);
  const [activeYear, setActiveYear] = useState(years[0] || "2025");

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white pb-12 px-4 selection:bg-cyan-500/30 font-sans transition-colors duration-500 overflow-x-hidden">
      {/* HUD Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto mt-20 md:mt-32">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 border-b border-slate-200 dark:border-white/10 pb-12 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-3">
                <span className="w-2 h-2 bg-cyan-500 rotate-45 animate-pulse" />
                <p className="text-cyan-600 dark:text-cyan-500 font-mono text-xs tracking-[0.4em] uppercase">Archive_System_Live</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
              Events<span className="text-cyan-600 dark:text-cyan-500"></span>
            </h1>
          </motion.div>
          
          <div className="flex bg-white/80 dark:bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
            {years.map((year) => (
              <button
                key={year} onClick={() => setActiveYear(year)}
                className={`relative px-10 py-4 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeYear === year ? 'text-white dark:text-black' : 'text-slate-500 hover:text-cyan-600'}`}
              >
                {activeYear === year && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-cyan-600 dark:bg-cyan-400 z-0 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)]" 
                  />
                )}
                <span className="relative z-10">{year}</span>
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeYear} 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -30 }}
            className="space-y-32 md:space-y-52 mb-40"
          >
            {ARCHIVE_DATA[activeYear]?.map((event, i) => (
              <EventCard key={`${activeYear}-${i}`} event={event} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #06b6d433; border-radius: 10px; }
        
        .swiper-pagination-bullet { background: #06b6d4 !important; opacity: 0.2; }
        .swiper-pagination-bullet-active { opacity: 1 !important; transform: scale(1.3); }
        
        @keyframes scan { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        .animate-scan { animation: scan 4s linear infinite; }
      `}</style>
    </div>
  );
};

export default FluxArchive;