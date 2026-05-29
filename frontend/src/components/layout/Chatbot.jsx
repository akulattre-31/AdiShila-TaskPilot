import React, { useState, useRef, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { storage } from '../../lib/storage';
import { MessageSquare, X, Send, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { apiCall } = useApi();
  const profile = storage.get('taskpilot_profile') || {};
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e, directMessage = null) => {
    if (e) e.preventDefault();
    const msgToSend = directMessage || input;
    if (!msgToSend.trim() || loading) return;

    const userMsg = msgToSend.trim();
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    if (!directMessage) setInput('');
    setLoading(true);

    try {
      const res = await apiCall('/api/chat', 'POST', { message: userMsg, profile });
      setMessages(prev => [...prev, { text: res.response, sender: 'bot' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Error communicating with Adishila Core. Try again later.", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary-container rounded-full shadow-clay border border-white/20 hover:shadow-clay-hover transition-all z-50 flex items-center justify-center animate-float group"
        >
          <div className="absolute inset-0 bg-primary rounded-full blur-[20px] opacity-40 group-hover:opacity-80 transition-opacity"></div>
          <Cpu size={24} className="relative z-10" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] liquid-glass flex flex-col rounded-2xl overflow-hidden z-50 animate-fade-in shadow-clay-glow border border-primary/20">
          
          {/* Header */}
          <div className="p-5 bg-black/40 border-b border-primary/20 flex justify-between items-center relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#ff5500]"></div>
            <div className="flex items-center text-primary font-headline-lg-mobile text-[16px]">
              <Cpu size={18} className="mr-3 drop-shadow-[0_0_8px_rgba(255,85,0,0.8)]" />
              <span>Adishila Core</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
            {messages.length === 0 && (
              <div className="flex flex-col h-full">
                <div className="text-center text-on-surface-variant text-[12px] mt-4 font-label-caps tracking-widest leading-loose mb-6 uppercase">
                  Initiating handshake... <br/> Adishila Core online.
                </div>
                <div className="flex flex-col gap-3 mt-auto">
                  <div className="font-label-caps text-[10px] text-on-surface-variant px-2 uppercase tracking-widest">Suggested queries:</div>
                  <button onClick={() => handleSend(null, "How do I submit a task?")} className="text-[13px] bg-black/40 text-primary hover:bg-primary/20 border border-primary/20 py-3 px-4 rounded-xl text-left transition-colors shadow-inner font-body-md">How do I submit a task?</button>
                  <button onClick={() => handleSend(null, "What is my next recommended task?")} className="text-[13px] bg-black/40 text-primary hover:bg-primary/20 border border-primary/20 py-3 px-4 rounded-xl text-left transition-colors shadow-inner font-body-md">What is my next recommended task?</button>
                  <button onClick={() => handleSend(null, "Raise a query")} className="text-[13px] bg-black/40 text-primary hover:bg-primary/20 border border-primary/20 py-3 px-4 rounded-xl text-left transition-colors shadow-inner font-body-md">Raise a query</button>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-[13px] shadow-clay ${msg.sender === 'user' ? 'bg-primary text-on-primary-container rounded-2xl rounded-br-sm font-medium border border-white/20' : 'bg-black/60 text-on-surface border border-primary/20 rounded-2xl rounded-bl-sm prose prose-sm prose-invert prose-orange'}`}>
                  {msg.sender === 'bot' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-4 rounded-2xl rounded-bl-sm text-sm bg-black/60 border border-primary/20 flex items-center gap-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-[0_0_8px_#ff5500]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-[0_0_8px_#ff5500] delay-100"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-[0_0_8px_#ff5500] delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-black/60 border-t border-primary/20 backdrop-blur-md relative z-10">
            <form onSubmit={handleSend} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Query the Core..."
                className="flex-1 bg-black/40 text-on-surface text-[13px] font-body-md rounded-xl border border-white/10 px-4 py-3 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_rgba(255,85,0,0.2)] transition-all"
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="clay-button text-on-primary-container disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none p-3 rounded-xl transition-colors flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
