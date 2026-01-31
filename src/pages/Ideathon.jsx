import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, Users, ExternalLink,
    ChevronDown, MessageCircle, Clock,
    Award, Zap, CheckCircle, Mail, Phone
} from 'lucide-react';
import IdeathonPoster from '../assets/events/Events-Posters/IdeathonPoster.jpg';

const TimelineItem = ({ date, title, description, icon: Icon, index, total }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={`relative mb-16 lg:mb-24 last:mb-0 w-full`}>
            {/* Desktop Center Line connection */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-px h-full bg-cyan-500/20 top-0 -z-10" />

            <div className={`flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 w-full group relative`}>

                {/* Date Bubble (Mobile: Left, Desktop: Center) */}
                <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                    <Icon size={20} className="text-cyan-600 dark:text-cyan-400" />
                </div>

                {/* Mobile Line */}
                <div className="lg:hidden absolute left-[35px] top-12 bottom-[-64px] w-0.5 bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent last:hidden" />

                {/* Content Side */}
                <div className={`lg:contents ${isEven ? 'lg:text-right' : 'lg:flex-row-reverse'}`}>

                    {/* Left Side (Even Index: Content, Odd Index: Empty/Date) */}
                    <div className={`${isEven ? 'order-1' : 'order-2'} w-full pl-24 lg:pl-0 pr-0 lg:pr-0`}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className={`bg-white dark:bg-white/5 backdrop-blur-sm border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all relative ${isEven ? 'lg:mr-auto' : 'lg:ml-auto'} shadow-lg dark:shadow-none w-full`}
                        >
                            {/* Desktop Arrow */}
                            <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-t border-l border-slate-200 dark:border-white/10 rotate-45 ${isEven ? '-right-2 border-r-0 border-b-0' : '-left-2 border-t-0 border-l-0 border-r border-b'}`} />

                            <div className="mb-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black tracking-widest uppercase mb-2 border border-cyan-500/20">
                                    {date}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter">{title}</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                                {description}
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Side (Even Index: Empty/Date, Odd Index: Content) */}
                    <div className={`${isEven ? 'order-2' : 'order-1'} hidden lg:block w-full text-center px-4`}>
                        <span className="text-5xl font-black text-slate-200 dark:text-white/5 uppercase select-none font-outline-2">
                            Phase {index + 1}
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.07] transition-colors shadow-sm dark:shadow-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-6 text-left"
            >
                <span className="text-lg font-bold text-slate-900 dark:text-slate-200">{question}</span>
                <ChevronDown
                    className={`text-cyan-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-white/5 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Ideathon = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans transition-colors duration-500">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] bg-cyan-500/10 blur-[120px] rounded-full opacity-30" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

                {/* HERO SECTION */}
                <div className="text-center max-w-4xl mx-auto mb-20 md:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mb-6"
                    >
                        <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                        <span className="text-cyan-600 dark:text-cyan-500 font-mono text-sm tracking-[0.2em] uppercase">Registrations Open</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8 text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:via-slate-200 dark:to-slate-500"
                    >
                        Flux <span className="text-cyan-600 dark:text-cyan-500">Hard-Wired</span> 1.0
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        The ultimate hardware ideathon where innovation meets reality. Transform your wildest concepts into defensible hardware solutions.
                    </motion.p>
                </div>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
                    {/* Main Content */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl dark:shadow-none">
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-slate-900 dark:text-white">
                                <Zap className="text-cyan-600 dark:text-cyan-500" />
                                About The Event
                            </h2>
                            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                                <p>
                                    <strong className="text-slate-900 dark:text-white">FLUX Hard-Wired 1.0</strong> is a competitive hardware-focused innovation challenge.
                                    This isn't just about coding; it's about the physical world. Participants will be evaluated on their ability
                                    to convert raw ideas into logically sound, well-structured, and feasible hardware solutions.
                                </p>
                                <p>
                                    Whether it's IoT, Robotics, Embedded Systems, or Sustainable Energy, showcase your blueprint for the future.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-sm">
                                        <Users size={16} /> Team: 2-3 Members
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-sm">
                                        <MapPin size={16} /> Mode: Online
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a
                                href="https://unstop.com/hackathons/flux-hard-wired-10-samrat-ashok-technological-institute-sati-vidisha-1632035?lb=B38kelc2&utm_medium=Share&utm_source=vedangoy6967&utm_campaign=Online_coding_challenge"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center justify-center gap-2 p-6 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-2xl font-bold text-xl text-white transition-transform hover:scale-[1.02] shadow-lg shadow-cyan-900/20"
                            >
                                <div className="flex items-center gap-2">
                                    <span>Register on Unstop</span>
                                    <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                                <span className="text-xs font-mono opacity-80 font-normal uppercase tracking-widest">Apply Now</span>
                            </a>

                            <a
                                href="https://chat.whatsapp.com/CHoWGztZFaTE4WTtWZVRGj?mode=gi_tapp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col items-center justify-center gap-2 p-6 bg-green-500/10 dark:bg-green-600/20 border border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/20 dark:hover:bg-green-600/30 rounded-2xl font-bold text-xl transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <MessageCircle size={24} />
                                    <span>Join Group</span>
                                </div>
                                <span className="text-xs font-mono opacity-70 font-normal uppercase tracking-widest">Official Updates</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Stats / Logo Placeholder */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="h-full bg-gradient-to-br from-slate-200 dark:from-slate-900 to-transparent border border-slate-200 dark:border-white/10 rounded-3xl p-1 flex items-center justify-center overflow-hidden relative">
                            <div className="relative w-full h-auto rounded-2xl overflow-hidden group">
                                {/* Glitch Effect Styles */}
                                <style jsx>{`
                                    @keyframes glitch-anim-1 {
                                        0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
                                        5% { clip-path: inset(10% 0 10% 0); transform: translate(2px, -1px); }
                                        10% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
                                        15% { clip-path: inset(40% 0 50% 0); transform: translate(2px, -1px); }
                                        20% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, 2px); }
                                        25% { clip-path: inset(60% 0 15% 0); transform: translate(1px, -2px); }
                                        30% { clip-path: inset(30% 0 40% 0); transform: translate(-2px, 1px); }
                                        35% { clip-path: inset(70% 0 20% 0); transform: translate(2px, -1px); }
                                        40% { clip-path: inset(15% 0 70% 0); transform: translate(-1px, 2px); }
                                        45% { clip-path: inset(50% 0 30% 0); transform: translate(1px, -2px); }
                                        50% { clip-path: inset(25% 0 65% 0); transform: translate(-2px, 1px); }
                                        55% { clip-path: inset(45% 0 10% 0); transform: translate(2px, -1px); }
                                        60% { clip-path: inset(5% 0 85% 0); transform: translate(-1px, 2px); }
                                        65% { clip-path: inset(55% 0 20% 0); transform: translate(1px, -2px); }
                                        70% { clip-path: inset(35% 0 55% 0); transform: translate(-2px, 1px); }
                                        75% { clip-path: inset(65% 0 10% 0); transform: translate(2px, -1px); }
                                        80% { clip-path: inset(20% 0 35% 0); transform: translate(-1px, 2px); }
                                        85% { clip-path: inset(75% 0 5% 0); transform: translate(1px, -2px); }
                                        90% { clip-path: inset(10% 0 50% 0); transform: translate(-2px, 1px); }
                                        95% { clip-path: inset(40% 0 25% 0); transform: translate(2px, -1px); }
                                        100% { clip-path: inset(15% 0 75% 0); transform: translate(-1px, 2px); }
                                    }
                                    @keyframes glitch-anim-2 {
                                        0% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); }
                                        5% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 2px); }
                                        10% { clip-path: inset(30% 0 20% 0); transform: translate(2px, -1px); }
                                        15% { clip-path: inset(15% 0 80% 0); transform: translate(-1px, 2px); }
                                        20% { clip-path: inset(55% 0 10% 0); transform: translate(1px, -2px); }
                                        25% { clip-path: inset(45% 0 40% 0); transform: translate(-2px, 1px); }
                                        30% { clip-path: inset(5% 0 85% 0); transform: translate(2px, -1px); }
                                        35% { clip-path: inset(65% 0 20% 0); transform: translate(-1px, 2px); }
                                        40% { clip-path: inset(25% 0 55% 0); transform: translate(1px, -2px); }
                                        45% { clip-path: inset(70% 0 15% 0); transform: translate(-2px, 1px); }
                                        50% { clip-path: inset(20% 0 50% 0); transform: translate(2px, -1px); }
                                        55% { clip-path: inset(50% 0 30% 0); transform: translate(-1px, 2px); }
                                        60% { clip-path: inset(85% 0 5% 0); transform: translate(1px, -2px); }
                                        65% { clip-path: inset(10% 0 70% 0); transform: translate(-2px, 1px); }
                                        70% { clip-path: inset(35% 0 25% 0); transform: translate(2px, -1px); }
                                        75% { clip-path: inset(60% 0 10% 0); transform: translate(-1px, 2px); }
                                        80% { clip-path: inset(15% 0 65% 0); transform: translate(1px, -2px); }
                                        85% { clip-path: inset(75% 0 5% 0); transform: translate(-2px, 1px); }
                                        90% { clip-path: inset(30% 0 45% 0); transform: translate(2px, -1px); }
                                        95% { clip-path: inset(55% 0 20% 0); transform: translate(-1px, 2px); }
                                        100% { clip-path: inset(5% 0 80% 0); transform: translate(1px, -2px); }
                                    }
                                    .glitch-layer {
                                        background-image: url('${IdeathonPoster}');
                                        background-size: cover;
                                        background-position: center;
                                    }
                                    .glitch-1 {
                                        animation: glitch-anim-1 2.5s infinite linear alternate-reverse;
                                    }
                                    .glitch-2 {
                                        animation: glitch-anim-2 3s infinite linear alternate-reverse;
                                    }
                                `}</style>

                                {/* Base Image - Using img tag to preserve aspect ratio */}
                                <img
                                    src={IdeathonPoster}
                                    alt="Ideathon Poster"
                                    className="w-full h-auto object-cover relative z-10 block"
                                />

                                {/* Glitch Layers - Absolute overlay matching parent dimensions */}
                                <div className="absolute inset-0 glitch-layer glitch-1 opacity-50 mix-blend-screen text-red-500 translate-x-[2px] z-20 pointer-events-none" />
                                <div className="absolute inset-0 glitch-layer glitch-2 opacity-50 mix-blend-screen text-cyan-500 -translate-x-[2px] z-20 pointer-events-none" />

                                {/* Scanline Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-30 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* TIMELINE SECTION */}
                <div className="max-w-6xl mx-auto mb-32">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-slate-900 dark:text-white">Event <span className="text-cyan-600 dark:text-cyan-500">Timeline</span></h2>
                        <div className="h-1 w-20 bg-cyan-500 mx-auto rounded-full" />
                    </div>

                    <div className="relative">
                        {/* Desktop Central Line */}
                        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-4 bottom-12 w-0.5 bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0" />

                        <div className="space-y-4">
                            <TimelineItem
                                index={0}
                                date="Until 05 Feb"
                                title="Registration"
                                description="Register on Unstop and submit your initial idea abstract. This is your entry ticket."
                                icon={Calendar}
                            />
                            <TimelineItem
                                index={1}
                                date="06 Feb"
                                title="Screening"
                                description="Expert panel reviews all submissions. The most innovative and feasible hardware ideas get shortlisted."
                                icon={Zap}
                            />
                            <TimelineItem
                                index={2}
                                date="07 Feb"
                                title="Announcement"
                                description="List of shortlisted teams is released. Selected teams prepare for the final presentation."
                                icon={Award}
                            />
                            <TimelineItem
                                index={3}
                                date="08-09 Feb"
                                title="Mentorship"
                                description="Refine your models with guidance from industry experts before the final showdown."
                                icon={Users}
                            />
                            <TimelineItem
                                index={4}
                                date="10 Feb"
                                title="Grand Finale"
                                description="Present your hardware solution online to the jury. Winners take it all."
                                icon={Clock}
                                isLast={true}
                            />
                        </div>
                    </div>
                </div>

                {/* FAQ SECTION */}
                <div className="max-w-3xl mx-auto mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-slate-900 dark:text-white">Frequently Asked <span className="text-cyan-600 dark:text-cyan-500">Questions</span></h2>
                        <p className="text-slate-500 dark:text-slate-400">Got questions? We've got answers.</p>
                    </div>

                    <div className="space-y-4">
                        <FAQItem
                            question="Who can participate?"
                            answer="Students from any college or university with a passion for hardware and innovation are welcome to participate. Teams should consist of 2-3 members."
                        />
                        <FAQItem
                            question="Is there a registration fee?"
                            answer="No, participation in Flux Hard-Wired 1.0 is completely free for all shortlisted teams."
                        />
                        <FAQItem
                            question="What if I don't have a team?"
                            answer="You can join our WhatsApp group to find other participants looking for teammates, or register individually and we'll try to match you."
                        />
                        <FAQItem
                            question="Is this an online or offline event?"
                            answer="The event is primarily online, allowing you to participate from anywhere. However, the final presentation might have hybrid options (details to be announced)."
                        />
                        <FAQItem
                            question="What themes can we choose from?"
                            answer="You can choose from a wide range of hardware domains including IoT, Robotics, Automobile, Sustainable Tech, and more. Innovation is the only constraint."
                        />
                    </div>
                </div>

                {/* FOOTER CONTACT */}
                <div className="text-center pb-0 border-t border-slate-200 dark:border-white/10 pt-10">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Need Help?</h2>
                    <div className="flex flex-col items-center gap-4">
                        <a href="/contact" className="text-slate-600 dark:text-slate-400 font-medium text-lg hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors">Contact Us</a>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <a href="mailto:vedansh27ai074@satiengg.in" className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-500 transition-colors">
                                <Mail size={18} />
                                <span>vedansh27ai074@satiengg.in</span>
                            </a>
                            {/* <a href="tel:+916265320187" className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-500 transition-colors">
                                <Phone size={18} />
                                <span>+91 62653 20187</span>
                            </a> */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Ideathon;
