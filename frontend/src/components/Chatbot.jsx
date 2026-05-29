import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useApi } from '../hooks/useApi';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([
    { sender: 'bot', text: 'Hello! I am your TaskPilot AI. How can I help you navigate your dashboard today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const { apiCall } = useApi();

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = message;
    setHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await apiCall('/api/chat', { method: 'POST', body: JSON.stringify({ message: userMsg }) });
      setHistory(prev => [...prev, { sender: 'bot', text: res?.reply || "I couldn't process that." }]);
    } catch (error) {
      setHistory(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error connecting to the AI core.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div 
        className="fixed bottom-6 right-6 z-50 cursor-pointer heavy-clay-btn flex items-center justify-center p-4 rounded-full"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={32} color="var(--aureate-gold)" />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 h-96 heavy-clay-card z-50 flex flex-col p-4"
          >
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <h3 className="text-[var(--aureate-gold)] font-bold">AI Assistant</h3>
              <X className="cursor-pointer hover:text-white" onClick={() => setIsOpen(false)} />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2 px-3 rounded-xl max-w-[80%] text-sm ${msg.sender === 'user' ? 'bg-[var(--aureate-gold)] text-black' : 'bg-white/10 text-white/90'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-white/50 text-xs">AI is typing...</div>}
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask something..."
                className="flex-1 bg-black/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-[var(--aureate-gold)]"
              />
              <button onClick={sendMessage} className="p-2 bg-[var(--aureate-gold)] rounded-lg hover:bg-yellow-600 transition">
                <Send size={16} color="black" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
