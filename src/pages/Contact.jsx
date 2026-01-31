import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Phone, Mail, Send, CheckCircle2, 
  Instagram, Linkedin, Github, Youtube,
  Globe, Database, Zap
} from 'lucide-react';

// 1. IMPORT YOUR CENTRALIZED API
import API from '../api'; 

// Assets
import fluxLogo from '../assets/fluxlogo.png';
import satiLogo from '../assets/satilogo.png';
import maheshPhoto from '../assets/Mahesh.jpg'; // UPDATED IMPORT


// --- Static Data ---
const CONTACT_INFO = [
  { icon: <MapPin size={20} />, title: "Coordinates", lines: ["SATI Vidisha", "Kailash Satyarthi Hall"], color: "text-cyan-500" },
  { icon: <Mail size={20} />, title: "Digital_Mail", lines: ["flux.club@satiengg.in"], color: "text-purple-500" },
  { icon: <Phone size={20} />, title: "Voice_Line", lines: ["+91 78699 28242" , "+91 83199 70011"], color: "text-emerald-500" }
];

// --- Optimized Internal Components ---

const Clock = memo(() => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <div className="flex items-center gap-2"><Globe size={12} className="text-cyan-500" /> {time}</div>;
});

const SocialLink = memo(({ href, icon, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="group flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-500 transition-colors">
    <div className="p-2 border border-slate-200 dark:border-white/10 rounded-lg group-hover:border-cyan-500/50 transition-colors bg-white dark:bg-transparent">
      {icon}
    </div>
    {label && <span className="text-[8px] font-mono uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>}
  </a>
));

const FluxContactPage = () => {
  const [formState, setFormState] = useState('idle'); // idle, sending, success
  const [formData, setFormData] = useState({ operator: '', channel: '', header: '', payload: '' });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // 2. UPDATED HANDLESUBMIT USING AXIOS INSTANCE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('sending');
    try {
      // API.post automatically uses the BASE_URL from your .env/Vercel
      const response = await API.post('/contact', formData);
      
      if (response.status === 200 || response.status === 201) {
        setFormState('success');
        setFormData({ operator: '', channel: '', header: '', payload: '' });
      } else { 
        setFormState('idle'); 
      }
    } catch (err) { 
      console.error("Transmission Failed:", err);
      setFormState('idle'); 
      alert("System Offline: Could not reach backend.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white flex flex-col items-center p-4 md:p-6 font-sans overflow-x-hidden pt-24 md:pt-40 pb-20 transition-colors duration-500">
      
      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[80%] h-[40%] bg-cyan-500/[0.05] dark:bg-cyan-900/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-[5%] right-[-5%] w-[70%] h-[30%] bg-purple-500/[0.05] dark:bg-purple-900/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl z-10 space-y-12 md:space-y-24">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col items-center gap-8 md:gap-12 py-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 relative">
            <LogoFrame label="SATI_INSTITUTE" imgSrc={satiLogo} color="border-slate-300 dark:border-white/10" />
            <div className="hidden md:block w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent relative">
              <motion.div animate={{ left: ["0%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[2px] w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
            </div>
            <LogoFrame label="FLUX_CLUB" imgSrc={fluxLogo} color="border-cyan-500/40" isGlowing />
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 px-2">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter uppercase bg-gradient-to-b from-slate-900 to-slate-400 dark:from-white dark:to-gray-800 bg-clip-text text-transparent leading-none">
              Contact_Flux
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-8 md:w-12 bg-cyan-500/20" />
              <p className="font-mono text-[8px] md:text-[10px] tracking-[0.4em] text-cyan-600 dark:text-cyan-400 uppercase font-bold">Protocol_Access_Point</p>
              <div className="h-[1px] w-8 md:w-12 bg-cyan-500/20" />
            </div>
          </motion.div>
        </header>

        {/* MAIN INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          <aside className="lg:col-span-2 space-y-4">
            {CONTACT_INFO.map((info, idx) => (
              <ContactCard key={idx} {...info} />
            ))}
            
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 rounded-[1.5rem] space-y-4 shadow-sm">
              <p className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest font-bold">Official_Flux_Socials</p>
              <div className="flex gap-4">
                <SocialLink href="https://www.instagram.com/fluxsati" icon={<Instagram size={20} />} label="Stream" />
                <SocialLink href="https://linkedin.com/company/flux-club-sati" icon={<Linkedin size={20} />} label="Network" />
                <SocialLink href="https://www.youtube.com/@fluxsati" icon={<Youtube size={20} />} label="Broadcast" />
              </div>
            </div>
          </aside>

          <main className="lg:col-span-3 bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-sm backdrop-blur-md min-h-[400px]">
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <SuccessState key="success" onReset={() => setFormState('idle')} />
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} className="space-y-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Operator" name="operator" placeholder="YOUR_NAME" value={formData.operator} onChange={handleChange} required />
                    <InputField label="Channel" name="channel" type="email" placeholder="YOUR_EMAIL" value={formData.channel} onChange={handleChange} required />
                  </div>
                  <InputField label="Header" name="header" placeholder="MESSAGE_SUBJECT" value={formData.header} onChange={handleChange} required />
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono uppercase tracking-widest text-slate-400 ml-5">Data_Payload</label>
                    <textarea name="payload" rows="4" value={formData.payload} onChange={handleChange} required placeholder="ENTER_TRANSMISSION..." 
                      className="w-full bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 focus:outline-none focus:border-cyan-500 transition-all text-sm font-mono text-slate-900 dark:text-white resize-none" />
                  </div>
                  <button type="submit" disabled={formState === 'sending'} 
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-black uppercase italic tracking-widest hover:bg-cyan-500 dark:hover:bg-cyan-500 hover:text-white transition-all flex items-center justify-center gap-4 group disabled:opacity-50">
                    {formState === 'sending' ? "PROCESSING..." : "SEND_DATA"}
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </main>
        </div>

        {/* MAP SECTION */}
        <section className="relative w-full h-[400px] md:h-[600px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-2 border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)] group">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-500 z-10 rounded-tl-[2.5rem] md:rounded-tl-[4rem]" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-cyan-500 z-10 rounded-br-[2.5rem] md:rounded-br-[4rem]" />

          <iframe 
            title="Kailash Satyarthi Hall Map" 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.41560741494!2d77.81751497591492!3d23.51754979767476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c0489839f57d7%3A0x450caad4c72f76b1!2sKailash%20Satyarthi%20Auditorium!5e0!3m2!1sen!2sin!4v1769850729631!5m2!1sen!2sin" 
            className="w-full h-full object-cover filter contrast-[1.1] dark:invert dark:hue-rotate-180" 
            loading="lazy"
          />
          {/* <iframe 
            title="SATI Map" 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.313178306467!2d77.818057875915!3d23.521235797534494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c048a269d1ab7%3A0xf7b28bf51d19bbcc!2sSamrat%20Ashok%20Technological%20Institute!5e0!3m2!1sen!2sin!4v1769850846903!5m2!1sen!2sin" 
            className="w-full h-full object-cover filter contrast-[1.1] dark:invert dark:hue-rotate-180" 
            loading="lazy"
          /> */}


          <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 p-6 bg-white/90 dark:bg-[#050505]/80 backdrop-blur-xl border border-slate-200 dark:border-cyan-500/20 rounded-[2rem] shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-cyan-500" />
                <p className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-black">Mission_Coordinates</p>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-black text-xl leading-tight">Kailash Satyarthi Auditorium</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1 uppercase tracking-tighter">SATI Campus, Vidisha, MP 464001</p>
              </div>
            </div>
          </div>
        </section>

        {/* OPERATOR SECTION */}
        <section className="relative max-w-6xl mx-auto px-4">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 p-6 md:p-10 backdrop-blur-xl">
            <div className="lg:col-span-4 flex justify-center relative group">
              <div className="relative w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-xl border border-white/10">
                <img 
                    src={maheshPhoto} // UPDATED SOURCE
                    alt="Mahesh Kushwah" 
                    className="w-full h-full object-cover group-hover: group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-black px-3 py-1 font-mono text-[9px] font-bold z-20">CORE_DEV</div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <div className="h-[1px] w-8 bg-cyan-500" />
                  <span className="text-cyan-500 font-mono text-[10px] uppercase tracking-widest">Lead System Architect</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-slate-900 dark:text-white">
                  Mahesh <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">Kushwah</span>
                </h2>
              </div>
              <p className="text-sm md:text-lg text-slate-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
                I engineer <span className="text-slate-900 dark:text-white">high-frequency React ecosystems</span> and secure data transmissions. Always ready to build scalable web apps and optimize for peak performance.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <SocialLink href="https://github.com/Introvert07" icon={<Github size={18} />} />
                  <SocialLink href="https://www.linkedin.com/in/mahesh-kushwah-942245276" icon={<Linkedin size={18} />} />
                  <SocialLink href="https://www.instagram.com/_introvert7/" icon={<Instagram size={18} />} />
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Secure_Comm</span>
                  <span className="text-sm font-bold text-cyan-500">+91 87707 26065</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 flex flex-col items-center gap-4 opacity-40 font-mono text-[8px] md:text-[10px] tracking-[0.4em] uppercase text-center">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><Database size={12} className="text-cyan-500" /> v2.0.4</div>
            <Clock />
        </div>
        <p>Lead Architect: Mahesh Kushwah // FLUX_WEB_DIV // © 2026</p>
      </footer>
    </div>
  );
};

// --- Helper Components ---

const LogoFrame = memo(({ label, imgSrc, color, isGlowing }) => (
  <div className="relative flex flex-col items-center gap-4">
    <div className={`relative w-24 h-24 md:w-36 md:h-36 flex items-center justify-center rounded-full border-2 ${color} ${isGlowing ? 'shadow-[0_0_40px_rgba(6,182,212,0.1)]' : ''} bg-white dark:bg-black/20 p-1`}>
      <motion.div className="absolute inset-[-8px] border border-dashed border-slate-300 dark:border-white/10 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
      <div className="w-full h-full rounded-full border border-slate-100 dark:border-white/5 flex items-center justify-center overflow-hidden bg-white dark:bg-zinc-900/80 p-4">
        <img src={imgSrc} alt={label} className="w-full h-full object-contain" />
      </div>
    </div>
    <span className="text-[8px] font-mono tracking-widest text-slate-500 dark:text-cyan-400 uppercase font-black">{label}</span>
  </div>
));

const ContactCard = memo(({ icon, title, lines, color }) => (
  <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-5 rounded-[1.5rem] flex items-center gap-5 group hover:border-cyan-500/30 transition-all shadow-sm">
    <div className={`p-4 bg-slate-50 dark:bg-white/5 rounded-2xl group-hover:scale-110 transition-transform ${color}`}>{icon}</div>
    <div>
      <h4 className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">{title}</h4>
      {lines.map((l, i) => <p key={i} className="text-sm font-black uppercase tracking-tight">{l}</p>)}
    </div>
  </div>
));

const InputField = memo(({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[9px] font-mono uppercase tracking-widest text-slate-400 ml-5">{label}</label>
    <input {...props} className="bg-slate-100/50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-full px-6 py-3 focus:outline-none focus:border-cyan-500 transition-all text-sm font-mono text-slate-900 dark:text-white w-full" />
  </div>
));

const SuccessState = memo(({ onReset }) => (
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-6">
    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mx-auto">
      <CheckCircle2 size={30} className="text-emerald-500" />
    </div>
    <h2 className="text-xl font-black uppercase italic">Transmission_Received</h2>
    <button onClick={onReset} className="px-6 py-2 border border-slate-200 dark:border-white/10 rounded-full font-mono text-[9px] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">CLEAR_CACHE</button>
  </motion.div>
));

export default memo(FluxContactPage);