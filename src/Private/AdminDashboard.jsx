import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api'; 
import toast, { Toaster } from 'react-hot-toast';
import { 
  ShieldAlert, Package, CheckCircle, 
  Trash2, Briefcase, MessageSquare, 
  User, Users, Globe, Github, RefreshCw, AlertTriangle,
  GraduationCap, ExternalLink, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobilePortalMenu, setShowMobilePortalMenu] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  // Dynamic Base URL for images/avatars
  const BASE_URL = API.defaults.baseURL.replace('/api', '');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoints = {
        orders: '/orders',
        projects: '/projects',
        contacts: '/contact',
        users: '/users'
      };
      
      const res = await API.get(endpoints[activeTab]);
      const result = res.data;

      // Robust data extraction regardless of backend wrapper
      if (Array.isArray(result)) {
        setData(result);
      } else if (result.data && Array.isArray(result.data)) {
        setData(result.data);
      } else {
        setData(result.users || result.projects || result.orders || result.contacts || []);
      }
    } catch (err) {
      setError(err.response?.status === 403 ? "INSUFFICIENT_PERMISSIONS" : "SIGNAL_LOST");
      toast.error("DATA_FETCH_FAILED");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      setError("ACCESS_DENIED: ADMINISTRATIVE_CLEARANCE_REQUIRED");
      return;
    }
    fetchData();
  }, [fetchData, userInfo]);

  const getImageUrl = (url) => {
    if (!url) return 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
  };

  // --- ACTIONS ---

  const handleVerifyOrder = async (id) => {
    try {
      await API.put(`/orders/${id}/confirm`);
      setData(prev => 
        prev.map(item => item._id === id ? { ...item, status: 'Confirmed' } : item)
      );
      toast.success("ORDER_VERIFIED");
    } catch (err) {
      toast.error("VERIFICATION_FAILED");
    }
  };

  const handleApproveProject = async (id) => {
    try {
      await API.put(`/projects/${id}/approve`);
      setData(prev => 
        prev.map(item => item._id === id ? { ...item, status: 'approved', isApproved: true } : item)
      );
      toast.success("PROJECT_APPROVED");
    } catch (err) {
      toast.error(err.response?.data?.message || "APPROVAL_FAILED");
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm("PERMANENTLY_PURGE_RECORD?")) return;
    try {
      const endpointMap = {
        orders: `/orders/${id}`,
        projects: `/projects/${id}`,
        contacts: `/contact/${id}`,
        users: `/users/${id}`
      };
      await API.delete(endpointMap[activeTab]);
      setData(prev => prev.filter(item => item._id !== id));
      toast.error("RECORD_DELETED", { icon: '🗑️' });
    } catch (err) {
      toast.error("PURGE_FAILED");
    }
  };

  // --- SUB-COMPONENTS ---

  const OrderTable = ({ data }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-white/5 text-cyan-700 dark:text-cyan-400 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Order_ID</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Client</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Amount</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Status</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10 text-center">Protocol</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((order) => (
            <tr key={order._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-mono text-cyan-600 dark:text-cyan-400">#{order._id?.slice(-6).toUpperCase()}</td>
              <td className="p-4">
                 <p className="text-slate-900 dark:text-white font-bold">{order.user?.name || 'Guest'}</p>
                 <p className="text-[9px] text-slate-400 dark:text-gray-500 uppercase tracking-tighter">{order.paymentMethod || 'UPI'}</p>
              </td>
              <td className="p-4 font-bold text-slate-900 dark:text-white">₹{Number(order.totalPrice || order.itemsPrice).toFixed(2)}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase border ${order.status === 'Confirmed' ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>
                  {order.status === 'Confirmed' ? 'VERIFIED' : 'PENDING'}
                </span>
              </td>
              <td className="p-4 text-center">
                 <div className="flex items-center justify-center gap-2">
                   {order.status !== 'Confirmed' && (
                     <button onClick={() => handleVerifyOrder(order._id)} className="text-emerald-600 dark:text-emerald-400 p-2 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Verify">
                       <CheckCircle size={16}/>
                     </button>
                   )}
                   <button onClick={() => handleDeleteEntry(order._id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors" title="Purge">
                     <Trash2 size={16}/>
                   </button>
                 </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const UserTable = ({ data }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-white/5 text-cyan-700 dark:text-cyan-400 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Identity</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Clearance</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Status</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((user) => (
            <tr key={user._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4 flex items-center gap-3">
                <img src={getImageUrl(user.avatar)} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 object-cover" />
                <div>
                  <p className="text-slate-900 dark:text-white font-bold">{user.name}</p>
                  <p className="text-[9px] text-slate-400 dark:text-gray-500">{user.email}</p>
                </div>
              </td>
              <td className="p-4">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${user.role === 'admin' ? 'text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/10' : 'text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10'}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${user.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-zinc-700'}`}></div>
                  <span className="text-[10px] uppercase text-slate-500 dark:text-gray-400">{user.isOnline ? 'Active' : 'Offline'}</span>
                </div>
              </td>
              <td className="p-4 text-center">
                {user.role !== 'admin' && (
                  <button onClick={() => handleDeleteEntry(user._id)} className="text-red-400 hover:text-red-600 dark:text-red-500/50 dark:hover:text-red-500 transition-colors">
                    <Trash2 size={16}/>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ProjectTable = ({ data }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-white/5 text-cyan-700 dark:text-cyan-400 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Source</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Project_Data</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Stack</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Status</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10 text-center">Protocol</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((project) => {
            const isApproved = project.isApproved || project.status === 'approved';
            return (
              <tr key={project._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] align-top transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold mb-1">
                    <User size={12} className="text-cyan-600 dark:text-cyan-500"/> {project.submittedBy || 'Anonymous'}
                  </div>
                  <p className="text-[9px] text-slate-400 dark:text-gray-500 lowercase">{project.email}</p>
                </td>
                <td className="p-4 max-w-sm">
                  <p className="text-cyan-700 dark:text-cyan-400 font-black uppercase mb-1">{project.title}</p>
                  <p className="text-[10px] text-slate-600 dark:text-gray-400 line-clamp-2 italic">"{project.description}"</p>
                  <div className="flex gap-3 mt-2">
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 dark:text-white/40 dark:hover:text-white transition-colors" title="GitHub"><Github size={12}/></a>}
                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-500/70 dark:hover:text-emerald-400 transition-colors" title="Live Link"><Globe size={12}/></a>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {project.techStack?.slice(0, 4).map((tag, i) => (
                      <span key={i} className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 px-2 py-0.5 rounded text-[8px] uppercase">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase border ${isApproved ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'}`}>
                    {isApproved ? 'APPROVED' : 'PENDING'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {!isApproved && (
                      <button 
                        onClick={() => handleApproveProject(project._id)} 
                        className="text-emerald-600 dark:text-emerald-400 p-2 hover:bg-emerald-500/10 rounded-lg transition-colors" 
                        title="Approve Project"
                      >
                        <CheckCircle size={16}/>
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteEntry(project._id)} 
                      className="text-red-400 hover:text-red-600 dark:text-red-500/40 dark:hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors" 
                      title="Purge"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const ContactTable = ({ data }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 dark:bg-white/5 text-cyan-700 dark:text-cyan-400 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Operator</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Subject</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10">Payload</th>
            <th className="p-4 border-b border-slate-200 dark:border-white/10 text-center">Delete</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((msg) => (
            <tr key={msg._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
              <td className="p-4">
                <p className="text-slate-900 dark:text-white font-bold">{msg.name || msg.operator}</p>
                <p className="text-[9px] text-slate-400 dark:text-gray-500">{msg.email || msg.channel}</p>
              </td>
              <td className="p-4 text-cyan-700 dark:text-cyan-400 font-bold uppercase">{msg.subject || msg.header}</td>
              <td className="p-4 max-w-xs truncate text-slate-600 dark:text-gray-300 italic">{msg.message || msg.payload}</td>
              <td className="p-4 text-center">
                <button onClick={() => handleDeleteEntry(msg._id)} className="text-red-400 hover:text-red-600 dark:text-red-500/50 dark:hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col items-center justify-center text-red-600 dark:text-red-500 font-mono p-6 text-center transition-colors">
        <ShieldAlert size={64} className="mb-4 animate-pulse" />
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4">{error}</h1>
        <button onClick={() => window.location.href = '/'} className="px-6 py-2.5 bg-white dark:bg-transparent border border-red-500/30 hover:bg-red-500/10 rounded-xl transition-all text-xs uppercase font-bold text-slate-900 dark:text-white shadow-sm">Return to Surface</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-gray-300 font-mono pt-20 transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Desktop Sidebar with Collapse/Expand */}
      <aside className={`hidden lg:flex ${isSidebarCollapsed ? 'w-20 p-3' : 'w-64 p-6'} bg-white dark:bg-white/[0.02] border-r border-slate-200 dark:border-white/10 flex-col gap-2 shrink-0 transition-all duration-300 relative`}>
        <div className={`mb-6 flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-2 px-0' : 'justify-between px-2'}`}>
          {!isSidebarCollapsed ? (
            <div>
              <h2 className="text-cyan-600 dark:text-cyan-400 font-black tracking-tighter text-xl uppercase italic">Flux_Control</h2>
              <p className="text-[9px] font-bold text-red-600 dark:text-red-500 tracking-widest uppercase">Clearance: Level_9</p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-black text-xs uppercase" title="Flux Control">
              FC
            </div>
          )}
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-white/10"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        
        <div className="space-y-1.5 flex-1">
          {[
            { id: 'orders', label: 'Orders_Log', icon: <Package size={18}/> },
            { id: 'projects', label: 'Projects_Net', icon: <Briefcase size={18}/> },
            { id: 'contacts', label: 'Message_Queue', icon: <MessageSquare size={18}/> },
            { id: 'users', label: 'Operator_DB', icon: <Users size={18}/> },
          ].map((btn) => (
            <button 
              key={btn.id}
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-3'} w-full rounded-xl transition-all group ${
                activeTab === btn.id 
                  ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30 shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.1)] font-bold' 
                  : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`} 
              onClick={() => setActiveTab(btn.id)}
              title={isSidebarCollapsed ? btn.label : undefined}
            >
              {React.cloneElement(btn.icon, { className: activeTab === btn.id ? "text-cyan-600 dark:text-cyan-400" : "group-hover:text-cyan-600 dark:group-hover:text-cyan-400" })} 
              {!isSidebarCollapsed && <span className="text-[10px] uppercase tracking-widest">{btn.label}</span>}
            </button>
          ))}

          {/* Quick Portal Access */}
          <div className={`pt-4 mt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5`}>
            {!isSidebarCollapsed && (
              <p className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-2">Event Portals</p>
            )}
            <Link
              to="/admin/events/recruitment-2026"
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'justify-between p-3'} rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-[10px] font-bold uppercase tracking-wider`}
              title="Recruitment 2026 Admin Portal"
            >
              <span className="flex items-center gap-2">
                <GraduationCap size={18} /> {!isSidebarCollapsed && 'Recruitment 2026'}
              </span>
              {!isSidebarCollapsed && <ExternalLink size={12} className="opacity-50" />}
            </Link>
            <Link
              to="/admin/events/fluxwave-2.0"
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center p-3' : 'justify-between p-3'} rounded-xl text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-purple-600 dark:hover:text-purple-400 transition-colors text-[10px] font-bold uppercase tracking-wider`}
              title="FluxWave Admin"
            >
              <span className="flex items-center gap-2">
                <Briefcase size={18} /> {!isSidebarCollapsed && 'FluxWave Admin'}
              </span>
              {!isSidebarCollapsed && <ExternalLink size={12} className="opacity-50" />}
            </Link>
          </div>
        </div>

        {/* Security Warning Box */}
        <div className={`mt-auto ${isSidebarCollapsed ? 'p-2 flex justify-center' : 'p-4'} bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl`}>
          {isSidebarCollapsed ? (
            <div title="System Security: Unauthorized access prohibited" className="text-red-600 dark:text-red-500 p-1">
              <AlertTriangle size={16} />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-red-600 dark:text-red-500 mb-1">
                <AlertTriangle size={12} />
                <span className="text-[9px] font-black uppercase">System Security</span>
              </div>
              <p className="text-[8px] text-slate-500 dark:text-gray-400 leading-relaxed uppercase">Unauthorized access to this terminal is a violation of Flux protocols.</p>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pb-28 lg:pb-10 overflow-y-auto custom-scrollbar">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-slate-900 dark:text-white tracking-tighter leading-none">{activeTab}</h1>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold mt-3 tracking-widest uppercase">
              Active_Records: <span className="text-slate-900 dark:text-white">{data.length}</span>
            </p>
          </div>
          
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-[10px] uppercase font-bold text-cyan-700 dark:text-cyan-400 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
            Sync_Database
          </button>
        </header>

        {loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-cyan-600 dark:text-cyan-400">
            <RefreshCw size={40} className="animate-spin mb-4" />
            <p className="text-[10px] font-mono animate-pulse uppercase tracking-[0.2em]">Decrypting_Data_Stream...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500">
             {activeTab === 'orders' && <OrderTable data={data} />}
             {activeTab === 'projects' && <ProjectTable data={data} />}
             {activeTab === 'contacts' && <ContactTable data={data} />}
             {activeTab === 'users' && <UserTable data={data} />} 
             
             {data.length === 0 && (
               <div className="p-20 text-center text-slate-400 dark:text-gray-500">
                 <Package size={48} className="mx-auto mb-4 opacity-40" />
                 <p className="text-xs uppercase font-bold tracking-widest">No_Records_Found_In_This_Matrix</p>
               </div>
             )}
          </div>
        )}
      </main>

      {/* Professional Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#0a0a0d]/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 px-2 py-2 shadow-2xl safe-area-pb">
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          {[
            { id: 'orders', label: 'Orders', icon: <Package size={18}/> },
            { id: 'projects', label: 'Projects', icon: <Briefcase size={18}/> },
            { id: 'contacts', label: 'Messages', icon: <MessageSquare size={18}/> },
            { id: 'users', label: 'Users', icon: <Users size={18}/> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMobilePortalMenu(false);
                }}
                className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2 w-8 h-1 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
                <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' : ''}`}>
                  {tab.icon}
                </div>
                <span className="text-[9px] uppercase tracking-tighter font-mono">{tab.label}</span>
              </button>
            );
          })}

          {/* Quick Event Portals menu button */}
          <div className="relative">
            <button
              onClick={() => setShowMobilePortalMenu(!showMobilePortalMenu)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all ${
                showMobilePortalMenu
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-all ${showMobilePortalMenu ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' : ''}`}>
                <GraduationCap size={18} />
              </div>
              <span className="text-[9px] uppercase tracking-tighter font-mono">Portals</span>
            </button>

            {showMobilePortalMenu && (
              <div className="absolute bottom-14 right-0 w-52 bg-white dark:bg-[#0e0e11] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 space-y-1 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-[60]">
                <p className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider px-2 py-1 border-b border-slate-100 dark:border-white/5">Event Portals</p>
                <Link
                  to="/admin/events/recruitment-2026"
                  onClick={() => setShowMobilePortalMenu(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-cyan-500/10 text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 text-[10px] font-bold uppercase transition-colors"
                >
                  <GraduationCap size={14} className="text-cyan-500 shrink-0" />
                  <span className="truncate">Recruitment 2026</span>
                </Link>
                <Link
                  to="/admin/events/fluxwave-2.0"
                  onClick={() => setShowMobilePortalMenu(false)}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-purple-500/10 text-slate-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 text-[10px] font-bold uppercase transition-colors"
                >
                  <Briefcase size={14} className="text-purple-500 shrink-0" />
                  <span className="truncate">FluxWave Admin</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
