import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { ChevronDown, Send, Code, Target, Zap, Layout, Mic, MessageCircle, HelpCircle } from 'lucide-react';

import iotBg from '../assets/events/FluxWave_2.0/domains/IOT_BG.png';
import iotAvatar from '../assets/events/FluxWave_2.0/domains/IOT_charater.png';
import aiBg from '../assets/events/FluxWave_2.0/domains/AI.png';
import aiAvatar from '../assets/events/FluxWave_2.0/domains/ai_char.png';
import cyberBg from '../assets/events/FluxWave_2.0/domains/cyber.png';
import cyberAvatar from '../assets/events/FluxWave_2.0/domains/cyber_char.png';
import web3Bg from '../assets/events/FluxWave_2.0/domains/blockchain.png';
import web3Avatar from '../assets/events/FluxWave_2.0/domains/blockchain_char.png';
import openBg from '../assets/events/FluxWave_2.0/domains/open.png';
import openAvatar from '../assets/events/FluxWave_2.0/domains/open_chars.png';
import gameBg from '../assets/events/FluxWave_2.0/domains/game.png';
import gameAvatar from '../assets/events/FluxWave_2.0/domains/game_cha.png';


const timelineData = [
  { id: 1, date: "July 11, 2026", title: "Registration Launch", desc: "Portals open for hackers" },
  { id: 2, date: "July 20, 2026", title: "Registration Deadline", desc: "Submissions TBD" },
  { id: 3, date: "July 20–28", title: "Idea & PPT", desc: "Submit problem statement & solution" },
  { id: 4, date: "July 29–31", title: "Evaluation", desc: "Judging panel screens projects" },
  { id: 5, date: "August 1, 2026", title: "Grand Finale", desc: "8-Hour Offline Hackathon at KSH" }
];

const domainsData = [
  { id: 1, title: "IoT & Hardware", desc: "Build smart devices and integrate hardware.", img: iotBg, avatar: iotAvatar },
  { id: 2, title: "Artificial Intelligence", desc: "Leverage ML and AI for innovative solutions.", img: aiBg, avatar: aiAvatar },
  { id: 3, title: "Cyber Security", desc: "Protect systems from digital attacks.", img: cyberBg, avatar: cyberAvatar },
  { id: 4, title: "Web3 & Blockchain", desc: "Develop decentralized applications.", img: web3Bg, avatar: web3Avatar },
  { id: 5, title: "Open Innovation", desc: "Solve open-ended real-world problems.", img: openBg, avatar: openAvatar },
  { id: 6, title: "Game Development", desc: "Create immersive gaming experiences.", img: gameBg, avatar: gameAvatar }
];

const metrics = [
  { title: "Innovation", weight: 30, color: "#8b5cf6", icon: <Zap size={20} /> },
  { title: "Tech Implementation", weight: 25, color: "#06b6d4", icon: <Code size={20} /> },
  { title: "Problem-Solving", weight: 20, color: "#10b981", icon: <Target size={20} /> },
  { title: "UI/UX & Design", weight: 15, color: "#ec4899", icon: <Layout size={20} /> },
  { title: "Presentation", weight: 10, color: "#f59e0b", icon: <Mic size={20} /> },
];

const faqs = [
  { q: "Who can participate?", a: "Open to all undergraduate students of any branch and year." },
  { q: "What is the team size?", a: "You can participate in teams of 2-4 members." },
  { q: "Is hardware provided?", a: "Participants need to bring their own basic hardware, though specific sensors may be provided upon prior request." },
  { q: "Will internet be available?", a: "Yes, high-speed Wi-Fi will be available at Kailash Satyarthi Hall (KSH)." },
  { q: "Is there any registration fee?", a: "Registration fees (if any) will be announced on the portal launch day." }
];

const MarqueeRibbon = ({ text, bg = "bg-purple-600", rotate = "-rotate-2" }) => (
  <div className={`w-[110vw] -ml-[5vw] py-4 ${bg} text-white font-bold tracking-widest uppercase overflow-hidden transform ${rotate} my-24 shadow-2xl z-20 relative`}>
    <div className="animate-marquee whitespace-nowrap text-2xl lg:text-3xl flex" style={{ fontFamily: '"Russo One", sans-serif' }}>
      {Array(15).fill(text).map((t, i) => (
        <span key={i} className="mx-4">{t}</span>
      ))}
    </div>
  </div>
);

const HolographicScroll = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, scaleY: 0 }}
            animate={{ height: "auto", opacity: 1, scaleY: 1 }}
            exit={{ height: 0, opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="w-72 md:w-80 mb-4 origin-bottom relative perspective-[1000px]"
          >
            {/* Scroll Container */}
            <div className="relative bg-[#0a0a10]/95 backdrop-blur-md border border-cyan-500/50 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden">
              
              {/* Blueprint Grid Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.5) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* Scanline Animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-[20%] w-full animate-[scan_3s_ease-in-out_infinite] pointer-events-none z-10"></div>

              {/* Top Roller */}
              <div className="h-4 w-full bg-gradient-to-r from-cyan-900 via-cyan-500 to-cyan-900 shadow-[0_2px_10px_rgba(6,182,212,0.5)] z-20 relative border-b border-cyan-300"></div>
              
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold mb-4 text-cyan-400 border-b border-cyan-500/30 pb-2 uppercase tracking-widest flex items-center justify-between" style={{ fontFamily: '"AudiowideReal", sans-serif' }}>
                   <span>FluxWave 1.0</span>
                   <span className="text-[9px] bg-cyan-500/20 px-2 py-1 rounded text-cyan-200 tracking-wider">ARCHIVE</span>
                </h3>
                
                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-slate-400 uppercase text-xs tracking-wider">Organized</span>
                     <span className="text-white">August 02, 2025</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-slate-400 uppercase text-xs tracking-wider">Hackers</span>
                     <span className="text-white text-right">250+ Participants</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-slate-400 uppercase text-xs tracking-wider">Output</span>
                     <span className="text-white text-right">51+ Projects Built</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                     <span className="text-slate-400 uppercase text-xs tracking-wider">Champions</span>
                     <span className="text-white text-right">3 Winning Teams</span>
                  </li>
                  <li className="flex justify-between items-center pt-1">
                     <span className="text-slate-400 uppercase text-xs tracking-wider">Prize Pool</span>
                     <span className="text-purple-400 font-bold" style={{ fontFamily: '"Technology", monospace', fontSize: '1.2rem' }}>Trophies And Certificates</span>
                  </li>
                </ul>
              </div>
              
              {/* Bottom Roller */}
              <div className="h-4 w-full bg-gradient-to-r from-purple-900 via-purple-500 to-purple-900 shadow-[0_-2px_10px_rgba(168,85,247,0.5)] z-20 relative border-t border-purple-300"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The closed capsule / trigger */}
      <div 
        className="cursor-pointer group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0a0a10] border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:border-purple-500 transition-all duration-300 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
         <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 group-hover:from-purple-500/40 group-hover:to-cyan-500/40 transition-colors duration-300 flex items-center justify-center">
            <ChevronDown className={`w-6 h-6 text-cyan-400 group-hover:text-purple-400 transition-all duration-500 ${isOpen ? '' : 'rotate-180'}`} />
         </div>
         {/* Capsule ridges */}
         <div className="absolute -inset-1 rounded-full border border-cyan-500/30 group-hover:border-purple-500/50 animate-[spin_4s_linear_infinite] border-dashed"></div>
         
         <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 px-3 py-1.5 rounded-md text-[10px] text-cyan-300 uppercase tracking-widest font-bold pointer-events-none border border-cyan-500/30">
            {isOpen ? 'Close Archive' : 'V1.0 Archive'}
         </div>
      </div>
    </div>
  );
};

const FluxWave2_0 = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeFaq, setActiveFaq] = useState(null);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date("July 11, 2026 00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Desktop Timeline Scroll logic
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start start", "end end"] 
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const xTransform = useTransform(smoothProgress, [0, 1], ["0%", "-66.66%"]);

  return (
    <div className="bg-slate-50 dark:bg-[#0f0f13] text-slate-900 dark:text-slate-50 min-h-screen font-sans selection:bg-purple-500/30 pt-24 overflow-x-clip transition-colors duration-300" style={{ fontFamily: '"Raleway", sans-serif' }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @font-face {
          font-family: 'Liger';
          src: url('https://hackatank.shadowctrl.me/fonts/liger.ttf') format('truetype');
        }
        @font-face {
          font-family: 'Technology';
          src: url('https://hackatank.shadowctrl.me/fonts/technology/Technology.ttf') format('truetype');
        }
        @font-face {
          font-family: 'Mars';
          src: url('https://hackatank.shadowctrl.me/fonts/mars/Mars%20Bold.ttf') format('truetype');
        }
        @font-face {
          font-family: 'AudiowideReal';
          src: url('https://fonts.gstatic.com/s/audiowide/v22/l7gdbjpo0cum0ckerWCdmA_OIxo.woff2') format('woff2');
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(500%); opacity: 0; }
        }
      `}} />

      {/* Background Topography Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
      <div className="fixed top-0 w-full h-[50vh] bg-gradient-to-b from-purple-500/10 via-transparent to-transparent pointer-events-none z-0"></div>

      {/* HERO SECTION (100vw Width) */}
      <section className="relative z-10 w-full min-h-[90vh] flex flex-col justify-between px-6 md:px-12 lg:px-24 pb-16">
        
        {/* Center Title Area */}
        <div className="flex-grow flex flex-col justify-center items-start pt-10">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 bg-white/50 dark:bg-white/5 p-2 pr-4 sm:p-3 sm:pr-5 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm w-fit max-w-full">
            <img src="/fluxlogo.png" alt="Flux Logo" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0" onError={(e) => e.target.style.display='none'} />
            <span className="text-[10px] sm:text-sm font-bold tracking-wide uppercase text-slate-800 dark:text-slate-200 truncate">Celebrating Innovation at SATI</span>
          </div>
          
          <h1 
            className="text-[11.5vw] sm:text-6xl md:text-8xl lg:text-[10rem] uppercase leading-none drop-shadow-2xl tracking-tighter"
            style={{ fontFamily: '"Liger", system-ui', WebkitTextStroke: '1px rgba(128,128,128,0.2)' }}
          >
            <span className="text-slate-900 dark:text-white">FLUXWAVE</span><br/><span className="text-purple-600 dark:text-purple-500">2.0</span>
          </h1>
          
          <p className="mt-8 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed border-l-4 border-purple-500 pl-6">
            The ultimate innovation sandbox where code, hardware, and design crash together. Forge solutions to real-world problems and push boundaries.
          </p>
        </div>

        {/* Bottom Left Timer & CTAs */}
        <div className="mt-12 flex flex-col items-start gap-6">
          
          {/* Action Buttons directly above the timer */}
          <div className="flex flex-wrap gap-4 items-center">
            <button 
              className="px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg"
              style={{ fontFamily: '"Mars", system-ui' }}
            >
              REGISTER NOW
            </button>
            <button 
              className="px-8 py-3 rounded-full bg-[#25D366] text-white hover:bg-[#1ebd5a] transition-colors shadow-[0_0_15px_rgba(37,211,102,0.4)] flex items-center gap-2 font-bold tracking-wider"
              style={{ fontFamily: '"Russo One", sans-serif' }}
            >
              <MessageCircle size={18} /> Join WhatsApp
            </button>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-[2px] rounded-2xl w-full sm:w-fit shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <div className="bg-white dark:bg-[#050505] rounded-2xl px-4 py-4 sm:px-8 sm:py-6 flex justify-between sm:justify-start gap-2 sm:gap-6 md:gap-12 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover opacity-5 dark:opacity-10 mix-blend-screen"></div>
              {Object.entries(timeLeft).map(([unit, value], i) => (
                <div key={unit} className="flex flex-col items-center relative z-10 w-1/4 sm:w-auto">
                  <span 
                    className="text-3xl sm:text-4xl md:text-6xl font-bold text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    style={{ fontFamily: '"Technology", monospace' }}
                  >
                    {String(value).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1 sm:mt-2 font-bold">{unit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MarqueeRibbon text="IDEATE ✦ BUILD ✦ CODE ✦ DEBUG ✦ PITCH ✦ NETWORK ✦ INNOVATE ✦ COLLABORATE ✦ CREATE ✦ DEPLOY ✦ DEMO ✦ WIN" bg="bg-purple-600" />

      {/* EXPLORE DOMAINS SECTION */}
      <section className="relative w-full px-6 md:px-12 lg:px-24 py-20 z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
            Explore Domains
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">Choose your battlefield. Which challenge will your team conquer?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 mt-8">
          {domainsData.map((domain) => (
            <div key={domain.id} className="group relative flex flex-col items-center cursor-pointer w-full perspective-[1200px]">
              
              {/* 16:9 Container */}
              <div className="relative w-full aspect-video rounded-3xl overflow-visible [transform-style:preserve-3d]">
                
                {/* Background Card that tilts back */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:[transform:rotateX(40deg)] group-hover:shadow-purple-500/40 origin-bottom border border-slate-200 dark:border-white/10 z-10 bg-slate-100 dark:bg-[#12121a]">
                  {/* Background Image */}
                  <img 
                    src={domain.img} 
                    alt={domain.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110 group-hover:brightness-[0.25]"
                  />
                </div>

                {/* Pop-out Avatar - Original size/position to match background, translates UP on hover */}
                <div className="absolute inset-0 z-20 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform group-hover:-translate-y-6 group-hover:scale-105 pointer-events-none drop-shadow-2xl">
                   <img 
                     src={domain.avatar} 
                     alt={`${domain.title} Avatar`}
                     className="w-full h-full object-cover"
                   />
                </div>

                {/* Text Content - visible on hover, NOT tilted, top z-index */}
                <div className={`absolute inset-y-0 p-6 md:p-8 flex flex-col justify-center w-[70%] opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 z-30 pointer-events-none ${domain.id === 2 ? 'right-0 text-right items-end' : 'left-0 text-left items-start'}`}>
                  <p className="text-white text-xs md:text-sm lg:text-base font-bold leading-relaxed drop-shadow-black] transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
                    {domain.desc}
                  </p>
                </div>

              </div>
              <h3 className="mt-8 text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest transition-colors duration-300 group-hover:text-cyan-500 text-center" style={{ fontFamily: '"AudiowideReal", sans-serif' }}>
                {domain.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

     {/* <MarqueeRibbon text="REGISTER NOW ✦ AI ✦ IoT & HARDWARE ✦ CYBER SECURITY ✦ WEB3 ✦ OPEN INNOVATION ✦ GAME DEVELOPMENT ✦ REGISTER NOW" bg="bg-cyan-600" rotate="rotate-2" />*/}

      {/* WAVY TIMELINE - DESKTOP */}
      <div className="hidden lg:block">
        <div ref={containerRef} className="h-[400vh] relative z-10 w-full">
          {/* Sticking container needs to cover screen, removed overflow-x-hidden from parent body/root */}
          <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
            
            <div className="absolute top-20 left-24 z-20">
              <h2 className="text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-widest" style={{ fontFamily: '"Russo One", sans-serif' }}>The Journey</h2>
              <p className="text-cyan-600 dark:text-cyan-400 mt-2 font-bold uppercase tracking-widest text-sm">Scroll to advance</p>
            </div>
            
            <motion.div style={{ x: xTransform }} className="flex w-[300vw] h-full items-center relative">
              
              <svg className="absolute top-1/2 -translate-y-1/4 w-full h-[400px] pointer-events-none drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]" viewBox="0 0 3000 400" preserveAspectRatio="none">
                <path 
                  d="M 0 200 C 300 50, 600 350, 900 200 C 1200 50, 1500 350, 1800 200 C 2100 50, 2400 350, 2700 200 C 2900 50, 3000 200, 3000 200" 
                  fill="none" 
                  stroke="url(#purple-cyan-grad)" 
                  strokeWidth="8" 
                />
                <defs>
                  <linearGradient id="purple-cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {timelineData.map((item, idx) => {
                const isTop = idx % 2 === 0;
                const leftPercent = 15 + (idx * 16); 
                
                return (
                  <div key={item.id} className="absolute flex flex-col items-center" style={{ left: `${leftPercent}%`, top: '50%', transform: 'translate(-50%, 200%)' }}>
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-[#050505] border-4 border-cyan-500 shadow-[0_0_20px_#06b6d4] z-10 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    </div>
                    <div className={`absolute flex flex-col items-center ${isTop ? 'bottom-full mb-6' : 'top-full mt-6'}`}>
                      <div className={`w-1 h-20 bg-gradient-to-b ${isTop ? 'from-cyan-700 to-cyan-400' : 'from-cyan-400 to-cyan-700'} ${isTop ? 'order-2' : 'order-1'}`}></div>
                      <div className={`w-80 p-6 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl ${isTop ? 'order-1' : 'order-2'}`}>
                        <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">{item.date}</div>
                        <h4 className="text-slate-900 dark:text-white font-bold text-2xl mb-2" style={{ fontFamily: '"AudiowideReal", sans-serif' }}>{item.title}</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* WAVY TIMELINE - MOBILE */}
      <section className="lg:hidden w-full px-6 py-24 relative z-10 overflow-hidden">
        <div className="text-center mb-24">
           <h2 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-2" style={{ fontFamily: '"Russo One", sans-serif' }}>The Journey</h2>
        </div>
        
        <div className="relative w-full max-w-lg mx-auto py-10">
          <svg className="absolute left-1/2 -translate-x-1/2 top-0 w-64 h-full z-0 pointer-events-none drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]" viewBox="0 0 100 1000" preserveAspectRatio="none">
             <path d="M 50 0 C 150 125, -50 250, 50 375 C 150 500, -50 625, 50 750 C 150 875, -50 1000, 50 1000" fill="none" stroke="url(#mobile-grad)" strokeWidth="3" />
             <defs>
                <linearGradient id="mobile-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" stopColor="#9333ea" />
                   <stop offset="50%" stopColor="#06b6d4" />
                   <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
             </defs>
          </svg>

          <div className="space-y-64 flex flex-col relative z-10">
            {timelineData.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-200px" }}
                  className={`flex w-full ${isLeft ? 'justify-start' : 'justify-end'} relative`}
                >
                  <div className={`w-[45%] ${isLeft ? 'pr-4 md:pr-8 text-right' : 'pl-4 md:pl-8 text-left'} bg-white/80 dark:bg-white/5 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-xl`}>
                    <div className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-bold rounded-full mb-2 uppercase">{item.date}</div>
                    <h4 className="text-slate-900 dark:text-white font-bold text-sm md:text-lg mb-1" style={{ fontFamily: '"AudiowideReal", sans-serif' }}>{item.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm">{item.desc}</p>
                  </div>
                  
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#050505] border-4 border-cyan-500 shadow-[0_0_15px_#06b6d4] z-10 flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* JUDGING METRICS - VISUALIZATION */}
      <section className="relative w-full px-6 md:px-12 lg:px-24 py-24 z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/3">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6" style={{ fontFamily: '"Russo One", sans-serif' }}>
              Judging Metrics
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 font-medium">
              Projects are evaluated across multiple dimensions. Hover over the parameters to see how we weigh innovation versus execution.
            </p>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-md">
               <h4 className="text-slate-700 dark:text-white font-bold mb-2 uppercase tracking-wide">Total Score</h4>
               <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500" style={{ fontFamily: '"Technology", monospace' }}>
                  100<span className="text-2xl text-slate-400">pts</span>
               </div>
            </div>
          </div>
          
          <div className="w-full lg:w-2/3 space-y-6">
            {metrics.map((metric, idx) => (
              <div 
                key={idx} 
                className="relative"
                onMouseEnter={() => setHoveredMetric(idx)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-2">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                    <span style={{ color: metric.color }}>{metric.icon}</span>
                    <span style={{ fontFamily: '"AudiowideReal", sans-serif' }}>{metric.title}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">{metric.weight}%</span>
                </div>
                <div className="h-4 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.weight}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                    className="h-full rounded-full relative"
                    style={{ backgroundColor: metric.color }}
                  >
                    <div className={`absolute inset-0 bg-white/40 transition-opacity duration-300 ${hoveredMetric === idx ? 'opacity-100' : 'opacity-0'}`}></div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <MarqueeRibbon text="REGISTER NOW ✦ AI ✦ IoT & HARDWARE ✦ CYBER SECURITY ✦ WEB3 ✦ OPEN INNOVATION ✦ GAME DEVELOPMENT ✦ REGISTER NOW" bg="bg-emerald-600" rotate='rotate-2' />

      {/* FAQS */}
      <section className="relative w-full px-6 md:px-12 lg:px-24 py-16 z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-slate-900 dark:text-white uppercase tracking-widest mb-12" style={{ fontFamily: '"Russo One", sans-serif' }}>System FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-white/5 backdrop-blur-sm shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="font-bold text-slate-800 dark:text-white text-lg tracking-wide">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 text-cyan-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 mt-2 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEED HELP SECTION */}
      <section className="relative w-full px-6 md:px-12 lg:px-24 py-16 z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6">
            <HelpCircle className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white uppercase mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>Need Help?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg font-medium">
            Got questions about registration, domains, or rules? Our support team is ready to assist you. Drop us a message!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
             <a href="/contact" className="px-8 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold tracking-wide flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
               <Send size={18} /> Contact Support
               
             </a>
             <button className="px-8 py-3 rounded-full bg-[#25D366] text-white font-bold tracking-wide flex items-center gap-2 hover:bg-[#1ebd5a] transition-colors shadow-lg">
               <MessageCircle size={18} /> Help Desk Group
             </button>
          </div>
        </div>
      </section>
      {/* FluxWave 1.0 Holographic Scroll */}
      <HolographicScroll />

    </div>
  );
};

export default FluxWave2_0;
