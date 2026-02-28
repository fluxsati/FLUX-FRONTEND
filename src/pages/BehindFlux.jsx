import React, { memo } from 'react';
import Typewriter from 'typewriter-effect';
import { useInView } from 'react-intersection-observer';
import { FileText, Table, ExternalLink } from 'lucide-react'; // Added icons for terminal links

// ===== IMAGE IMPORTS =====
import ykJainImg from '../assets/faculty/ykjainsir.png';
import aashuSirImg from '../assets/faculty/aashusir.png';
import dkSirImg from '../assets/faculty/dksir.png';
import nkSirImg from '../assets/faculty/nksir.png';
import kamleshSirImg from '../assets/faculty/kamleshsir.jpeg';

// --- Optimized Typewriter Component ---
const ScrollTypewriter = memo(({ content, delay = 20, cursor = '█' }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="inline-block w-full">
      {inView ? (
        <Typewriter
          options={{ delay, cursor, wrapperClassName: 'inline-block' }}
          onInit={(typewriter) => {
            typewriter.typeString(content).start();
          }}
        />
      ) : (
        <span className="opacity-0">{content}</span>
      )}
    </div>
  );
});

const FacultyCard = memo(({ fac }) => (
  <div className="group relative bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-1 hover:border-cyan-500/50 transition-all duration-300 rounded-sm">
    <div className="relative bg-white dark:bg-[#050505] p-6 lg:p-8 space-y-6 z-10 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start text-center sm:text-left">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg border-2 border-slate-200 dark:border-white/5 group-hover:border-cyan-500/50 transition-colors">
          <img src={fac.img} alt={fac.name} className="w-full h-full object-cover lg:group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 tracking-widest font-bold">{fac.id}</span>
          <h4 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors tracking-tight">{fac.name}</h4>
          <p className="text-slate-500 dark:text-gray-400 text-[10px] sm:text-xs font-mono uppercase tracking-tighter">{fac.role}</p>
        </div>
      </div>
      <div className="text-xs md:text-sm text-slate-500 dark:text-gray-400 font-mono leading-relaxed border-t border-slate-100 dark:border-white/5 pt-4 sm:pt-6 flex-grow text-justify min-h-[80px]">
        <ScrollTypewriter content={fac.content} delay={15} cursor="_" />
      </div>
    </div>
    <div className="hidden lg:block absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
  </div>
));

const BehindFlux = () => {
  const director = {
    name: "Dr. Y.K. JAIN",
    role: "Director, SATI Vidisha",
    img: ykJainImg,
    id: "DIR-00",
    content: "In today’s learning environment, students hold greater responsibility for their education than ever before. The Flux Technical Club thrives in this dynamic digital era, where technology offers both incredible opportunities and potential challenges. Flux embodies the spirit of innovation and teamwork. Flux is more than just a club—it’s a place where overall development occurs, skills are honed, knowledge is shared, and a positive impact on society is made."
  };

  const mentors = [
    { name: "Dr. Ashutosh Datar", role: "Faculty Coordinator", id: "FC-01", img: aashuSirImg, content: "FLUX, the technical heart of Samrat Ashok Technological Institute, invites you to embark on an exhilarating journey of innovation and exploration. Our club is a crucible of ideas, where hardware meets software in a symphony of ingenuity." },
    { name: "Dr. D. K. Shakya", role: "Faculty Coordinator", id: "FC-02", img: dkSirImg, content: "A strong technical community plays a crucial role in shaping the academic and professional journey of students. Flux is passionate about empowering young minds to explore the vast world of technology and develop skills that will shape the future." },
    { name: "Prof. Neeraj Kumar Dhakad", role: "Faculty Co-Coordinator", id: "FCC-01", img: nkSirImg, content: "Welcome to Flux, where we foster innovation and creativity. Whether you’re a beginner or an experienced tech enthusiast, we offer workshops and projects that cater to all skill levels. Joining Flux is about a supportive community." },
    { name: "Dr. Kamlesh Sharma", role: "Faculty Co-Coordinator", id: "FCC-02", img: kamleshSirImg, content: "FLUX combines innovation with enthusiasm. We offer a vibrant platform for students to excel in both hardware and software engineering, with a special emphasis on robotics. Every year, during Samrat Utsav, FLUX organizes extraordinary competitions." }
  ];

  const recentNews = [
    "LOG: TECHNOVISION IS COMING... PREPARE YOUR GEAR.",
    "LOG: REGISTRATIONS OPEN FOR ROBOTICS WORKSHOP 2.0.",
    "LOG: ACCESS CORE DATABASE BELOW."
  ];

  return (
    <div id="behind-flux" className="relative min-h-screen w-full bg-white dark:bg-[#030303] text-slate-900 dark:text-white font-sans py-12 lg:py-24 overflow-x-hidden border-t border-slate-200 dark:border-white/5 transition-colors duration-500">

      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none opacity-10"
        style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        <header className="mb-12 lg:mb-20 space-y-4 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-4">
            <div className="h-[2px] w-8 lg:w-12 bg-cyan-500" />
            <span className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] lg:text-xs tracking-[0.3em] lg:tracking-[0.5em] uppercase font-bold">Administration & Guidance</span>
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
            Behind <span className="bg-gradient-to-r from-cyan-600 via-slate-500 to-purple-600 dark:from-cyan-400 dark:via-white dark:to-purple-500 text-transparent bg-clip-text">Flux</span>
          </h2>
        </header>

        <section className="mb-16 lg:mb-32">
          <div className="relative group max-w-5xl mx-auto">
            <div className="hidden lg:block absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-500 z-20" />
            <div className="hidden lg:block absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-500 z-20" />
            <div className="hidden lg:block absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg blur opacity-20" />
            <div className="relative bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-6 sm:p-10 lg:p-14 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 rounded-xl lg:rounded-sm">
              <div className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 flex-shrink-0">
                <div className="hidden lg:block absolute -inset-4 border border-cyan-500/30 rounded-full animate-[spin_30s_linear_infinite]" />
                <img src={director.img} alt={director.name} className="w-full h-full object-cover rounded-full border-2 lg:border-4 border-cyan-500 relative z-20" />
              </div>
              <div className="flex-1 space-y-4 lg:space-y-6 text-center lg:text-left w-full">
                <div>
                  <span className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] tracking-[0.3em] block mb-2">{director.id} // COMMAND_CENTER</span>
                  <h3 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight uppercase">{director.name}</h3>
                  <p className="text-sm sm:text-xl text-purple-600 dark:text-purple-400 font-mono mt-1 lg:mt-2 uppercase tracking-widest font-bold">{director.role}</p>
                </div>
                <div className="text-sm md:text-base text-slate-600 dark:text-gray-300 leading-relaxed border-l-0 lg:border-l-2 border-cyan-500/30 lg:pl-6 italic text-justify lg:text-left">
                  <ScrollTypewriter content={director.content} delay={10} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-16 lg:mb-24">
          {mentors.map((fac, i) => <FacultyCard key={fac.id} fac={fac} />)}
        </section>

        {/* TERMINAL NOTICE BOARD SECTION */}
        <section className="mt-8 lg:mt-12 max-w-4xl mx-auto">
          <div className="bg-black dark:bg-zinc-950 border border-cyan-500/30 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-zinc-900 px-3 py-2 border-b border-white/10 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Live_Terminal_Feed</span>
            </div>

            <div className="p-4 sm:p-6 font-mono text-[10px] sm:text-xs md:text-sm text-cyan-400 space-y-4">
              {recentNews.map((news, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <span className="text-white/20 select-none shrink-0">{`0${index + 1}`}</span>
                  <div className="text-cyan-400/90 w-full">
                    <ScrollTypewriter content={news} delay={30} cursor="▋" />
                  </div>
                </div>
              ))}

              {/* PDF & SHEET LINKS IN TERMINAL STYLE */}
              <div className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Flux Members PDF Link */}
                  <div className="group/link">
                    <span className="text-white/20 mr-3">04</span>
                    <span className="text-white">flux_user@system:~$ view --members</span>
                    <a
                      // href="/fluxmembers.pdf"
                      href="https://drive.google.com/file/d/1_XSYKnesAdNPkTqNdI-6JkuWOxKk8NWI/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-3 w-fit bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all rounded-sm group"
                    >
                      <ExternalLink size={16} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Flux_Members_Archive.pdf</span>
                    </a>
                  </div>

                  {/* Attendance Sheet Link */}

                </div>
              </div>

              <div className="flex gap-2 items-center pt-2">
                <span className="text-white shrink-0">flux_user@system:~$</span>
                <span className="w-1.5 h-3 sm:w-2 sm:h-4 bg-cyan-500 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default BehindFlux;