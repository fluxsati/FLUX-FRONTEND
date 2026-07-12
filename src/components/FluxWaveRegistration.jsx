import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Users, FileText, Globe, Code, Video, LayoutTemplate } from 'lucide-react';

const FluxWaveRegistration = () => {
    const [activeRound, setActiveRound] = useState(0);
    const [numMembers, setNumMembers] = useState(2);
    const [selectedDomain, setSelectedDomain] = useState('Internet of Things (IoT) & Hardware');

    const rounds = [
        { id: 0, title: 'Zeroth', num: '0' },
        { id: 1, title: 'First', num: '1' },
        { id: 2, title: 'Second', num: '2' },
    ];

    const domains = [
        'Internet of Things (IoT) & Hardware',
        'Artificial Intelligence (AI)',
        'Cyber Security',
        'Web3 & Blockchain',
        'Open Innovation',
        'Game Development'
    ];

    const handleFormSubmit = (e, round) => {
        e.preventDefault();
        // Console log for UI purposes (backend not connected)
        console.log(`Submitted Round ${round}`);
    };

    return (
        <section id="registration" className="relative w-full px-6 md:px-12 lg:px-24 py-16 z-10 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4" style={{ fontFamily: '"Russo One", sans-serif' }}>
                        Registration Form
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Complete your registration step by step. Each round requires an independent submission.
                    </p>
                </div>

                {/* Round Toggles */}
                <div className="flex flex-row justify-center items-end gap-8 md:gap-24 mb-12 relative">
                    {rounds.map((round, index) => (
                        <div key={round.id} className="relative flex flex-col items-center">
                            <span className={`text-sm md:text-lg font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${activeRound === round.id ? 'text-cyan-500' : 'text-slate-500'}`}>
                                {round.title}
                            </span>
                            
                            <button
                                onClick={() => setActiveRound(round.id)}
                                className={`
                                    relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2
                                    ${activeRound === round.id
                                        ? 'bg-slate-800 dark:bg-white/10 border-cyan-500 text-cyan-500 scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                                        : 'bg-slate-300 dark:bg-[#1a1a1a] border-transparent text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400'
                                    }
                                `}
                            >
                                <span className="font-bold text-4xl md:text-5xl" style={{ fontFamily: '"Russo One", sans-serif' }}>
                                    {round.num}
                                </span>
                            </button>

                            {/* Connecting line to the form container */}
                            {activeRound === round.id && (
                                <motion.div
                                    layoutId="formConnector"
                                    className="absolute -bottom-12 w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent"
                                />
                            )}
                        </div>
                    ))}
                    
                    {/* Horizontal Connector Line between bubbles (background) */}
                    {/* <div className="absolute top-[100%] left-[1%] right-[1%] h-0.5 bg-slate-300 dark:bg-white/10 -z-10 hidden md:block"></div> */}
                </div>

                {/* Form Container */}
                <div className="relative mt-12 bg-white/50 dark:bg-[#0f1115]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-12 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {activeRound === 0 && (
                            <motion.form
                                key="round0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={(e) => handleFormSubmit(e, 0)}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Team Name" icon={<Users className="w-5 h-5" />} placeholder="Enter Team Name" required />
                                    <InputField label="Leader Name" icon={<User className="w-5 h-5" />} placeholder="Enter Leader Name" required />
                                </div>
                                
                                <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <User className="text-cyan-500" /> Leader Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <InputField label="Contact Number" placeholder="+91 1234567890" required />
                                        <InputField label="Email Address" type="email" placeholder="College Email" required />
                                        <InputField label="Enrollment No." placeholder="0108CS..." required />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                                        <label className="text-slate-700 dark:text-slate-300 font-bold text-lg">No. of members in team (2-4)</label>
                                        <div className="w-full md:w-48">
                                            <CustomSelect
                                                value={numMembers}
                                                onChange={setNumMembers}
                                                options={[
                                                    { value: 2, label: '2 Members' },
                                                    { value: 3, label: '3 Members' },
                                                    { value: 4, label: '4 Members' }
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6">
                                        {Array.from({ length: numMembers }).map((_, idx) => (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                key={idx} 
                                                className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5"
                                            >
                                                <div className="md:col-span-2">
                                                    <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Member {idx + 1}</h4>
                                                </div>
                                                <InputField label="Name" placeholder={`Member ${idx + 1} Name`} required />
                                                <InputField label="Enrollment No." placeholder="Enrollment Number" required />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <SubmitButton label="Submit Zeroth Round" />
                            </motion.form>
                        )}

                        {activeRound === 1 && (
                            <motion.form
                                key="round1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={(e) => handleFormSubmit(e, 1)}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Team Name" icon={<Users className="w-5 h-5" />} placeholder="Enter Team Name" required />
                                    <InputField label="Leader Name" icon={<User className="w-5 h-5" />} placeholder="Enter Leader Name" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-slate-700 dark:text-slate-300 font-bold block">Idea Abstract</label>
                                    <textarea 
                                        className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none min-h-[120px]"
                                        placeholder="Brief Description of Idea..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-slate-700 dark:text-slate-300 font-bold block flex items-center gap-2">
                                            <LayoutTemplate className="w-4 h-4" /> Domain
                                        </label>
                                        <CustomSelect 
                                            value={selectedDomain}
                                            onChange={setSelectedDomain}
                                            options={domains.map(d => ({ value: d, label: d }))}
                                        />
                                    </div>
                                    <InputField label="PPT Link" icon={<FileText className="w-5 h-5" />} placeholder="Drive link with viewer access" required />
                                </div>
                                <SubmitButton label="Submit First Round" />
                            </motion.form>
                        )}

                        {activeRound === 2 && (
                            <motion.form
                                key="round2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={(e) => handleFormSubmit(e, 2)}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Team Name" icon={<Users className="w-5 h-5" />} placeholder="Enter Team Name" required />
                                    <InputField label="Leader Name" icon={<User className="w-5 h-5" />} placeholder="Enter Leader Name" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label="Deploy Project Link" icon={<Globe className="w-5 h-5" />} placeholder="Live URL of Project" required />
                                    <InputField label="GitHub Repo URL" icon={<Code className="w-5 h-5" />} placeholder="https://github.com/..." required />
                                </div>

                                <InputField label="Screen Recording" icon={<Video className="w-5 h-5" />} placeholder="Drive link with viewer access" required />
                                
                                <SubmitButton label="Submit Second Round" />
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

const CustomSelect = ({ value, onChange, options, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            >
                <span className="font-medium text-left truncate">{selectedOption.label}</span>
                <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-500' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-[100] w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-between group
                                        ${value === opt.value 
                                            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' 
                                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {opt.label}
                                    {value === opt.value && (
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const InputField = ({ label, icon, type = "text", placeholder, required }) => (
    <div className="space-y-2">
        <label className="text-slate-700 dark:text-slate-300 font-bold block flex items-center gap-2">
            {icon && <span className="text-cyan-500">{icon}</span>}
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type={type}
            placeholder={placeholder}
            required={required}
            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
        />
    </div>
);

const SubmitButton = ({ label }) => (
    <div className="pt-4 flex justify-end">
        <button 
            type="submit"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0f1115]"
        >
            <span className="relative z-10 flex items-center gap-2">
                {label} <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
        </button>
    </div>
);

export default FluxWaveRegistration;
