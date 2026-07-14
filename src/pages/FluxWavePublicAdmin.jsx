import React, { useState } from 'react';
import FluxWaveAdminPanel from '../components/FluxWaveAdminPanel';

const FluxWavePublicAdmin = () => {
  const [key, setKey] = useState('');
  const [unlocked, setUnlocked] = useState(!!sessionStorage.getItem('fluxwaveAdminKey'));

  const handleUnlock = (e) => {
    e.preventDefault();
    if (!key.trim()) return;
    sessionStorage.setItem('fluxwaveAdminKey', key.trim());
    setUnlocked(true);
  };

  const handleAuthError = () => {
    sessionStorage.removeItem('fluxwaveAdminKey');
    setUnlocked(false);
    setKey('');
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#0f0f13] pt-24">
        <form onSubmit={handleUnlock} className="w-full max-w-sm space-y-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center">FluxWave Event Admin</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            Enter the event admin key to view registrations.
          </p>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg py-3 font-bold hover:opacity-90 transition-opacity"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return <FluxWaveAdminPanel useEventKey onAuthError={handleAuthError} />;
};

export default FluxWavePublicAdmin;