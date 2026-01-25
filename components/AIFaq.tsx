
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles } from 'lucide-react';
import { chatWithAI } from '../services/gemini';
import { ChatMessage } from '../types';

export const AIFaq: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I represent the SKH team. Ask me about our services, pricing, or how we can automate your business.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await chatWithAI(userMsg.text, messages);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, our team system is having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-brand-600 to-indigo-600 rounded-full shadow-2xl shadow-brand-500/30 flex items-center justify-center text-white hover:scale-105 transition-all duration-300 group border border-white/10"
        >
          <MessageSquare size={28} className="group-hover:hidden" />
          <Sparkles size={28} className="hidden group-hover:block animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[550px] glass-panel border border-slate-700/50 rounded-3xl flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Chat Header */}
          <div className="bg-slate-900/95 p-5 border-b border-slate-800 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center p-1.5 shadow-inner">
                 <img src="https://files.catbox.moe/rx7p0x.jpg" alt="SKH" className="w-full h-full object-cover rounded-lg brightness-110" />
              </div>
              <div>
                 <h3 className="text-white font-black text-sm font-display tracking-tight uppercase">SKH Assistant</h3>
                 <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Protocol_Active</span>
                 </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-xl hover:bg-slate-700">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-950/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-[1.5rem] px-6 py-4 text-sm leading-relaxed shadow-xl ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 rounded-[1.5rem] rounded-bl-none px-5 py-4 flex items-center gap-1.5 border border-slate-700 shadow-xl">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-slate-900/95 border-t border-slate-800 flex gap-3 backdrop-blur-md">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Query architectural team..."
              className="flex-1 bg-slate-800/50 text-white text-sm rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-brand-500/50 border border-slate-700 placeholder-slate-600 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-4 bg-brand-600 rounded-2xl text-white hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-brand-500/20 active:scale-90"
            >
              {isTyping ? <Loader2 size={20} className="animate-spin"/> : <Send size={20} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
