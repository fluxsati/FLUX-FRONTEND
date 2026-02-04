import React, { useState, useEffect, useCallback, memo } from "react";
import { Play, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";

import { youtubeProjects, instaReels, eventPosters } from "../data/GalleryData";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

const SectionHeader = memo(({ title, subtitle, borderColor, textColor, children }) => (
  <div className={`flex items-center justify-between mb-6 md:mb-8 border-l-4 ${borderColor} pl-4`}>
    <div className="flex-1">
      <h2 className={`text-lg md:text-2xl font-black uppercase italic leading-tight ${textColor || ""}`}>{title}</h2>
      <p className="text-[10px] md:text-sm opacity-50 tracking-wide">{subtitle}</p>
    </div>
    <div className="flex gap-1 md:gap-2 ml-2">{children}</div>
  </div>
));

const FluxGallery = () => {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const openLightbox = useCallback((item, type) => {
    setSelectedItem(item);
    setModalType(type);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedItem(null);
    setModalType(null);
    document.body.style.overflow = "unset";
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0b0b0b] text-white" : "bg-white text-zinc-900"} transition-colors duration-300 pb-20 relative font-sans overflow-x-hidden`}>

      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, #888 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

      {/* Lightbox Modal - Adjusted for Mobile height */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-2 md:p-10 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-[10000] p-2 rounded-full bg-red-600 text-white shadow-xl">
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-5xl max-h-[85vh] flex items-center justify-center rounded-xl overflow-hidden bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {modalType === "video" ? (
                <div className="w-full aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedItem.id}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="video"
                  />
                </div>
              ) : (
                <img src={selectedItem.img} className="max-w-full max-h-[80vh] object-contain" alt={selectedItem.title} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative z-10 pt-16 md:pt-28 pb-8 px-6 max-w-7xl mx-auto text-center md:text-left">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-bold border border-red-500/20">
            Official Archive
          </span>
          <h1 className="text-5xl md:text-7xl font-black mt-3 tracking-tighter italic uppercase leading-[0.9]">
            Flux <span className="text-red-600">Media</span>
          </h1>
        </motion.div>
      </header>

      <main className="relative z-10 space-y-16 md:space-y-32">

        {/* 1. HERO POSTER SECTION - FIXING IMAGE VIEW */}
        {/* 1. HERO POSTER SECTION - NO BLANK SPACE VERSION */}
        <section className="relative group/poster">
          <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between">
            <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Feature Spotlights</h2>
            <div className="hidden md:flex gap-2">
              <button className="p-prev p-2 rounded-full border border-current/10 hover:bg-red-600 hover:text-white transition-all"><ChevronLeft size={20} /></button>
              <button className="p-next p-2 rounded-full border border-current/10 hover:bg-red-600 hover:text-white transition-all"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="w-full md:px-6 max-w-7xl mx-auto">
            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              navigation={{ prevEl: ".p-prev", nextEl: ".p-next" }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              loop={true}
              autoHeight={true} // Crucial: adjusts swiper height to the image
              className="md:rounded-2xl overflow-hidden"
            >
              {eventPosters.map((p, i) => (
                <SwiperSlide key={i}>
                  <div
                    onClick={() => openLightbox(p, "poster")}
                    className="relative cursor-pointer w-full h-auto"
                  >
                    <img
                      src={p.img}
                      className="w-full h-auto block object-cover md:rounded-2xl"
                      alt={p.title}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* 2. YOUTUBE SECTION */}
        <section className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Video Vault" subtitle="Tutorials & Events" borderColor="border-red-600">
            <button className="v-prev p-1.5 md:p-2 rounded-full bg-zinc-500/10 hover:bg-red-600 hover:text-white transition"><ChevronLeft size={16} /></button>
            <button className="v-next p-1.5 md:p-2 rounded-full bg-zinc-500/10 hover:bg-red-600 hover:text-white transition"><ChevronRight size={16} /></button>
          </SectionHeader>

          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            navigation={{ prevEl: ".v-prev", nextEl: ".v-next" }}
            autoplay={{ delay: 3000 }}
            loop={true}
            spaceBetween={12}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 }
            }}
          >
            {youtubeProjects.map((vid, i) => (
              <SwiperSlide key={i}>
                <div onClick={() => openLightbox(vid, "video")} className="group cursor-pointer">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                    <img src={`https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`} className="w-full h-full object-cover" alt={vid.title} />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-red-600 p-2.5 rounded-full shadow-xl">
                        <Play size={16} fill="white" color="white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-3 text-[11px] md:text-sm font-bold leading-tight line-clamp-2">{vid.title}</h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 3. INSTAGRAM REELS - 1 column for small mobile, 2 for tablet */}
        <section className="max-w-7xl mx-auto px-6">
          <SectionHeader
            title="Social Loop"
            subtitle="Latest Reels"
            borderColor="border-pink-600"
            textColor="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {instaReels.slice(0, 4).map((id, i) => (
              <div key={i} className="rounded-xl overflow-hidden bg-black border border-white/5 aspect-[9/16]">
                <iframe
                  src={`https://www.instagram.com/reel/${id}/embed`}
                  className="w-full h-full"
                  scrolling="no"
                  frameBorder="0"
                />
              </div>
            ))}
          </div>

          {/* Instagram Profile Embed */}
          {/* <div className="mt-8 w-full rounded-xl overflow-hidden bg-black border border-white/5">
            <iframe
              src="https://www.instagram.com/fluxsati/embed"
              className="w-full h-[600px] md:h-[800px]"
              frameBorder="0"
              scrolling="yes"
              allowtransparency="true"
              title="Flux Instagram Profile"
            />
          </div> */}
        </section>
      </main>
    </div>
  );
};

export default FluxGallery;
