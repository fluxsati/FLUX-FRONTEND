import React, { useState, useMemo, useDeferredValue, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Tag, Play, ExternalLink,
  Copy, Check, Quote, Globe
} from 'lucide-react';

// --- CONSTANTS ---
const COUPONS = [
  { label: "PREMIUM", code: "SUxPZlyQ" },
  { label: "SPECIAL", code: "zqgZPx" }
];

const TUTEDUDE_URL = "https://tutedude.com/";

const LEARNING_SECTIONS = [
  {
    title: "Web Development",
    resources: [
      { id: "PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w", isPlaylist: true, thumbnail: "https://i.ytimg.com/vi/tVzUXW6siu0/hqdefault.jpg" },
      { id: "PLDzeHZWIZsTo0wSBcg4-NMIbC0L8evLrD", isPlaylist: true, thumbnail: "https://i.ytimg.com/vi/Vi9bxu-M-ag/hqdefault.jpg" },
      { id: "PLQEaRBV9gAFsistSzOgnD4cWgFGRVda4X", isPlaylist: true, thumbnail: "https://i.ytimg.com/vi/1pcikNlDB-4/hqdefault.jpg" },
    ]
  },
  {
    title: "Game Development",
    resources: [
      { id: "gB1F9G0JXOo", isPlaylist: false, thumbnail: "https://img.youtube.com/vi/gB1F9G0JXOo/maxresdefault.jpg" },
      { id: "GFO_txvwK_c", isPlaylist: false, thumbnail: "https://img.youtube.com/vi/GFO_txvwK_c/maxresdefault.jpg" },
    ]
  },
  {
    title: "Data Structures & Algorithms",
    resources: [
      { id: "PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt", isPlaylist: true, thumbnail: "https://i.ytimg.com/vi/VTLCoHnyACE/hqdefault.jpg" },
    ]
  },
  {
    title: "AI & ML",
    resources: [
      { id: "PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH", isPlaylist: true, thumbnail: "https://i.ytimg.com/vi/ZftI2fEz0Fw/hqdefault.jpg" }
    ]
  },
  {
    title: "Python Programming",
    resources: [
      { id: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0", isPlaylist: true, thumbnail: "https://i.ytimg.com/vi/t2_Q2BRzeEE/hqdefault.jpg" },
       { id: "UrsmFxEIp5k", isPlaylist: false, thumbnail: "https://img.youtube.com/vi/UrsmFxEIp5k/maxresdefault.jpg" },
    ]
  },
  {
    title: "Javascript",
    resources: [
      { id: "PLu0W_9lII9ahR1blWXxgSlL4y9iQBnLpR", isPlaylist: true, thumbnail: "https://img.youtube.com/vi/ER9SspLe4Hg/maxresdefault.jpg" },
    ]
  },
  {
    title: "Animations",
    resources: [
      { id: "PLbtI3_MArDOnIIJxB6xFtpnhM0wTwz0x6", isPlaylist: true, thumbnail: "https://i.ytimg.com/vi/9C03V1dXxOU/hqdefault.jpg" },
    ]
  },
 
 
];

// --- SUB-COMPONENTS ---

const CouponCard = memo(() => {
  const [copiedCode, setCopiedCode] = useState("");

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative w-full max-w-sm group mx-auto lg:mx-0"
    >
      <div className="absolute inset-0 bg-blue-600/10 blur-2xl group-hover:bg-blue-600/20 transition-all rounded-[2rem]" />
      <div className="relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 p-1.5 rounded-[2.2rem] shadow-xl">
        <div className="bg-slate-900 dark:bg-zinc-800 rounded-[2rem] p-5 md:p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[9px] font-bold tracking-[0.2em] text-blue-400 uppercase">TuteDude Offer</p>
              <a href={TUTEDUDE_URL} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-full text-white/50 hover:text-white transition-colors">
                <Globe size={14} />
              </a>
            </div>
            <div className="space-y-2 mb-4">
              {COUPONS.map((coupon) => (
                <button
                  key={coupon.code}
                  onClick={() => handleCopy(coupon.code)}
                  className={`w-full group/btn relative py-3 rounded-xl font-bold text-[11px] flex items-center justify-between px-4 transition-all active:scale-[0.98] ${copiedCode === coupon.code
                    ? "bg-green-600 text-white"
                    : "bg-white/5 hover:bg-white hover:text-black border border-white/10"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <Tag size={12} /> {coupon.label}: <span className="font-black tracking-widest uppercase">{coupon.code}</span>
                  </span>
                  {copiedCode === coupon.code ? <Check size={14} /> : <Copy size={14} className="opacity-40" />}
                </button>
              ))}
            </div>
            <a
              href={TUTEDUDE_URL} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
            >
              Visit TuteDude <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const ResourceCard = memo(({ item }) => {
  const url = item.isPlaylist
    ? `https://www.youtube.com/playlist?list=${item.id}`
    : `https://www.youtube.com/watch?v=${item.id}`;

  return (
    <motion.a
      href={url} target="_blank" rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/5 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 block h-full"
    >
      <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-zinc-800">
        <img
          src={item.thumbnail} alt="Learning Resource"
          loading="lazy" decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-3 bg-blue-600 rounded-full text-white shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play className="fill-white" size={24} />
          </div>
        </div>
        <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full">
          <span className="text-[8px] font-black text-white uppercase tracking-[0.15em]">
            {item.isPlaylist ? "Series" : "Single"}
          </span>
        </div>
      </div>
    </motion.a>
  );
});

// --- MAIN COMPONENT ---

const LearningHub = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] text-slate-900 dark:text-white pt-24 md:pt-32 pb-20 px-4 md:px-8 transition-colors duration-500">

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[60%] h-[30%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-10 md:mb-16">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-10 md:gap-16">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full lg:max-w-xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="h-[2px] w-8 bg-blue-600" />
                <span className="text-blue-600 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase">Curated Resources</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-tight mb-6">
                SKILL<span className="text-blue-600">FORGE</span>
              </h1>
              <div className="flex gap-3 items-start text-slate-500 dark:text-zinc-400 italic justify-center lg:justify-start">
                <Quote size={18} className="text-blue-500 shrink-0 mt-1" />
                <p className="text-base md:text-lg leading-relaxed max-w-md">
                  "The beautiful thing about learning is that no one can take it away from you."
                  <span className="block text-xs font-bold mt-2 not-italic uppercase tracking-widest text-slate-400">— B.B. King</span>
                </p>
              </div>
            </motion.div>

            <CouponCard />
          </div>
        </header>

        {/* SECTIONS */}
        <div className="space-y-20">
          {LEARNING_SECTIONS.map((section, index) => (
            <section key={section.title} className="relative">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-8 flex items-end gap-3"
              >
                <span className="text-4xl md:text-5xl font-black text-slate-200 dark:text-white/5 font-mono -mb-1 select-none">
                  0{index + 1}
                </span>
                <div className="relative">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-400 dark:to-purple-400">
                      {section.title.split(' ')[0]}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {' ' + section.title.split(' ').slice(1).join(' ')}
                    </span>
                  </h2>
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-600/20 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-600 rounded-full" />
                  </div>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-white/10 dark:to-transparent mb-2 ml-4" />
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {section.resources.map((item) => (
                  <ResourceCard key={item.id} item={item} />
                ))}
              </motion.div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningHub;