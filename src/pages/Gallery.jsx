import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Cpu, Layers, ChevronRight, 
  Maximize2, ChevronLeft, Zap, Users
} from 'lucide-react';

/* ===================== AUTOMATIC IMAGE IMPORTS ===================== */
// These lines scan your folders and create objects mapping the file path to the actual image URL
const tvImages = import.meta.glob('../assets/events/technovision-2025/*.{png,jpg,jpeg,webp}', { eager: true });
const fwImages = import.meta.glob('../assets/events/fluxWave/*.{png,jpg,jpeg,webp}', { eager: true });
const webImages = import.meta.glob('../assets/events/Web-Workshop/*.{png,jpg,jpeg,webp}', { eager: true });
const recruitImages = import.meta.glob('../assets/events/FluxRecruitment/*.{png,jpg,jpeg,webp}', { eager: true });

// Helper to convert the Glob objects into simple arrays of URLs
const getImageUrls = (globObj) => Object.values(globObj).map(mod => mod.default);

/* ===================== DATA STRUCTURE ===================== */
const EVENTS = [
  { 
    id: 'technovision25', 
    label: 'TECHNOVISION_25', 
    desc: 'Robotics & Hardware Showcase', 
    icon: <Cpu size={24}/>,
    assets: getImageUrls(tvImages)
  },
  { 
    id: 'webdev_workshop', 
    label: 'WEB_DEV_25', 
    desc: 'Modern Fullstack Training', 
    icon: <Layers size={24}/>,
    assets: getImageUrls(webImages)
  },
  { 
    id: 'fluxwave', 
    label: 'FLUXWAVE', 
    desc: 'State Level Hackathon Archive', 
    icon: <Zap size={24}/>,
    assets: getImageUrls(fwImages)
  },
  { 
    id: 'recruitment25', 
    label: 'RECRUITMENT_25', 
    desc: 'New Talent Induction', 
    icon: <Users size={24}/>,
    assets: getImageUrls(recruitImages)
  }
];

// Flat array for the internal gallery logic
const GALLERY_DATA = EVENTS.flatMap(evt => 
  evt.assets.map((url, index) => ({
    id: `${evt.id}-${index}`,
    type: 'image',
    event: evt.id,
    url: url
  }))
);

/* ===================== LIGHTBOX COMPONENT ===================== */
const Lightbox = ({ item, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-2 md:p-6"
    onClick={onClose}
  >
    <button className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 z-[10000]">
      <X size={24} />
    </button>
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
      className="max-w-6xl w-full max-h-full overflow-hidden flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <img src={item.url} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" alt="" />
      <div className="mt-6 font-mono text-cyan-400 text-[10px] md:text-xs tracking-[0.4em] uppercase px-6 py-2 border border-cyan-500/20 rounded-full bg-cyan-950/20 text-center">
        ACCESS_ID // {item.id}
      </div>
    </motion.div>
  </motion.div>
);

/* ===================== HORIZONTAL GALLERY ===================== */
const HorizontalStrip = ({ eventId, onClose }) => {
  const event = EVENTS.find(e => e.id === eventId);
  const items = GALLERY_DATA.filter(item => item.event === eventId);
  const scrollRef = useRef(null);
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleScrollTo = (index) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const itemWidth = container.offsetWidth;
      container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 md:p-6 flex justify-between items-center border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500 text-white rounded shadow-lg shrink-0">{event.icon}</div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter truncate">{event.label}</h2>
            <p className="text-[9px] font-mono text-cyan-500 tracking-[0.2em]">UNIT_{currentIndex + 1}/{items.length}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-cyan-500/10 transition-colors">
          <X size={28} />
        </button>
      </div>

      {/* Viewport */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Navigation Controls */}
        <div className="absolute inset-x-8 z-10 hidden md:flex justify-between pointer-events-none">
          <button 
            disabled={currentIndex === 0}
            onClick={() => handleScrollTo(currentIndex - 1)}
            className={`p-4 bg-black/50 backdrop-blur-md text-white rounded-full pointer-events-auto transition-all ${currentIndex === 0 ? 'opacity-0 scale-50' : 'opacity-100 hover:bg-cyan-500 hover:scale-110'}`}
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            disabled={currentIndex === items.length - 1}
            onClick={() => handleScrollTo(currentIndex + 1)}
            className={`p-4 bg-black/50 backdrop-blur-md text-white rounded-full pointer-events-auto transition-all ${currentIndex === items.length - 1 ? 'opacity-0 scale-50' : 'opacity-100 hover:bg-cyan-500 hover:scale-110'}`}
          >
            <ChevronRight size={32} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="w-full h-full flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
          onScroll={(e) => {
            const index = Math.round(e.target.scrollLeft / e.target.offsetWidth);
            if(index !== currentIndex) setCurrentIndex(index);
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-4 md:p-12">
              <div className="relative w-full max-w-5xl aspect-[4/5] md:aspect-video rounded-2xl overflow-hidden border-2 border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl">
                <img src={item.url} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:opacity-0 md:hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setActiveLightbox(item)} 
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold hover:bg-cyan-500 hover:text-white transition-all shadow-xl text-xs md:text-sm"
                  >
                    <Maximize2 size={18} /> <span className="tracking-widest">VIEW FULLSCREEN</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-black/5 dark:bg-white/5">
        <motion.div 
          className="h-full bg-cyan-500"
          animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
        />
      </div>

      <AnimatePresence>
        {activeLightbox && <Lightbox item={activeLightbox} onClose={() => setActiveLightbox(null)} />}
      </AnimatePresence>
    </motion.div>
  );
};

/* ===================== MAIN COMPONENT ===================== */
export default function EventGallery() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#050505] text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 md:px-6 md:py-24">
        <header className="mb-10 md:mb-16 pt-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-6 md:w-8 bg-cyan-500" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase">Archive_System_v2.5</span>
          </div>
          <h1 className="text-5xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            Gallery<span className="text-cyan-500">.</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {EVENTS.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedEvent(event.id)}
              className="group relative h-[300px] md:h-[400px] cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border-2 border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-xl"
            >
              {/* Thumbnail Background (Uses first image from folder) */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-all duration-700 grayscale group-hover:grayscale-0">
                <img src={event.assets[0]} className="w-full h-full object-cover scale-110 group-hover:scale-100" alt="" />
              </div>

              <div className="relative h-full p-6 md:p-10 flex flex-col justify-between z-10 bg-gradient-to-br from-black/20 to-transparent">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-cyan-500 border border-white/10">
                  {event.icon}
                </div>
                <div>
                  <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2 leading-none">{event.label}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[9px] tracking-widest uppercase opacity-70">{event.desc}</p>
                    <div className="p-2 bg-cyan-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedEvent && <HorizontalStrip eventId={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}