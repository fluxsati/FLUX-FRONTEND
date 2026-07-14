import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Send, User, Users, FileText, Globe, Code, Video, LayoutTemplate, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { registerFluxWave, fetchFluxWaveStatus } from '../api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const domains = [
    'Internet of Things (IoT) & Hardware',
    'Artificial Intelligence (AI)',
    'Cyber Security',
    'Web3 & Blockchain',
    'Open Innovation',
    'Game Development'
];

const rounds = [
    { id: 0, title: 'Zeroth', num: '0' },
    { id: 1, title: 'First', num: '1' },
    { id: 2, title: 'Second', num: '2' },
];

const emptyMember = () => ({ name: '', enrollment: '' });

const initialRound0 = {
    teamName: '', leaderName: '', contactNumber: '', email: '', enrollment: '',
    numMembers: 2, members: [emptyMember(), emptyMember()],
};
const initialRound1 = {
    teamName: '', leaderName: '', email: '', ideaAbstract: '', domain: domains[0], pptLink: '',
};
const initialRound2 = {
    teamName: '', leaderName: '', email: '', deployLink: '', githubRepo: '', screenRecording: '',
};

const FluxWaveRegistration = () => {
    const [activeRound, setActiveRound] = useState(0);

    const [round0, setRound0] = useState(initialRound0);
    const [round1, setRound1] = useState(initialRound1);
    const [round2, setRound2] = useState(initialRound2);

    // Per-round UI state: submitting, submitted (success), and which rounds
    // this email has already registered for (fetched from the backend).
    const [status, setStatus] = useState({
        submitting: { 0: false, 1: false, 2: false },
        submitted: { 0: false, 1: false, 2: false },
        registeredRounds: [],
    });

    const setSubmitting = (round, val) =>
        setStatus((prev) => ({ ...prev, submitting: { ...prev.submitting, [round]: val } }));

    const setSubmitted = (round, val) =>
        setStatus((prev) => ({ ...prev, submitted: { ...prev.submitted, [round]: val } }));

    // Check the backend for which rounds an email has already registered for,
    // so we can prevent duplicate submissions before the user even hits submit.
    const checkStatusForEmail = useCallback(async (email) => {
        if (!EMAIL_REGEX.test(email)) return;
        try {
            const res = await fetchFluxWaveStatus(email);
            setStatus((prev) => ({ ...prev, registeredRounds: res.data.registeredRounds || [] }));
        } catch {
            // Silently ignore - this is a convenience check, not a hard requirement.
        }
    }, []);

    const handleNumMembersChange = (num) => {
        setRound0((prev) => {
            const members = Array.from({ length: num }, (_, i) => prev.members[i] || emptyMember());
            return { ...prev, numMembers: num, members };
        });
    };

    const handleMemberChange = (idx, field, value) => {
        setRound0((prev) => {
            const members = [...prev.members];
            members[idx] = { ...members[idx], [field]: value };
            return { ...prev, members };
        });
    };

    const validateCommon = (data) => {
        if (!data.teamName.trim() || !data.leaderName.trim()) {
            return 'Team name and leader name are required.';
        }
        if (!EMAIL_REGEX.test(data.email)) {
            return 'Please enter a valid email address.';
        }
        return null;
    };

    const handleFormSubmit = async (e, round) => {
        e.preventDefault();

        if (status.registeredRounds.includes(round)) {
            toast.error(`This email has already been registered for the ${rounds[round].title} Round.`);
            return;
        }

        let payload;
        let validationError;

        if (round === 0) {
            validationError = validateCommon(round0)
                || (!round0.contactNumber.trim() ? 'Contact number is required.' : null)
                || (!round0.enrollment.trim() ? 'Leader enrollment number is required.' : null)
                || (round0.members.some((m) => !m.name.trim() || !m.enrollment.trim())
                    ? 'Please fill in every team member\u2019s name and enrollment number.'
                    : null);
            payload = { ...round0, round: 0 };
        } else if (round === 1) {
            validationError = validateCommon(round1)
                || (!round1.ideaAbstract.trim() ? 'Idea abstract is required.' : null)
                || (!round1.pptLink.trim() ? 'PPT link is required.' : null);
            payload = { ...round1, contactNumber: round0.contactNumber || 'N/A', round: 1 };
        } else {
            validationError = validateCommon(round2)
                || (!round2.deployLink.trim() ? 'Deployed project link is required.' : null)
                || (!round2.githubRepo.trim() ? 'GitHub repo URL is required.' : null)
                || (!round2.screenRecording.trim() ? 'Screen recording link is required.' : null);
            payload = { ...round2, contactNumber: round0.contactNumber || 'N/A', round: 2 };
        }

        if (validationError) {
            toast.error(validationError);
            return;
        }

        setSubmitting(round, true);
        try {
            await registerFluxWave(payload);
            setSubmitted(round, true);
            setStatus((prev) => ({ ...prev, registeredRounds: [...prev.registeredRounds, round] }));
            toast.success(`${rounds[round].title} Round registration submitted successfully!`);
        } catch (err) {
            const message = err.response?.data?.message
                || (err.request ? 'Could not reach the server. Please check your connection.' : 'Something went wrong. Please try again.');
            toast.error(message);
        } finally {
            setSubmitting(round, false);
        }
    };

    return (
        <section id="registration" className="relative w-full px-6 md:px-12 lg:px-24 py-16 z-10 font-sans">
            <Toaster position="bottom-right" reverseOrder={false} />
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
                    {rounds.map((round) => (
                        <div key={round.id} className="relative flex flex-col items-center">
                            <span className={`text-sm md:text-lg font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${activeRound === round.id ? 'text-cyan-500' : 'text-slate-500'}`}>
                                {round.title}
                                {status.registeredRounds.includes(round.id) && (
                                    <CheckCircle2 className="inline-block w-4 h-4 ml-1 text-emerald-500" />
                                )}
                            </span>

                            <button
                                type="button"
                                onClick={() => setActiveRound(round.id)}
                                aria-pressed={activeRound === round.id}
                                aria-label={`${round.title} Round`}
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

                            {activeRound === round.id && (
                                <motion.div
                                    layoutId="formConnector"
                                    className="absolute -bottom-12 w-1 h-12 bg-gradient-to-b from-cyan-500 to-transparent"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Container */}
                <div className="relative mt-12 bg-white/50 dark:bg-[#0f1115]/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-12 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {activeRound === 0 && (
                            status.submitted[0] ? (
                                <SuccessPanel key="round0-success" label="Zeroth Round" />
                            ) : (
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
                                        <InputField label="Team Name" icon={<Users className="w-5 h-5" />} placeholder="Enter Team Name" required
                                            value={round0.teamName} onChange={(v) => setRound0((p) => ({ ...p, teamName: v }))} />
                                        <InputField label="Leader Name" icon={<User className="w-5 h-5" />} placeholder="Enter Leader Name" required
                                            value={round0.leaderName} onChange={(v) => setRound0((p) => ({ ...p, leaderName: v }))} />
                                    </div>

                                    <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5 space-y-6">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            <User className="text-cyan-500" /> Leader Details
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <InputField label="Contact Number" placeholder="+91 1234567890" required
                                                value={round0.contactNumber} onChange={(v) => setRound0((p) => ({ ...p, contactNumber: v }))} />
                                            <InputField label="Email Address" type="email" placeholder="College Email" required
                                                value={round0.email}
                                                onChange={(v) => setRound0((p) => ({ ...p, email: v }))}
                                                onBlur={() => checkStatusForEmail(round0.email)} />
                                            <InputField label="Enrollment No." placeholder="0108CS..." required
                                                value={round0.enrollment} onChange={(v) => setRound0((p) => ({ ...p, enrollment: v }))} />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5">
                                            <label className="text-slate-700 dark:text-slate-300 font-bold text-lg">No. of members in team (2-4)</label>
                                            <div className="w-full md:w-48">
                                                <CustomSelect
                                                    value={round0.numMembers}
                                                    onChange={handleNumMembersChange}
                                                    options={[
                                                        { value: 2, label: '2 Members' },
                                                        { value: 3, label: '3 Members' },
                                                        { value: 4, label: '4 Members' }
                                                    ]}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            {round0.members.map((member, idx) => (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    key={idx}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5"
                                                >
                                                    <div className="md:col-span-2">
                                                        <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Member {idx + 1}</h4>
                                                    </div>
                                                    <InputField label="Name" placeholder={`Member ${idx + 1} Name`} required
                                                        value={member.name} onChange={(v) => handleMemberChange(idx, 'name', v)} />
                                                    <InputField label="Enrollment No." placeholder="Enrollment Number" required
                                                        value={member.enrollment} onChange={(v) => handleMemberChange(idx, 'enrollment', v)} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                    <SubmitButton label="Submit Zeroth Round" submitting={status.submitting[0]} />
                                </motion.form>
                            )
                        )}

                        {activeRound === 1 && (
                            status.submitted[1] ? (
                                <SuccessPanel key="round1-success" label="First Round" />
                            ) : (
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
                                        <InputField label="Team Name" icon={<Users className="w-5 h-5" />} placeholder="Enter Team Name" required
                                            value={round1.teamName} onChange={(v) => setRound1((p) => ({ ...p, teamName: v }))} />
                                        <InputField label="Leader Name" icon={<User className="w-5 h-5" />} placeholder="Enter Leader Name" required
                                            value={round1.leaderName} onChange={(v) => setRound1((p) => ({ ...p, leaderName: v }))} />
                                    </div>

                                    <InputField label="Leader Email" icon={<Mail className="w-5 h-5" />} type="email" placeholder="College Email" required
                                        value={round1.email}
                                        onChange={(v) => setRound1((p) => ({ ...p, email: v }))}
                                        onBlur={() => checkStatusForEmail(round1.email)} />

                                    <div className="space-y-2">
                                        <label className="text-slate-700 dark:text-slate-300 font-bold block">Idea Abstract</label>
                                        <textarea
                                            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none min-h-[120px]"
                                            placeholder="Brief Description of Idea..."
                                            required
                                            value={round1.ideaAbstract}
                                            onChange={(e) => setRound1((p) => ({ ...p, ideaAbstract: e.target.value }))}
                                        ></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-slate-700 dark:text-slate-300 font-bold block flex items-center gap-2">
                                                <LayoutTemplate className="w-4 h-4" /> Domain
                                            </label>
                                            <CustomSelect
                                                value={round1.domain}
                                                onChange={(v) => setRound1((p) => ({ ...p, domain: v }))}
                                                options={domains.map(d => ({ value: d, label: d }))}
                                            />
                                        </div>
                                        <InputField label="PPT Link" icon={<FileText className="w-5 h-5" />} placeholder="Drive link with viewer access" required
                                            value={round1.pptLink} onChange={(v) => setRound1((p) => ({ ...p, pptLink: v }))} />
                                    </div>
                                    <SubmitButton label="Submit First Round" submitting={status.submitting[1]} />
                                </motion.form>
                            )
                        )}

                        {activeRound === 2 && (
                            status.submitted[2] ? (
                                <SuccessPanel key="round2-success" label="Second Round" />
                            ) : (
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
                                        <InputField label="Team Name" icon={<Users className="w-5 h-5" />} placeholder="Enter Team Name" required
                                            value={round2.teamName} onChange={(v) => setRound2((p) => ({ ...p, teamName: v }))} />
                                        <InputField label="Leader Name" icon={<User className="w-5 h-5" />} placeholder="Enter Leader Name" required
                                            value={round2.leaderName} onChange={(v) => setRound2((p) => ({ ...p, leaderName: v }))} />
                                    </div>

                                    <InputField label="Leader Email" icon={<Mail className="w-5 h-5" />} type="email" placeholder="College Email" required
                                        value={round2.email}
                                        onChange={(v) => setRound2((p) => ({ ...p, email: v }))}
                                        onBlur={() => checkStatusForEmail(round2.email)} />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Deploy Project Link" icon={<Globe className="w-5 h-5" />} placeholder="Live URL of Project" required
                                            value={round2.deployLink} onChange={(v) => setRound2((p) => ({ ...p, deployLink: v }))} />
                                        <InputField label="GitHub Repo URL" icon={<Code className="w-5 h-5" />} placeholder="https://github.com/..." required
                                            value={round2.githubRepo} onChange={(v) => setRound2((p) => ({ ...p, githubRepo: v }))} />
                                    </div>

                                    <InputField label="Screen Recording" icon={<Video className="w-5 h-5" />} placeholder="Drive link with viewer access" required
                                        value={round2.screenRecording} onChange={(v) => setRound2((p) => ({ ...p, screenRecording: v }))} />

                                    <SubmitButton label="Submit Second Round" submitting={status.submitting[2]} />
                                </motion.form>
                            )
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

const CustomSelect = ({ value, onChange, options }) => {
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
                aria-haspopup="listbox"
                aria-expanded={isOpen}
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
                        role="listbox"
                        className="absolute z-[100] w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="option"
                                    aria-selected={value === opt.value}
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

const InputField = ({ label, icon, type = "text", placeholder, required, value, onChange, onBlur }) => (
    <div className="space-y-2">
        <label className="text-slate-700 dark:text-slate-300 font-bold block flex items-center gap-2">
            {icon && <span className="text-cyan-500">{icon}</span>}
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors disabled:opacity-50"
        />
    </div>
);

const SubmitButton = ({ label, submitting }) => (
    <div className="pt-4 flex justify-end">
        <button
            type="submit"
            disabled={submitting}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0f1115]"
        >
            <span className="relative z-10 flex items-center gap-2">
                {submitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                ) : (
                    <>
                        {label} <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </span>
            {!submitting && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            )}
        </button>
    </div>
);

const SuccessPanel = ({ label }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center text-center py-16 gap-4"
    >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-wide" style={{ fontFamily: '"Russo One", sans-serif' }}>
            {label} Registered
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
            We've received your submission. Watch your email and the WhatsApp Help Desk group for further updates.
        </p>
    </motion.div>
);

export default FluxWaveRegistration;
