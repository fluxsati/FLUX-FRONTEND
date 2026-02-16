import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaRobot, FaSatelliteDish, FaArrowRight } from 'react-icons/fa';

const SIREN_VOLUME = 0.1; // Volume level (0.0 to 1.0)

const NotFound = () => {
    const [text, setText] = useState('');
    const [timeLeft, setTimeLeft] = useState(10);
    const fullText = "SYSTEM FAILURE: TRAJECTORY UNKNOWN";
    const navigate = useNavigate();
    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const gainNodeRef = useRef(null);

    // Typing effect
    useEffect(() => {
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < fullText.length) {
                setText(fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingEffect);
            }
        }, 50);

        return () => clearInterval(typingEffect);
    }, []);

    // Siren Sound Effect (Synthesized)
    useEffect(() => {
        const playSiren = () => {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;

                const ctx = new AudioContext();
                audioContextRef.current = ctx;

                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(440, ctx.currentTime);

                // Siren modulation (LFO effect)
                oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
                oscillator.frequency.linearRampToValueAtTime(440, ctx.currentTime + 1.0);
                oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.5);
                oscillator.frequency.linearRampToValueAtTime(440, ctx.currentTime + 2.0);
                oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 2.5);

                gainNode.gain.setValueAtTime(SIREN_VOLUME, ctx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.0); // Fade out

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                oscillator.start();
                oscillator.stop(ctx.currentTime + 3);

                oscillatorRef.current = oscillator;
                gainNodeRef.current = gainNode;
            } catch (e) {
                console.error("Audio playback failed (likely due to play policy):", e);
            }
        };

        playSiren();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Countdown and Redirect Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div className="relative h-screen w-full bg-slate-50 dark:bg-slate-950 text-cyan-600 dark:text-cyan-500 overflow-hidden font-mono flex flex-col items-center justify-center p-4 transition-colors duration-300">
            <style>
                {`
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }

                .glitch-text {
                    animation: glitch 1s infinite;
                    animation-direction: alternate;
                }

                .scanlines {
                    background: linear-gradient(
                        to bottom,
                        rgba(255, 255, 255, 0),
                        rgba(255, 255, 255, 0) 50%,
                        rgba(0, 0, 0, 0.1) 50%,
                        rgba(0, 0, 0, 0.1)
                    );
                    background-size: 100% 4px;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 10;
                    opacity: 0.6;
                }

                .noise-bg {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
                }
                `}
            </style>

            {/* Background Effects */}
            <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none"></div>
            <div className="scanlines pointer-events-none"></div>

            {/* Countdown Toast - Appears in last 5 seconds */}
            <AnimatePresence>
                {timeLeft <= 5 && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        div className="fixed top-4 right-4 z-[200] flex items-center gap-4 bg-red-500/10 dark:bg-red-500/20 border-l-4 border-red-500 backdrop-blur-md px-6 py-4 shadow-[0_0_20px_rgba(239,68,68,0.3)] rounded-r-md"
                    >
                        <div className="relative">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute inset-0"></div>
                            <div className="w-3 h-3 bg-red-500 rounded-full relative z-10"></div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-red-600 dark:text-red-400 font-bold uppercase tracking-wider text-xs">System Override</span>  
                            <span className="text-slate-900 dark:text-white font-bold text-sm">
                                Redirecting to Home in {timeLeft}s
                            </span>
                        </div>
                        <FaArrowRight className="text-red-500 animate-pulse ml-2" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated Grid Background (Simplified) */}
            <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-multiply dark:mix-blend-screen"
                style={{
                    backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) scale(1.5)',
                    transformOrigin: 'center 80%'
                }}>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 text-center space-y-8 max-w-2xl"
            >
                {/* Error Code */}
                <div className="relative">
                    <motion.h1
                        className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-cyan-600 to-red-600 dark:from-red-500 dark:via-cyan-500 dark:to-red-500 glitch-text tracking-tighter"
                        animate={{
                            textShadow: [
                                "0 0 10px rgba(239, 68, 68, 0.5)",
                                "0 0 20px rgba(6, 182, 212, 0.5)",
                                "0 0 10px rgba(239, 68, 68, 0.5)"
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        404
                    </motion.h1>
                    <div className="absolute -inset-1 blur-xl bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full -z-10 animate-pulse"></div>
                </div>

                {/* Error Message */}
                <div className="space-y-4 border-l-2 border-red-500 pl-6 text-left bg-white/60 dark:bg-slate-900/50 p-6 backdrop-blur-sm rounded-r-lg border-y border-r border-slate-200/60 dark:border-slate-800/50 shadow-lg dark:shadow-none">
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-500 mb-2">
                        <FaExclamationTriangle className="animate-bounce" />
                        <h2 className="text-xl font-bold tracking-widest uppercase">Critical Error</h2>
                    </div>

                    <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white h-8">
                        {text}<span className="animate-pulse">_</span>
                    </p>

                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
                        The neural link to this sector has been severed. The requested coordinates do not exist in the current timeline. Immediate relocation is advised.
                    </p>
                </div>

                {/* Action Buttons */}
                <motion.div
                    className="pt-8 flex flex-col sm:flex-row gap-4 justify-center"
                >
                    {/* Recharge/Home Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/"
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500/10 border border-cyan-500/50 hover:bg-cyan-500 hover:text-white text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm overflow-hidden w-full sm:w-auto"
                        >
                            <span className="absolute inset-0 w-0 bg-cyan-500 transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></span>
                            <FaRobot className="text-lg group-hover:rotate-12 transition-transform" />
                            <span>Initiate Reboot</span>
                            {/* Corner Accents */}
                            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500"></span>
                            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500"></span>
                        </Link>
                    </motion.div>

                    {/* Contact/Distress Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            to="/contact"
                            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-600 dark:text-red-400 font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm overflow-hidden w-full sm:w-auto"
                        >
                            <span className="absolute inset-0 w-0 bg-red-500 transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></span>
                            <FaSatelliteDish className="text-lg group-hover:animate-pulse" />
                            <span>Signal Distress</span>
                            {/* Corner Accents */}
                            <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500"></span>
                            <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500"></span>
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Footer Info */}
            <div className="absolute bottom-8 text-cyan-600/40 dark:text-cyan-500/30 text-[10px] uppercase tracking-[0.3em]">
                Error_Log: 0x404_NOT_FOUND // Sector: NULL
            </div>
        </div>
    );
};

export default NotFound;
