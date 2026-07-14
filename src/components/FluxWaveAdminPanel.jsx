import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { RefreshCw, CheckCircle2, XCircle, Users, ExternalLink, Loader2, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  fetchFluxWaveRegistrations,
  updateFluxWaveStatus,
  checkInFluxWaveTeam,
  fetchFluxWavePublicAdmin,
  updateFluxWavePublicStatus,
  checkInFluxWavePublicTeam,
} from '../api';

const STATUS_OPTIONS = ['registered', 'idea_submitted', 'shortlisted', 'rejected', 'finalist'];

const STATUS_STYLES = {
  registered: 'bg-slate-200 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300',
  idea_submitted: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400',
  shortlisted: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  finalist: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
};

const getErrorMessage = (err, fallback) => err?.response?.data?.message || fallback;

const FluxWaveAdminPanel = ({ useEventKey = false, onAuthError }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [exporting, setExporting] = useState(false);

  // Pick the right set of calls depending on which admin mode we're in
  const fetchRegistrationsFn = useEventKey ? fetchFluxWavePublicAdmin : fetchFluxWaveRegistrations;
  const updateStatusFn = useEventKey ? updateFluxWavePublicStatus : updateFluxWaveStatus;
  const checkInFn = useEventKey ? checkInFluxWavePublicTeam : checkInFluxWaveTeam;

  const loadTeams = useCallback(async (opts = {}) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchRegistrationsFn();
      setTeams(data?.data || []);
      if (opts.silent !== true) {
        toast.success('Registrations refreshed.');
      }
    } catch (err) {
      if (useEventKey && err?.response?.status === 401 && onAuthError) {
        onAuthError();
        return;
      }
      const message = getErrorMessage(err, 'Could not load registrations. Are you logged in as an admin?');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useEventKey]);

  useEffect(() => {
    loadTeams({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    const toastId = toast.loading('Updating status...');
    try {
      const { data } = await updateStatusFn(id, status);
      setTeams((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
      toast.success(data?.message || 'Status updated.', { id: toastId });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update status.'), { id: toastId });
    } finally {
      setBusyId(null);
    }
  };

  const handleCheckIn = async (id) => {
    setBusyId(id);
    const toastId = toast.loading('Checking in team...');
    try {
      const { data } = await checkInFn(id);
      setTeams((prev) => prev.map((t) => (t._id === id ? data.data : t)));
      toast.success(data?.message || 'Team checked in.', { id: toastId });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not check in team.'), { id: toastId });
    } finally {
      setBusyId(null);
    }
  };

  const filteredTeams = filter === 'all' ? teams : teams.filter((t) => t.status === filter);

  // ---------- PDF EXPORT ----------
  const handleDownloadPdf = () => {
    if (filteredTeams.length === 0) {
      toast.error('No teams to export.');
      return;
    }

    setExporting(true);
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('FluxWave 2.0 — Team Registrations', 40, 40);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100);
      doc.text(
        `Generated on ${new Date().toLocaleString()}  •  ${filteredTeams.length} team(s)  •  Filter: ${filter === 'all' ? 'All statuses' : filter.replace('_', ' ')}`,
        40,
        58
      );
      doc.setTextColor(0);

      const tableBody = filteredTeams.map((team) => {
        const members = (team.teamMembers || [])
          .map((m) => `${m.name} (${m.enrollment})`)
          .join('\n') || '—';

        const submissions = [
          team.pptLink ? `Idea: ${team.ideaTitle || 'Untitled'}\nPPT: ${team.pptLink}` : 'Idea: Not submitted',
          team.deployLink
            ? `Live: ${team.deployLink}\nGitHub: ${team.githubLink || '—'}\nRecording: ${team.screenRecordingLink || '—'}`
            : 'Final: Not submitted',
        ].join('\n\n');

        return [
          team.teamName || '—',
          team.domain || '—',
          `${team.leaderName || '—'}\n${team.leaderEmail || ''}\n${team.contactNumber || ''}`,
          members,
          submissions,
          (team.status || '—').replace('_', ' '),
          team.checkedIn ? 'Yes' : (team.status === 'finalist' ? 'No' : 'N/A'),
        ];
      });

      autoTable(doc, {
        startY: 72,
        head: [['Team', 'Domain', 'Leader', 'Members', 'Submissions', 'Status', 'Checked In']],
        body: tableBody,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 6,
          valign: 'top',
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [15, 17, 21],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 70 },
          2: { cellWidth: 110 },
          3: { cellWidth: 110 },
          4: { cellWidth: 180 },
          5: { cellWidth: 60 },
          6: { cellWidth: 55 },
        },
        margin: { left: 40, right: 40 },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            pageWidth - 80,
            doc.internal.pageSize.getHeight() - 20
          );
        },
      });

      const filename = `fluxwave-registrations-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
      toast.success('PDF downloaded.');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('Could not generate PDF.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans mt-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase tracking-widest" style={{ fontFamily: '"Russo One", sans-serif' }}>
            FluxWave 2.0 — Registrations
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
            <Users size={14} /> {teams.length} team{teams.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <button
            onClick={handleDownloadPdf}
            disabled={exporting || filteredTeams.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold disabled:opacity-60 transition-colors"
          >
            {exporting ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
            Download PDF
          </button>
          <button
            onClick={() => loadTeams()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-400">
          <Loader2 className="animate-spin mr-2" /> Loading registrations...
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-24 text-slate-400">No teams match this filter.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Leader</th>
                <th className="px-4 py-3">Members</th>
                <th className="px-4 py-3">Idea / PPT</th>
                <th className="px-4 py-3">Final Submission</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Check-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredTeams.map((team) => (
                <motion.tr
                  key={team._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-800 dark:text-slate-200 align-top"
                >
                  <td className="px-4 py-4 font-bold">{team.teamName}</td>
                  <td className="px-4 py-4 text-slate-500 dark:text-slate-400">{team.domain}</td>
                  <td className="px-4 py-4">
                    <div>{team.leaderName}</div>
                    <div className="text-xs text-slate-400">{team.leaderEmail}</div>
                    <div className="text-xs text-slate-400">{team.contactNumber}</div>
                  </td>
                  <td className="px-4 py-4">
                    <ul className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {(team.teamMembers || []).map((m, i) => (
                        <li key={i}>{m.name} — {m.enrollment}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-4">
                    {team.pptLink ? (
                      <div className="space-y-1">
                        <div className="font-medium">{team.ideaTitle || '—'}</div>
                        <a href={team.pptLink} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 text-xs flex items-center gap-1 hover:underline">
                          View PPT <ExternalLink size={10} />
                        </a>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Not submitted</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {team.deployLink ? (
                      <div className="space-y-1 text-xs">
                        <a href={team.deployLink} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:underline">Live <ExternalLink size={10} /></a>
                        <a href={team.githubLink} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:underline">GitHub <ExternalLink size={10} /></a>
                        <a href={team.screenRecordingLink} target="_blank" rel="noreferrer" className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:underline">Recording <ExternalLink size={10} /></a>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Not submitted</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`inline-block w-fit px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[team.status]}`}>
                        {team.status.replace('_', ' ')}
                      </span>
                      <select
                        value={team.status}
                        disabled={busyId === team._id}
                        onChange={(e) => handleStatusChange(team._id, e.target.value)}
                        className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {team.checkedIn ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 size={14} /> Checked in
                      </span>
                    ) : team.status === 'finalist' ? (
                      <button
                        onClick={() => handleCheckIn(team._id)}
                        disabled={busyId === team._id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-60"
                      >
                        Check In
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 text-xs">
                        <XCircle size={14} /> Not a finalist
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FluxWaveAdminPanel;