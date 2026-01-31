import React, { useState, useEffect, memo } from 'react';
import { 
  Github, Linkedin, Youtube, Instagram, 
  Sun, Moon, Globe, Database, ArrowRight, Cpu
} from 'lucide-react';

// --- Sub-component: TimeDisplay (Prevents parent from re-rendering every second) ---
const TimeDisplay = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span>{time}</span>;
};

// --- Sub-component: Social Link Button ---
const SocialButton = memo(({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="p-2.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-cyan-500 hover:border-cyan-500/50 transition-all duration-300"
    title={label}
    aria-label={label}
  >
    {React.cloneElement(icon, { size: 18 })}
  </a>
));

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const footerSections = [
    {
      title: "Navigation",
      links: [
        { name: "About_Us", href: "/about" },
        { name: "Our_Projects", href: "/projects" },
        { name: "Team_Flux", href: "/team" },
        { name: "Events_Log", href: "/events" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Learning_Hub", href: "/LearningHub" },
        { name: "Documentation", href: "#" },
        { name: "Gallery_View", href: "/gallery" },
        { name: "Tech_Stack", href: "#" },
      ]
    },
    {
      title: "Connect",
      links: [
        { name: "Contact_System", href: "/contact" },
        { name: "Sponsorship", href: "#" },
        { name: "Bug_Report", href: "#" },
        { name: "System_Status", href: "#" },
      ]
    }
  ];

  return (
    <footer className="relative bg-white dark:bg-[#050505] border-t border-slate-200 dark:border-white/10 pt-12 md:pt-20 pb-8 transition-colors duration-500 overflow-hidden">
      
      {/* Flux Cyan Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-16 md:mb-20">
          
          {/* BRAND PORTION */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] shrink-0">
                <Cpu className="text-white dark:text-black" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white leading-none">
                  FLUX
                </span>
                <span className="text-[9px] font-mono font-bold text-cyan-600 dark:text-cyan-400 tracking-[0.2em] uppercase">
                  TECHNICAL CLUB
                </span>
              </div>
            </div>
            
            <p className="text-slate-500 dark:text-gray-400 text-sm font-mono leading-relaxed max-w-sm">
              Engineering the interface between hardware precision and software agility. SATI's premier technical innovation hub.
            </p>

            <div className="flex flex-col gap-4">
               <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">System_Access_Points</span>
               <div className="flex items-center gap-2 md:gap-3">
                {/* <button 
                  onClick={toggleTheme} 
                  className="p-2.5 rounded-md border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-cyan-500 transition-colors"
                  aria-label="Toggle Theme"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button> */}
                
                <SocialButton href="https://github.com/fluxsati" icon={<Github />} label="GitHub" />
                <SocialButton href="https://www.linkedin.com/company/fluxsati/" icon={<Linkedin />} label="LinkedIn" />
                <SocialButton href="https://www.instagram.com/fluxsati/" icon={<Instagram />} label="Instagram" />
                <SocialButton href="https://www.youtube.com/@fluxsati" icon={<Youtube />} label="YouTube" />
              </div>
            </div>
          </div>

          {/* DYNAMIC LINK COLUMNS */}
          <nav className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-4 md:gap-8">
            {footerSections.map((section, i) => (
              <div key={i} className="space-y-4 md:space-y-6">
                <h4 className="text-[11px] font-mono font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] border-b border-cyan-500/30 pb-2">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="text-xs text-slate-500 dark:text-gray-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all font-mono block">
                        &gt; {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* NEWSLETTER */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-4 md:space-y-6">
            <h4 className="text-[11px] font-mono font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">
              Encrypted_Updates
            </h4>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter_User_Email..." 
                autoComplete="email"
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-3 px-4 text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors dark:text-white"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-md transition-all">
                <ArrowRight size={16} />
              </button>
            </form>
            <p className="text-[9px] font-mono text-slate-400 leading-tight">
              *Subscribe to receive technical bulletins and mission updates from FLUX_HQ.
            </p>
          </div>
        </div>

        {/* BOTTOM METADATA BAR */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            <span>© {currentYear} TECHNICAL_CLUB_FLUX</span>
            <span className="hidden sm:inline text-slate-200 dark:text-white/10">|</span>
            <span>All_Systems_Nominal</span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-[10px] font-mono text-slate-500">
             <div className="flex items-center gap-2">
                <Database size={12} className="text-cyan-500" />
                <span className="dark:text-gray-400 text-slate-600">SATI_Node_v2.6.0</span>
             </div>
             <div className="flex items-center gap-2">
                <Globe size={12} className="text-cyan-500" />
                <div className="dark:text-white text-slate-900 min-w-[70px]">
                  <TimeDisplay />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Aesthetic Background Layer */}
      <div className="absolute -bottom-6 md:-bottom-10 left-0 text-[5rem] sm:text-[8rem] md:text-[12rem] font-black italic text-slate-100 dark:text-white/[0.02] pointer-events-none select-none tracking-tighter uppercase leading-none whitespace-nowrap will-change-transform">
        TECHNICAL
      </div>
    </footer>
  );
};

export default memo(Footer);