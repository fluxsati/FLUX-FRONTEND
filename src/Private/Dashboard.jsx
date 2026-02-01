import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import {
  User, ShoppingCart, Plus, X, CheckCircle,
  Clock, CreditCard, Activity, Copy, AlertCircle, List
} from 'lucide-react';
import { addToCart, removeFromCart, clearCart } from '../slices/cartSlice';
import api from '../api';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems, totalPrice } = useSelector((state) => state.cart);

  const [products, setProducts] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [notification, setNotification] = useState({ title: "", type: "" });
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Dynamic Base URL for Images and Sockets
  const BASE_URL = api.defaults.baseURL.replace('/api', '');

  const upiIds = ["flux.terminal@okaxis", "admin.flux@upi", "node.payment@ybl"];

  const fetchData = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders/myorders')
      ]);
      setProducts(prodRes.data);
      setMyOrders(orderRes.data);
    } catch (err) {
      console.error("System sync error");
    }
  };

  useEffect(() => {
    fetchData();

    // Connect socket to the dynamic Base URL
    const socket = io(BASE_URL);
    if (userInfo) {
      socket.emit('join', userInfo._id);

      socket.on('notification', (data) => {
        const isRejection = data.title.toLowerCase().includes('rejected') ||
          data.title.toLowerCase().includes('purged');

        setNotification({
          title: data.title,
          type: isRejection ? 'error' : 'success'
        });

        if (isRejection) {
          toast.error(data.title, {
            style: { background: '#7f1d1d', color: '#fff', fontSize: '12px', border: '1px solid #ef4444' }
          });
        }

        fetchData();
        setTimeout(() => setNotification({ title: "", type: "" }), 6000);
      });
    }
    return () => socket.disconnect();
  }, [userInfo, BASE_URL]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to terminal`, {
      style: { borderRadius: '12px', background: '#0f172a', color: '#fff', fontSize: '12px' },
    });
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    try {
      await api.post('/orders', {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        paymentMethod,
        itemsPrice: totalPrice,
      });

      setShowCart(false);
      setShowSuccessModal(true);
      dispatch(clearCart());
      fetchData();
    } catch (err) {
      toast.error("Transaction Failed: System Busy");
    }
  };

  const getImageUrl = (url) => url?.startsWith('http') ? url : `${BASE_URL}${url || '/placeholder.png'}`;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] text-slate-900 dark:text-gray-100 pt-20 md:pt-28 pb-12 px-4 md:px-8 font-sans transition-colors duration-300">
      <Toaster position="bottom-center" />

      {/* Dynamic Notification Bar */}
      {notification.title && (
        <div className="fixed top-16 md:top-20 left-1/2 -translate-x-1/2 z-[600] w-full max-w-xl px-4 animate-in slide-in-from-top duration-500">
          <div className={`${notification.type === 'error' ? 'bg-red-950 border-red-500/50' : 'bg-slate-900 border-indigo-500/30'} text-white px-4 md:px-6 py-3 rounded-2xl shadow-2xl border flex items-center gap-3`}>
            <Activity size={18} className={`${notification.type === 'error' ? 'text-red-400' : 'text-indigo-400'} animate-pulse`} />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider flex-1 leading-tight">{notification.title}</span>
            <button onClick={() => setNotification({ title: "", type: "" })} className="shrink-0"><X size={16} /></button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: System Profile */}
        <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
          <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col lg:max-h-[75vh] transition-colors">
            <div className="bg-slate-900 p-6 text-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                  <User size={24} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-black text-base md:text-lg uppercase tracking-tight truncate">{userInfo?.name}</h2>
                  <p className="text-[9px] md:text-[10px] text-indigo-300 font-bold uppercase tracking-widest">{userInfo?.role}</p>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <List size={14} /> Node History
                </h3>
                <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded font-bold text-slate-500 dark:text-slate-300">
                  {myOrders.length}
                </span>
              </div>

              <div className="space-y-4 overflow-y-auto max-h-60 lg:max-h-none pr-2 custom-scrollbar flex-1">
                {myOrders.length > 0 ? (
                  myOrders.map(order => (
                    <div key={order._id} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl flex flex-col gap-3 group hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">ID_{order._id.slice(-6).toUpperCase()}</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                        </div>
                        <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase border transition-colors ${order.status === 'Confirmed'
                          ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                          : 'text-amber-600 bg-amber-50 border-amber-100'
                          }`}>
                          {order.status === 'Confirmed' ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200/50 dark:border-white/10">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white dark:bg-white/5 p-1.5 rounded-xl border border-slate-100 dark:border-white/5 pr-3">
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="w-6 h-6 object-contain rounded-md bg-slate-50 dark:bg-white/10"
                            />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{item.name}</span>
                              <span className="text-[8px] text-indigo-500 font-mono">qty: {item.qty}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Transaction Total</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white font-mono">₹{Number(order.totalPrice || order.itemsPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <AlertCircle size={20} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">No Active Nodes Found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-6 md:p-8 rounded-2xl shadow-xl text-white text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Pending Allocation</p>
            <h2 className="text-3xl md:text-4xl font-black mb-6 font-mono tracking-tighter">₹{totalPrice}</h2>
            <button
              onClick={() => setShowCart(true)}
              className="w-full py-4 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase shadow-lg hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <ShoppingCart size={18} /> Terminal Checkout ({cartItems.length})
            </button>
          </div>
        </div>

        {/* RIGHT: Marketplace */}
        <div className="lg:col-span-9 order-1 lg:order-2">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-slate-200 pb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Marketplace</h1>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">Inventory Access Terminal</p>
            </div>
            <div className="flex self-start items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 text-[10px] font-black uppercase">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Systems Live
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group overflow-hidden shadow-sm hover:shadow-xl">
                <div className="h-48 md:h-52 bg-slate-50 dark:bg-white/5 relative flex items-center justify-center p-8">
                  <img src={getImageUrl(product.image)} alt={product.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1 text-base md:text-lg">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4 md:mt-6">
                    <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">₹{product.price}</p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 active:scale-90 transition-all flex items-center gap-2 px-4"
                    >
                      <Plus size={18} />
                      <span className="text-[10px] font-black uppercase">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SIDE CART */}
      {showCart && (
        <div className="fixed inset-0 z-[700] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="relative w-full sm:max-w-md bg-white dark:bg-[#0a0a0a] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 md:p-8 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h2 className="font-black uppercase tracking-tighter text-xl md:text-2xl">Terminal Cart</h2>
                <p className="text-[10px] text-indigo-300 font-bold tracking-widest uppercase mt-1">Order Manifest v1.0</p>
              </div>
              <button onClick={() => setShowCart(false)} className="hover:bg-white/10 p-2 md:p-3 rounded-2xl shrink-0"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 opacity-50">
                  <ShoppingCart size={48} />
                  <p className="text-xs font-black uppercase">Cart Empty</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 md:gap-5">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-2 shrink-0">
                      <img src={getImageUrl(item.image)} className="w-full h-full object-contain" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] md:text-[11px] font-black text-slate-800 dark:text-white uppercase truncate">{item.name}</h4>
                      <p className="text-sm text-indigo-600 font-black font-mono">₹{item.price} <span className="text-slate-400 font-medium text-[10px]">x {item.qty}</span></p>
                    </div>
                    <button onClick={() => dispatch(removeFromCart(item._id))} className="text-slate-300 hover:text-red-500 shrink-0"><X size={20} /></button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 md:p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 space-y-4 md:space-y-6 shrink-0">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Gateway</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'UPI', icon: <CreditCard size={18} /> },
                    { id: 'COD', icon: <Clock size={18} /> }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl border-2 transition-all ${paymentMethod === method.id ? 'border-indigo-600 bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-md' : 'border-transparent bg-slate-200/50 dark:bg-white/5 text-slate-400'}`}
                    >
                      {method.icon}
                      <span className="text-[9px] font-black uppercase">{method.id}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Available VPA Nodes:</p>
                    <div className="space-y-2">
                      {upiIds.map((id) => (
                        <div key={id} className="bg-white dark:bg-white/5 border border-indigo-200 dark:border-indigo-500/30 p-2 rounded-xl flex justify-between items-center px-4 overflow-hidden">
                          <code className="text-[9px] md:text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 truncate mr-2">{id}</code>
                          <button onClick={() => { navigator.clipboard.writeText(id); toast.success("Copied"); }} className="text-indigo-400 hover:text-indigo-600 shrink-0"><Copy size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end pb-2">
                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Total Valuation</span>
                <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter">₹{totalPrice}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full py-4 md:py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase text-[11px] md:text-xs tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                Execute Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 md:p-6 backdrop-blur-md">
          <div className="absolute inset-0 bg-slate-900/80" onClick={() => setShowSuccessModal(false)}></div>
          <div className="relative bg-white dark:bg-[#0a0a0a] w-full max-w-sm p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center transform animate-in zoom-in duration-300 border dark:border-white/10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 rotate-12">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">Success</h2>
            <p className="text-[11px] md:text-xs text-slate-500 mb-8 md:mb-10 leading-relaxed font-bold uppercase">
              {paymentMethod === 'COD'
                ? "Order placed. Submit funds at Flux office within 1 hour to prevent cancellation."
                : "Order initiated. Verification call incoming shortly."
              }
            </p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest">Return to Console</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;