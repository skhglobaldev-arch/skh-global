
import React, { useState } from 'react';
import { generateProjectPlan, generateVisualDemo } from '../services/gemini';
import { Loader2, Copy, CheckCircle2, Layout, FileText, Zap, Cpu, Key, AlertTriangle, RefreshCcw } from 'lucide-react';
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
  const [errorType, setErrorType] = useState<'none' | 'auth' | 'overloaded' | 'general'>('none');

  const handleRepairConnection = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setErrorType('none');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setIsLoading(true);
    setErrorType('none');
    setPlan('');
    setDemoData(null);
    setLoadingStep('Initializing Neural Link...');
    
    try {
      setLoadingStep('Synthesizing Architecture (Gemini 3.0)...');
      const planResult = await generateProjectPlan(idea);
      setPlan(planResult);

      setLoadingStep('Rendering Visual UI Prototype...');
      const demoResult = await generateVisualDemo(idea);
      setDemoData(demoResult);
      
      if (demoResult) {
        setActiveTab('demo');
      } else {
        setActiveTab('blueprint');
      }
    } catch (err: any) {
      console.error("Planner Error:", err);
      if (err.message === "AUTH_REQUIRED") {
        setErrorType('auth');
      } else if (err?.message?.includes("503") || err?.message?.includes("overloaded")) {
        setErrorType('overloaded');
      } else {
        setErrorType('general');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep('');
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
      <div className="glass-panel rounded-[3.5rem] p-12 border border-slate-700 shadow-2xl relative overflow-hidden max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-8 mb-10">
          <div className="w-20 h-20 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/30 flex items-center justify-center">
            <Cpu size={40} className={isLoading ? 'animate-spin' : ''} />
          </div>
          <div>
            <h3 className="text-3xl font-display font-black text-white">System Architect <span className="text-brand-400">v3.5</span></h3>
            <p className="text-slate-400 text-sm">Automated logic-to-infrastructure compiler.</p>
          </div>
        </div>

        {errorType === 'auth' ? (
          <div className="p-10 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center mb-8 animate-in fade-in zoom-in duration-500">
            <Key className="text-amber-500 mx-auto mb-6" size={48} />
            <h4 className="text-2xl font-bold text-white mb-4">API Key Validation Failed</h4>
            <p className="text-amber-200/70 mb-8 max-w-md mx-auto">
              The provided API key is invalid or lacks the necessary permissions for the Gemini 3 Pro matrix.
            </p>
            <button 
              onClick={handleRepairConnection}
              className="px-10 py-4 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all flex items-center justify-center gap-3 mx-auto shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              <RefreshCcw size={20} /> Link New Key
            </button>
          </div>
        ) : errorType === 'overloaded' ? (
          <div className="p-10 rounded-3xl bg-brand-500/10 border border-brand-500/30 text-center mb-8 animate-in fade-in zoom-in duration-500">
            <AlertTriangle className="text-brand-400 mx-auto mb-6" size={48} />
            <h4 className="text-2xl font-bold text-white mb-4">Neural Overload</h4>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              The Gemini 3 server is currently at peak capacity. Please wait a few seconds and try re-initializing.
            </p>
            <button 
              onClick={handleSubmit}
              className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-brand-50 transition-all flex items-center justify-center gap-3 mx-auto shadow-xl"
            >
              <Zap size={20} /> Re-try Synthesis
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your vision (e.g., A luxury skincare brand with automated membership and AI skin analysis)..."
              className="w-full h-48 bg-slate-900/60 border-2 border-slate-800 rounded-[2rem] p-8 text-white focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500/50 outline-none transition-all text-xl mb-8"
            />
            
            <button
              type="submit"
              disabled={isLoading || !idea.trim()}
              className="w-full py-6 bg-white text-slate-950 rounded-2xl font-black text-xl hover:bg-brand-50 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Zap size={24} />}
              {isLoading ? 'Processing Protocol...' : 'Initialize Build'}
            </button>
          </form>
        )}
      </div>

      {/* Result Module */}
      {(plan || isLoading) && errorType === 'none' && (
        <div className="max-w-full mx-auto w-full animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="flex justify-center mb-10">
             <div className="flex p-2 bg-slate-900/80 rounded-[2rem] border border-white/5 backdrop-blur-md">
                <button 
                  onClick={() => setActiveTab('demo')}
                  className={`flex items-center gap-3 px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'demo' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  <Layout size={18} /> UI Preview
                </button>
                <button 
                  onClick={() => setActiveTab('blueprint')}
                  className={`flex items-center gap-3 px-8 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'blueprint' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  <FileText size={18} /> Technical Blueprint
                </button>
             </div>
          </div>

          <div className="glass-panel rounded-[3.5rem] p-10 border border-white/5 min-h-[600px] relative overflow-hidden bg-slate-950/40">
            {isLoading && (
              <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center">
                 <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-brand-500 animate-spin"></div>
                    <Cpu className="absolute inset-0 m-auto text-brand-500 animate-pulse" size={32} />
                 </div>
                 <p className="text-2xl font-display font-bold text-white tracking-widest uppercase mb-2">Processing...</p>
                 <p className="text-brand-400 font-mono text-xs animate-pulse tracking-widest uppercase">{loadingStep}</p>
              </div>
            )}

            {activeTab === 'blueprint' ? (
              <div className="prose prose-invert prose-xl max-w-none animate-in fade-in duration-500">
                <div className="flex justify-end mb-8">
                  <button onClick={copyToClipboard} className="flex items-center gap-2 text-sm bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    {isCopied ? <CheckCircle2 className="text-green-500" size={18}/> : <Copy size={18}/>}
                    {isCopied ? "Protocol Copied" : "Export Blueprint"}
                  </button>
                </div>
                <div className="bg-slate-900/40 p-8 md:p-12 rounded-3xl border border-white/5">
                  <ReactMarkdown>{plan}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                {demoData ? (
                  <AppPreview data={demoData} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                    <Layout size={48} className="mb-4 opacity-20" />
                    <p>Visual preview deferred. Re-run synthesis if required.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
