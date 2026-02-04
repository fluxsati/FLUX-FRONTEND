import React from 'react';
import { Github, Twitter, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">FLUX</h2>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-2">
            Engineered by SATI_Technical_Club © 2026
          </p>
        </div>
        
        <div className="flex gap-6">
          {[Github, Twitter, Instagram, Globe].map((Icon, i) => (
            <a key={i} href="#" className="p-3 bg-white/[0.03] border border-white/10 rounded-full hover:border-cyan-500/50 hover:text-cyan-500 transition-all">
              <Icon size={20} />
            </a>
          ))}
        </div>

        <div className="text-right">
          <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-tighter">System_Status: Operational</p>
          <div className="flex items-center gap-2 justify-end mt-1">
            <div className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
            <span className="text-[9px] text-gray-600 font-mono uppercase tracking-[0.3em]">Latency_12ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
