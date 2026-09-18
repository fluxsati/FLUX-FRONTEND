import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Users, Search, Download, Trash2, CheckCircle2, XCircle,
  Clock, RefreshCw, Eye, ExternalLink, ShieldCheck,
  FileText, Phone, Mail, GraduationCap, Code, Cpu,
  Briefcase, Award,
  X, Lock, Key, LogOut, Loader2, FileDown, FileSpreadsheet
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  fetchRecruitment_26_Registrations,
  updateRecruitmentStatus,
  deleteRecruitment_26_Registration,
  verifyRecruitmentKey
} from '../api';
import CustomDropdown from '../components/CustomDropdown';

const RecruitmentAdminPortal = () => {
  const [adminKey, setAdminKey] = useState('');
  const [unlocked, setUnlocked] = useState(!!sessionStorage.getItem('recruitmentAdminKey'));
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  // Lock background scrolling when candidate details modal is open
  useEffect(() => {
    if (selectedCandidate) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
      };
    }
  }, [selectedCandidate]);

  // Authentication error handler: resets state and prompts for key
  const handleAuthError = useCallback(() => {
    sessionStorage.removeItem('recruitmentAdminKey');
    setUnlocked(false);
    setAdminKey('');
    setError('Session expired or invalid key. Please unlock again.');
    toast.error('Session expired or invalid key.');
  }, []);

  // Handle unlock submission
  const handleUnlock = async (e) => {
    e.preventDefault();
    const trimmed = adminKey.trim();
    if (!trimmed) {
      setUnlockError('Please enter the admin key.');
      return;
    }

    setUnlockLoading(true);
    setUnlockError('');
    try {
      // First verify key with backend
      await verifyRecruitmentKey(trimmed);
      sessionStorage.setItem('recruitmentAdminKey', trimmed);
      setUnlocked(true);
      toast.success('Admin portal unlocked!');
    } catch (err) {
      // If backend is unreachable in local dev, allow matching default key
      if (!err.response && (trimmed === 'flux-recruit-2026-key' || trimmed === 'fw2-9k3jf82hd0alz7qpmxr45vtn')) {
        sessionStorage.setItem('recruitmentAdminKey', trimmed);
        setUnlocked(true);
        toast.success('Admin portal unlocked (local dev mode)!');
        return;
      }
      const msg = err.response?.data?.message || (err.message?.includes('Network') ? 'Backend server unreachable. Please start backend.' : 'Invalid admin key. Please try again.');
      setUnlockError(msg);
      toast.error(msg);
    } finally {
      setUnlockLoading(false);
    }
  };

  // Lock admin portal
  const handleLock = () => {
    sessionStorage.removeItem('recruitmentAdminKey');
    setUnlocked(false);
    setAdminKey('');
    setRegistrations([]);
    toast.success('Admin portal locked.');
  };

  // Fetch all registrations
  const loadRegistrations = useCallback(async (opts = {}) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchRecruitment_26_Registrations();
      const res = response.data;
      if (res && Array.isArray(res.data)) {
        setRegistrations(res.data);
      } else if (Array.isArray(res)) {
        setRegistrations(res);
      } else {
        setRegistrations([]);
      }
      if (opts.silent !== true) {
        toast.success('Registrations refreshed.');
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthError();
        return;
      }
      const message = err?.response?.data?.message || 'Failed to fetch candidate registrations.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    if (unlocked) {
      loadRegistrations({ silent: true });
    }
  }, [unlocked, loadRegistrations]);

  // Update applicant status (Shortlisted, Reviewed, Rejected, Pending)
  const handleStatusChange = async (id, newStatus) => {
    setActionLoadingId(id);
    try {
      await updateRecruitmentStatus(id, newStatus);
      setRegistrations((prev) =>
        prev.map((reg) => (reg._id === id ? { ...reg, status: newStatus } : reg))
      );
      if (selectedCandidate && selectedCandidate._id === id) {
        setSelectedCandidate((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`Candidate marked as ${newStatus}`);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthError();
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to update candidate status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete candidate registration
  const handleDeleteCandidate = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the record for ${name}?`)) return;
    setActionLoadingId(id);
    try {
      await deleteRecruitment_26_Registration(id);
      setRegistrations((prev) => prev.filter((reg) => reg._id !== id));
      if (selectedCandidate && selectedCandidate._id === id) {
        setSelectedCandidate(null);
      }
      toast.success(`Record for ${name} removed.`);
    } catch (err) {
      if (err?.response?.status === 401) {
        handleAuthError();
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to delete record.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filtered registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.fullName && item.fullName.toLowerCase().includes(q)) ||
        (item.enrollmentNo && item.enrollmentNo.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.ticketId && item.ticketId.toLowerCase().includes(q));

      const matchesBranch =
        selectedBranch === 'ALL' ||
        (item.branch && item.branch.toUpperCase() === selectedBranch.toUpperCase());

      const matchesYear =
        selectedYear === 'ALL' ||
        (item.year && item.year.toUpperCase().includes(selectedYear.toUpperCase()));

      const matchesStatus =
        selectedStatus === 'ALL' ||
        (item.status && item.status.toUpperCase() === selectedStatus.toUpperCase());

      return matchesSearch && matchesBranch && matchesYear && matchesStatus;
    });
  }, [registrations, searchQuery, selectedBranch, selectedYear, selectedStatus]);

  // Analytics Metrics
  const stats = useMemo(() => {
    const total = registrations.length;
    const pending = registrations.filter((r) => !r.status || r.status === 'Pending').length;
    const shortlisted = registrations.filter((r) => r.status === 'Shortlisted').length;
    const reviewed = registrations.filter((r) => r.status === 'Reviewed').length;
    const rejected = registrations.filter((r) => r.status === 'Rejected').length;

    return { total, pending, shortlisted, reviewed, rejected };
  }, [registrations]);

  // Export to PDF with professional formatting
  const handleExportPDF = () => {
    if (filteredRegistrations.length === 0) {
      toast.error('No candidates available to export.');
      return;
    }

    setExportingPdf(true);
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title & Header Information
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('FLUX Technical Club — Recruitment 2026 Report', 40, 42);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(
        `Generated: ${new Date().toLocaleString()}  •  Showing ${filteredRegistrations.length} of ${registrations.length} Applicant(s)  •  Branch: ${selectedBranch}  •  Year: ${selectedYear}  •  Status: ${selectedStatus}`,
        40,
        58
      );

      // Build Table Data
      const tableHead = [
        ['Ticket ID', 'Candidate Name & Enrollment', 'Branch & Year', 'Contact Info', 'Preferred Domains / Skills', 'Status', 'Applied On']
      ];

      const tableBody = filteredRegistrations.map((cand) => {
        const skills = [
          ...(cand.techSkillCategories || []),
          ...(cand.softwareSkills || []),
          ...(cand.hardwareSkills || []),
          ...(cand.designingSkills || [])
        ].slice(0, 4).join(', ') || '—';

        const branchDisplay = cand.branch === 'Other' && cand.branchOther
          ? `Other (${cand.branchOther})`
          : (cand.branch || '—');

        return [
          cand.ticketId || '—',
          `${cand.fullName || '—'}\n${cand.enrollmentNo || '—'}`,
          `${branchDisplay}\n(${cand.year || '2nd Year'})`,
          `Ph: ${cand.phone || '—'}\n${cand.email || '—'}`,
          skills,
          (cand.status || 'Pending').toUpperCase(),
          cand.createdAt ? new Date(cand.createdAt).toLocaleDateString() : '—'
        ];
      });

      autoTable(doc, {
        startY: 72,
        head: tableHead,
        body: tableBody,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 5,
          valign: 'middle',
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [15, 23, 42], // #0f172a
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 8.5
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // slate-50
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: 'bold' },
          1: { cellWidth: 130 },
          2: { cellWidth: 95 },
          3: { cellWidth: 140 },
          4: { cellWidth: 165 },
          5: { cellWidth: 80, fontStyle: 'bold' },
          6: { cellWidth: 80 }
        },
        margin: { left: 40, right: 40 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount} — Confidentially generated for FLUX Technical Club Recruitments`,
            pageWidth - 40,
            doc.internal.pageSize.getHeight() - 18,
            { align: 'right' }
          );
        }
      });

      const dateStr = new Date().toISOString().slice(0, 10);
      doc.save(`FLUX_Recruitment_2026_Candidates_${dateStr}.pdf`);
      toast.success('Candidate PDF report downloaded successfully!');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setExportingPdf(false);
    }
  };

  // Helper to format cell values for CSV (escaping quotes, joining arrays)
  const formatCSVCell = (val) => {
    if (val === null || val === undefined) return '""';
    if (Array.isArray(val)) {
      val = val.join('; ');
    }
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };


  const CSV_HEADERS = [
    'Ticket ID',
    'Status',
    'Applied Date & Time',
    'Full Name',
    'Enrollment Number',
    'Year',
    'Branch',
    'Branch (Other Specified)',
    'WhatsApp Phone Number',
    'Official College Email',
    'LinkedIn Profile URL',
    'GitHub Profile URL',
    'Resume Google Drive Link',
    'Technical Domains',
    'Software Skills',
    'Hardware Skills',
    'Designing Skills',
    'Projects (Title & Links)',
    'Soft Skills',
    'Clubs & Organizations Joined',
    'Experience in Marked Fields',
    'Tell Us About Yourself',
    'Significant Achievements / Experience',
    '3 Strengths & 3 Weaknesses',
    'Why Join FLUX',
    'Handling Team Failure / Rejection',
    'Handling Team Conflicts',
    'Why Hire You / Distinct Qualities',
    'What Do You Know About FLUX',
    'FLUX Events / Workshops Attended',
    'Other Events / Workshops Attended',
    'Expectations from Technical Club FLUX'
  ];

  const mapCandidateToCSVRow = (c) => [
    formatCSVCell(c.ticketId || ''),
    formatCSVCell((c.status || 'Pending').toUpperCase()),
    formatCSVCell(c.createdAt ? new Date(c.createdAt).toLocaleString() : ''),
    formatCSVCell(c.fullName || ''),
    formatCSVCell(c.enrollmentNo || ''),
    formatCSVCell(c.year || '2nd Year'),
    formatCSVCell(c.branch || ''),
    formatCSVCell(c.branchOther || ''),
    formatCSVCell(c.phone || ''),
    formatCSVCell(c.email || ''),
    formatCSVCell(c.linkedinUrl || ''),
    formatCSVCell(c.githubUrl || ''),
    formatCSVCell(c.resumeUrl || ''),
    formatCSVCell(c.techSkillCategories || []),
    formatCSVCell(c.softwareSkills || []),
    formatCSVCell(c.hardwareSkills || []),
    formatCSVCell(c.designingSkills || []),
    formatCSVCell(c.projectDriveUrl || ''),
    formatCSVCell(c.softSkills || []),
    formatCSVCell(c.clubsJoined || []),
    formatCSVCell(c.markedFieldsExperience || ''),
    formatCSVCell(c.tellAboutYourself || ''),
    formatCSVCell(c.significantAchievement || ''),
    formatCSVCell(c.strengthsWeaknesses || ''),
    formatCSVCell(c.whyJoinClub || ''),
    formatCSVCell(c.handleTeamFailure || ''),
    formatCSVCell(c.handleTeamConflict || ''),
    formatCSVCell(c.whyHireYou || ''),
    formatCSVCell(c.whatKnowAboutClub || ''),
    formatCSVCell(c.fluxEventsAttended || ''),
    formatCSVCell(c.otherEventsAttended || ''),
    formatCSVCell(c.expectationsFromClub || '')
  ];

  // Export all applicant details to Excel-compatible CSV spreadsheet
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      toast.error('No candidates available to export.');
      return;
    }

    const rows = filteredRegistrations.map((c) => mapCandidateToCSVRow(c));
    const csvContent = [CSV_HEADERS.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `FLUX_Recruitment_2026_Applications_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredRegistrations.length} applicant record(s) to CSV!`);
  };

  // Export single applicant details to Excel-compatible CSV
  const handleExportSingleCandidateCSV = (candidate) => {
    if (!candidate) return;
    const row = mapCandidateToCSVRow(candidate);
    const csvContent = [CSV_HEADERS.map((h) => `"${h}"`).join(','), row.join(',')].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const safeName = (candidate.fullName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute(
      'download',
      `FLUX_Application_${safeName}_${candidate.ticketId || 'record'}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported CSV for ${candidate.fullName}!`);
  };

  // Render Key-Gated Unlock Screen if not authenticated
  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white pt-24 pb-16 font-sans transition-colors duration-500">
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-[#0c0c0e]/80 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl relative z-10 space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-600 dark:text-cyan-400">
            <Lock size={30} />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black italic tracking-tight uppercase text-slate-900 dark:text-white">
              Recruitment <span className="text-cyan-600 dark:text-cyan-400">Admin Portal</span>
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Enter your event organizer admin key to view and manage candidate registrations.
            </p>
          </div>

          {unlockError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
              {unlockError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-slate-600 dark:text-slate-400">
                Admin Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter security key..."
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  autoFocus
                />
                <Key size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={unlockLoading}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {unlockLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Verifying Access...
                </>
              ) : (
                'Unlock Admin Portal'
              )}
            </button>
          </form>

          
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020202] text-slate-900 dark:text-white pt-28 pb-20 px-4 md:px-8 font-sans transition-colors duration-500">
      {/* Ambience Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 rounded-full text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} /> RECRUITMENT 2026 // EVENT ADMIN
              </span>
            
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 dark:text-white">
              CANDIDATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-purple-500">MANAGEMENT</span>
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-xs md:text-sm font-mono mt-1">
              Manage and evaluate candidate registrations for Technical Club FLUX 2026.
            </p>
          </div>

          <div className="grid grid-cols-2 items-center gap-3 ">
            <button
              onClick={() => loadRegistrations()}
              disabled={loading}
              className="px-4 py-2.5 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 text-slate-700 dark:text-gray-300 shadow-sm"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredRegistrations.length === 0}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              title="Export all candidate details to Excel / CSV spreadsheet"
            >
              <FileSpreadsheet size={14} /> Export CSV / Excel
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exportingPdf || filteredRegistrations.length === 0}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-60"
            >
              {exportingPdf ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <FileDown size={14} /> Export PDF
                </>
              )}
            </button>

            <button
              onClick={handleLock}
              className="px-4 py-2.5 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              title="Lock Admin Portal"
            >
              <LogOut size={14} /> Lock
            </button>
          </div>
        </div>

        {/* METRICS DASHBOARD CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-5 rounded-2xl backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-gray-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">TOTAL APPLICANTS</span>
              <Users size={16} className="text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">{stats.total}</div>
          </div>

          <div className="bg-white/80 dark:bg-white/[0.03] border border-amber-200 dark:border-amber-500/20 p-5 rounded-2xl backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">PENDING REVIEW</span>
              <Clock size={16} />
            </div>
            <div className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">{stats.pending}</div>
          </div>

          <div className="bg-white/80 dark:bg-white/[0.03] border border-emerald-200 dark:border-emerald-500/20 p-5 rounded-2xl backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">SHORTLISTED</span>
              <CheckCircle2 size={16} />
            </div>
            <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">{stats.shortlisted}</div>
          </div>

          <div className="bg-white/80 dark:bg-white/[0.03] border border-blue-200 dark:border-blue-500/20 p-5 rounded-2xl backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">REVIEWED</span>
              <Eye size={16} />
            </div>
            <div className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400">{stats.reviewed}</div>
          </div>

          <div className="bg-white/80 dark:bg-white/[0.03] border border-rose-200 dark:border-rose-500/20 p-5 rounded-2xl backdrop-blur-xl col-span-2 md:col-span-1 shadow-sm">
            <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">REJECTED</span>
              <XCircle size={16} />
            </div>
            <div className="text-3xl font-black font-mono text-rose-600 dark:text-rose-400">{stats.rejected}</div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="relative z-30 bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-4 md:p-6 rounded-2xl backdrop-blur-xl space-y-4 shadow-sm">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Name, 0108..., Email, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Branch Filter */}
            <div>
              <CustomDropdown
                variant="filter"
                options={[
                  { value: 'ALL', label: 'ALL BRANCHES' },
                  { value: 'CS', label: 'CS (Computer Science & Eng.)' },
                  { value: 'IT', label: 'IT (Information Technology)' },
                  { value: 'BC', label: 'BC (Block Chain)' },
                  { value: 'AI', label: 'AI (AI & Data Science)' },
                  { value: 'AL', label: 'AL (AI & Machine Learning)' },
                  { value: 'EC', label: 'EC / ECE (Electronics & Comm.)' },
                  { value: 'EE', label: 'EE (Electrical Engineering)' },
                  { value: 'ME', label: 'ME (Mechanical Engineering)' },
                  { value: 'CE', label: 'CE / Civil (Civil Engineering)' },
                  { value: 'IO', label: 'IO / IoT (Internet of Things)' },
                  { value: 'CY', label: 'CY (Cyber Security)' },
                  { value: 'OTHER', label: 'Other Branches' }
                ]}
                value={selectedBranch}
                onChange={setSelectedBranch}
                placeholder="Filter by branch"
              />
            </div>

            {/* Status Filter */}
            <div>
              <CustomDropdown
                variant="filter"
                options={[
                  { value: 'ALL', label: 'ALL STATUSES' },
                  { value: 'PENDING', label: 'Pending' },
                  { value: 'SHORTLISTED', label: 'Shortlisted' },
                  { value: 'REVIEWED', label: 'Reviewed' },
                  { value: 'REJECTED', label: 'Rejected' }
                ]}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Filter by status"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-gray-400 pt-2 border-t border-slate-200 dark:border-white/5">
            <div>
              Showing <span className="text-slate-900 dark:text-white font-bold">{filteredRegistrations.length}</span> of{' '}
              <span className="text-slate-900 dark:text-white font-bold">{registrations.length}</span> applications
            </div>
            {(searchQuery || selectedBranch !== 'ALL' || selectedYear !== 'ALL' || selectedStatus !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBranch('ALL');
                  setSelectedYear('ALL');
                  setSelectedStatus('ALL');
                }}
                className="text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* CANDIDATES TABLE */}
        <div className="relative z-10 bg-white/80 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl dark:shadow-2xl">
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <RefreshCw size={32} className="animate-spin mx-auto text-cyan-600 dark:text-cyan-400" />
              <p className="font-mono text-xs text-slate-500 dark:text-gray-400 uppercase tracking-widest">
                Fetching candidate records from database...
              </p>
            </div>
          ) : error ? (
            <div className="py-16 text-center space-y-4">
              <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-mono text-xs max-w-md mx-auto">
                {error}
              </div>
              <button
                onClick={() => loadRegistrations()}
                className="px-4 py-2 bg-cyan-600 text-white text-xs font-mono uppercase tracking-wider rounded-lg hover:bg-cyan-500 transition-colors"
              >
                Retry Request
              </button>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Users size={40} className="mx-auto text-slate-400 dark:text-gray-600" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-gray-300">No Candidates Found</h3>
              <p className="text-xs font-mono text-slate-500 dark:text-gray-500 max-w-md mx-auto">
                No recruitment applications match your search query or filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 font-mono text-[10px] text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Ticket ID</th>
                    <th className="py-4 px-6">Candidate Details</th>
                    <th className="py-4 px-6">Branch & Year</th>
                    <th className="py-4 px-6">Contact Channels</th>
                    <th className="py-4 px-6">Top Tech Skills</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-sans text-xs">
                  {filteredRegistrations.map((candidate) => {
                    const status = candidate.status || 'Pending';
                    const isActionLoading = actionLoadingId === candidate._id;

                    return (
                      <tr
                        key={candidate._id}
                        className="hover:bg-slate-50/80 dark:hover:bg-white/[0.03] transition-colors group cursor-pointer"
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        {/* Ticket ID */}
                        <td className="py-4 px-6 font-mono text-[11px]">
                          <span className="text-cyan-600 dark:text-cyan-400 font-bold">{candidate.ticketId}</span>
                          <div className="text-[9px] text-slate-400 dark:text-gray-500">
                            {candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : '—'}
                          </div>
                        </td>

                        {/* Candidate Name & Enrollment */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                            {candidate.fullName}
                          </div>
                          <div className="font-mono text-[10px] text-slate-500 dark:text-gray-400 tracking-wider">
                            {candidate.enrollmentNo}
                          </div>
                        </td>

                        {/* Branch & Year */}
                        <td className="py-4 px-6 ">
                          <div className="font-semibold text-slate-800 dark:text-gray-200">
                            {candidate.branch === 'Other' && candidate.branchOther ? `Other (${candidate.branchOther})` : (candidate.branch || '—')}
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-gray-400">{candidate.year || '2nd Year'}</div>
                        </td>

                        {/* Contact Channels */}
                        <td className="py-4 px-6 space-y-1 font-mono text-[11px]" onClick={(e) => e.stopPropagation()}>
                          <a
                            href={`https://wa.me/91${(candidate.phone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <Phone size={11} /> {candidate.phone}
                          </a>
                          <div className="text-slate-500 dark:text-gray-400 flex items-center gap-1 text-[10px]">
                            <Mail size={10} /> {candidate.email}
                          </div>
                        </td>

                        {/* Skills */}
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(candidate.techSkillCategories || []).slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-gray-300 rounded text-[9px] font-mono"
                              >
                                {skill}
                              </span>
                            ))}
                            {(candidate.techSkillCategories || []).length > 3 && (
                              <span className="text-[9px] font-mono text-slate-400 dark:text-gray-500">
                                +{(candidate.techSkillCategories || []).length - 3} more
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                          <CustomDropdown
                            variant="status"
                            options={[
                              { value: 'Pending', label: 'PENDING' },
                              { value: 'Shortlisted', label: 'SHORTLISTED' },
                              { value: 'Reviewed', label: 'REVIEWED' },
                              { value: 'Rejected', label: 'REJECTED' }
                            ]}
                            value={status}
                            disabled={isActionLoading}
                            onChange={(newStatus) => handleStatusChange(candidate._id, newStatus)}
                            className="inline-block"
                            align="right"
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right space-x-2 flex flex-row" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedCandidate(candidate)}
                            title="View Full Profile"
                            className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-cyan-500/20 text-slate-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-300 border border-slate-200 dark:border-white/10 rounded-lg transition-all"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCandidate(candidate._id, candidate.fullName)}
                            title="Delete Record"
                            className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-rose-500/20 text-slate-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* FULL CANDIDATE PROFILE MODAL */}
      <AnimatePresence>
        {selectedCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/75 dark:bg-black/85 backdrop-blur-md overflow-hidden overscroll-contain"
            onClick={() => setSelectedCandidate(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl relative text-slate-900 dark:text-white overflow-hidden"
            >
              {/* Fixed Top Header */}
              <div className="shrink-0 p-5 sm:p-6 md:px-8 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-full font-mono text-[10px] font-bold">
                      {selectedCandidate.ticketId}
                    </span>
                    <span className="text-slate-400 dark:text-gray-400 font-mono text-xs">
                      Submitted: {selectedCandidate.createdAt ? new Date(selectedCandidate.createdAt).toLocaleString() : '—'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                        selectedCandidate.status === 'Shortlisted'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : selectedCandidate.status === 'Reviewed'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                          : selectedCandidate.status === 'Rejected'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {selectedCandidate.status || 'Pending'}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black italic uppercase text-slate-900 dark:text-white truncate">
                    {selectedCandidate.fullName}
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-slate-500 dark:text-gray-400 pt-0.5">
                    <span>ENROLLMENT: <strong className="text-slate-900 dark:text-white font-bold">{selectedCandidate.enrollmentNo}</strong></span>
                    <span>BRANCH: <strong className="text-cyan-600 dark:text-cyan-400 font-bold">{selectedCandidate.branch === 'Other' && selectedCandidate.branchOther ? `Other (${selectedCandidate.branchOther})` : (selectedCandidate.branch || '—')}</strong></span>
                    <span>YEAR: <strong className="text-slate-900 dark:text-white font-bold">{selectedCandidate.year || '2nd Year'}</strong></span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/15 rounded-full transition-colors shrink-0"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 md:p-8 space-y-6 overscroll-contain">
                {/* Contact & Links Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-slate-400 dark:text-gray-400 uppercase text-[10px]">CONTACT INFORMATION</div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <Phone size={14} />
                      <a href={`https://wa.me/91${(selectedCandidate.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                        {selectedCandidate.phone} (WhatsApp)
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
                      <Mail size={14} />
                      <span>{selectedCandidate.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-slate-400 dark:text-gray-400 uppercase text-[10px]">PORTFOLIO & LINKS</div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedCandidate.resumeUrl && (
                        <a href={selectedCandidate.resumeUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 rounded-lg text-[10px] hover:bg-cyan-500/25 flex items-center gap-1 font-mono transition-colors">
                          <ExternalLink size={10} /> Resume
                        </a>
                      )}
                      {selectedCandidate.githubUrl && (
                        <a href={selectedCandidate.githubUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-purple-500/15 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] hover:bg-purple-500/25 flex items-center gap-1 font-mono transition-colors">
                          <ExternalLink size={10} /> GitHub
                        </a>
                      )}
                      {selectedCandidate.linkedinUrl && (
                        <a href={selectedCandidate.linkedinUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-500/15 text-blue-700 dark:text-blue-300 rounded-lg text-[10px] hover:bg-blue-500/25 flex items-center gap-1 font-mono transition-colors">
                          <ExternalLink size={10} /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* PAST PROJECTS & Live URL */}
                {selectedCandidate.projectDriveUrl && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase size={16} /> PAST PROJECTS & Live URL
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCandidate.projectDriveUrl
                        .split('\n')
                        .filter((line) => line && line.trim())
                        .map((line, idx) => {
                          const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                          const url = urlMatch ? urlMatch[0] : null;
                          let title = line;
                          if (url) {
                            title = line.replace(url, '').replace(/^Project\s*\d*\s*\(?/i, '').replace(/\)?\s*:\s*$/, '').trim();
                          }
                          return (
                            <div
                              key={idx}
                              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-col justify-between gap-2"
                            >
                              <div>
                                <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold block">
                                  PROJECT #{idx + 1}
                                </span>
                                <p className="text-xs font-semibold text-slate-800 dark:text-white mt-1">
                                  {title || 'Project Link'}
                                </p>
                              </div>
                              {url ? (
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[11px] font-mono font-bold transition-colors w-fit mt-1"
                                >
                                  <ExternalLink size={12} /> View Demo / Docs
                                </a>
                              ) : (
                                <span className="text-[11px] font-mono text-slate-400">{line}</span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Technical, Software, Hardware & Designing Skills */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Code size={16} /> TECHNICAL SKILLS & DOMAINS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedCandidate.techSkillCategories || []).map((cat, i) => (
                      <span key={i} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-mono rounded-lg">
                        {cat}
                      </span>
                    ))}
                    {(selectedCandidate.softwareSkills || []).map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-mono rounded-lg">
                        {s}
                      </span>
                    ))}
                    {(selectedCandidate.hardwareSkills || []).map((h, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono rounded-lg">
                        {h}
                      </span>
                    ))}
                    {(selectedCandidate.designingSkills || []).map((d, i) => (
                      <span key={i} className="px-3 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-700 dark:text-pink-300 text-xs font-mono rounded-lg">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Soft Skills & Clubs Joined */}
                  {(selectedCandidate.softSkills?.length > 0 || selectedCandidate.clubsJoined?.length > 0) && (
                    <div className="pt-2 space-y-2">
                      <div className="text-slate-400 dark:text-gray-400 uppercase text-[10px] font-mono">
                        SOFT SKILLS & CLUBS JOINED
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(selectedCandidate.softSkills || []).map((s, i) => (
                          <span key={`soft-${i}`} className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-mono rounded-lg">
                            {s}
                          </span>
                        ))}
                        {(selectedCandidate.clubsJoined || []).map((c, i) => (
                          <span key={`club-${i}`} className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-mono rounded-lg">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* EXPERIENCE IN MARKED FIELDS */}
                {selectedCandidate.markedFieldsExperience && (
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-white/10">
                    <h3 className="text-sm font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} /> EXPERIENCE IN MARKED FIELDS
                    </h3>
                    <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/5 whitespace-pre-wrap text-xs text-slate-700 dark:text-gray-300 leading-relaxed font-sans">
                      {selectedCandidate.markedFieldsExperience}
                    </div>
                  </div>
                )}

                {/* ACHIEVEMENTS & TELL ABOUT YOURSELF */}
                {(selectedCandidate.tellAboutYourself || selectedCandidate.significantAchievement) && (
                  <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-white/10">
                    <h3 className="text-sm font-mono text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Award size={16} /> CANDIDATE BACKGROUND & ACHIEVEMENTS
                    </h3>

                    {selectedCandidate.tellAboutYourself && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">
                          Tell Us About Yourself
                        </div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light text-xs">
                          {selectedCandidate.tellAboutYourself}
                        </p>
                      </div>
                    )}

                    {selectedCandidate.significantAchievement && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Award size={13} /> Significant Achievement / Experience
                        </div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light text-xs">
                          {selectedCandidate.significantAchievement}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Behavioral Responses & Strengths / Weaknesses */}
                <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-white/10">
                  <h3 className="text-sm font-mono text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} /> BEHAVIORAL & CLUB FIT RESPONSES
                  </h3>

                  <div className="space-y-3 text-xs">
                    {selectedCandidate.whyJoinClub && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">Why do you want to join FLUX?</div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light">{selectedCandidate.whyJoinClub}</p>
                      </div>
                    )}

                    {selectedCandidate.strengthsWeaknesses && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">3 Strengths & 3 Weaknesses</div>
                        <div className="whitespace-pre-wrap font-mono text-xs text-slate-700 dark:text-gray-300 leading-relaxed bg-white dark:bg-black/20 p-3 rounded-lg border border-slate-200 dark:border-white/5">
                          {selectedCandidate.strengthsWeaknesses}
                        </div>
                      </div>
                    )}

                    {selectedCandidate.handleTeamFailure && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">Handling Rejection or Failure in a Team</div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light">{selectedCandidate.handleTeamFailure}</p>
                      </div>
                    )}

                    {selectedCandidate.handleTeamConflict && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">Handling Team Conflict & Disagreements</div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light">{selectedCandidate.handleTeamConflict}</p>
                      </div>
                    )}

                    {selectedCandidate.whyHireYou && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">Why Should We Hire You / What Makes You Different</div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light">{selectedCandidate.whyHireYou}</p>
                      </div>
                    )}

                    {selectedCandidate.whatKnowAboutClub && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">What Do You Know About Our Club?</div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light">{selectedCandidate.whatKnowAboutClub}</p>
                      </div>
                    )}

                    {selectedCandidate.fluxEventsAttended && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">FLUX Events / Workshops Participated In</div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light">{selectedCandidate.fluxEventsAttended}</p>
                      </div>
                    )}

                    {selectedCandidate.otherEventsAttended && (
                      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                        <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">Other Events / Workshops Participated In</div>
                        <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light">{selectedCandidate.otherEventsAttended}</p>
                      </div>
                    )}

                    <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5 space-y-1">
                      <div className="text-cyan-600 dark:text-cyan-400 font-mono text-[10px] uppercase font-bold">Expectations from Technical Club FLUX</div>
                      <p className="text-slate-700 dark:text-gray-300 leading-relaxed font-light">
                        {selectedCandidate.expectationsFromClub ? (
                          selectedCandidate.expectationsFromClub
                        ) : (
                          <span className="text-slate-400 dark:text-gray-500 italic text-[11px] font-mono">
                            No response recorded / submitted prior to update
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Footer */}
              <div className="shrink-0 p-4 sm:px-8 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#121214] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 dark:text-gray-400 uppercase font-medium">Status:</span>
                  <CustomDropdown
                    variant="status"
                    options={[
                      { value: 'Pending', label: 'PENDING' },
                      { value: 'Shortlisted', label: 'SHORTLISTED' },
                      { value: 'Reviewed', label: 'REVIEWED' },
                      { value: 'Rejected', label: 'REJECTED' }
                    ]}
                    value={selectedCandidate.status || 'Pending'}
                    onChange={(newStatus) => handleStatusChange(selectedCandidate._id, newStatus)}
                    className="inline-block min-w-[130px]"
                    direction="up"
                    align="left"
                  />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => handleExportSingleCandidateCSV(selectedCandidate)}
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    title="Export candidate's full response details to Excel-compatible CSV"
                  >
                    <FileSpreadsheet size={13} /> Export CSV / Excel
                  </button>

                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecruitmentAdminPortal;
