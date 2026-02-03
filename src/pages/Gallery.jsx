import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Cpu, Layers, ChevronRight, 
  Maximize2, ChevronLeft, Zap, Users,
  Download, Share2, ZoomIn, Grid, List
} from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

/* ===================== AUTOMATIC IMAGE IMPORTS ===================== */
// These lines scan your folders and create objects mapping the file path to the actual image URL
const tvImages = import.meta.glob('../assets/events/technovision-2025/*.{png,jpg,jpeg,webp}', { eager: true });
const fwImages = import.meta.glob('../assets/events/FluxWave/*.{png,jpg,jpeg,webp}', { eager: true });
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
const Lightbox = ({ item, onClose, onNext, onPrev, hasNext, hasPrev }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `flux-gallery-${item.id}.jpg`;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FLUX Gallery', url: item.url });
      } catch (err) { console.log('Share failed:', err); }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-4 md:top-6 right-4 md:right-6 flex items-center gap-2 z-[10000]">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
          className="text-white bg-white/10 p-2.5 md:p-3 rounded-full hover:bg-white/20 backdrop-blur-md transition-colors"
          title="Toggle Zoom"
        >
          <ZoomIn size={20} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); handleDownload(); }}
          className="text-white bg-white/10 p-2.5 md:p-3 rounded-full hover:bg-cyan-500 backdrop-blur-md transition-colors"
          title="Download"
        >
          <Download size={20} />
        </motion.button>
        {navigator.share && (
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); handleShare(); }}
            className="text-white bg-white/10 p-2.5 md:p-3 rounded-full hover:bg-purple-500 backdrop-blur-md transition-colors"
            title="Share"
          >
            <Share2 size={20} />
          </motion.button>
        )}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-white bg-white/10 p-2.5 md:p-3 rounded-full hover:bg-red-500 backdrop-blur-md transition-colors"
          title="Close (ESC)"
        >
          <X size={20} />
        </motion.button>
      </div>

      {/* Navigation Arrows */}
      {hasPrev && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: -5 }}
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-[10000] p-3 md:p-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-cyan-500 transition-all"
        >
          <ChevronLeft size={28} />
        </motion.button>
      )}
      {hasNext && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: 5 }}
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[10000] p-3 md:p-4 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-cyan-500 transition-all"
        >
          <ChevronRight size={28} />
        </motion.button>
      )}

      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }}
        className="max-w-7xl w-full max-h-full overflow-hidden flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="max-w-full max-h-[80vh] w-[80vw] aspect-video bg-slate-800 rounded-lg animate-pulse flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <motion.img 
          src={item.url} 
          className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-all duration-300 ${
            isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
          } ${!imageLoaded ? 'hidden' : ''}`}
          alt="Gallery image"
          onLoad={() => setImageLoaded(true)}
          onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
          whileHover={{ scale: isZoomed ? 1.5 : 1.05 }}
        />
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 font-mono text-cyan-400 text-[10px] md:text-xs tracking-[0.4em] uppercase px-6 py-2 border border-cyan-500/20 rounded-full bg-cyan-950/50 backdrop-blur-md text-center"
        >
          ACCESS_ID // {item.id}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ===================== HORIZONTAL GALLERY ===================== */
const HorizontalStrip = ({ eventId, onClose }) => {
  const event = EVENTS.find(e => e.id === eventId);
  const items = GALLERY_DATA.filter(item => item.event === eventId);
  const scrollRef = useRef(null);
  const [activeLightbox, setActiveLightbox] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState({});

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) handleScrollTo(currentIndex + 1);
      if (e.key === 'ArrowLeft' && currentIndex > 0) handleScrollTo(currentIndex - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items.length]);

  const handleScrollTo = (index) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const itemWidth = container.offsetWidth;
      container.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
      setCurrentIndex(index);
    }
  };

  const openLightbox = (item) => {
    const itemIndex = items.findIndex(i => i.id === item.id);
    setActiveLightbox({ item, index: itemIndex });
  };

  const handleLightboxNav = (direction) => {
    if (!activeLightbox) return;
    const newIndex = activeLightbox.index + direction;
    if (newIndex >= 0 && newIndex < items.length) {
      setActiveLightbox({ item: items[newIndex], index: newIndex });
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
          {items.map((item, idx) => (
            <div key={item.id} className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-4 md:p-12">
              <div className="relative w-full max-w-5xl aspect-[4/5] md:aspect-video rounded-2xl overflow-hidden border-2 border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl">
                {/* Loading skeleton */}
                {!imagesLoaded[item.id] && (
                  <div className="absolute inset-0 bg-slate-200 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
                    />
                  </div>
                )}
                <img 
                  src={item.url} 
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imagesLoaded[item.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  alt="Gallery image"
                  onLoad={() => setImagesLoaded(prev => ({ ...prev, [item.id]: true }))}
                  loading={idx < 2 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:opacity-0 md:hover:opacity-100 transition-opacity flex items-center justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openLightbox(item)} 
                    className="flex items-center gap-2 bg-white text-black px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold hover:bg-cyan-500 hover:text-white transition-all shadow-xl text-xs md:text-sm backdrop-blur-md"
                  >
                    <Maximize2 size={18} /> <span className="tracking-widest">VIEW FULLSCREEN</span>
                  </motion.button>
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
        {activeLightbox && (
          <Lightbox 
            item={activeLightbox.item} 
            onClose={() => setActiveLightbox(null)}
            onNext={() => handleLightboxNav(1)}
            onPrev={() => handleLightboxNav(-1)}
            hasNext={activeLightbox.index < items.length - 1}
            hasPrev={activeLightbox.index > 0}
          />
        )}
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
        <Breadcrumb items={[{ label: 'Gallery', path: '/gallery' }]} />
        
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 md:mb-16 pt-8"
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '2rem' }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-px bg-cyan-600 dark:bg-cyan-400" 
            />
            <span className="text-xs font-mono tracking-widest text-cyan-600 dark:text-cyan-400 uppercase font-bold">Archive System v2.5</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Gallery<motion.span 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-cyan-600 dark:text-cyan-400"
            >.</motion.span>
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-medium">Explore our collection of events, workshops, and memorable moments</p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {EVENTS.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedEvent(event.id)}
              className="group relative h-[300px] md:h-[400px] cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl border-2 border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500"
            >
              {/* Thumbnail Background */}
              <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-all duration-700 grayscale group-hover:grayscale-0">
                <motion.img 
                  src={event.assets[0]} 
                  className="w-full h-full object-cover"
                  alt="Event thumbnail"
                  initial={{ scale: 1.1 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.7 }}
                />
              </div>

              {/* Gradient overlay with enhanced effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent group-hover:from-black/60 group-hover:via-black/30 transition-all duration-500" />

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

              <div className="relative h-full p-6 md:p-10 flex flex-col justify-between z-10">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md text-cyan-500 border border-white/10 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-400 transition-all duration-300 shadow-lg"
                >
                  {event.icon}
                </motion.div>
                <div>
                  <motion.h3 
                    className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none text-white"
                    whileHover={{ x: 5 }}
                  >
                    {event.label}
                  </motion.h3>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-xs tracking-widest uppercase opacity-70 text-white">{event.desc}</p>
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="p-2 bg-cyan-600 dark:bg-cyan-400 text-white dark:text-black rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    className="h-0.5 bg-gradient-to-r from-cyan-500 to-transparent mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>

              {/* Photo count badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full text-white text-xs font-mono border border-white/10">
                {event.assets.length} Photos
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
