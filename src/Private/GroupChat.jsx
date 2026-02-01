import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'; // Added Redux hook
import { Send, MessageSquare, Cpu, Wifi, ShieldCheck } from 'lucide-react';
import api from '../api';
import { io } from 'socket.io-client';

const GroupChat = () => {
  // 1. Grab user directly from Redux Store
  const { userInfo } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef();
  // Dynamic Base URL for Socket
  const BASE_URL = api.defaults.baseURL.replace('/api', '');

  // Keep socket reference
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(BASE_URL);
    socketRef.current.emit("join_room", "general");

    const handleMessage = (msg) => {
      setMessages(prev => {
        // ID-based check is better if your backend provides a message ID, 
        // otherwise this content-time check works well.
        const isDuplicate = prev.some(m =>
          m.time === msg.time &&
          m.content === msg.content &&
          m.senderId === msg.senderId
        );
        if (isDuplicate) return prev;
        return [...prev, msg];
      });
    };

    socketRef.current.on("receive_message", handleMessage);

    return () => {
      socketRef.current.off("receive_message", handleMessage);
      socketRef.current.disconnect();
    };
  }, [BASE_URL]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (input.trim()) {
      const msgData = {
        senderName: userInfo?.name || "Anonymous",
        senderId: userInfo?._id || userInfo?.id,
        content: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      socketRef.current.emit("send_message", msgData);

      // OPTIONAL: If your backend "broadcasts" to everyone INCLUDING the sender,
      // remove this setMessages to avoid seeing your own message twice.
      setMessages(prev => [...prev, msgData]);

      setInput("");
    }
  };

  return (
    <div className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col h-full shadow-2xl relative transition-colors duration-500">

      {/* CHAT HEADER */}
      <div className="p-6 border-b border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-zinc-900/20 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="p-2.5 bg-cyan-500/10 rounded-2xl">
              <MessageSquare size={20} className="text-cyan-600 dark:text-cyan-500" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0a0a0a] rounded-full animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-black uppercase tracking-tighter text-sm text-gray-900 dark:text-white">Internal_Comms</h3>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 opacity-70">
              <ShieldCheck size={10} />
              <p className="text-[9px] font-mono tracking-widest uppercase">Node: Flux_Mainframe</p>
            </div>
          </div>
        </div>
        <Cpu size={20} className="text-gray-300 dark:text-zinc-700 animate-spin-slow" />
      </div>

      {/* MESSAGES FLOW */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-transparent">
        {messages.map((msg, i) => {
          // Compare with Redux userInfo
          const isMe = msg.senderId === (userInfo?._id || userInfo?.id);

          return (
            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group animate-in slide-in-from-bottom-2`}>
              <div className={`flex items-center gap-2 mb-1 px-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-[9px] font-bold font-mono text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
                  {msg.senderName}
                </span>
                <span className="text-[8px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  [{msg.time}]
                </span>
              </div>

              <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-xs leading-relaxed shadow-sm transition-all
                ${isMe
                  ? 'bg-cyan-600 text-white rounded-tr-none shadow-cyan-500/20'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-tl-none'
                }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} className="h-2 w-full" />
      </div>

      {/* INPUT AREA */}
      <form onSubmit={sendMessage} className="p-6 bg-gray-50 dark:bg-zinc-900/40 backdrop-blur-xl border-t border-gray-200 dark:border-white/10">
        <div className="flex gap-3 relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYPE_SIGNAL_HERE..."
            className="flex-1 bg-white dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-mono outline-none focus:border-cyan-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 z-10"
          />
          <button
            type="submit"
            className="px-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl transition-all group active:scale-95 shadow-lg shadow-cyan-600/20 z-10"
          >
            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupChat;