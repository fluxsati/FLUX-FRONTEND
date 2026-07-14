import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import API from '../api'; 
import toast, { Toaster } from 'react-hot-toast';
import { 
  ShieldAlert, Package, CheckCircle, 
  Trash2, Briefcase, MessageSquare, 
  User, Users, Globe, Github, RefreshCw, AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        <thead className="bg-white/5 text-cyan-500 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="p-4 border-b border-white/10">Order_ID</th>
            <th className="p-4 border-b border-white/10">Client</th>
            <th className="p-4 border-b border-white/10">Amount</th>
            <th className="p-4 border-b border-white/10">Status</th>
            <th className="p-4 border-b border-white/10 text-center">Protocol</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((order) => (
            <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="p-4 font-mono text-cyan-400">#{order._id?.slice(-6).toUpperCase()}</td>
              <td className="p-4">
                 <p className="text-white font-bold">{order.user?.name || 'Guest'}</p>
                 <p className="text-[9px] opacity-40 uppercase tracking-tighter">{order.paymentMethod || 'UPI'}</p>
              </td>
              <td className="p-4 font-bold text-white">₹{Number(order.totalPrice || order.itemsPrice).toFixed(2)}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase border ${order.status === 'Confirmed' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'}`}>
                  {order.status === 'Confirmed' ? 'VERIFIED' : 'PENDING'}
                </span>
              </td>
              <td className="p-4 text-center">
                 <div className="flex items-center justify-center gap-2">
                   {order.status !== 'Confirmed' && (
                     <button onClick={() => handleVerifyOrder(order._id)} className="text-emerald-500 p-2 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Verify">
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
        <thead className="bg-white/5 text-cyan-500 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="p-4 border-b border-white/10">Identity</th>
            <th className="p-4 border-b border-white/10">Clearance</th>
            <th className="p-4 border-b border-white/10">Status</th>
            <th className="p-4 border-b border-white/10 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((user) => (
            <tr key={user._id} className="border-b border-white/5 hover:bg-white/[0.02]">
              <td className="p-4 flex items-center gap-3">
                <img src={getImageUrl(user.avatar)} alt="avatar" className="w-8 h-8 rounded-full border border-white/10 object-cover" />
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-[9px] opacity-40">{user.email}</p>
                </div>
              </td>
              <td className="p-4">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${user.role === 'admin' ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-cyan-500 border-cyan-500/20 bg-cyan-500/5'}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${user.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></div>
                  <span className="text-[10px] uppercase opacity-60">{user.isOnline ? 'Active' : 'Offline'}</span>
                </div>
              </td>
              <td className="p-4 text-center">
                {user.role !== 'admin' && (
                  <button onClick={() => handleDeleteEntry(user._id)} className="text-red-500/50 hover:text-red-500 transition-colors">
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
        <thead className="bg-white/5 text-cyan-500 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="p-4 border-b border-white/10">Source</th>
            <th className="p-4 border-b border-white/10">Project_Data</th>
            <th className="p-4 border-b border-white/10">Stack</th>
            <th className="p-4 border-b border-white/10 text-center">Purge</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((project) => (
            <tr key={project._id} className="border-b border-white/5 hover:bg-white/[0.02] align-top">
              <td className="p-4">
                <div className="flex items-center gap-2 text-white font-bold mb-1">
                  <User size={12} className="text-cyan-500"/> {project.submittedBy || 'Anonymous'}
                </div>
                <p className="text-[9px] opacity-40 lowercase">{project.email}</p>
              </td>
              <td className="p-4 max-w-sm">
                <p className="text-cyan-400 font-black uppercase mb-1">{project.title}</p>
                <p className="text-[10px] text-gray-400 line-clamp-2 italic">"{project.description}"</p>
                <div className="flex gap-3 mt-2">
                  {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors"><Github size={12}/></a>}
                  {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-emerald-500/70 hover:text-emerald-400 transition-colors"><Globe size={12}/></a>}
                </div>
              </td>
              <td className="p-4">
                <div className="flex gap-1 flex-wrap">
                  {project.techStack?.slice(0, 4).map((tag, i) => (
                    <span key={i} className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[8px] uppercase">{tag}</span>
                  ))}
                </div>
              </td>
              <td className="p-4 text-center">
                <button onClick={() => handleDeleteEntry(project._id)} className="text-red-500/40 hover:text-red-500"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ContactTable = ({ data }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-cyan-500 uppercase text-[10px] tracking-widest">
          <tr>
            <th className="p-4 border-b border-white/10">Operator</th>
            <th className="p-4 border-b border-white/10">Subject</th>
            <th className="p-4 border-b border-white/10">Payload</th>
            <th className="p-4 border-b border-white/10 text-center">Delete</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {data.map((msg) => (
            <tr key={msg._id} className="border-b border-white/5 hover:bg-white/[0.02]">
              <td className="p-4">
                <p className="text-white font-bold">{msg.name || msg.operator}</p>
                <p className="text-[9px] opacity-40">{msg.email || msg.channel}</p>
              </td>
              <td className="p-4 text-cyan-500 font-bold uppercase">{msg.subject || msg.header}</td>
              <td className="p-4 max-w-xs truncate opacity-70 italic">{msg.message || msg.payload}</td>
              <td className="p-4 text-center">
                <button onClick={() => handleDeleteEntry(msg._id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 font-mono p-6 text-center">
        <ShieldAlert size={64} className="mb-4 animate-pulse" />
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4">{error}</h1>
        <button onClick={() => window.location.href = '/'} className="px-6 py-2 border border-red-500/30 hover:bg-red-500/10 transition-all text-xs uppercase font-bold">Return to Surface</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-300 font-mono pt-20">
      <Toaster position="top-right" toastOptions={{ style: { background: '#000', color: '#fff', border: '1px solid #333', fontSize: '10px', fontFamily: 'monospace' }}} />
      
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white/[0.02] border-r border-white/10 p-6 flex-col gap-2 shrink-0">
        <div className="mb-8 px-2">
          <h2 className="text-cyan-500 font-black tracking-tighter text-xl uppercase italic">Flux_Control</h2>
          <p className="text-[9px] font-bold opacity-50 uppercase text-red-500 tracking-widest">Root Clearance: Level_9</p>
        </div>
        
        {[
          { id: 'orders', label: 'Orders_Log', icon: <Package size={16}/> },
          { id: 'projects', label: 'Projects_Net', icon: <Briefcase size={16}/> },
          { id: 'contacts', label: 'Message_Queue', icon: <MessageSquare size={16}/> },
          { id: 'users', label: 'Operator_DB', icon: <Users size={16}/> },
        ].map((btn) => (
          <button 
            key={btn.id}
            className={`flex items-center gap-3 p-4 rounded-xl transition-all group ${activeTab === btn.id ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'hover:bg-white/5 opacity-60 hover:opacity-100'}`} 
            onClick={() => setActiveTab(btn.id)}
          >
            {React.cloneElement(btn.icon, { className: activeTab === btn.id ? "text-cyan-400" : "group-hover:text-cyan-400" })} 
            <span className="text-[10px] font-bold uppercase tracking-widest">{btn.label}</span>
          </button>
        ))}

        <div className="mt-auto p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
           <div className="flex items-center gap-2 text-red-500 mb-1">
             <AlertTriangle size={12} />
             <span className="text-[9px] font-black uppercase">System Security</span>
           </div>
           <p className="text-[8px] opacity-50 leading-relaxed uppercase">Unauthorized access to this terminal is a violation of Flux protocols.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">{activeTab}</h1>
            <p className="text-[10px] text-cyan-500 font-bold mt-3 tracking-widest uppercase opacity-70">
              Active_Records: <span className="text-white">{data.length}</span>
            </p>
          </div>
          
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-[10px] uppercase font-bold text-cyan-500 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> 
            Sync_Database
          </button>
        </header>

        {loading && data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-cyan-500/50">
            <RefreshCw size={40} className="animate-spin mb-4" />
            <p className="text-[10px] font-mono animate-pulse uppercase tracking-[0.2em]">Decrypting_Data_Stream...</p>
          </div>
        ) : (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             {activeTab === 'orders' && <OrderTable data={data} />}
             {activeTab === 'projects' && <ProjectTable data={data} />}
             {activeTab === 'contacts' && <ContactTable data={data} />}
             {activeTab === 'users' && <UserTable data={data} />} 
             
             {data.length === 0 && (
               <div className="p-20 text-center opacity-20">
                 <Package size={48} className="mx-auto mb-4" />
                 <p className="text-xs uppercase font-bold tracking-widest">No_Records_Found_In_This_Matrix</p>
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;