import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Eye, Instagram, Linkedin, GraduationCap, Sparkles, Code2, Zap } from 'lucide-react';

// ===================== IMAGE IMPORTS =====================
import mritunjayImg from '../assets/founders/mritunjay.png'; 
import shubhamImg from '../assets/founders/shubham.png';

/* ===================== PERSONNEL CARD (MEMOIZED) ===================== */
const FounderCard = memo(({ title, name, role, company, branch, batch, bio, ig, li, imgSrc, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
    className="relative group rounded-3xl md:rounded-[3rem] border border-slate-200/60 dark:border-white/10 bg-gradient-to-br from-white via-white to-slate-50/50 dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#111111] backdrop-blur-xl overflow-hidden mb-8 md:mb-12 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500"
  >
    {/* Glow Effect */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 rounded-3xl md:rounded-[3rem] blur-2xl opacity-20" />
    </div>

    <div className="relative flex flex-col lg:flex-row">
      {/* Image Container with Enhanced Effects */}
      <div className="relative w-full lg:w-96 xl:w-[28rem] h-80 sm:h-[28rem] lg:h-auto shrink-0 bg-gradient-to-br from-cyan-50 to-purple-50 dark:from-black dark:to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <img 
          src={imgSrc} 
          alt={name} 
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 transform-gpu grayscale-[20%] group-hover:grayscale-0" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent opacity-60" />
        
        {/* Floating Badge */}
        <div className="absolute top-6 left-6 z-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="px-4 py-2 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl"
          >
            <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={12} className="text-cyan-500" />
              {title}
            </span>
          </motion.div>
        </div>
      </div>

      <div className="relative p-8 md:p-10 lg:p-14 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div className="w-full">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white uppercase tracking-tight mb-3 leading-tight"
            >
              {name}
            </motion.h3>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 text-sm md:text-base font-semibold"
            >
              <Code2 size={18} className="text-cyan-500" />
              <span className="text-cyan-600 dark:text-cyan-400">{role}</span>
              <span className="text-slate-400">@</span>
              <span className="text-slate-700 dark:text-slate-300">{company}</span>
            </motion.div>
          </div>
          
          {/* Social Links with Better Design */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 self-end sm:self-start"
          >
            {li && (
              <a 
                href={li} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/10 dark:to-white/5 hover:from-cyan-500 hover:to-cyan-600 text-slate-700 dark:text-slate-300 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110 transform"
              >
                <Linkedin size={20} />
              </a>
            )}
            {ig && (
              <a 
                href={ig} 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/10 dark:to-white/5 hover:from-pink-500 hover:to-purple-600 text-slate-700 dark:text-slate-300 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl hover:scale-110 transform"
              >
                <Instagram size={20} />
              </a>
            )}
          </motion.div>
        </div>
        
        {/* BIO SECTION - Removed Typewriter for better performance */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent rounded-full opacity-50" />
          <blockquote className="text-slate-600 dark:text-slate-300 leading-relaxed text-base md:text-lg font-medium italic pl-6 mb-8 border-l-2 border-transparent">
            "{bio}"
          </blockquote>
        </motion.div>

        {/* Enhanced Info Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-center gap-4 pt-8 border-t border-slate-200 dark:border-white/10"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-950/30 dark:to-cyan-900/20 border border-cyan-200/50 dark:border-cyan-800/30">
            <GraduationCap size={18} className="text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{branch}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200/50 dark:border-purple-800/30">
            <Zap size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">{batch}</span>
          </div>
        </motion.div>
      </div>
    </div>
  </motion.div>
));

const FluxAbout = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const content = {
    mission: {
      title: "Our Mission",
      icon: <Target className="text-cyan-500" size={28} />,
      text: "Bridging the gap between theory and industry. We provide a sandbox for students to break things, build things, and master the technical leadership required for the real world.",
      gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
      borderGlow: "group-hover:shadow-cyan-500/50"
    },
    vision: {
      title: "Our Vision",
      icon: <Eye className="text-purple-500" size={28} />,
      text: "To be the premier interdisciplinary hub for innovation at SATI, fostering a culture where knowledge sharing is free and creativity is the only currency that matters.",
      gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
      borderGlow: "group-hover:shadow-purple-500/50"
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#050505] dark:via-[#0a0a0a] dark:to-[#050505] text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden">
      
      {/* Enhanced Grid Background with Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-30 dark:opacity-10" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, #06b6d4 0.5px, transparent 0.5px)', 
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-black/50 to-white dark:to-black" />
      </div>

      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 dark:from-cyan-500/10 dark:to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 dark:from-purple-500/10 dark:to-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-20">
        
        {/* REFINED HERO SECTION */}
        <div className="mb-16 md:mb-24">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
            <div className="h-[2px] w-8 bg-cyan-500 rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-600">Since 2019</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic mb-6 leading-tight">
            We Are <span className="text-cyan-600">Flux</span>
          </h1>
          
          <p className="max-w-xl text-sm md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
            "A high-performance ecosystem designed to accelerate technical potential into engineering excellence."
          </p>
        </div>

        {/* MISSION/VISION TOGGLE */}
        <div className="mb-24 md:mb-32">
          <div className="flex p-1 bg-slate-200 dark:bg-white/5 rounded-full w-full sm:w-fit mb-8 mx-auto">
            {['mission', 'vision'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab 
                  ? 'bg-white dark:bg-cyan-600 text-black dark:text-white shadow-md scale-105' 
                  : 'text-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border backdrop-blur-xl ${content[activeTab].color} transition-all duration-500 transform-gpu`}
            >
              <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
                <div className="p-4 bg-white dark:bg-black rounded-2xl shadow-sm">
                  {content[activeTab].icon}
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-3 italic">
                    {content[activeTab].title}
                  </h2>
                  <p className="text-sm md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {content[activeTab].text}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* TEAM SECTION */}
        <div id="team">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
             <div className="px-4 py-1.5 rounded-full border border-cyan-500/20 text-[9px] font-mono text-cyan-600 uppercase tracking-[0.2em] bg-cyan-500/5">
              Profiles // Founding_Command
            </div>
          </div>

          <FounderCard 
            title="Founder"
            name="Mritunjay Pathak"
            role="SDE"
            company="Amazon"
            branch="Computer Science & Engineering"
            batch="Batch of 2019"
            bio="It’s incredible to see how much the club has evolved since we started. Our goal was simple: to create a space where students could innovate and develop skills together—a place where ideas transform into solutions. Strength lies in the networks you build."
            imgSrc={mritunjayImg}
            li="https://linkedin.com"
            ig="https://instagram.com"
          />

          <FounderCard 
            title="Co-Founder"
            name="Shubham Pathak"
            role="Consultant"
            company="Infosys"
            branch="Electronics & Communication"
            batch="Class of 2019"
            bio="Flux represents an ongoing journey of growth and self-improvement. When we founded this club, our vision was to create a platform for individuals to exchange ideas and access free training. We continue to be a force multiplier in technology."
            imgSrc={shubhamImg}
            li="https://linkedin.com"
          />
        </div>
      </div>
    </div>
  );
};

export default FluxAbout;
