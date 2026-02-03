import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight, Rocket, Send, Cpu } from 'lucide-react';

/* ===================== MARQUEE COMPONENT ===================== */
const MiniMarquee = ({ items }) => (
  <div className="relative w-full py-5 bg-slate-900/[0.03] dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/5 mt-auto">
    <div 
      className="flex overflow-hidden whitespace-nowrap"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}
    >
      <div className="flex animate-mini-marquee">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-8 text-[11px] font-mono font-bold tracking-[0.3em] text-slate-400 dark:text-gray-400 uppercase">
            {item}
          </span>
        ))}
      </div>
    </div>
    <style jsx>{`
      @keyframes mini-marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-33.33%); }
      }
      .animate-mini-marquee {
        animation: mini-marquee 15s linear infinite;
      }
    `}</style>
  </div>
);

const FluxSkillsPage = () => {
  const [activeTab, setActiveTab] = useState('software');

  const softwareStack = [
    { name: "Web Dev", techs: ["React", "Next.js", "Node.js", "Tailwind"], color: "from-blue-600" },
    { name: "App Dev", techs: ["Flutter", "React Native", "Kotlin"], color: "from-cyan-600" },
    { name: "UI/UX", techs: ["Figma", "Adobe XD", "Framer"], color: "from-purple-600" },
    { name: "AI/ML", techs: ["Python", "TensorFlow", "OpenCV"], color: "from-pink-600" },
    { name: "DevOps", techs: ["Docker", "AWS", "Git/Github"], color: "from-orange-600" },
    { name: "Languages", techs: ["C", "C++", "Java", "JavaScript"], color: "from-emerald-600" },
  ];

  const hardwareStack = [
    { name: "Controllers", techs: ["Arduino", "ESP32", "NodeMCU"], color: "from-red-600" },
    { name: "Processors", techs: ["Raspberry Pi", "Jetson Nano"], color: "from-yellow-600" },
    { name: "Embedded", techs: ["VLSI", "PCB Design", "FPGA"], color: "from-indigo-600" },
    { name: "Sensors/IoT", techs: ["Ultrasonic", "Gyroscope", "MQTT"], color: "from-green-600" },
    { name: "Protocols", techs: ["I2C", "SPI", "UART"], color: "from-amber-600" },
    { name: "Robotics", techs: ["ROS", "Motor Drivers", "Drones"], color: "from-blue-700" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white p-6 md:p-12 font-sans overflow-hidden pb-32 transition-colors duration-500">
      
      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto mb-24 pt-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="flex items-center gap-3 text-cyan-600 dark:text-cyan-500 font-mono text-[10px] tracking-[0.5em] uppercase mb-6">
              <span className="w-12 h-[1px] bg-cyan-600 dark:bg-cyan-500"></span> core_capabilities
            </div>
            <h1 className="text-6xl md:text-7xl font-black italic tracking-tighter leading-[0.75] uppercase opacity-90 text-slate-900 dark:text-white">
              TECH<br />
              <span className="text-transparent stroke-slate-200 dark:stroke-white" style={{ WebkitTextStroke: '1px currentColor' }}>
                STACK
              </span>
            </h1>
          </div>
          <div className="max-w-xs border-l border-slate-200 dark:border-white/10 pl-8 pb-4">
            <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-500 uppercase mb-3 tracking-widest">// architecture</p>
            <p className="text-sm text-slate-500 dark:text-gray-500 leading-relaxed italic font-medium">
              A seamless fusion of software logic and hardware execution.
            </p>
          </div>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="flex justify-center mb-24 relative z-10">
        <div className="flex bg-white dark:bg-white/[0.03] p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl dark:shadow-none">
          {['software', 'hardware'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-4 rounded-xl font-mono text-[11px] font-bold tracking-[0.4em] uppercase transition-all duration-500 ${
                activeTab === tab 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-black scale-105 shadow-2xl' 
                  : 'text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* CARDS GRID */}
      <main className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {(activeTab === 'software' ? softwareStack : hardwareStack).map((item, idx) => (
              <motion.div 
                key={idx}
                className="group relative bg-white dark:bg-[#070707] border border-slate-200 dark:border-white/5 rounded-[3.5rem] flex flex-col pt-12 overflow-hidden hover:border-cyan-500/30 dark:hover:border-white/20 transition-all duration-700 min-h-[400px] shadow-sm hover:shadow-2xl"
              >
                <div className="px-12 flex items-center justify-between mb-12">
                  <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-500/50 tracking-[0.4em] uppercase">
                    Protocol_{idx + 1}
                  </span>
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} animate-pulse`} />
                </div>

                <div className="px-12 mb-16 flex-1">
                  <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-500 text-slate-900 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-gray-600 uppercase tracking-[0.2em]">
                    {item.techs.length} Units Integrated
                  </p>
                </div>

                <MiniMarquee items={item.techs} />

                <div className="p-8 flex justify-center items-center bg-slate-50 dark:bg-white/[0.01]">
                  <div className="flex items-center gap-3 text-[9px] font-mono text-cyan-600 dark:text-cyan-500 tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-2 group-hover:translate-y-0">
                    <Terminal size={12} /> STATUS_OPERATIONAL <ChevronRight size={12} />
                  </div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none`} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* BOTTOM CTA */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="relative bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-[4rem] p-12 md:p-20 overflow-hidden backdrop-blur-3xl shadow-2xl dark:shadow-none">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-cyan-600 dark:text-cyan-500 tracking-[0.3em] uppercase">
                  <Rocket size={12} /> Project_Inquiry
                </div>
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
                  Got a vision?<br />
                  <span className="text-cyan-600 dark:text-cyan-500">Let's build it.</span>
                </h2>
                <p className="text-slate-500 dark:text-gray-400 max-w-xl font-medium leading-relaxed">
                  Whether you're looking for technical help, building a complex startup from scratch, 
                  or need a hardware-software prototype—our lab is open for collaboration.
                </p>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto">
                <button className="group/btn relative px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase italic tracking-tighter text-xl rounded-2xl overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-xl">
                  <span className="relative z-10 flex items-center gap-3">
                    Initiate_Protocol <Send size={20} />
                  </span>
                  <div className="absolute inset-0 bg-cyan-500 dark:bg-cyan-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>
                <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-slate-400 dark:text-gray-500 tracking-widest uppercase">
                  <span>Available for Hire</span>
                  <span className="w-1 h-1 rounded-full bg-green-500 animate-ping" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity text-slate-900 dark:text-white">
              <Cpu size={300} strokeWidth={0.5} />
            </div>
          </div>
        </motion.section>
      </main>

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/[0.05] dark:bg-cyan-500/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-500/[0.05] dark:bg-purple-500/[0.03] blur-[150px] rounded-full" />
      </div>
    </div>
  );
};

export default FluxSkillsPage;
