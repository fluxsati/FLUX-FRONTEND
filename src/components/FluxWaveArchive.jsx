import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Trophy } from 'lucide-react';
import Typewriter from 'typewriter-effect';
import Carousel3D from './Carousel3D';

// Import actual presentation photos from the FluxWave gallery folder
import img1 from '../assets/events/FluxWave/1.jpg';
import img2 from '../assets/events/FluxWave/2.jpg';
import img3 from '../assets/events/FluxWave/3.jpg';
import img4 from '../assets/events/FluxWave/4.jpg';
import img5 from '../assets/events/FluxWave/5.jpg';
import img6 from '../assets/events/FluxWave/6.jpg';
import img7 from '../assets/events/FluxWave/7.jpg';
import img8 from '../assets/events/FluxWave/8.jpg';
import img9 from '../assets/events/FluxWave/9.jpg';
import img10 from '../assets/events/FluxWave/10.jpg';
import img11 from '../assets/events/FluxWave/11.jpg';

const FluxWaveArchive = () => {
    const carouselImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

    return (
        <section className="relative w-full px-4 sm:px-6 md:px-12 lg:px-24 py-20 z-10 font-sans overflow-hidden">
            <div className="w-full max-w-screen-1xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-200 dark:border-white/10 pb-6 gap-6">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest flex flex-wrap items-center gap-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
                        FLUXWAVE 1.0 
                     
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left Column: Stats & Links & Hall of Fame */}
                    <div className="lg:col-span-5 space-y-12 w-full">
                        
                        {/* Stats Card */}
                        <div className="bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/5 p-5 sm:p-6 md:p-8 shadow-xl" style={{ fontFamily: '"Raleway", sans-serif' }}>
                            <ul className="space-y-6">
                                <li className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-white/10 pb-4 gap-2">
                                    <span className="text-slate-500 dark:text-slate-400 uppercase text-xs sm:text-sm font-bold tracking-widest">Organized</span>
                                    <span className="text-slate-900 dark:text-white font-medium text-base sm:text-lg">August 02, 2025</span>
                                </li>
                                <li className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-white/10 pb-4 gap-2">
                                    <span className="text-slate-500 dark:text-slate-400 uppercase text-xs sm:text-sm font-bold tracking-widest">Hackers</span>
                                    <span className="text-slate-900 dark:text-white font-medium text-base sm:text-lg text-right">250+ Participants</span>
                                </li>
                                <li className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-white/10 pb-4 gap-2">
                                    <span className="text-slate-500 dark:text-slate-400 uppercase text-xs sm:text-sm font-bold tracking-widest">Output</span>
                                    <span className="text-slate-900 dark:text-white font-medium text-base sm:text-lg text-right">51+ Projects Built</span>
                                </li>
                                <li className="flex flex-wrap justify-between items-center border-b border-slate-100 dark:border-white/10 pb-4 gap-2">
                                    <span className="text-slate-500 dark:text-slate-400 uppercase text-xs sm:text-sm font-bold tracking-widest">Champions</span>
                                    <span className="text-slate-900 dark:text-white font-medium text-base sm:text-lg text-right">3 Winning Teams</span>
                                </li>
                                <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-2">
                                    <span className="text-slate-500 dark:text-slate-400 uppercase text-xs sm:text-sm font-bold tracking-widest">Prize Pool</span>
                                    <span className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-base sm:text-lg" style={{ fontFamily: '"Russo One", sans-serif' }}>
                                        Trophies And Certificates
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <a 
                                href="https://fluxonlinehackathon.vercel.app/" 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-900/60 dark:to-blue-900/60 hover:from-cyan-700 hover:to-blue-700 dark:hover:from-cyan-800 dark:hover:to-blue-800 text-white py-4 px-4 sm:px-6 rounded-xl font-bold uppercase tracking-widest transition-all shadow-md dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] border border-cyan-500/30 text-sm sm:text-base text-center"
                            >
                                <ExternalLink size={20} className="shrink-0" /> V1.0 Website
                            </a>
                            <button 
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-4 px-4 sm:px-6 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg border border-slate-300 dark:border-white/10 text-sm sm:text-base text-center"
                                onClick={() => window.open('https://drive.google.com/file/d/1p40aK4vyMOEsW4K_V-PKl7m-3Ap_Tdc5/view', '_blank')}
                            >
                                <FileText size={20} className="shrink-0" /> Archive PDF
                            </button>
                        </div>

                        {/* Winners */}
                        <div className="w-full">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest border-l-4 border-yellow-500 pl-4 flex items-center gap-3" style={{ fontFamily: '"Russo One", sans-serif' }}>
                                <Trophy className="text-yellow-500 shrink-0" /> Hall of Fame
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                                <WinnerCard rank="1st Place" name="Med Squad" color="from-yellow-500 to-yellow-600" />
                                <WinnerCard rank="2nd Place" name="Byte Buddies" color="from-slate-400 to-slate-500" />
                                <WinnerCard rank="3rd Place" name="Vconnect" color="from-orange-500 to-orange-600" />
                                <WinnerCard rank="Special Award" sub="Best Project" name="Nadan Parinde" color="from-cyan-500 to-blue-600" />
                                <WinnerCard rank="Special Award" sub="Best UI/UX" name="InsightMinds" color="from-purple-500 to-pink-600" />
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Description & Carousel */}
                    <div className="lg:col-span-7 space-y-12 w-full">
                        {/* Overview */}
                        <div className="w-full">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest border-l-4 border-cyan-500 pl-4" style={{ fontFamily: '"Russo One", sans-serif' }}>Quick Overview</h3>
                            <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-white dark:bg-white/5 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/5 min-h-[140px] shadow-sm" style={{ fontFamily: '"Raleway", sans-serif' }}>
                                <Typewriter
                                    options={{
                                        wrapperClassName: "text-slate-700 dark:text-slate-300 ",
                                        delay: 20
                                    }}
                                    onInit={(typewriter) => {
                                        typewriter
                                            .typeString("The Technical Club Flux successfully hosted the FLUXWave Online Hackathon 2025, a dynamic innovation sandbox designed to push boundaries. Driven by the vision to forge creative solutions for real-world problems, participants tested their mettle across technology, design, and business viability.<br/><br/>This engaging event challenged students to crash code, hardware, and design together in an ultimate showcase of teamwork and technical expertise, with the final showdown taking place offline.")
                                            .start();
                                    }}
                                />
                            </div>
                        </div>

                        {/* Carousel */}
                        <div className="w-full">
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest border-l-4 border-purple-500 pl-4" style={{ fontFamily: '"Russo One", sans-serif' }}>Glimpses of FluxWave 1.0</h3>
                            <Carousel3D images={carouselImages} />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

const WinnerCard = ({ rank, sub, name, color }) => (
    <div className="bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 p-5 rounded-2xl hover:border-slate-300 dark:hover:border-white/20 transition-colors group flex flex-col justify-center relative overflow-hidden shadow-sm">
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${color}`}></div>
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
            <span className={`text-xs sm:text-sm font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
                {rank}
            </span>
            {sub && <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold">- {sub}</span>}
        </div>
        <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-100 transition-colors">{name}</span>
    </div>
);

export default FluxWaveArchive;
