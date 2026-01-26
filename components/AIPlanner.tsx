
import React, { useState } from 'react';
import { generateProjectPlan, generateVisualDemo } from '../services/gemini';
import { Loader2, Sparkles, Send, Copy, CheckCircle2, Layout, FileText, ChevronRight, Zap, Cpu, ArrowRight, Key } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AppPreview } from './AppPreview';

export const AIPlanner: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [plan, setPlan] = useState('');
  const [demoData, setDemoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'demo'>('blueprint');
  const [showKeyHint, setShowKeyHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setPlan('');
    setDemoData(null);
    setShowKeyHint(false);
    
    try {
      const planResult = await generateProjectPlan(idea);
      
      if (planResult.includes("API Key is selected")) {
        setShowKeyHint(true);
        setPlan(planResult);
        setIsLoading(false);
        return;
      }

      const demoResult = await generateVisualDemo(idea);
      
      setPlan(planResult);
      setDemoData(demoResult);
      setActiveTab('demo'); 
    } catch (error) {
      setPlan("System error: Neural synthesis failed. Please re-establish link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenKeyManager = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(plan);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-12">
      {/* Input Module */}
      <div className="glass-panel rounded-[3.5rem] p-12 md:p-16 border border-slate-700 shadow-[0_50px_100px_rgba(0,0,0,0.7)] relative overflow-hidden group max-w-5xl mx-auto w-full">
        <div className="absolute top-0 right-0 p-60 bg-brand-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-500/25 transition-all duration-1000"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-14 relative z-10">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2rem] bg-brand-500/10 text-brand-400 border border-brand-500/30 flex items-center justify-center shadow-3xl">
              <Cpu size={48} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-4xl font-display font-black text-white tracking-tight">System Architect <span className="text-brand-400">v3.0</span></h3>
              <p className="text-slate-400 font-medium tracking-wide opacity-80 text-lg">Deep synthesis of operational logic and visual framework.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Define your ecosystem requirements (e.g., 'A high-end autonomous delivery management system with real-time tracking')..."
            className="w-full h-56 bg-slate-900/60 border-2 border-slate-800 rounded-[2.5rem] p-10 text-white focus:outline-none focus:ring-8 focus:ring-brand-500/10 focus:border-brand-500/60 resize-none placeholder-slate-700 mb-12 transition-all text-2xl font-light leading-relaxed shadow-inner"
          />
          
          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="w-full flex items-center justify-center gap-5 py-8 px-12 rounded-[2rem] bg-white text-slate-950 hover:bg-brand-50 font-black text-2xl shadow-[0_40px_80px_rgba(255,255,255,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={32} />
                Synthesizing Protocol...
              </>
            ) : (
              <>
                Initialize System Build <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform" />
              </>
            )}
          </button>
        </form>

        {showKeyHint && (
          <div className="mt-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center gap-4 text-amber-200">
                <Key size={24} />
                <p className="text-sm font-medium">To use Gemini 3 models, you must select an API key from a paid project.</p>
             </div>
             <button 
                onClick={handleOpenKeyManager}
                className="px-6 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors text-sm"
             >
                Select Key
             </button>
          </div>
        )}
      </div>

      {/* Result Module */}
      {(plan || isLoading) && !showKeyHint && (
        <div className="max-w-full mx-auto w-full animate-in slide-in-from-bottom-20 duration-1000">
          
          <div className="flex justify-center mb-14">
             <div className="flex p-3 bg-slate-900/90 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-3xl">
                <button 
                  onClick={() => setActiveTab('demo')}
                  className={`flex items-center gap-4 px-12 py-5 rounded-[2rem] text-lg font-black transition-all ${activeTab === 'demo' ? 'bg-brand-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <Layout size={24} /> Neural Interface Preview
                </button>
                <button 
                  onClick={() => setActiveTab('blueprint')}
                  className={`flex items-center gap-4 px-12 py-5 rounded-[2rem] text-lg font-black transition-all ${activeTab === 'blueprint' ? 'bg-brand-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  <FileText size={24} /> Architectural Protocol
                </button>
             </div>
          </div>

          <div className="glass-panel rounded-[4.5rem] p-12 md:p-20 border border-white/5 min-h-[850px] flex flex-col relative overflow-hidden shadow-3xl">
            
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center space-y-12">
                 <div className="relative">
                    <div className="w-40 h-40 rounded-full border-[10px] border-slate-800 border-t-brand-500 animate-spin shadow-[0_0_100px_rgba(14,165,233,0.3)]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap size={56} className="text-brand-500 animate-pulse" />
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-4xl font-display font-black text-white mb-4 tracking-tighter">System Synthesis in Progress</p>
                    <p className="text-brand-400 font-mono text-sm uppercase tracking-[0.6em] animate-pulse">Establishing_Neural_Gateway</p>
                 </div>
              </div>
            )}

            {activeTab === 'blueprint' && plan && (
              <div className="animate-in fade-in slide-in-from-right-10 duration-700 h-full flex flex-col">
                <div className="flex justify-between items-center mb-16 pb-12 border-b border-white/5">
                   <div>
                     <h4 className="text-5xl font-display font-black text-white tracking-tighter mb-2">Technical Specification</h4>
                     <p className="text-xl text-slate-500 font-medium tracking-wide">Core infrastructure mapping and automation lifecycle.</p>
                   </div>
                   <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-4 text-base font-black text-slate-300 hover:text-white transition-all bg-white/5 border border-white/10 hover:border-brand-500/50 px-10 py-5 rounded-3xl"
                   >
                     {isCopied ? <CheckCircle2 size={24} className="text-green-500"/> : <Copy size={24}/>}
                     {isCopied ? "Protocol Saved" : "Export Specification"}
                   </button>
                </div>
                
                <div className="prose prose-invert prose-2xl max-w-none overflow-y-auto max-h-[900px] pr-12 custom-scrollbar font-light leading-relaxed">
                  <ReactMarkdown>{plan}</ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'demo' && demoData && (
              <div className="animate-in fade-in slide-in-from-left-10 duration-700">
                 <div className="mb-14 px-10 text-center">
                    <h4 className="text-4xl font-display font-black text-white mb-3">Neural Production Interface</h4>
                    <p className="text-xl text-slate-500 tracking-wide">Live deployment mock-up synthesized from high-level system logic.</p>
                 </div>
                 <AppPreview data={demoData} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
