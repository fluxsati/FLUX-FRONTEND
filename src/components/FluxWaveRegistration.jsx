import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Send, User, Users, FileText, Globe, Code, Video, LayoutTemplate,
    Mail, Phone, Hash, GraduationCap, Loader2, Lock
} from 'lucide-react';
import {
    registerFluxWave,
    submitFluxWaveIdea,
    submitFluxWaveFinal,
} from '../api';
// At the top of App.jsx (or your chosen page file):
import FAQDiscussion from './FAQDiscussion/FAQDiscussion';


// Keep this in sync with backend/models/FluxWaveRegistration.js -> DOMAINS
const DOMAINS = [
    'IoT & Hardware',
    'Artificial Intelligence',
    'Cyber Security',
    'Web3 & Blockchain',
    'Open Innovation',
    'Game Development',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const emptyMember = () => ({ name: '', email: '', enrollment: '' });

const emptyRound0 = () => ({
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    contactNumber: '',
    enrollment: '',
    // college: 'Samrat Ashok Technological Institute (SATI), Vidisha',
    // branch: '',
    // year: '1st Year',
});

const emptyRound1 = () => ({
    teamName: '',
    domain: DOMAINS[0],
    leaderEmail: '',
    ideaTitle: '',
    problemStatement: '',
    pptLink: '',
});

const emptyRound2 = () => ({
    teamName: '',
    leaderEmail: '',
    deployLink: '',
    githubLink: '',
    screenRecordingLink: '',
});

// ---- localStorage helpers ----
const STORAGE_KEYS = {
    activeRound: 'fluxwave_activeRound',
    round0: 'fluxwave_round0',
    round1: 'fluxwave_round1',
    round2: 'fluxwave_round2',
    teamMembers: 'fluxwave_teamMembers',
    numMembers: 'fluxwave_numMembers',
};

const loadFromStorage = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch { /* quota exceeded – silently ignore */ }
};

const removeFromStorage = (key) => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
};

// Pulls the friendliest message out of an axios error / API response
const getErrorMessage = (err, fallback) => {
    const data = err?.response?.data;
    if (data?.errors && Array.isArray(data.errors) && data.errors.length) {
        return data.errors.join(' ');
    }
    return data?.message || err?.message || fallback;
};

const FluxWaveRegistration = () => {
    const [activeRound, setActiveRound] = useState(() => loadFromStorage(STORAGE_KEYS.activeRound, 0));

    // ---------- Round 0: Registration ----------
    const [numMembers, setNumMembers] = useState(() => loadFromStorage(STORAGE_KEYS.numMembers, 2));
    const [round0, setRound0] = useState(() => loadFromStorage(STORAGE_KEYS.round0, emptyRound0()));
    const [teamMembers, setTeamMembers] = useState(() => loadFromStorage(STORAGE_KEYS.teamMembers, [emptyMember()]));
    const [submitting0, setSubmitting0] = useState(false);

    // ---------- Round 1: Idea / PPT submission ----------
    const [round1, setRound1] = useState(() => loadFromStorage(STORAGE_KEYS.round1, emptyRound1()));
    const [submitting1, setSubmitting1] = useState(false);

    // ---------- Round 2: Final project submission ----------
    const [round2, setRound2] = useState(() => loadFromStorage(STORAGE_KEYS.round2, emptyRound2()));
    const [submitting2, setSubmitting2] = useState(false);

    // ---- Persist every state change to localStorage ----
    useEffect(() => saveToStorage(STORAGE_KEYS.activeRound, activeRound), [activeRound]);
    useEffect(() => saveToStorage(STORAGE_KEYS.round0, round0), [round0]);
    useEffect(() => saveToStorage(STORAGE_KEYS.round1, round1), [round1]);
    useEffect(() => saveToStorage(STORAGE_KEYS.round2, round2), [round2]);
    useEffect(() => saveToStorage(STORAGE_KEYS.teamMembers, teamMembers), [teamMembers]);
    useEffect(() => saveToStorage(STORAGE_KEYS.numMembers, numMembers), [numMembers]);

    // ---- Round locking: dates taken from the event timeline ----
    // Round 0 is always open; Round 1 & 2 unlock on their start dates.
    const ROUND_OPEN_DATES = {
        0: null,                              // always open
        1: new Date('2026-07-20T00:00:00'),   // "Idea & PPT" starts July 20
        2: new Date('2026-08-01T00:00:00'),   // "Grand Finale" starts August 1
    };

    const isRoundLocked = (roundId) => {
        const openDate = ROUND_OPEN_DATES[roundId];
        if (!openDate) return false;
        return new Date() < openDate;
    };

    const handleRoundClick = (roundId) => {
        if (isRoundLocked(roundId)) {
            const openDate = ROUND_OPEN_DATES[roundId];
            const formatted = openDate.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
            });
            toast(`🔒 Submissions for this round will open on ${formatted}`, {
                icon: '🗓️',
                style: {
                    borderRadius: '12px',
                    background: '#1a1a2e',
                    color: '#e2e8f0',
                    border: '1px solid rgba(6,182,212,0.3)',
                },
            });
            return;
        }
        setActiveRound(roundId);
    };

    const rounds = [
        { id: 0, title: 'Zeroth', num: '0' },
        { id: 1, title: 'First', num: '1' },
        { id: 2, title: 'Second', num: '2' },
    ];

    // Keep teamMembers array length in sync with the selected team size
    useEffect(() => {
        const additionalNeeded = numMembers - 1;
        setTeamMembers((prev) => {
            const next = [...prev];
            while (next.length < additionalNeeded) next.push(emptyMember());
            while (next.length > additionalNeeded) next.pop();
            return next;
        });
    }, [numMembers]);

    const updateRound0 = (field, value) => setRound0((prev) => ({ ...prev, [field]: value }));
    const updateRound1 = (field, value) => setRound1((prev) => ({ ...prev, [field]: value }));
    const updateRound2 = (field, value) => setRound2((prev) => ({ ...prev, [field]: value }));
    const updateMember = (idx, field, value) =>
        setTeamMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));

    // ---------- Round 0 submit ----------
    const handleRound0Submit = async (e) => {
        e.preventDefault();
        if (submitting0) return;

        const payload = {
            ...round0,
            teamMembers,
        };

        setSubmitting0(true);
        const toastId = toast.loading('Submitting your registration...');
        try {
            const { data } = await registerFluxWave(payload);
            toast.success(data?.message || 'Registration successful!', { id: toastId });
            setRound0(emptyRound0());
            setTeamMembers([emptyMember()]);
            setNumMembers(2);
            removeFromStorage(STORAGE_KEYS.round0);
            removeFromStorage(STORAGE_KEYS.teamMembers);
            removeFromStorage(STORAGE_KEYS.numMembers);
        } catch (err) {
            toast.error(getErrorMessage(err, 'Could not complete registration. Please try again.'), {
                id: toastId,
            });
        } finally {
            setSubmitting0(false);
        }
    };

    // ---------- Round 1 submit ----------
    const handleRound1Submit = async (e) => {
        e.preventDefault();
        if (submitting1) return;

        setSubmitting1(true);
        const toastId = toast.loading('Submitting your idea...');
        try {
            const { data } = await submitFluxWaveIdea(round1);
            toast.success(data?.message || 'Idea submitted successfully!', { id: toastId });
            setRound1(emptyRound1());
            removeFromStorage(STORAGE_KEYS.round1);
        } catch (err) {
            toast.error(getErrorMessage(err, 'Could not submit your idea. Please try again.'), {
                id: toastId,
            });
        } finally {
            setSubmitting1(false);
        }
    };

    // ---------- Round 2 submit ----------
    const handleRound2Submit = async (e) => {
        e.preventDefault();
        if (submitting2) return;

        setSubmitting2(true);
        const toastId = toast.loading('Submitting your final project...');
        try {
            const { data } = await submitFluxWaveFinal(round2);
            toast.success(data?.message || 'Final submission received!', { id: toastId });
            setRound2(emptyRound2());
            removeFromStorage(STORAGE_KEYS.round2);
        } catch (err) {
            toast.error(getErrorMessage(err, 'Could not submit your project. Please try again.'), {
                id: toastId,
            });
        } finally {
            setSubmitting2(false);
        }
    };

    return (
        <>
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
                    {rounds.map((round) => (
                        <div key={round.id} className="relative flex flex-col items-center">
                            <span className={`text-sm md:text-lg font-bold uppercase tracking-widest mb-4 transition-colors duration-300 ${activeRound === round.id ? 'text-cyan-500' : 'text-slate-500'}`}>
                                {round.title}
                            </span>

                            <button
                                type="button"
                                onClick={() => handleRoundClick(round.id)}
                                className={`
                                    relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2
                                    ${isRoundLocked(round.id)
                                        ? 'bg-slate-200 dark:bg-[#111] border-slate-400/50 dark:border-white/10 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-70'
                                        : activeRound === round.id
                                            ? 'bg-slate-800 dark:bg-white/10 border-cyan-500 text-cyan-500 scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                                            : 'bg-slate-300 dark:bg-[#1a1a1a] border-transparent text-slate-500 hover:border-cyan-500/50 hover:text-cyan-400'
                                    }
                                `}
                            >
                                <span className="font-bold text-4xl md:text-5xl" style={{ fontFamily: '"Russo One", sans-serif' }}>
                                    {round.num}
                                </span>

                                {isRoundLocked(round.id) && (
                                    <span className="absolute -top-1 -right-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-red-500 border-2 border-white dark:border-[#0f1115] flex items-center justify-center shadow-lg">
                                        <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                                    </span>
                                )}
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
                            <motion.form
                                key="round0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleRound0Submit}
                                className="space-y-8"
                            >
                                <InputField
                                    label="Team Name"
                                    icon={<Users className="w-5 h-5" />}
                                    placeholder="Enter Team Name"
                                    required
                                    value={round0.teamName}
                                    onChange={(v) => updateRound0('teamName', v)}
                                />

                                <div className="bg-slate-50 dark:bg-white/5 p-3 sm:p-6 rounded-2xl border border-slate-100 dark:border-white/5 space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <User className="text-cyan-500" /> Leader Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Leader Name"
                                            icon={<User className="w-4 h-4" />}
                                            placeholder="Enter Leader Name"
                                            required
                                            value={round0.leaderName}
                                            onChange={(v) => updateRound0('leaderName', v)}
                                        />
                                        <InputField
                                            label="Email Address"
                                            icon={<Mail className="w-4 h-4" />}
                                            type="email"
                                            placeholder="you@satiengg.in"
                                            required
                                            value={round0.leaderEmail}
                                            onChange={(v) => updateRound0('leaderEmail', v)}
                                        />
                                        <InputField
                                            label="Contact Number"
                                            icon={<Phone className="w-4 h-4" />}
                                            placeholder="10-digit mobile number"
                                            required
                                            pattern="[6-9][0-9]{9}"
                                            maxLength={10}
                                            value={round0.contactNumber}
                                            onChange={(v) => updateRound0('contactNumber', v.replace(/\D/g, ''))}
                                        />
                                        <InputField
                                            label="Enrollment No."
                                            icon={<Hash className="w-4 h-4" />}
                                            placeholder="0108CS123456"
                                            required
                                            value={round0.enrollment}
                                            onChange={(v) => updateRound0('enrollment', v)}
                                        />
                                        {/* <InputField
                                            label="Branch"
                                            icon={<GraduationCap className="w-4 h-4" />}
                                            placeholder="CS / IT / EC / AI / BC / EE / ME"
                                            value={round0.branch}
                                            onChange={(v) => updateRound0('branch', v)}
                                        />
                                        <div className="space-y-2">
                                            <label className="text-slate-700 dark:text-slate-300 font-bold block">Year</label>
                                            <CustomSelect
                                                value={round0.year}
                                                onChange={(v) => updateRound0('year', v)}
                                                options={YEARS.map((y) => ({ value: y, label: y }))}
                                            />
                                        </div> */}
                                    </div>
                                    {/* <InputField
                                        label="College"
                                        placeholder="College Name"
                                        value={round0.college}
                                        onChange={(v) => updateRound0('college', v)}
                                    /> */}
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Only  college emails are accepted for the leader and every team member.
                                    </p>
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
                                                    { value: 4, label: '4 Members' },
                                                ]}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {teamMembers.map((member, idx) => (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                key={idx}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-white/5 p-6 rounded-2xl border border-slate-100 dark:border-white/5"
                                            >
                                                <div className="md:col-span-3">
                                                    <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">Member {idx + 2}</h4>
                                                </div>
                                                <InputField
                                                    label="Name"
                                                    placeholder={`Member ${idx + 2} Name`}
                                                    required
                                                    value={member.name}
                                                    onChange={(v) => updateMember(idx, 'name', v)}
                                                />
                                                <InputField
                                                    label="Email"
                                                    type="email"
                                                    placeholder="member@satiengg.in"
                                                    required
                                                    value={member.email}
                                                    onChange={(v) => updateMember(idx, 'email', v)}
                                                />
                                                <InputField
                                                    label="Enrollment No."
                                                    placeholder="Enrollment Number"
                                                    required
                                                    value={member.enrollment}
                                                    onChange={(v) => updateMember(idx, 'enrollment', v)}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                <SubmitButton label="Submit Zeroth Round" loading={submitting0} />
                            </motion.form>
                        )}

                        {activeRound === 1 && (
                            <motion.form
                                key="round1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleRound1Submit}
                                className="space-y-8"
                            >
                                <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3">
                                    We identify your team using the <span className="font-bold">Team Name</span> and <span className="font-bold">Leader Email</span> you used during registration (Round 0).
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Team Name"
                                        icon={<Users className="w-5 h-5" />}
                                        placeholder="Enter Team Name"
                                        required
                                        value={round1.teamName}
                                        onChange={(v) => updateRound1('teamName', v)}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-slate-700 dark:text-slate-300 font-bold block flex items-center gap-2">
                                            <LayoutTemplate className="w-4 h-4 text-cyan-500" /> Domain <span className="text-red-500">*</span>
                                        </label>
                                        <CustomSelect
                                            value={round1.domain}
                                            onChange={(v) => updateRound1('domain', v)}
                                            options={DOMAINS.map((d) => ({ value: d, label: d }))}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Leader Email"
                                        icon={<Mail className="w-5 h-5" />}
                                        type="email"
                                        placeholder="you@satiengg.in"
                                        required
                                        value={round1.leaderEmail}
                                        onChange={(v) => updateRound1('leaderEmail', v)}
                                    />
                                </div>

                                <InputField
                                    label="Idea Title"
                                    icon={<LayoutTemplate className="w-5 h-5" />}
                                    placeholder="A short, catchy title for your idea"
                                    required
                                    value={round1.ideaTitle}
                                    onChange={(v) => updateRound1('ideaTitle', v)}
                                />

                                <div className="space-y-2">
                                    <label className="text-slate-700 dark:text-slate-300 font-bold block">Problem Statement / Idea Abstract</label>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none min-h-[120px]"
                                        placeholder="Brief Description of Idea..."
                                        required
                                        maxLength={1000}
                                        value={round1.problemStatement}
                                        onChange={(e) => updateRound1('problemStatement', e.target.value)}
                                    ></textarea>
                                </div>

                                <InputField
                                    label="PPT Link"
                                    icon={<FileText className="w-5 h-5" />}
                                    placeholder="Drive link with viewer access"
                                    required
                                    value={round1.pptLink}
                                    onChange={(v) => updateRound1('pptLink', v)}
                                />
                                <SubmitButton label="Submit First Round" loading={submitting1} />
                            </motion.form>
                        )}

                        {activeRound === 2 && (
                            <motion.form
                                key="round2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                onSubmit={handleRound2Submit}
                                className="space-y-8"
                            >
                                <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3">
                                    Only teams marked as <span className="font-bold">Finalist</span> can submit here. We identify your team using the <span className="font-bold">Team Name</span> and <span className="font-bold">Leader Email</span>.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Team Name"
                                        icon={<Users className="w-5 h-5" />}
                                        placeholder="Enter Team Name"
                                        required
                                        value={round2.teamName}
                                        onChange={(v) => updateRound2('teamName', v)}
                                    />
                                    <InputField
                                        label="Leader Email"
                                        icon={<Mail className="w-5 h-5" />}
                                        type="email"
                                        placeholder="you@satiengg.in"
                                        required
                                        value={round2.leaderEmail}
                                        onChange={(v) => updateRound2('leaderEmail', v)}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Deploy Project Link"
                                        icon={<Globe className="w-5 h-5" />}
                                        placeholder="Live URL of Project"
                                        required
                                        value={round2.deployLink}
                                        onChange={(v) => updateRound2('deployLink', v)}
                                    />
                                    <InputField
                                        label="GitHub Repo URL"
                                        icon={<Code className="w-5 h-5" />}
                                        placeholder="https://github.com/..."
                                        required
                                        value={round2.githubLink}
                                        onChange={(v) => updateRound2('githubLink', v)}
                                    />
                                </div>

                                <InputField
                                    label="Screen Recording"
                                    icon={<Video className="w-5 h-5" />}
                                    placeholder="Drive link with viewer access"
                                    required
                                    value={round2.screenRecordingLink}
                                    onChange={(v) => updateRound2('screenRecordingLink', v)}
                                />

                                <SubmitButton label="Submit Second Round" loading={submitting2} />
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>

        {/* Then inside your JSX, add it wherever you want it to appear: */}
        <FAQDiscussion />
        </>

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

    const selectedOption = options.find((opt) => opt.value === value) || options[0];

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

const InputField = ({ label, icon, type = 'text', placeholder, required, value, onChange, pattern, maxLength }) => (
    <div className="space-y-2">
        <label className="text-slate-700 dark:text-slate-300 font-bold block flex items-center gap-2">
            {icon && <span className="text-cyan-500">{icon}</span>}
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            placeholder={placeholder}
            required={required}
            pattern={pattern}
            maxLength={maxLength}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
        />
    </div>
);

const SubmitButton = ({ label, loading }) => (
    <div className="pt-4 flex justify-end">
        <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#0f1115] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <>
                        Submitting... <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                ) : (
                    <>
                        {label} <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </span>
            {!loading && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
            )}
        </button>
    </div>
);

export default FluxWaveRegistration;