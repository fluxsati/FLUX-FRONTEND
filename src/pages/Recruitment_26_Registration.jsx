import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, CheckCircle, ArrowLeft, ArrowRight, User, Mail, Phone,
  Sparkles, Check, Upload, FileText, Link as LinkIcon, MessageCircle,
  ExternalLink, ShieldCheck, Award, Briefcase, Code, Cpu, Palette,
  HelpCircle, ChevronRight, Plus, Trash2, CheckCircle2, RotateCcw, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { registerRecruitment } from '../api';
import CustomDropdown from '../components/CustomDropdown';

const STORAGE_KEY = 'flux_recruitment_2026_draft';

const initialFormData = {
  // Step 1
  fullName: '',
  enrollmentNo: '',
  year: '2nd Year',
  branch: 'CS (Computer Science and Engineering)',
  branchOther: '',
  phone: '',
  email: '',

  // Step 2
  linkedinUrl: '',
  githubUrl: '',
  resumeUrl: '',
  techSkillCategories: [],
  techSkillCategoriesOther: '',
  softwareSkills: [],
  softwareSkillsOther: '',
  hardwareSkills: [],
  hardwareSkillsOther: '',
  designingSkills: [],
  designingSkillsOther: '',

  // Step 3
  softSkills: [],
  softSkillsOther: '',
  tellAboutYourself: '',
  significantAchievement: '',
  clubsJoined: [],
  clubsJoinedOther: '',

  // Step 4
  whyJoinClub: '',
  handleTeamFailure: '',
  handleTeamConflict: '',
  whyHireYou: '',
  whatKnowAboutClub: '',
  fluxEventsAttended: '',
  otherEventsAttended: '',
  expectationsFromClub: ''
};

const getSavedDraft = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load recruitment draft from localStorage', e);
  }
  return null;
};

const Recruitment_26_Registration = () => {
  const savedDraft = useMemo(() => getSavedDraft(), []);

  const [currentStep, setCurrentStep] = useState(() => {
    return (savedDraft && typeof savedDraft.currentStep === 'number' && savedDraft.currentStep >= 1 && savedDraft.currentStep <= 4)
      ? savedDraft.currentStep
      : 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    return Boolean(savedDraft?.isSubmitted);
  });
  const [submitError, setSubmitError] = useState('');
  const [ticketId, setTicketId] = useState(() => {
    return savedDraft?.ticketId || '';
  });

  // Form State initialized from saved draft if available
  const [formData, setFormData] = useState(() => {
    return savedDraft?.formData ? { ...initialFormData, ...savedDraft.formData } : initialFormData;
  });

  // Dynamic Projects List (Demo video / Live Video of past projects)
  const [projects, setProjects] = useState(() => {
    return (Array.isArray(savedDraft?.projects) && savedDraft.projects.length > 0)
      ? savedDraft.projects
      : [{ name: '', url: '' }];
  });

  // Dynamic Sub-Fields for Experience in Marked Fields
  const [fieldExperiences, setFieldExperiences] = useState(() => {
    return (savedDraft?.fieldExperiences && typeof savedDraft.fieldExperiences === 'object')
      ? savedDraft.fieldExperiences
      : {};
  });

  // 3 Strengths and 3 Weaknesses separate column input fields
  const [strengths, setStrengths] = useState(() => {
    return (Array.isArray(savedDraft?.strengths) && savedDraft.strengths.length === 3)
      ? savedDraft.strengths
      : ['', '', ''];
  });
  const [weaknesses, setWeaknesses] = useState(() => {
    return (Array.isArray(savedDraft?.weaknesses) && savedDraft.weaknesses.length === 3)
      ? savedDraft.weaknesses
      : ['', '', ''];
  });

  const [errors, setErrors] = useState({});

  // Auto-save form progress, step, and filled details to localStorage
  useEffect(() => {
    try {
      const draftData = {
        currentStep,
        formData,
        projects,
        fieldExperiences,
        strengths,
        weaknesses,
        isSubmitted,
        ticketId,
        lastSavedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
    } catch (e) {
      console.error('Failed to save recruitment draft to localStorage', e);
    }
  }, [currentStep, formData, projects, fieldExperiences, strengths, weaknesses, isSubmitted, ticketId]);

  const handleClearDraft = () => {
    if (window.confirm('Are you sure you want to reset the form? All your filled details will be cleared.')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      setFormData(initialFormData);
      setProjects([{ name: '', url: '' }]);
      setFieldExperiences({});
      setStrengths(['', '', '']);
      setWeaknesses(['', '', '']);
      setCurrentStep(1);
      setIsSubmitted(false);
      setTicketId('');
      setErrors({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Branch List matching specified codes: CS, IT, BC, AI, EE, EC, ME, CE, IO, CY, AL
  const branches = [
    'CS (Computer Science and Engineering)',
    'IT (Information Technology)',
    'BC (Block Chain)',
    'AI (Artificial Intelligence & Data Science)',
    'EE (Electrical Engineering)',
    'EC (Electronics and Communication Engineering)',
    'ME (Mechanical Engineering)',
    'CE (Civil Engineering)',
    'IO (Internet of Things)',
    'CY (Cyber Security)',
    'AL (Artificial Intelligence & Machine Learning)',
    'Other'
  ];

  const softwareSkillOptions = [
    'Web Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Data Science',
    'Android Development',
    'Cloud Computing',
    'Database Management',
    'Programming Languages',
    'Deployment CI/CD DevOps',
    'Programming for Arduino (C/C++) or Similar Development Boards',
    'Cybersecurity/ Blockchain',
    'None of the above',
    'Other'
  ];

  const hardwareSkillOptions = [
    'Arduino or Similar Micro Controller',
    'Robotics',
    '3D Printing',
    'Embedded Systems',
    'Electronics',
    'VLSI',
    'None of the above',
    'Other'
  ];

  const designingSkillOptions = [
    'Graphic Designing',
    'UI/UX',
    'Blender or CAD (3D Object Design)',
    'Cinematography / Camera Operation',
    'Video Editing',
    'Photography & Camera Handling',
    'None Of the above',
    'Other'
  ];

  const softSkillOptions = [
    'Content Writing',
    'Public Speaking',
    'Social Media Page Handling',
    'Management',
    'Photography & Camera Handling',
    'Mentorship',
    'PR',
    'None of the above',
    'Other'
  ];

  const clubOptions = [
    'Training and Placement Cell',
    'Photography Club (Mirage)',
    'E-Cell',
    'Speakers and Skill Development Club (FIAT)',
    'Rudras Dance Crew',
    'Musical Club (SWAR)',
    'Startup Cell',
    'Coding Club',
    'Udaan DC Club',
    'National Cadets Corps (NCC)',
    'National Service Scheme (NSS)',
    'Google Developer Group (GDGoC)',
    'Gitsetcode (Girls Community)',
    'VariableX Community',
    'Wiki Club',
    'None of the above',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Strict 10-digit exact contact number constraint
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: '' }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (category, value) => {
    setFormData((prev) => {
      const list = prev[category] || [];
      const updated = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return { ...prev, [category]: updated };
    });
    if (errors[category]) {
      setErrors((prev) => ({ ...prev, [category]: '' }));
    }
  };

  // Dynamic Projects List Handlers
  const handleProjectChange = (index, field, value) => {
    setProjects((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    if (errors.projects) {
      setErrors((prev) => ({ ...prev, projects: '' }));
    }
  };

  const handleAddProject = () => {
    setProjects((prev) => [...prev, { name: '', url: '' }]);
  };

  const handleRemoveProject = (index) => {
    if (projects.length <= 1) return;
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  // Dynamic Experience in Marked Fields Handlers
  const handleFieldExperienceChange = (field, value) => {
    setFieldExperiences((prev) => ({ ...prev, [field]: value }));
    if (errors.markedFieldsExperience) {
      setErrors((prev) => ({ ...prev, markedFieldsExperience: '' }));
    }
  };

  // Strengths & Weaknesses Handlers
  const handleStrengthChange = (index, value) => {
    setStrengths((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    if (errors.strengthsWeaknesses) {
      setErrors((prev) => ({ ...prev, strengthsWeaknesses: '' }));
    }
  };

  const handleWeaknessChange = (index, value) => {
    setWeaknesses((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
    if (errors.strengthsWeaknesses) {
      setErrors((prev) => ({ ...prev, strengthsWeaknesses: '' }));
    }
  };

  // Calculate distinct marked fields for the CURRENT step (Step 3: Soft Skills), excluding 'None of the above'
  const markedFieldsList = useMemo(() => {
    const isNone = (val) => !val || /^none/i.test(val.trim());

    const softList = formData.softSkills
      .filter((s) => !isNone(s))
      .map((s) => (s === 'Other' ? (formData.softSkillsOther.trim() ? formData.softSkillsOther.trim() : 'Other') : s));

    return Array.from(new Set(softList));
  }, [
    formData.softSkills,
    formData.softSkillsOther
  ]);

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';

    if (!formData.enrollmentNo.trim()) {
      errs.enrollmentNo = 'Enrollment number is required';
    } else if (!/^0108/i.test(formData.enrollmentNo.trim())) {
      errs.enrollmentNo = 'Enrollment number must start with 0108 (e.g., 0108CS231001)';
    }

    if (formData.branch === 'Other' && !formData.branchOther.trim()) {
      errs.branchOther = 'Please specify your branch';
    }

    // Contact number must be exactly 10 digits
    if (!formData.phone.trim()) {
      errs.phone = 'WhatsApp contact number is required';
    } else if (formData.phone.trim().length !== 10 || !/^\d{10}$/.test(formData.phone.trim())) {
      errs.phone = 'WhatsApp contact number must be exactly 10 digits';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@satiengg\.in$/i.test(formData.email.trim())) {
      errs.email = 'Official college email is compulsory (@satiengg.in)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation (LinkedIn, GitHub, Resume, Past Projects all MANDATORY)
  const validateStep2 = () => {
    const errs = {};

    // if (!formData.linkedinUrl.trim()) {
    //   errs.linkedinUrl = 'LinkedIn profile URL is compulsory *';
    // }

    // if (!formData.githubUrl.trim()) {
    //   errs.githubUrl = 'GitHub profile URL is compulsory *';
    // }

    // if (!formData.resumeUrl.trim()) {
    //   errs.resumeUrl = 'Resume Google Drive link is compulsory *';
    // }

    if (formData.softwareSkills.length === 0) errs.softwareSkills = 'Select at least one software skill (or None)';
    if (formData.hardwareSkills.length === 0) errs.hardwareSkills = 'Select at least one hardware skill (or None)';
    if (formData.designingSkills.length === 0) errs.designingSkills = 'Select at least one designing skill (or None)';

    // Check if other inputs are filled when 'Other' selected
    if (formData.techSkillCategories.includes('Other') && !formData.techSkillCategoriesOther.trim()) {
      errs.techSkillCategoriesOther = 'Please specify your other technical category';
    }
    if (formData.softwareSkills.includes('Other') && !formData.softwareSkillsOther.trim()) {
      errs.softwareSkillsOther = 'Please specify your other software skill';
    }
    if (formData.hardwareSkills.includes('Other') && !formData.hardwareSkillsOther.trim()) {
      errs.hardwareSkillsOther = 'Please specify your other hardware skill';
    }
    if (formData.designingSkills.includes('Other') && !formData.designingSkillsOther.trim()) {
      errs.designingSkillsOther = 'Please specify your other designing skill';
    }

    // Projects: Demo video / Live URL is mandatory
    // const hasValidProject = projects.some((p) => p.name.trim() && p.url.trim());
    // if (!hasValidProject) {
    //   errs.projects = 'Please provide at least one past project with both Name and Demo Video / Live URL *';
    // } else {
    //   // Check if any partially filled project rows exist
    //   const incomplete = projects.some((p) => (p.name.trim() && !p.url.trim()) || (!p.name.trim() && p.url.trim()));
    //   if (incomplete) {
    //     errs.projects = 'Please ensure both Project Name and URL are filled for every project listed.';
    //   }
    // }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation (Sub-fields for marked fields experience)
  const validateStep3 = () => {
    const errs = {};

    if (formData.softSkills.length === 0) errs.softSkills = 'Select at least one soft skill (or None)';
    if (formData.softSkills.includes('Other') && !formData.softSkillsOther.trim()) {
      errs.softSkillsOther = 'Please specify your other soft skill';
    }

    if (formData.clubsJoined.length === 0) errs.clubsJoined = 'Select organizations you belong to (or None)';
    if (formData.clubsJoined.includes('Other') && !formData.clubsJoinedOther.trim()) {
      errs.clubsJoinedOther = 'Please specify your other club or organization';
    }

    // Validate dynamic sub-fields for marked fields experience
    if (markedFieldsList.length > 0) {
      const missingFields = markedFieldsList.filter(
        (field) => !(fieldExperiences[field] && fieldExperiences[field].trim())
      );
      if (missingFields.length > 0) {
        errs.markedFieldsExperience = `Please fill out your experience for all marked fields (${missingFields.slice(0, 3).join(', ')}${missingFields.length > 3 ? '...' : ''}) *`;
      }
    }

    if (!formData.tellAboutYourself.trim()) errs.tellAboutYourself = 'Please tell us about yourself *';
    if (!formData.significantAchievement.trim()) errs.significantAchievement = 'Please mention your achievements or experience *';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 Validation (3 Strengths and 3 Weaknesses compulsory)
  const validateStep4 = () => {
    const errs = {};
    // if (!formData.whyJoinClub.trim()) errs.whyJoinClub = 'This field is required *';

    // // 3 Strengths & 3 Weaknesses validation
    // const has3Strengths = strengths.every((s) => s && s.trim().length > 0);
    // const has3Weaknesses = weaknesses.every((w) => w && w.trim().length > 0);
    // if (!has3Strengths || !has3Weaknesses) {
    //   errs.strengthsWeaknesses = 'Please enter all 3 strengths and all 3 weaknesses *';
    // }

    // if (!formData.handleTeamFailure.trim()) errs.handleTeamFailure = 'This field is required *';
    // if (!formData.handleTeamConflict.trim()) errs.handleTeamConflict = 'This field is required *';
    // if (!formData.whyHireYou.trim()) errs.whyHireYou = 'This field is required *';
    // if (!formData.whatKnowAboutClub.trim()) errs.whatKnowAboutClub = 'This field is required *';
    // if (!formData.fluxEventsAttended.trim()) errs.fluxEventsAttended = 'This field is required *';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep4()) return;
    setSubmitError('');
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    // Format formatted projects into projectDriveUrl string for backend
    const formattedProjects = projects
      .filter((p) => p.name.trim() && p.url.trim())
      .map((p, i) => `Project ${i + 1} (${p.name.trim()}): ${p.url.trim()}`)
      .join('\n');

    // Format marked fields experience breakdown
    const formattedExperiences = Object.entries(fieldExperiences)
      .filter(([_, exp]) => exp && exp.trim())
      .map(([field, exp]) => `[${field}]:\n${exp.trim()}`)
      .join('\n\n');

    // Format 3 strengths and 3 weaknesses
    const formattedStrengthsWeaknesses = `STRENGTHS:\n1. ${strengths[0].trim()}\n2. ${strengths[1].trim()}\n3. ${strengths[2].trim()}\n\nWEAKNESSES:\n1. ${weaknesses[0].trim()}\n2. ${weaknesses[1].trim()}\n3. ${weaknesses[2].trim()}`;

    // Append 'Other' custom inputs to arrays if filled
    const finalSoftwareSkills = [...formData.softwareSkills];
    if (formData.softwareSkills.includes('Other') && formData.softwareSkillsOther.trim()) {
      finalSoftwareSkills.push(`Other: ${formData.softwareSkillsOther.trim()}`);
    }

    const finalHardwareSkills = [...formData.hardwareSkills];
    if (formData.hardwareSkills.includes('Other') && formData.hardwareSkillsOther.trim()) {
      finalHardwareSkills.push(`Other: ${formData.hardwareSkillsOther.trim()}`);
    }

    const finalDesigningSkills = [...formData.designingSkills];
    if (formData.designingSkills.includes('Other') && formData.designingSkillsOther.trim()) {
      finalDesigningSkills.push(`Other: ${formData.designingSkillsOther.trim()}`);
    }

    const finalSoftSkills = [...formData.softSkills];
    if (formData.softSkills.includes('Other') && formData.softSkillsOther.trim()) {
      finalSoftSkills.push(`Other: ${formData.softSkillsOther.trim()}`);
    }

    const finalClubsJoined = [...formData.clubsJoined];
    if (formData.clubsJoined.includes('Other') && formData.clubsJoinedOther.trim()) {
      finalClubsJoined.push(`Other: ${formData.clubsJoinedOther.trim()}`);
    }

    const payload = {
      ...formData,
      softwareSkills: finalSoftwareSkills,
      hardwareSkills: finalHardwareSkills,
      designingSkills: finalDesigningSkills,
      softSkills: finalSoftSkills,
      clubsJoined: finalClubsJoined,
      projectDriveUrl: formattedProjects,
      markedFieldsExperience: formattedExperiences,
      strengthsWeaknesses: formattedStrengthsWeaknesses
    };

    try {
      const response = await registerRecruitment(payload);
      if (response.data && response.data.success) {
        setShowConfirmModal(false);
        setTicketId(response.data.ticketId || `FLUX-2026-REG-${Math.floor(100000 + Math.random() * 900000)}`);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Submission failed. Please check your details or network connection.';
      setSubmitError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans transition-colors duration-500 py-16 lg:py-24">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] bg-cyan-500/10 blur-[140px] rounded-full opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Back Link & Draft Auto-Save Status */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <Link
            to="/events/recruitment-2026"
            className="inline-flex items-center gap-2 text-sm font-mono text-cyan-600 dark:text-cyan-400 hover:underline group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Recruitment Roadmap
          </Link>

          {!isSubmitted && (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Draft Auto-Saved
              </span>
              <button
                type="button"
                onClick={handleClearDraft}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-red-500 transition-colors px-1"
                title="Reset form and clear all saved inputs"
              >
                <RotateCcw size={12} /> Reset Form
              </button>
            </div>
          )}
        </div>

        {/* STEP PROGRESS BAR */}
        {!isSubmitted && (
          <div className="mb-10">
            <div className="flex items-center justify-between relative mb-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200/50 dark:bg-white/10 w-full -z-10 rounded-full" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 -z-10 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                      : 'bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-400'
                  }`}
                >
                  {currentStep > step ? <Check size={16} /> : `0${step}`}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-1">
              <span className={currentStep === 1 ? 'text-cyan-600 dark:text-cyan-400 font-bold' : ''}>Personal</span>
              <span className={currentStep === 2 ? 'text-cyan-600 dark:text-cyan-400 font-bold' : ''}>Skills & Projects</span>
              <span className={currentStep === 3 ? 'text-cyan-600 dark:text-cyan-400 font-bold' : ''}>Experience</span>
              <span className={currentStep === 4 ? 'text-cyan-600 dark:text-cyan-400 font-bold' : ''}>Club Fit</span>
            </div>
          </div>
        )}

        {/* HEADER TITLE */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-3">
            Recruitment <span className="text-cyan-600 dark:text-cyan-500">Form</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            Step into SATI's flagship technical society. Fill in your details with care and precision.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
            <a
              href="https://drive.google.com/file/d/1TepOS1fshYWi5l3LTskDbRNfIynuPFHq/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-mono transition-colors"
            >
              <FileText size={12} /> Club Constitution <ExternalLink size={10} />
            </a>
            <a
              href="https://drive.google.com/file/d/16RMD4O0LmZoIcWUQ0aVmuWyoZs8AGcMT/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-xs font-mono transition-colors"
            >
              <FileText size={12} /> Recruitment Procedure <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* FORM CONTAINER - TRANSPARENT GLASSMORPHISM */}
        {!isSubmitted ? (
          <div className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl transition-all">
            <form onSubmit={handleSubmit}>
              {/* STEP 1: PERSONAL & CONTACT INFORMATION */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white border-b border-slate-200/40 dark:border-white/5 pb-3">
                    01 // Personal & Academic Information
                  </h3>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.fullName ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-mono">{errors.fullName}</p>}
                  </div>

                  {/* Enrollment No & Year */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Enrollment Number * <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-normal lowercase">(Must start with 0108)</span>
                      </label>
                      <input
                        type="text"
                        name="enrollmentNo"
                        placeholder="0108CS231001"
                        value={formData.enrollmentNo}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                          errors.enrollmentNo ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                        } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono`}
                      />
                      {errors.enrollmentNo && <p className="text-red-500 text-xs mt-1 font-mono">{errors.enrollmentNo}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Year of Study *
                      </label>
                      <input
                        type="text"
                        name="year"
                        value="2nd Year"
                        disabled
                        className="w-full px-4 py-3.5 rounded-2xl bg-white/30 dark:bg-white/[0.02] backdrop-blur-md border border-slate-200/40 dark:border-white/10 text-cyan-600 dark:text-cyan-400 font-bold text-sm cursor-not-allowed opacity-90"
                      />
                    </div>
                  </div>

                  {/* Branch Select */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Branch *
                    </label>
                    <CustomDropdown
                      variant="form"
                      options={branches}
                      value={formData.branch}
                      onChange={(val) => {
                        setFormData((prev) => ({ ...prev, branch: val }));
                        if (errors.branch) {
                          setErrors((prev) => ({ ...prev, branch: '' }));
                        }
                      }}
                      placeholder="Select your branch..."
                    />
                  </div>

                  {formData.branch === 'Other' && (
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Specify Branch *
                      </label>
                      <input
                        type="text"
                        name="branchOther"
                        placeholder="Type your branch..."
                        value={formData.branchOther}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                          errors.branchOther ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                        } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                      />
                      {errors.branchOther && <p className="text-red-500 text-xs mt-1 font-mono">{errors.branchOther}</p>}
                    </div>
                  )}

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        WhatsApp Contact No. * <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-normal">(Exact 10 digits)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          maxLength={10}
                          placeholder="9876543210"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                            errors.phone ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                          } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono`}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                          {formData.phone.length}/10
                        </span>
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1 font-mono">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                        Email Address * <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-normal lowercase">(@satiengg.in)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="yourname@satiengg.in"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                          errors.email ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                        } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm font-mono`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-mono">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-cyan-500/20"
                    >
                      Next: Tech & Design Skills <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PROFILES, TECH, HARDWARE, DESIGNING SKILLS & PROJECTS */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">
                    02 // Profiles, Resumes & Domain Skills
                  </h3>

                  {/* LinkedIn & GitHub Links (Mandatory) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        LinkedIn Profile (URL)
                      </label>
                      {/* <span className="block text-[11px] text-cyan-600 dark:text-cyan-400 font-mono mb-2">
                        (Mandatory profile URL)
                      </span> */}
                      <input
                        type="url"
                        name="linkedinUrl"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                          errors.linkedinUrl ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                        } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                      />
                      {errors.linkedinUrl && <p className="text-red-500 text-xs mt-1 font-mono">{errors.linkedinUrl}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        GitHub Profile (URL)
                      </label>
                      {/* <span className="block text-[11px] text-cyan-600 dark:text-cyan-400 font-mono mb-2">
                        (Mandatory repository portfolio link)
                      </span> */}
                      <input
                        type="url"
                        name="githubUrl"
                        placeholder="https://github.com/yourusername"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                          errors.githubUrl ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                        } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                      />
                      {errors.githubUrl && <p className="text-red-500 text-xs mt-1 font-mono">{errors.githubUrl}</p>}
                    </div>
                  </div>

                  {/* Google Drive Resume Link (Mandatory) */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Resume Google Drive Link
                    </label>
                    {/* <span className="block text-[11px] text-slate-400 font-mono mb-2">
                      Paste your Google Drive shareable link below (Make sure access is set to "Anyone with the link"):
                    </span> */}
                    <input
                      type="url"
                      name="resumeUrl"
                      placeholder="https://drive.google.com/file/d/your-resume-link"
                      value={formData.resumeUrl}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.resumeUrl ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono`}
                    />
                    {errors.resumeUrl && <p className="text-red-500 text-xs mt-1 font-mono">{errors.resumeUrl}</p>}
                  </div>

                  {/* Technical Skills Category */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Technical Skills Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Software', 'Hardware', 'Designing', 'Other'].map((cat, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                            formData.techSkillCategories.includes(cat)
                              ? 'bg-cyan-500/15 border-cyan-500 backdrop-blur-md text-cyan-600 dark:text-cyan-400'
                              : 'bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.techSkillCategories.includes(cat)}
                            onChange={() => handleCheckboxChange('techSkillCategories', cat)}
                            className="rounded text-cyan-600"
                          />
                          {cat}
                        </label>
                      ))}
                    </div>

                    {/* 'Other' input field for Technical Skills Category */}
                    {formData.techSkillCategories.includes('Other') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                          Specify other technical domain *
                        </label>
                        <input
                          type="text"
                          name="techSkillCategoriesOther"
                          placeholder="e.g. Embedded Firmware, Quantum Computing..."
                          value={formData.techSkillCategoriesOther}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                            errors.techSkillCategoriesOther ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                          } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono`}
                        />
                        {errors.techSkillCategoriesOther && (
                          <p className="text-red-500 text-xs mt-1 font-mono">{errors.techSkillCategoriesOther}</p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Software Skills Checkboxes */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Software Skills (Tick all that apply) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                      {softwareSkillOptions.map((opt, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                            formData.softwareSkills.includes(opt)
                              ? 'bg-cyan-500/15 border-cyan-500 backdrop-blur-md text-cyan-600 dark:text-cyan-400 font-bold'
                              : 'bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.softwareSkills.includes(opt)}
                            onChange={() => handleCheckboxChange('softwareSkills', opt)}
                            className="rounded text-cyan-600"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    {/* 'Other' input field for Software Skills */}
                    {formData.softwareSkills.includes('Other') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                          Specify other software skill *
                        </label>
                        <input
                          type="text"
                          name="softwareSkillsOther"
                          placeholder="e.g. Flutter, Next.js, Rust, Solidity..."
                          value={formData.softwareSkillsOther}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                            errors.softwareSkillsOther ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                          } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono`}
                        />
                        {errors.softwareSkillsOther && (
                          <p className="text-red-500 text-xs mt-1 font-mono">{errors.softwareSkillsOther}</p>
                        )}
                      </motion.div>
                    )}
                    {errors.softwareSkills && <p className="text-red-500 text-xs mt-1 font-mono">{errors.softwareSkills}</p>}
                  </div>

                  {/* Hardware Skills Checkboxes */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Hardware Skills (Tick all that apply) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                      {hardwareSkillOptions.map((opt, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                            formData.hardwareSkills.includes(opt)
                              ? 'bg-emerald-500/15 border-emerald-500 backdrop-blur-md text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.hardwareSkills.includes(opt)}
                            onChange={() => handleCheckboxChange('hardwareSkills', opt)}
                            className="rounded text-emerald-600"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    {/* 'Other' input field for Hardware Skills */}
                    {formData.hardwareSkills.includes('Other') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                          Specify other hardware skill *
                        </label>
                        <input
                          type="text"
                          name="hardwareSkillsOther"
                          placeholder="e.g. Raspberry Pi, Drone Assembly, PCB Soldering..."
                          value={formData.hardwareSkillsOther}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                            errors.hardwareSkillsOther ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                          } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono`}
                        />
                        {errors.hardwareSkillsOther && (
                          <p className="text-red-500 text-xs mt-1 font-mono">{errors.hardwareSkillsOther}</p>
                        )}
                      </motion.div>
                    )}
                    {errors.hardwareSkills && <p className="text-red-500 text-xs mt-1 font-mono">{errors.hardwareSkills}</p>}
                  </div>

                  {/* Designing Skills Checkboxes */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Designing Skills (Tick all that apply) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                      {designingSkillOptions.map((opt, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                            formData.designingSkills.includes(opt)
                              ? 'bg-purple-500/15 border-purple-500 backdrop-blur-md text-purple-600 dark:text-purple-400 font-bold'
                              : 'bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.designingSkills.includes(opt)}
                            onChange={() => handleCheckboxChange('designingSkills', opt)}
                            className="rounded text-purple-600"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    {/* 'Other' input field for Designing Skills */}
                    {formData.designingSkills.includes('Other') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                          Specify other designing skill *
                        </label>
                        <input
                          type="text"
                          name="designingSkillsOther"
                          placeholder="e.g. Figma, Adobe Premiere Pro, After Effects..."
                          value={formData.designingSkillsOther}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                            errors.designingSkillsOther ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                          } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono`}
                        />
                        {errors.designingSkillsOther && (
                          <p className="text-red-500 text-xs mt-1 font-mono">{errors.designingSkillsOther}</p>
                        )}
                      </motion.div>
                    )}
                    {errors.designingSkills && <p className="text-red-500 text-xs mt-1 font-mono">{errors.designingSkills}</p>}
                  </div>

                  {/* DYNAMIC DEMO VIDEO / DOCUMENTATION OF PAST PROJECTS (MANDATORY WITH + ICON) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/40 dark:border-white/10 pb-2">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Demo video / Live URL of your past projects
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Provide project title and Google Drive / GitHub / Demo video links:
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddProject}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30 transition-all self-start sm:self-auto"
                      >
                        <Plus size={14} /> Add Project
                      </button>
                    </div>

                    <div className="space-y-3">
                      {projects.map((proj, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-white/30 dark:bg-white/[0.02] backdrop-blur-md border border-slate-200/60 dark:border-white/10 space-y-3 relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                              Project #{idx + 1}
                            </span>
                            {projects.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveProject(idx)}
                                className="p-1.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Remove project"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                                Project Name / Title
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Autonomous Maze Solving Robot"
                                value={proj.name}
                                onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                                Demo Video / Live URL / SourceCode
                              </label>
                              <input
                                type="url"
                                placeholder="https://drive.google.com/... or https://xyz.com/..."
                                value={proj.url}
                                onChange={(e) => handleProjectChange(idx, 'url', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {errors.projects && <p className="text-red-500 text-xs font-mono">{errors.projects}</p>}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/3 py-4 px-6 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md text-slate-900 dark:text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 border border-slate-200/60 dark:border-white/10"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-2/3 flex items-center justify-center gap-2 py-4 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-cyan-500/20"
                    >
                      Next: Soft Skills & Experience <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SOFT SKILLS, DYNAMIC MARKED FIELDS EXPERIENCE & CLUBS */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white border-b border-slate-200/40 dark:border-white/5 pb-3">
                    03 // Soft Skills, Achievements & Clubs
                  </h3>

                  {/* Soft Skills */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Soft Skills (Tick all that apply) *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                      {softSkillOptions.map((opt, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                            formData.softSkills.includes(opt)
                              ? 'bg-amber-500/15 border-amber-500 backdrop-blur-md text-amber-600 dark:text-amber-400 font-bold'
                              : 'bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.softSkills.includes(opt)}
                            onChange={() => handleCheckboxChange('softSkills', opt)}
                            className="rounded text-amber-600"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    {/* 'Other' input field for Soft Skills */}
                    {formData.softSkills.includes('Other') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                          Specify other soft skill *
                        </label>
                        <input
                          type="text"
                          name="softSkillsOther"
                          placeholder="e.g. Content Strategy, Anchoring, Public Relations..."
                          value={formData.softSkillsOther}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                            errors.softSkillsOther ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                          } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono`}
                        />
                        {errors.softSkillsOther && (
                          <p className="text-red-500 text-xs mt-1 font-mono">{errors.softSkillsOther}</p>
                        )}
                      </motion.div>
                    )}
                    {errors.softSkills && <p className="text-red-500 text-xs mt-1 font-mono">{errors.softSkills}</p>}
                  </div>

                  {/* DYNAMIC EXPERIENCE IN MARKED FIELDS SUB-FIELDS */}
                  <div className="space-y-4 pt-2">
                    <div className="border-b border-slate-200/40 dark:border-white/10 pb-2">
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Write about your experience in above marked fields! *
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        A dedicated section appears for each soft skill selected above (excluding 'None'). Describe your real-world experience:
                      </span>
                    </div>

                    {markedFieldsList.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-amber-500/10 backdrop-blur-md border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono">
                        No soft skills were selected above (or only 'None' was picked). If you have hands-on experience, please check the appropriate soft skill options above to unlock experience fields.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {markedFieldsList.map((field, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-white/30 dark:bg-white/[0.02] backdrop-blur-md border border-slate-200/60 dark:border-white/10 space-y-2"
                          >
                            <label className="block text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                              Experience in "{field}" *
                            </label>
                            <textarea
                              rows={2}
                              placeholder={`Describe your practical experience, tools/libraries used, or projects built with ${field}...`}
                              value={fieldExperiences[field] || ''}
                              onChange={(e) => handleFieldExperienceChange(field, e.target.value)}
                              className="w-full p-3.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.markedFieldsExperience && (
                      <p className="text-red-500 text-xs font-mono">{errors.markedFieldsExperience}</p>
                    )}
                  </div>

                  {/* Tell us about yourself */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Tell us about yourself! *
                    </label>
                    <textarea
                      name="tellAboutYourself"
                      rows={3}
                      placeholder="Share your background, key interests, what excites you about technology..."
                      value={formData.tellAboutYourself}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.tellAboutYourself ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.tellAboutYourself && <p className="text-red-500 text-xs mt-1 font-mono">{errors.tellAboutYourself}</p>}
                  </div>

                  {/* Mention significant achievements */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Mention your significant Achievement / Experience *
                    </label>
                    <textarea
                      name="significantAchievement"
                      rows={3}
                      placeholder="Hackathon wins, notable college ranks, certifications, completed open-source contributions..."
                      value={formData.significantAchievement}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.significantAchievement ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.significantAchievement && <p className="text-red-500 text-xs mt-1 font-mono">{errors.significantAchievement}</p>}
                  </div>

                  {/* Clubs / Organizations Joined */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Choose the clubs/organizations you are a member of until now! *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                      {clubOptions.map((opt, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                            formData.clubsJoined.includes(opt)
                              ? 'bg-blue-500/15 border-blue-500 backdrop-blur-md text-blue-600 dark:text-blue-400 font-bold'
                              : 'bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.clubsJoined.includes(opt)}
                            onChange={() => handleCheckboxChange('clubsJoined', opt)}
                            className="rounded text-blue-600"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    {/* 'Other' input field for Clubs */}
                    {formData.clubsJoined.includes('Other') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3"
                      >
                        <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                          Specify other club or community *
                        </label>
                        <input
                          type="text"
                          name="clubsJoinedOther"
                          placeholder="e.g. College Magazine Team, Sports Committee..."
                          value={formData.clubsJoinedOther}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                            errors.clubsJoinedOther ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                          } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-xs font-mono`}
                        />
                        {errors.clubsJoinedOther && (
                          <p className="text-red-500 text-xs mt-1 font-mono">{errors.clubsJoinedOther}</p>
                        )}
                      </motion.div>
                    )}
                    {errors.clubsJoined && <p className="text-red-500 text-xs mt-1 font-mono">{errors.clubsJoined}</p>}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/3 py-4 px-6 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md text-slate-900 dark:text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 border border-slate-200/60 dark:border-white/10"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-2/3 flex items-center justify-center gap-2 py-4 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-cyan-500/20"
                    >
                      Next: Club Fit Questions <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: BEHAVIORAL & 3 STRENGTHS / 3 WEAKNESSES COLUMN FIELDS */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3">
                    04 // Behavioral & FLUX Alignment
                  </h3>

                  {/* Why do you want to join the club? */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Why do you want to join the club? *
                    </label>
                    <textarea
                      name="whyJoinClub"
                      rows={3}
                      placeholder="Explain your motivation for joining Technical Club FLUX..."
                      value={formData.whyJoinClub}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.whyJoinClub ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.whyJoinClub && <p className="text-red-500 text-xs mt-1 font-mono">{errors.whyJoinClub}</p>}
                  </div>

                  {/* 3 STRENGTHS AND 3 WEAKNESSES - 3-3 INPUT COLUMN FIELDS */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                        What are your 3 strengths and 3 weaknesses?
                      </label>
                      <span className="block text-[11px] text-slate-400 font-mono">
                        Fill in exactly 3 strengths in the left column and 3 weaknesses in the right column:
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Strengths Column */}
                      <div className="p-5 rounded-2xl bg-emerald-500/5 backdrop-blur-md border border-emerald-500/20 space-y-3.5">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 size={16} /> 3 Strengths
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                              Strength 1
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Fast learner with high adaptability"
                              value={strengths[0]}
                              onChange={(e) => handleStrengthChange(0, e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                              Strength 2
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Strong analytical problem solver"
                              value={strengths[1]}
                              onChange={(e) => handleStrengthChange(1, e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                              Strength 3
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Reliable and proactive collaborator"
                              value={strengths[2]}
                              onChange={(e) => handleStrengthChange(2, e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 transition-colors text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Weaknesses Column */}
                      <div className="p-5 rounded-2xl bg-amber-500/5 backdrop-blur-md border border-amber-500/20 space-y-3.5">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                          <HelpCircle size={16} /> 3 Weaknesses
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                              Weakness 1
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Hesitant to delegate when busy"
                              value={weaknesses[0]}
                              onChange={(e) => handleWeaknessChange(0, e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                              Weakness 2
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Tendency to overthink edge cases"
                              value={weaknesses[1]}
                              onChange={(e) => handleWeaknessChange(1, e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors text-xs font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                              Weakness 3
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Sometimes work long hours without breaks"
                              value={weaknesses[2]}
                              onChange={(e) => handleWeaknessChange(2, e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 transition-colors text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {errors.strengthsWeaknesses && (
                      <p className="text-red-500 text-xs font-mono">{errors.strengthsWeaknesses}</p>
                    )}
                  </div>

                  {/* Handle rejection / failure */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      How would you handle rejection or failure while working in a team? *
                    </label>
                    <textarea
                      name="handleTeamFailure"
                      rows={3}
                      placeholder="Think of a time you missed a deadline, received negative feedback, or a project didn't go as planned. What did you do?"
                      value={formData.handleTeamFailure}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.handleTeamFailure ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.handleTeamFailure && <p className="text-red-500 text-xs mt-1 font-mono">{errors.handleTeamFailure}</p>}
                  </div>

                  {/* Handle conflicts */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      How do you usually handle conflicts or disagreements in a team? *
                    </label>
                    <textarea
                      name="handleTeamConflict"
                      rows={3}
                      placeholder="Think of a time you had a disagreement with a teammate. How did you approach it?"
                      value={formData.handleTeamConflict}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.handleTeamConflict ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.handleTeamConflict && <p className="text-red-500 text-xs mt-1 font-mono">{errors.handleTeamConflict}</p>}
                  </div>

                  {/* Why hire you */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Why should we hire you, what makes you different from others? *
                    </label>
                    <textarea
                      name="whyHireYou"
                      rows={3}
                      placeholder="What unique skills, experiences, or perspectives do you bring to the team?"
                      value={formData.whyHireYou}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.whyHireYou ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.whyHireYou && <p className="text-red-500 text-xs mt-1 font-mono">{errors.whyHireYou}</p>}
                  </div>

                  {/* What do you know about our club? */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      What do you know about our club? *
                    </label>
                    <textarea
                      name="whatKnowAboutClub"
                      rows={3}
                      placeholder="What have you heard about Flux? Any specific projects, events, or initiatives that caught your eye?"
                      value={formData.whatKnowAboutClub}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.whatKnowAboutClub ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.whatKnowAboutClub && <p className="text-red-500 text-xs mt-1 font-mono">{errors.whatKnowAboutClub}</p>}
                  </div>

                  {/* FLUX Events participated */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Events or Workshops you have participated in that were conducted by FLUX: *
                    </label>
                    <textarea
                      name="fluxEventsAttended"
                      rows={2}
                      placeholder="Which FLUX events or workshops have you attended? What did you like about them?"
                      value={formData.fluxEventsAttended}
                      onChange={handleInputChange}
                      className={`w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border ${
                        errors.fluxEventsAttended ? 'border-red-500' : 'border-slate-200/60 dark:border-white/10'
                      } text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm`}
                    />
                    {errors.fluxEventsAttended && <p className="text-red-500 text-xs mt-1 font-mono">{errors.fluxEventsAttended}</p>}
                  </div>

                  {/* Other Events participated */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      Which other events or workshops have you participated in apart from FLUX?
                    </label>
                    <textarea
                      name="otherEventsAttended"
                      rows={2}
                      placeholder="Any hackathons, competitions, or technical events outside of FLUX?"
                      value={formData.otherEventsAttended}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Expectations from FLUX */}
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                      What are your expectations from the Technical Club Flux?
                    </label>
                    <textarea
                      name="expectationsFromClub"
                      rows={3}
                      placeholder="What do you hope to learn, experience, build, or contribute as a member of FLUX?"
                      value={formData.expectationsFromClub}
                      onChange={handleInputChange}
                      className="w-full p-4 rounded-2xl bg-white/50 dark:bg-white/[0.03] backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                    />
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono font-bold">
                      ⚠️ {submitError}
                    </div>
                  )}

                  {/* Submit Action */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-1/3 py-4 px-6 bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-2/3 flex items-center justify-center gap-2 py-4 px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send size={16} /> Submit Full Application
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>
        ) : (
          /* SUCCESS CONFIRMATION RECEIPT WITH WHATSAPP GROUP LINK */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white mb-2">
              Registration Successful!
            </h2>

            <p className="text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold uppercase tracking-wider mb-6">
              Reference Ticket ID: {ticketId || `FLUX-2026-REG-${Math.floor(100000 + Math.random() * 900000)}`}
            </p>

            {/* Applicant Summary */}
            <div className="max-w-md mx-auto bg-white/40 dark:bg-white/[0.02] backdrop-blur-md border border-slate-200/60 dark:border-white/10 p-6 rounded-2xl text-left space-y-3 mb-8 text-sm">
              <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                <span className="text-slate-500">Enrollment No:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{formData.enrollmentNo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2">
                <span className="text-slate-500">Branch & Year:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">{formData.branch} (2nd Year)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Next Evaluation:</span>
                <span className="font-bold text-slate-900 dark:text-white">Pen & Paper Test (26 Sept)</span>
              </div>
            </div>

            {/* PROMINENT WHATSAPP GROUP JOIN CTA CARD */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/5 backdrop-blur-md border border-emerald-500/40 p-6 rounded-2xl mb-8 text-center shadow-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <MessageCircle size={14} /> Action Required
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                Join Official Recruitment WhatsApp Group
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-6">
                Stay updated with test venue announcements, dates, schedules, and recruitment notices.
              </p>
              <a
                href="https://chat.whatsapp.com/JKSDCOwvPjcDFZvzPGKaeN?s=sh&p=a&mlu=4&ilr=4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl uppercase tracking-widest text-xs transition-all shadow-lg shadow-emerald-500/30 group"
              >
                <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                Join WhatsApp Group <ExternalLink size={14} />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events/recruitment-2026"
                className="py-3.5 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-widest transition-all"
              >
                View Recruitment Roadmap
              </Link>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem(STORAGE_KEY);
                  } catch (e) {}
                  setFormData(initialFormData);
                  setProjects([{ name: '', url: '' }]);
                  setFieldExperiences({});
                  setStrengths(['', '', '']);
                  setWeaknesses(['', '', '']);
                  setCurrentStep(1);
                  setIsSubmitted(false);
                  setTicketId('');
                  setErrors({});
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="py-3.5 px-6 rounded-2xl bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 backdrop-blur-md border border-slate-200/60 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-widest transition-all"
              >
                Register Another Candidate
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* CONFIRMATION POPUP MODAL */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setShowConfirmModal(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0f0f13] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5"
            >
              {/* Close Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-30"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4 pr-6">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <ShieldCheck size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                    Confirm Submission
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Are you sure you want to submit your application? Please verify your details before finalizing.
                  </p>
                </div>
              </div>

              {/* Candidate Info Verification Box */}
              <div className="bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/10 rounded-2xl p-4 text-xs space-y-2.5 font-mono">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400">Applicant:</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {formData.fullName || '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400">Enrollment:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formData.enrollmentNo || '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400">Branch & Year:</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold truncate">
                    {formData.branch ? `${formData.branch.split(' ')[0]} (2nd Year)` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-600 dark:text-slate-300 truncate max-w-[190px]">
                    {formData.email || '—'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3.5 py-2">
                ⚠️ Note: Once submitted, your registration cannot be re-edited.
              </p>

              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-mono">
                  ⚠️ {submitError}
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmSubmit}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Confirm Submit</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recruitment_26_Registration;
