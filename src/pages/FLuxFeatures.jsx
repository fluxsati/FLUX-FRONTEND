import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Instagram, Linkedin, Cpu, CircuitBoard, 
  ArrowUpRight, Terminal, BrainCircuit, 
  Sparkles, Crown, GraduationCap, 
  Rocket, Bot, Zap, TrendingUp 
} from 'lucide-react';

/* ===================== ANIMATION VARIANTS ===================== */
// Reduced movement distance for mobile to prevent layout thrashing
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
};

/* ===================== SUB-COMPONENTS ===================== */

const Marquee = memo(({ text, direction = "left", speed = 25 }) => (
  <div className="relative flex overflow-hidden py-3 border-y border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm z-10">
    <motion.div 
      className="flex whitespace-nowrap uppercase font-black tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] text-cyan-600 dark:text-cyan-400"
      animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
    >
      {[...Array(4)].map((_, i) => (
        <span key={i} className="mx-6 md:mx-10 inline-block">{text}</span>
      ))}
    </motion.div>
  </div>
));

const ServiceCard = memo(({ s }) => (
  <motion.div 
    variants={fadeInUp}
    // Hover effects only enabled for desktop to save mobile resources
    whileHover={{ y: -5 }}
    className="p-6 md:p-8 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[1.5rem] md:rounded-[2rem] flex flex-col h-full hover:border-cyan-500 transition-colors group"
  >
    <div className="text-cyan-600 dark:text-cyan-400 mb-4 md:mb-6 transition-transform lg:group-hover:scale-110 duration-300">
      {React.cloneElement(s.icon, { size: 28 })}
    </div>
    <h3 className="text-lg md:text-xl font-bold uppercase mb-3 italic tracking-tight">{s.title}</h3>
    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-6 md:mb-8 leading-relaxed flex-grow">{s.desc}</p>
    <div className="flex flex-wrap gap-2">
      {s.stack.map((tech, idx) => (
        <span key={idx} className="text-[8px] md:text-[9px] font-black bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-tighter">
          {tech}
        </span>
      ))}
    </div>
  </motion.div>
));

const SponsorCard = memo(({ op }) => (
  <motion.div 
    variants={fadeInUp}
    className="p-6 md:p-8 bg-white dark:bg-zinc-950/30 border border-slate-200 dark:border-white/10 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between h-64 md:h-72 hover:border-cyan-500/50 transition-colors"
  >
    <div className="text-cyan-600 dark:text-cyan-400">{React.cloneElement(op.icon, { size: 24 })}</div>
    <div>
       <h3 className="font-bold uppercase mb-2 tracking-tight text-sm md:text-base">{op.title}</h3>
       <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed mb-4">{op.desc}</p>
       <span className="text-[9px] md:text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">{op.target}</span>
    </div>
  </motion.div>
));

/* ===================== MAIN COMPONENT ===================== */

const FluxServices = () => {
  const navigate = useNavigate();

  const services = [
    { icon: <TrendingUp />, title: "Business Growth", desc: "We help local shops and businesses get more customers using modern digital tools and automation.", stack: ["Local SEO", "Google Business", "Sales Tech"] },
    { icon: <Bot />, title: "Robotics & Automation", desc: "We build smart machines that handle repetitive work to save time and reduce labor costs.", stack: ["Motion Control", "Smart Sensors", "Auto-Logic"] },
    { icon: <BrainCircuit />, title: "AI & Smart Software", desc: "We use Artificial Intelligence to build custom chatbots and intelligent data systems.", stack: ["Smart AI", "Data Analysis", "Chatbots"] },
    { icon: <Terminal />, title: "Websites & Apps", desc: "We create professional, fast-loading websites that look great on phones and computers.", stack: ["Modern Web", "Online Stores", "Mobile Ready"] },
    { icon: <CircuitBoard />, title: "Hardware Design", desc: "We design and build custom electronic circuit boards for physical product prototypes.", stack: ["PCB Design", "Circuitry", "Prototypes"] },
    { icon: <Cpu />, title: "Device Programming", desc: "We write firmware to make your hardware fast, secure, and internet-ready.", stack: ["Firmware", "IoT Systems", "C++ Logic"] }
  ];

  const sponsorOpportunities = [
    { icon: <Crown />, title: "Title Partner", desc: "Primary branding on all projects. Best for established brands.", target: "Major Brands" },
    { icon: <Zap />, title: "Tool Partner", desc: "Showcase your tech in our builds. Great for hardware makers.", target: "Tech Makers" },
    { icon: <Rocket />, title: "Startup Patron", desc: "Help fund new technical research and experiments.", target: "Investors" },
    { icon: <GraduationCap />, title: "Education Ally", desc: "Support student training projects and recruitment.", target: "Institutes" }
  ];

  return (
    <section className="bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-slate-100 min-h-screen selection:bg-cyan-500/30 overflow-x-hidden">
      
      <Marquee text="LOCAL GROWTH • ROBOTICS • AI SYSTEMS • WEB APPS • HARDWARE DESIGN •" speed={40} />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        
        {/* HERO SECTION */}
        <motion.div 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }} 
          variants={staggerContainer} 
          className="mb-16 md:mb-20 text-center md:text-left"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
            WE DESIGN THE <br />
            <span className="text-cyan-500 italic">NEXT GENERATION.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500 dark:text-slate-400 max-w-xl text-base md:text-lg font-medium leading-snug">
            Providing the technical expertise to move your business forward—from local growth to advanced robotics.
          </motion.p>
        </motion.div>

        {/* SERVICES GRID */}
        <motion.div 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-24 md:mb-32"
        >
          {services.map((s, i) => <ServiceCard key={i} s={s} />)}
        </motion.div>

        {/* SPONSORS SECTION */}
        <motion.div 
          initial="initial" 
          whileInView="animate" 
          viewport={{ once: true }}
          variants={staggerContainer}
          className="border-t border-slate-200 dark:border-white/10 pt-16 md:pt-20"
        >
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-5xl font-black uppercase mb-10 md:mb-12">Support <span className="text-cyan-500 italic">Innovation.</span></motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {sponsorOpportunities.map((op, i) => <SponsorCard key={i} op={op} />)}
          </div>
        </motion.div>

        {/* COMPACT CTA */}
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          onClick={() => navigate('/contact')}
          className="mt-16 md:mt-20 bg-gradient-to-br from-cyan-600 to-blue-700 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] text-center cursor-pointer transition-all group relative overflow-hidden active:scale-95 lg:hover:shadow-xl lg:hover:shadow-cyan-500/20"
        >
          <div className="relative z-10">
            <h3 className="text-xl md:text-4xl font-black text-white uppercase italic">Ready to Work Together?</h3>
            <p className="text-white/80 font-bold mt-2 uppercase tracking-widest text-[9px] md:text-xs">
              Sponsor us • Grow your Business • Hire the Team
            </p>
            <div className="mt-6 md:mt-8 inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 bg-white text-cyan-700 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest lg:group-hover:scale-105 transition-transform">
              Contact Us <ArrowUpRight size={14} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* <footer className="py-10 px-6 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2026 FLUX ENGINEERING</p>
        <div className="flex gap-6 md:gap-8">
          <Instagram size={18} className="text-slate-400 hover:text-cyan-500 cursor-pointer transition-colors" />
          <Linkedin size={18} className="text-slate-400 hover:text-cyan-500 cursor-pointer transition-colors" />
        </div>
      </footer> */}
    </section>
  );
};

export default FluxServices;