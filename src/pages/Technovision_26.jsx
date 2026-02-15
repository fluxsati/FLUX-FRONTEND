import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, MessageCircle, Info,
    ChevronDown, ChevronUp, Trophy, Clock, HelpCircle, Phone,
    Download, ExternalLink, Bot, CableCar, Presentation, Lightbulb, Mail
} from 'lucide-react';


// Assets
import poster from '../assets/events/technovision_2026/poster.jpeg';
import bannerRopeway from '../assets/events/technovision_2026/1.png';
import bannerRobo from '../assets/events/technovision_2026/2.png';
import bannerModel from '../assets/events/technovision_2026/3.png';
import roboIcon from '../assets/events/technovision_2026/robo_rumble_icon.webp';



const Technovision = () => {
    const [activeTab, setActiveTab] = useState(null); // 'ropeway', 'robo', 'model'
    const [activeTooltipIndex, setActiveTooltipIndex] = useState(null);

    // Tooltip Sequence Logic
    React.useEffect(() => {
        let timeouts = [];
        let intervalId = null;

        // Reset tooltip state when tab changes
        setActiveTooltipIndex(null);

        if (activeTab === null) {
            const eventKeys = Object.keys(events);
            const cycleDuration = eventKeys.length * 5000; // 3 * 2000 = 6000ms

            const runSequence = () => {
                eventKeys.forEach((_, index) => {
                    // Show tooltip
                    const showTimeout = setTimeout(() => {
                        setActiveTooltipIndex(index);
                    }, index * 5000);

                    // Hide tooltip
                    const hideTimeout = setTimeout(() => {
                        setActiveTooltipIndex((prev) => (prev === index ? null : prev));
                    }, (index * 8000) + 4000);

                    timeouts.push(showTimeout, hideTimeout);
                });
            };

            // Start sequence immediately (or after short delay)
            const startDelay = setTimeout(() => {
                runSequence();
                intervalId = setInterval(runSequence, cycleDuration);
            }, 5000);

            timeouts.push(startDelay);
        }

        return () => {
            timeouts.forEach(clearTimeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, [activeTab]);

    const events = {
        ropeway: {
            id: 'ropeway',
            title: 'Ropeway Racing',
            icon: <CableCar size={32} />,
            banner: bannerRopeway,
            registrationLink: 'https://unstop.com/hackathons/ropeway-racing-samrat-ashok-technological-institute-sati-vidisha-1640929?lb=wr0VBQwi',
            description: "A hardware-based robotics competition where contestants will be tasked with designing and building robots capable of effectively moving across a slackline/ropeway. Teams will compete against each other in a round-robin format.",
            rules: [
                "The bot must be lightweight (under 1 kilogram).",
                "The robot must be capable of moving effectively across the ropeway/slackline.",
                "The bot may be based on a fun or entertaining theme.",
                "Design must comply with all safety and hardware constraints."
            ],
            prizes: [
                // "Winner: Exciting Cash Prizes & Certificates",
                "Top-3 Teams: Certificates & Goodies",
                "Participation Certificates for all"
            ],
            timeline: [
                { time: "Registration Deadline", event: "18 Feb 2026" },
                { time: "Event Day", event: "19-20 Feb 2026" },
                { time: "Round-Robin Matches", event: "Day 1" },
                { time: "Finals", event: "Day 2" }
            ]
        },
        robo: {
            id: 'robo',
            title: 'Robo Rumble',
            icon: <img src={roboIcon} alt="Robo Rumble" className="w-full h-full object-cover rounded-full" />,
            banner: bannerRobo,
            registrationLink: 'https://unstop.com/p/roborumble-samrat-ashok-technological-institute-1641998',
            description: "An intensive hardware-focused competition where students create robots to navigate varying terrains and specialized hurdles. The competition track features unique obstacles and technical challenges.",
            rules: [
                "Bots must be capable of traversing rough terrain.",
                "Technical inspection will be conducted before the event.",
                "Time limit constraints apply for each round.",
                "Safety gears are mandatory for bot handling."
            ],
            prizes: [
                "Winner: Certificates & Special Gifts",
                "Participation Certificates for all"
            ],
            timeline: [
                { time: "Registration Deadline", event: "18 Feb 2026" },
                { time: "Event Day", event: "19-20 Feb 2026" },
                { time: "Inspection", event: "Day 1 Morning" },
                { time: "Rounds", event: "Day 1 Afternoon" }
            ]
        },
        model: {
            id: 'model',
            title: 'Model Presentation',
            icon: <Lightbulb size={32} />,
            banner: bannerModel,
            registrationLink: 'https://unstop.com/hackathons/flux-hard-wired-10-showcase-samrat-ashok-technological-institute-sati-vidisha-1641988',
            description: "An innovation-driven technical event where participants present their hardware robots, kits, and working models. The event focuses on structured presentation, technical explanation, and critical evaluation.",
            rules: [
                "Maximum team size: 4 members.",
                "Minimum team size: 1 member.",
                "Projects must be hardware-based (robots, kits, or working models).",
                "School students in Vidisha are also eligible."
            ],
            prizes: [
                "Winner:Goodies & Certificates",
                "Participation Certificates for all"
            ],
            timeline: [
                { time: "Registration Deadline", event: "18 Feb 2026" },
                { time: "Event Day", event: "19-20 Feb 2026" },
                { time: "Presentation", event: "Day 1 & 2" }
            ]
        }
    };

    const currentEvent = activeTab ? events[activeTab] : null;

    return (
        <div className="bg-slate-50 dark:bg-[#050505] min-h-screen text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-cyan-500/30">

            {/* Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative z-10">

                {/* Header Section */}
                <section className="relative pt-32 pb-12 px-6">
                    <div className="max-w-7xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-4 py-2 rounded-full border border-cyan-500/20"
                        >
                            <Calendar size={16} />
                            <span className="text-sm font-bold uppercase tracking-wider">19 - 20 Feb 2026</span>
                            <span className="mx-2 text-cyan-500/30">|</span>
                            <a
                                href="https://maps.app.goo.gl/fTdZm1HhBHnK9JYEA"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 hover:text-cyan-500 transition-colors"
                            >
                                <MapPin size={16} />
                                <span className="text-sm font-bold uppercase tracking-wider">SU Ground</span>
                            </a>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-4xl md:text-8xl lg:text-9xl font-black italic tracking-tighter uppercase leading-none bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-white/50"
                        >
                            Technovision<span className="text-cyan-500">.</span>
                        </motion.h1>


                    </div>
                </section>

                {/* Poster & Quick Overview */}
                <section className="max-w-7xl mx-auto px-6 mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
                        {/* New Cyber-Glitch Poster */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative max-w-xs md:max-w-sm mx-auto"
                        >
                            <style>{`
                                @keyframes cyber-glitch-1 {
                                    0% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); transform: translate(0); opacity: 0; }
                                    2% { clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%); transform: translate(-5px, 5px); opacity: 0.5; }
                                    4% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); transform: translate(5px, -5px); opacity: 0.5; }
                                    6% { clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%); transform: translate(5px, 5px); opacity: 0.5; }
                                    8% { clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%); transform: translate(0); opacity: 0; }
                                    100% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); transform: translate(0); opacity: 0; }
                                }
                                @keyframes cyber-glitch-2 {
                                    0% { clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); transform: translate(-5px, 0); opacity: 0; }
                                    4% { clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%); transform: translate(5px, 0); opacity: 0.5; }
                                    8% { clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%); transform: translate(0); opacity: 0.5; }
                                    12% { clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%); transform: translate(-5px, 5px); opacity: 0.5; }
                                    16% { clip-path: polygon(0 40%, 100% 40%, 100% 40%, 0 40%); transform: translate(5px, -5px); opacity: 0.5; }
                                    20% { clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%); transform: translate(0); opacity: 0; }
                                    100% { clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); transform: translate(-5px, 0); opacity: 0; }
                                }
                                @keyframes cyber-flash {
                                    0%, 95%, 100% { opacity: 0; }
                                    96% { opacity: 0.3; filter: brightness(1.5) contrast(1.2); }
                                    98% { opacity: 0; }
                                }
                                .cyber-glitch-1 {
                                    animation: cyber-glitch-1 2s infinite linear alternate-reverse;
                                }
                                .cyber-glitch-2 {
                                    animation: cyber-glitch-2 3s infinite linear alternate-reverse;
                                }
                            `}</style>

                            <div className="relative rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.15)] bg-black border border-cyan-500/30">

                                {/* Main Image */}
                                <img
                                    src={poster}
                                    alt="Technovision Poster"
                                    className="w-full h-full object-cover relative z-10"
                                />

                                {/* Glitch Layers - Continuous */}
                                <div className="absolute inset-0 cyber-glitch-1 mix-blend-color-dodge z-20 pointer-events-none">
                                    <img src={poster} className="w-full h-full object-cover filter contrast-150 brightness-125 sepia-[0.5] hue-rotate-[-30deg]" />
                                </div>
                                <div className="absolute inset-0 cyber-glitch-2 mix-blend-exclusion z-20 pointer-events-none">
                                    <img src={poster} className="w-full h-full object-cover filter contrast-125 brightness-150 sepia-[0.3] hue-rotate-[90deg] translate-x-2" />
                                </div>

                                {/* Flash Effect */}
                                <div className="absolute inset-0 bg-white mix-blend-overlay z-30 pointer-events-none animate-[cyber-flash_1s_infinite]" />

                                {/* Digital Noise Detail */}
                                <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay z-30 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />




                            </div>
                        </motion.div>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold uppercase tracking-tight">
                                Quick <span className="text-cyan-500">Overview</span>
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                                Technovision 2026 is the premier technical fest of Samrat Ashok Technological Institute, organized by the Technical Club 'Flux'. It brings together the brightest minds to compete in high-octane robotics and innovation challenges. Witness the clash of metal and code in Ropeway Racing, Robo Rumble, and Model Presentation.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                                    <h3 className="text-3xl font-black text-cyan-500 mb-1">3+</h3>
                                    <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Mega Events</p>
                                </div>
                                <div className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
                                    <h3 className="text-2xl font-black text-cyan-500 mb-1">
                                        Rewards
                                    </h3>
                                    <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 leading-tight">
                                        Goodies & Certificates
                                    </p>
                                </div>

                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex justify-center gap-4"
                            >
                                <a
                                    href="https://chat.whatsapp.com/ITmlgvbmiM7Bu8GGWddYxc?mode=gi_t"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-500/20"
                                >
                                    <MessageCircle size={20} /> Join WhatsApp Group
                                </a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Event Toggles */}
                <section className="max-w-7xl mx-auto px-6 mb-12">
                    <div className="flex flex-row flex-wrap justify-center items-center gap-4 md:gap-16">
                        {Object.values(events).map((event) => (
                            <button
                                key={event.id}
                                onClick={() => setActiveTab(activeTab === event.id ? null : event.id)}
                                className="group relative flex flex-col items-center gap-3 md:gap-4 focus:outline-none"
                            >
                                <div className={`
                  w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2
                  ${activeTab === event.id
                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] md:shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                                        : 'bg-slate-200 dark:bg-white/5 border-transparent text-slate-400 hover:border-cyan-500/50 hover:text-cyan-500'}
                `}>
                                    <div className="scale-75 md:scale-100 flex items-center justify-center w-full h-full">
                                        {event.icon}
                                    </div>
                                </div>
                                <span className={`
                  text-[10px] md:text-sm font-bold uppercase tracking-widest transition-colors
                  ${activeTab === event.id ? 'text-cyan-500' : 'text-slate-500 group-hover:text-cyan-500'}
                `}>
                                    {event.title}
                                </span>

                                {/* Sequential Tooltip */}
                                <AnimatePresence>
                                    {activeTooltipIndex === Object.keys(events).indexOf(event.id) && !activeTab && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute -top-10 bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none"
                                        >
                                            Click Me!
                                            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-cyan-500 rotate-45" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Connector Line for visual flow (optional) */}
                                {activeTab === event.id && (
                                    <motion.div
                                        layoutId="connector"
                                        className="absolute -bottom-12 w-1 h-8 md:h-12 bg-gradient-to-b from-cyan-500 to-transparent"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Dynamic Content Section */}
                <AnimatePresence mode="wait">
                    {currentEvent && (
                        <motion.section
                            key={currentEvent.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="max-w-7xl mx-auto px-6 pb-24"
                        >
                            <div className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl">

                                {/* Banner Image */}
                                <div className="relative text-center bg-black">
                                    <img
                                        src={currentEvent.banner}
                                        alt={`${currentEvent.title} Banner`}
                                        className="w-full h-auto opacity-90"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                                    <div className="absolute bottom-8 left-8">
                                        <h2 className="text-2xl md:text-6xl font-black italic uppercase text-white tracking-tighter">
                                            {currentEvent.title}
                                        </h2>
                                    </div>
                                </div>

                                <div className="p-8 md:p-12 space-y-12">

                                    {/* Action Bar */}
                                    <div className="flex flex-wrap gap-4 border-b border-slate-200 dark:border-white/10 pb-8">
                                        {currentEvent.registrationLink && currentEvent.registrationLink !== '#' && (
                                            <a
                                                href={currentEvent.registrationLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-all uppercase tracking-wider"
                                            >
                                                Register Now <ExternalLink size={18} />
                                            </a>
                                        )}


                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                                        {/* Left Column: Description & Rules */}
                                        <div className="space-y-8">
                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-wider text-cyan-500 mb-4 flex items-center gap-2">
                                                    <Info size={20} /> About Event
                                                </h3>
                                                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg">
                                                    {currentEvent.description}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black uppercase tracking-wider text-cyan-500 mb-4 flex items-center gap-2">
                                                    <Bot size={20} /> Key Rules
                                                </h3>
                                                <ul className="space-y-3">
                                                    {currentEvent.rules.map((rule, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-gray-400">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0" />
                                                            {rule}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Right Column: Timeline & Prizes */}
                                        <div className="space-y-8">
                                            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                                                <h3 className="text-xl font-black uppercase tracking-wider text-cyan-500 mb-6 flex items-center gap-2">
                                                    <Clock size={20} /> Event Timeline
                                                </h3>
                                                <div className="space-y-4">
                                                    {currentEvent.timeline.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center border-b border-slate-200 dark:border-white/5 last:border-0 pb-3 last:pb-0">
                                                            <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">{item.event}</span>
                                                            <span className="font-bold text-slate-900 dark:text-white">{item.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-2xl border border-amber-500/20">
                                                <h3 className="text-xl font-black uppercase tracking-wider text-amber-500 mb-6 flex items-center gap-2">
                                                    <Trophy size={20} /> Prize Pool
                                                </h3>
                                                <ul className="space-y-3">
                                                    {currentEvent.prizes.map((prize, idx) => (
                                                        <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-amber-100/80">
                                                            <Trophy size={14} className="text-amber-500" />
                                                            {prize}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* FAQs Section */}
                <section className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200 dark:border-white/10">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-center mb-12">
                        Frequently Asked <span className="text-cyan-500">Questions</span>
                    </h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is there any registration fee?", a: "Yes, there is a some amount of registration fee for other students but for SATI students it is free." },
                            { q: "Can I participate in multiple events?", a: "Yes, you can participate in multiple events as long as the schedules do not clash. Please check the timeline." },
                            { q: "Are teams from other colleges allowed?", a: "Yes, Technovision 2026 welcomes participation from other institutes and schools." },
                            { q: "Will certificates be provided?", a: "Yes, all participants will receive certificates of participation, and winners will get certificates and goodies." }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                    <span className="font-bold text-lg">{faq.q}</span>
                                    <ChevronDown className="transition-transform group-open:rotate-180 text-cyan-500" />
                                </summary>
                                <div className="px-6 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <div className="text-center pb-0 border-t border-slate-200 dark:border-white/10 pt-10 mb-10">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Need Help?</h2>
                    <div className="flex flex-col items-center gap-4">
                        <a href="/contact" className="text-slate-600 dark:text-slate-400 font-medium text-lg hover:text-cyan-600 dark:hover:text-cyan-500 transition-colors">Contact Us</a>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <a href="mailto:vedansh27ai074@satiengg.in" className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-500 transition-colors">
                                <Mail size={18} />
                                <span>vedansh27ai074@satiengg.in</span>
                            </a>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-2">
                            {/* <a href="tel:+919179736005" className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-500 transition-colors">
                            <Phone size={18} />
                            <span>Himanshu Deshmukh - 9179736005</span>
                        </a> */}
                            <a href="tel:+916266059669" className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-500 transition-colors">
                                <Phone size={18} />
                                <span>Riddhi Agrawal - 6266059669</span>
                            </a>
                            <a href="tel:+919302276804" className="flex items-center gap-2 text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-500 transition-colors">
                                <Phone size={18} />
                                <span>Devansh Patel - 9302276804</span>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Technovision;
