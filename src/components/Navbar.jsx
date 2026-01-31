import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../slices/authSlices';
import { logout as logoutApi } from '../api';
import { Sun, Moon, LogOut, User as UserIcon, LayoutDashboard, ChevronDown, Menu, X } from 'lucide-react';
import fluxLogo from '../assets/fluxlogo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Scroll Locking
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [location]);

  // Theme Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try { await logoutApi(); } catch (err) { console.error(err); }
    finally {
      dispatch(logoutAction());
      setIsOpen(false);
      navigate('/login', { replace: true });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Team', path: '/team' },
    { name: 'Projects', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Learning', path: '/LearningHub' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed w-full z-[150] transition-all duration-500 ${scrolled ? 'top-0' : 'top-0 lg:top-6'}`}>
        <div className={`mx-auto transition-all duration-700 ${scrolled ? 'max-w-full' : 'max-w-full lg:max-w-7xl px-0 lg:px-6'}`}>
          <div className={`relative flex items-center justify-between h-16 sm:h-20 px-4 sm:px-8 lg:px-10 transition-all duration-500 
            ${scrolled
              ? 'bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-gray-200 dark:border-cyan-500/30'
              : 'bg-white/90 dark:bg-black/80 lg:dark:bg-white/[0.03] backdrop-blur-md border-b lg:border border-gray-200 dark:border-white/10 lg:rounded-2xl shadow-lg lg:shadow-2xl'}`}>

            {/* --- LOGO SECTION (Restored Desktop Animations) --- */}
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-4 group relative shrink-0 z-[160]"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center group">
                {/* Engineering Grid / Orbit Ring */}
                <div className="absolute inset-0 border-[1px] border-cyan-500/20 rounded-full group-hover:border-cyan-500/50 group-hover:scale-125 transition-all duration-500"></div>

                {/* Rotating Tech Bracket - Only visible on hover */}
                <div className="absolute inset-[-4px] border-t-2 border-l-2 border-cyan-500 rounded-full opacity-0 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 ease-in-out hidden lg:block"></div>

                {/* Logo Image with Glitch/Glow effect */}
                <div className="relative overflow-hidden">
                  <img
                    src={fluxLogo}
                    alt="Flux"
                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 object-contain z-10 
                             lg:filter lg:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]
                             group-hover:scale-110 group-hover:brightness-125
                             transition-all duration-300"
                  />

                  {/* Technical "Scanline" Overlay (Desktop Only) */}
                  <div className="absolute inset-0 w-full h-[2px] bg-cyan-400/50 -translate-y-10 group-hover:animate-[scan_1.5s_ease-in-out_infinite] pointer-events-none hidden lg:block"></div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-black dark:text-white text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter leading-none uppercase">FLUX</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${userInfo ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`}></span>
                </div>
                <span className="text-[8px] lg:text-[10px] text-cyan-600 dark:text-cyan-400 font-mono tracking-[0.2em] lg:tracking-[0.3em] uppercase mt-0.5 font-bold">TECHNICAL CLUB</span>
              </div>
            </Link>

            {/* --- DESKTOP NAVIGATION (Restored Hover Animations) --- */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all group overflow-hidden
                    ${location.pathname === link.path ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                  {/* Sliding Text Effect */}
                  <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-full block">{link.name}</span>
                  <span className="absolute inset-0 z-10 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-cyan-500">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* --- RIGHT TOOLS --- */}
            <div className="flex items-center gap-2 sm:gap-4 z-[160]">

              <div className="hidden xl:flex items-center gap-4">
                <button onClick={toggleTheme} className="p-2 rounded-full border border-cyan-500/20 hover:bg-cyan-500/10 transition-colors">
                  {isDark ? <Sun size={18} className="text-cyan-400" /> : <Moon size={18} className="text-cyan-600" />}
                </button>

                {userInfo ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-3 px-3 py-2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-cyan-500/50 transition-all group max-w-[180px]"
                    >
                      <UserIcon size={16} className="text-cyan-500 shrink-0" />
                      <span className="text-[10px] font-bold dark:text-white uppercase tracking-widest truncate">{userInfo.name}</span>
                      <ChevronDown size={14} className={`shrink-0 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in duration-200">
                        <div className="p-2 space-y-1">
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cyan-500/10 dark:text-gray-300 hover:text-cyan-500 transition-all">
                            <LayoutDashboard size={16} />
                            <span className="text-xs font-bold uppercase">Dashboard</span>
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all">
                            <LogOut size={16} />
                            <span className="text-xs font-bold uppercase">Terminate</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className="px-4 py-2 border border-cyan-500/30 text-[9px] font-bold text-cyan-400 uppercase tracking-[0.2em] rounded-sm hover:border-cyan-400 transition-all">
                    System_Access
                  </Link>
                )}
              </div>

              {/* MOBILE THEME TOGGLE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTheme();
                }}
                className="xl:hidden p-2 rounded-lg text-cyan-500 hover:bg-cyan-500/10 active:scale-95 transition-all mr-1"
              >
                {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </button>

              {/* MOBILE TOGGLE - MENU BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="xl:hidden relative p-2 text-cyan-500 active:scale-90 transition-transform rounded-lg hover:bg-cyan-500/10"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE/TABLET MENU (Simple Grid Layout) --- */}
      <div className={`fixed inset-0 w-full h-screen bg-white dark:bg-black z-[140] transition-transform duration-300 xl:hidden ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col h-full pt-20 px-6 pb-10">

          {/* Mobile User Profile */}
          {userInfo && (
            <div className="flex items-center gap-4 p-4 mb-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-full border border-cyan-500/50 flex items-center justify-center">
                <UserIcon size={24} className="text-cyan-500" />
              </div>
              <div>
                <p className="text-sm font-black text-black dark:text-white uppercase truncate max-w-[150px]">{userInfo.name}</p>
                <p className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest">{userInfo.role || 'Member'}</p>
              </div>
            </div>
          )}

          {/* Mobile Navigation Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center h-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest active:bg-cyan-500/10 active:text-cyan-500 transition-all"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Mobile Footer Actions */}
          <div className="mt-auto space-y-3">
            <div className="flex justify-center w-full">
              {userInfo ? (
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full h-12 bg-cyan-500/10 text-cyan-500 rounded-xl text-[10px] font-bold uppercase">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center w-full h-12 bg-cyan-500 text-white dark:text-black rounded-xl text-[10px] font-bold uppercase">
                  Login
                </Link>
              )}
            </div>

            {userInfo && (
              <button onClick={handleLogout} className="w-full h-12 flex items-center justify-center gap-2 border border-red-500/20 text-red-500 bg-red-500/5 rounded-xl text-[10px] font-bold uppercase">
                <LogOut size={14} /> Terminate Session
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;