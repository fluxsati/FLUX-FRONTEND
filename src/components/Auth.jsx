import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../slices/authSlices';
import { login, register } from '../api';
import { ShieldCheck, ArrowRight, UserPlus, Key, Lock, User, Eye, EyeOff } from 'lucide-react';

const Auth = ({ isLoginMode = true }) => {
  const [isLogin, setIsLogin] = useState(isLoginMode);
  const [authType, setAuthType] = useState('member');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsLogin(isLoginMode);
    setError('');
  }, [isLoginMode]);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      const targetPath = userInfo.role === 'admin' ? '/admin' : '/dashboard';
      if (location.pathname !== targetPath) {
        navigate(targetPath, { replace: true });
      }
    }
  }, [userInfo, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = isLogin ? await login(formData) : await register(formData);
      dispatch(setCredentials({ ...data }));
      const target = data.role === 'admin' ? '/admin' : '/dashboard';
      navigate(target, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Authentication Failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Added responsive padding and adjusted items-center for better mobile viewport handling */
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] transition-colors duration-500 flex items-center justify-center px-4 sm:px-6 py-12 relative overflow-hidden">

      {/* Background Glow - Scaled down for mobile */}
      <div className={`absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none transition-colors duration-500 ${authType === 'admin' ? 'bg-red-500/10' : 'bg-cyan-500/10'}`}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Adjusted padding for mobile (p-6) vs desktop (p-10) */}
        <div className={`bg-white/80 dark:bg-white/[0.02] backdrop-blur-3xl border p-6 sm:p-10 rounded-3xl shadow-2xl relative transition-all duration-500 ${authType === 'admin' ? 'border-red-500/20 shadow-red-500/5' : 'border-gray-200 dark:border-white/10'}`}>

          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 transition-colors duration-500" style={{ color: authType === 'admin' ? '#ef4444' : '#0891b2' }}></div>

          <div className="text-center mb-6 sm:mb-8">
            {/* Responsive text size for the heading */}
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
              {isLogin ? 'Initialize_Access' : 'Create_Identity'}
            </h2>

            <div className="flex justify-center mt-6 p-1 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setAuthType('member')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-mono transition-all ${authType === 'member' ? 'bg-cyan-600 text-white shadow-lg' : 'text-gray-500 hover:text-cyan-500'}`}
              >
                <User size={12} /> <span className="hidden xs:inline">MEMBER_PORTAL</span><span className="xs:hidden">MEMBER</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthType('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-mono transition-all ${authType === 'admin' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Lock size={12} /> <span className="hidden xs:inline">ADMIN_PORTAL</span><span className="xs:hidden">ADMIN</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-500 text-[10px] font-mono uppercase animate-pulse tracking-widest leading-relaxed">
              Signal_Error: {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {!isLogin && authType !== 'admin' && (
              <div className="relative">
                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/40" size={18} />
                <input
                  type="text"
                  placeholder="FULL_NAME"
                  className="w-full bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 sm:py-4 pl-12 pr-4 text-gray-900 dark:text-white text-xs font-mono outline-none focus:border-cyan-500 transition-all"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="relative">
              <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${authType === 'admin' ? 'text-red-500/40' : 'text-cyan-500/40'}`} size={18} />
              <input
                type="email"
                placeholder={authType === 'admin' ? "ADMIN_EMAIL" : "EMAIL_ADDRESS"}
                className={`w-full bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 sm:py-4 pl-12 pr-4 text-gray-900 dark:text-white text-xs font-mono outline-none transition-all ${authType === 'admin' ? 'focus:border-red-500' : 'focus:border-cyan-500'}`}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <Key className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${authType === 'admin' ? 'text-red-500/40' : 'text-cyan-500/40'}`} size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={authType === 'admin' ? "PASSWORD" : "PASSWORD"}
                className={`w-full bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 sm:py-4 pl-12 pr-12 text-gray-900 dark:text-white text-xs font-mono outline-none transition-all ${authType === 'admin' ? 'focus:border-red-500' : 'focus:border-cyan-500'}`}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              disabled={loading}
              className={`w-full group relative py-3.5 sm:py-4 rounded-xl font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 text-white overflow-hidden ${authType === 'admin' ? 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:bg-red-500' : 'bg-cyan-600 shadow-[0_0_20px_rgba(8,145,178,0.2)] hover:bg-cyan-500'}`}
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              {loading ? 'Processing...' : (
                <div className="relative z-10 flex items-center gap-3">
                  {isLogin ? 'Authenticate' : 'Establish Identity'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {authType !== 'admin' && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[12px] font-mono text-gray-500 dark:text-gray-400 hover:text-cyan-600 uppercase tracking-widest transition-colors block w-full"
              >
                {isLogin ? "Need a new identity? Create_One" : "Already registered? Return_to_Login"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
