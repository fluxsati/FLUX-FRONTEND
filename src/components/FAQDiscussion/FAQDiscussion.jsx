// src/components/FAQDiscussion/FAQDiscussion.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronUp, MessageSquare, ThumbsUp,
  Plus, Send, CheckCircle, X, Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CATEGORIES = ['General', 'Events', 'Projects', 'Membership', 'Other'];

const FAQDiscussion = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [answerForms, setAnswerForms] = useState({});
  const [newQuestion, setNewQuestion] = useState({ question: '', askedBy: '', category: 'General' });
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // --- Fetch all FAQs from backend ---
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/faq`);
      const data = await res.json();
      if (data.success) setFaqs(data.data);
      else setError('Failed to load questions');
    } catch (err) {
      setError('Could not connect to server. Is your backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFAQs(); }, []);

  // --- Submit a new question ---
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.question.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/faq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs([data.data, ...faqs]);
        setNewQuestion({ question: '', askedBy: '', category: 'General' });
        setShowAskForm(false);
      }
    } catch {
      alert('Failed to submit question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Submit an answer ---
  const handleSubmitAnswer = async (faqId) => {
    const form = answerForms[faqId];
    if (!form?.text?.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/faq/${faqId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: form.text, author: form.author || 'Anonymous' }),
      });
      const data = await res.json();
      if (data.success) {
        setFaqs(faqs.map(f => f._id === faqId ? data.data : f));
        setAnswerForms(prev => ({ ...prev, [faqId]: { text: '', author: '' } }));
      }
    } catch {
      alert('Failed to post answer.');
    }
  };

  // --- Upvote a question ---
  const handleUpvote = async (faqId, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_URL}/api/faq/${faqId}/upvote`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) setFaqs(faqs.map(f => f._id === faqId ? data.data : f));
    } catch {}
  };

  const filteredFaqs = activeFilter === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeFilter);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <section className="min-h-screen bg-[#0a0a0a] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            FAQ & Discussion
          </h2>
          <p className="text-gray-400 text-lg">
            Got questions? Our community has answers.
          </p>
        </motion.div>

        {/* ── Filter buttons + Ask button ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeFilter === cat
                    ? 'bg-cyan-500 border-cyan-500 text-black'
                    : 'border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAskForm(!showAskForm)}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full text-white font-semibold text-sm shadow-lg"
          >
            {showAskForm ? <X size={16} /> : <Plus size={16} />}
            {showAskForm ? 'Cancel' : 'Ask a Question'}
          </motion.button>
        </div>

        {/* ── Ask Question Form ── */}
        <AnimatePresence>
          {showAskForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-[#111] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Ask Your Question</h3>
                <form onSubmit={handleSubmitQuestion} className="space-y-4">
                  <textarea
                    value={newQuestion.question}
                    onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    placeholder="What would you like to know?"
                    rows={3}
                    required
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none transition-colors"
                  />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newQuestion.askedBy}
                      onChange={e => setNewQuestion({ ...newQuestion, askedBy: e.target.value })}
                      placeholder="Your name (optional)"
                      className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <select
                      value={newQuestion.category}
                      onChange={e => setNewQuestion({ ...newQuestion, category: e.target.value })}
                      className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-colors disabled:opacity-60"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Submit Question
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAQ List ── */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-cyan-400" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">{error}</div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No questions yet. Be the first to ask!
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => (
              <motion.div
                key={faq._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors"
              >
                {/* Question row */}
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-800">
                        {faq.category}
                      </span>
                      {faq.isResolved && (
                        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-800">
                          <CheckCircle size={10} /> Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-white font-medium text-[15px] leading-relaxed">{faq.question}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Asked by <span className="text-gray-400">{faq.askedBy || 'Anonymous'}</span></span>
                      <span>{formatDate(faq.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={11} />
                        {faq.answers.length} answer{faq.answers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Upvote + expand toggle */}
                  <div className="flex flex-col items-center gap-2 ml-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleUpvote(faq._id, e)}
                      className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                      <ThumbsUp size={14} />
                      <span className="text-xs">{faq.upvotes}</span>
                    </button>
                    {expandedId === faq._id
                      ? <ChevronUp size={18} className="text-gray-500" />
                      : <ChevronDown size={18} className="text-gray-500" />
                    }
                  </div>
                </div>

                {/* Expanded answers + answer form */}
                <AnimatePresence>
                  {expandedId === faq._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-800 px-5 pb-5 pt-4">

                        {/* Existing answers */}
                        {faq.answers.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {faq.answers.map((ans, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                  <p className="text-gray-300 text-sm leading-relaxed">{ans.text}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    — {ans.author || 'Anonymous'} · {formatDate(ans.createdAt)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Post an answer */}
                        <div className="mt-3">
                          <textarea
                            value={answerForms[faq._id]?.text || ''}
                            onChange={e => setAnswerForms(prev => ({
                              ...prev,
                              [faq._id]: { ...prev[faq._id], text: e.target.value }
                            }))}
                            placeholder="Write your answer..."
                            rows={2}
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none text-sm transition-colors"
                          />
                          <div className="flex items-center gap-3 mt-2">
                            <input
                              type="text"
                              value={answerForms[faq._id]?.author || ''}
                              onChange={e => setAnswerForms(prev => ({
                                ...prev,
                                [faq._id]: { ...prev[faq._id], author: e.target.value }
                              }))}
                              placeholder="Your name (optional)"
                              className="flex-1 bg-[#1a1a1a] border border-gray-700 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm transition-colors"
                            />
                            <button
                              onClick={() => handleSubmitAnswer(faq._id)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-colors"
                            >
                              <Send size={13} /> Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQDiscussion;