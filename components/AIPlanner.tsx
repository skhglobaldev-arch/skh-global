
import React, { useState, useEffect } from 'react';
import { generateProjectPlan, generateVisualDemo } from '../services/gemini';
import { Loader2, Copy, CheckCircle2, Layout, FileText, Zap, Cpu, Key, RefreshCcw, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppPreview } from './AppPreview';

export const AIPlanner: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [plan, setPlan] = useState('');
  const [demoData, setDemoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'demo'>('blueprint');
  const [errorState, setErrorState] = useState<'none' | 'auth' | 'overloaded'>('none');
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success as per guidelines to avoid race condition
      setHasKey(true);
      setErrorState('none');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setErrorState('none');
    setPlan('');
    setDemoData(null);
    setLoadingStep('Accessing Neural Substrate...');
    
    try {
      const planResult = await generateProjectPlan(idea);
      setPlan(planResult);

      setLoadingStep('Simulating Visual Interface...');
      const demoResult = await generateVisualDemo(idea);
      if (demoResult) {
        setDemoData(demoResult);
        setActiveTab('demo');
      } else {
        setActiveTab('blueprint');
      }
    } catch (err: any) {
      const msg = err?.message?.toLowerCase() || "";
      if (msg.includes("auth") || msg.includes("api_key") || msg.includes("not found")) {
        setErrorState('auth');
      } else if (msg.includes("503") || msg.includes("overloaded")) {
        setErrorState('overloaded');
      } else {
        setErrorState('none');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(plan);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!hasKey) {
    return (
      <div className="max-w-4xl mx-auto glass-panel p-16 rounded-[4rem] text-center border border-brand-500/20 shadow-2xl animate-in zoom-in duration-500">
        <Key className="text-brand-400 mx-auto mb-10 animate-pulse" size={64} />
        <h3 className="text-4xl font-display font-black text-white mb-6 uppercase tracking-tighter">Authorization Required</h3>
        <p className="text-slate-400 text-xl mb-12 font-light leading-relaxed max-w-lg mx-auto">
          To initialize the System Architect, you must select a valid Gemini API Key from a paid project.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={handleOpenKeyDialog}
            className="px-12 py-5 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-500 transition-all flex items-center justify-center gap-3 shadow-[0_20px_60px_rgba(14,165,233,0.3)]"
          >
            <Zap size={22} /> Connect Key
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            className="px-12 py-5 bg-slate-900 border border-slate-700 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
          >
            Billing Docs <ExternalLink size={18} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <div className="glass-panel rounded-[3.5rem] p-12 border border-slate-700 shadow-2xl relative overflow-hidden max-w-5xl mx-auto w-full bg-slate-950/40">
        <div className="flex items-center gap-8 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.1)]">
            <Cpu size={32} className={isLoading ? 'animate-spin' : ''} />
          </div>
          <div>
            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter">Lead Architect <span className="text-brand-400">GPT-3.0</span></h3>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-[0.3em]">Holographic Logic Engine</p>
          </div>
        </div>

        {errorState === 'auth' ? (
          <div className="p-10 rounded-3xl bg-red-500/10 border border-red-500/20 text-center animate-in fade-in zoom-in duration-500">
            <h4 className="text-xl font-bold text-white mb-4">Neural Link Severed</h4>
            <p className="text-slate-400 mb-8">The requested model was not found or the key is invalid. Please re-authorize.</p>
            <button onClick={handleOpenKeyDialog} className="px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-brand-50 transition-all flex items-center gap-2 mx-auto">
               <RefreshCcw size={18} /> Re-Connect System
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Input your vision (e.g., A global logistics automation hub)..."
              className="w-full h-40 bg-slate-900/60 border-2 border-slate-800/50 rounded-[2rem] p-8 text-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500/50 outline-none transition-all text-xl mb-8 placeholder:opacity-20"
            />
            <button
              type="submit"
              disabled={isLoading || !idea.trim()}
              className="w-full py-6 bg-brand-600 text-white rounded-2xl font-black text-xl hover:bg-brand-500 transition-all flex items-center justify-center gap-4 disabled:opacity-30 shadow-[0_20px_50px_rgba(14,165,233,0.2)]"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={24} />}
              {isLoading ? 'Processing Neural Streams...' : 'Synthesize Architecture'}
            </button>
          </form>
        )}
      </div>

      {(plan || isLoading) && errorState === 'none' && (
        <div className="max-w-full mx-auto w-full animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex justify-center mb-10">
             <div className="flex p-1.5 bg-slate-900/90 rounded-2xl border border-white/5 backdrop-blur-xl">
                <button onClick={() => setActiveTab('demo')} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'demo' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}><Layout size={14} /> UI Prototype</button>
                <button onClick={() => setActiveTab('blueprint')} className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'blueprint' ? 'bg-white text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white'}`}><FileText size={14} /> Logic Blueprint</button>
             </div>
          </div>
          <div className="glass-panel rounded-[4rem] p-1 border border-white/5 min-h-[600px] relative overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-3xl flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full border-2 border-slate-800 border-t-brand-500 animate-spin mb-6"></div>
                 <p className="text-xl font-display font-black text-white tracking-[0.2em] uppercase mb-2">Architecting...</p>
                 <p className="text-brand-400 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">{loadingStep}</p>
              </div>
            )}
            <div className="p-8 md:p-12">
              {activeTab === 'blueprint' ? (
                <div className="prose prose-invert prose-lg max-w-none animate-in fade-in duration-500">
                  <div className="flex justify-end mb-8">
                    <button onClick={copyToClipboard} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 transition-all">
                      {isCopied ? <CheckCircle2 className="text-emerald-500" size={14}/> : <Copy size={14}/>}
                      {isCopied ? "Copied" : "Export Assets"}
                    </button>
                  </div>
                  <div className="bg-slate-950/50 p-10 rounded-[3rem] border border-white/5 shadow-inner">
                    <ReactMarkdown>{plan}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in zoom-in-95 duration-700">
                  <AppPreview data={demoData} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
