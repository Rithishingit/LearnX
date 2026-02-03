import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Sparkles, BookOpen, Shield, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'learnx_chatbot_state_v1';

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const LearnXAI = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY));
    if (saved?.messages?.length) return saved.messages;
    return [
      {
        id: 'welcome',
        role: 'bot',
        text:
          "Hi! I’m the LearnX assistant. I can help you find courses, explain features, and guide you around the app. What are you looking for today?",
      },
    ];
  });

  const quickReplies = useMemo(
    () => [
      { label: 'Browse courses', action: 'NAV:/courses', icon: BookOpen },
      { label: 'How do I enroll?', action: 'FAQ:ENROLL', icon: HelpCircle },
      { label: 'Reset my password', action: 'FAQ:RESET', icon: Shield },
    ],
    []
  );

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ open, messages }));
  }, [open, messages]);

  // Auto-scroll
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [open, messages]);

  // Add a helpful “context” message when route changes (only if open)
  useEffect(() => {
    if (!open) return;
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      const text = `You’re currently on: ${location.pathname}`;
      if (last?.role === 'system' && last?.text === text) return prev;
      return [...prev, { id: `route:${Date.now()}`, role: 'system', text }];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const pushBot = (text) => {
    setMessages((prev) => [...prev, { id: `b:${Date.now()}`, role: 'bot', text }]);
  };

  const pushUser = (text) => {
    setMessages((prev) => [...prev, { id: `u:${Date.now()}`, role: 'user', text }]);
  };

  const handleAction = (action) => {
    if (action.startsWith('NAV:')) {
      const path = action.slice('NAV:'.length);
      pushBot(`Opening ${path}…`);
      navigate(path);
      return;
    }

    if (action === 'FAQ:ENROLL') {
      pushBot(
        "To enroll: open a course → click ‘Enroll for Free’ (or ‘Enroll Now’ for paid, coming soon). If you’re not signed in, we’ll take you to Login and return you back."
      );
      return;
    }

    if (action === 'FAQ:RESET') {
      pushBot(
        "To reset your password: go to Login → ‘Forgot password’ → enter your email. You’ll get a reset link."
      );
      return;
    }

    pushBot("I didn’t understand that action, but I’m here to help!");
  };

  const respond = (text) => {
    const t = text.trim().toLowerCase();

    if (t.includes('course') || t.includes('courses') || t.includes('browse')) {
      pushBot('Sure — want to browse all courses?');
      pushBot('Tip: use search and category filters on the Courses page.');
      return;
    }

    if (t.includes('enroll')) {
      pushBot(
        "Enroll by opening a course and clicking the enroll button. If you’re already enrolled, you’ll see ‘Start Learning’ / ‘Continue’."
      );
      return;
    }

    if (t.includes('certificate')) {
      pushBot(
        'Certificates appear after completing a course. You can check them in your Dashboard / Profile sections.'
      );
      return;
    }

    if (t.includes('wishlist')) {
      pushBot('Wishlist is available from the top navbar icon. Save courses you want to learn later.');
      return;
    }

    if (t.includes('leaderboard')) {
      pushBot('Leaderboard shows top learners. Keep your streak and complete courses to climb up.');
      return;
    }

    if (t.includes('login') || t.includes('sign in')) {
      pushBot('You can sign in from the top right, or go to /login.');
      return;
    }

    // Friendly default
    pushBot(
      "Got it. Tell me what you want to do (e.g., ‘browse courses’, ‘enroll’, ‘reset password’, ‘dashboard’), and I’ll guide you."
    );
  };

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    pushUser(text);
    respond(text);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen((v) => !v)}
          className="relative flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
          aria-label={open ? 'Close chat' : 'Open chat'}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="hidden sm:inline">LearnX Chat</span>
          {!open && (
            <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-amber-400 text-slate-900 text-xs font-bold flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </span>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] sm:w-[420px]"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
                <div>
                  <div className="font-bold text-lg">LearnX Assistant</div>
                  <div className="text-xs text-white/70">
                    {user ? `Signed in as ${user?.name?.split(' ')[0]}` : 'Not signed in'}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div ref={listRef} className="h-[340px] overflow-y-auto px-4 py-4 bg-gray-50">
                <div className="space-y-3">
                  {messages.map((m) => {
                    if (m.role === 'system') {
                      return (
                        <div key={m.id} className="text-center text-xs text-gray-400">
                          {m.text}
                        </div>
                      );
                    }

                    const isUser = m.role === 'user';
                    return (
                      <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm border ${
                            isUser
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-800 border-gray-200'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="px-4 pt-3 bg-white">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleAction(q.action)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800"
                    >
                      <q.icon className="w-4 h-4 text-indigo-600" />
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSend();
                    }}
                    placeholder="Ask about courses, enrollment, dashboard…"
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    onClick={onSend}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg"
                    aria-label="Send"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-gray-400">
                  This assistant provides guidance inside LearnX (no external browsing).
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LearnXAI;
