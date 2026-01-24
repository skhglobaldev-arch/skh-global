import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Hexagon } from 'lucide-react';
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
        <div className="w-[350px] sm:w-[400px] h-[500px] glass-panel border border-slate-700/50 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Chat Header */}
          <div className="bg-slate-900/90 p-4 border-b border-slate-700 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                 <Hexagon size={16} className="text-brand-400 fill-brand-400/20" />
              </div>
              <div>
                 <h3 className="text-white font-bold text-sm font-display">SKH Assistant</h3>
                 <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Online</span>
                 </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 p-1.5 rounded-md hover:bg-slate-700">
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/30">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-sm shadow-md'
                      : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 border border-slate-700">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-700 flex gap-2 backdrop-blur-md">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask the SKH team..."
              className="flex-1 bg-slate-800/50 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-500 border border-slate-700 placeholder-slate-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-brand-600 rounded-xl text-white hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/20"
            >
              {isTyping ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};