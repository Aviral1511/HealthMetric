import React, { useState, useRef, useEffect } from 'react';
import { askDataChatbot } from '../services/api';

const DataChatbot = ({ filters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([{ type: 'ai', text: "Ask me anything about the vaccine data trends!" }]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const userMessage = query;
    setQuery("");
    setChat(prev => [...prev, { type: 'user', text: userMessage }]);
    setLoading(true);
    
    try {
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""));
      const res = await askDataChatbot({ question: userMessage, filterContext: activeFilters });
      setChat(prev => [...prev, { type: 'ai', text: res.answer || "I couldn't analyze that." }]);
    } catch (e) {
      setChat(prev => [...prev, { type: 'error', text: "Connection to analytics server lost." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-6 right-6 z-100 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(79,70,229,0.4)] transition-all duration-300 hover:scale-110 cursor-pointer ${isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 scale-100'}`}
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <div className={`fixed bottom-6 right-6 z-100 w-[calc(100vw-3rem)] sm:w-96 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/60 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'}`}>
        <div className="bg-linear-to-r from-brand-600 to-indigo-700 p-4 pt-5 pb-5 flex justify-between items-center text-white shadow-sm relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-10 -mr-10 pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 border border-white/30 backdrop-blur-sm">🤖</div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Data Analyst AI</h3>
              <p className="text-indigo-200 text-xs font-medium">Ask specific dataset questions</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="opacity-70 hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition-colors relative z-10 cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 p-4 h-80 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 flex flex-col gap-4 custom-scrollbar">
          {chat.map((m, i) => (
            <div key={i} className={`flex max-w-[85%] ${m.type === 'user' ? 'self-end' : 'self-start text-left'}`}>
              <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed font-medium shadow-sm border ${
                m.type === 'user' 
                  ? 'bg-indigo-600 border-indigo-500 text-white rounded-br-sm' 
                  : (m.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700 rounded-bl-sm dark:bg-rose-900/20 dark:border-rose-900/50 dark:text-rose-400' : 'bg-white dark:bg-slate-800 border-[#e2e8f0] dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-sm')
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
             <div className="self-start flex max-w-[85%]">
               <div className="p-3.5 bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-3 border-t border-[#e2e8f0] dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
          <input 
            type="text" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="Type your question..." 
            className="flex-1 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 border border-transparent dark:border-slate-700 outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors" 
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()} 
            className="bg-indigo-600 text-white w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>
      </div>
    </>
  );
}

export default DataChatbot;
