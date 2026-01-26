
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Zap, Power } from 'lucide-react';

// Audio Decoding Helpers
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function createAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

interface SystemIntroProps {
  onComplete: () => void;
}

export const SystemIntro: React.FC<SystemIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'ready' | 'active' | 'exiting'>('ready');
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mountedRef = useRef(true);

  const videoUrl = "https://dl.dropboxusercontent.com/scl/fi/ryxm1c2utu1zu0fwmmpew/grok-video-4de00c75-f0d7-4b70-9048-0b9124eccd31-1.mp4?rlkey=b3fuw8m0gqj8izz4cccrrtvrl&raw=1";
  const welcomeMessage = "Welcome to SKH Global. The connection is stable. Initializing neural bridge. We are ready to architect your future.";

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handleInitialize = async () => {
    if (!mountedRef.current) return;
    
    // Resume/Start Audio Context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    await ctx.resume();

    setPhase('active');

    try {
      // Create AI instance inside the handler to ensure updated API key
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: welcomeMessage }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: 'Zephyr' } 
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("Audio data missing");

      const audioBuffer = await createAudioBuffer(decodeBase64(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      if (videoRef.current) {
        videoRef.current.play().catch(console.warn);
      }

      source.start();
      
      source.onended = () => {
        if (mountedRef.current) {
          setPhase('exiting');
          setTimeout(() => onComplete(), 1000);
        }
      };
    } catch (err) {
      console.error("Intro Error:", err);
      // Fallback: Transition anyway if AI fails after a delay
      setTimeout(() => {
        if (mountedRef.current && phase === 'active') {
          setPhase('exiting');
          setTimeout(onComplete, 1000);
        }
      }, 4000);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 pointer-events-none ${phase === 'exiting' ? 'opacity-0 scale-110 blur-3xl' : 'opacity-100'}`}>
      <div className={`absolute inset-0 bg-[#020617]/60 backdrop-blur-xl transition-opacity duration-1000 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}></div>

      {phase === 'ready' && (
        <div className="relative z-10 flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-700 pointer-events-auto">
          <button 
            onClick={handleInitialize}
            className="w-48 h-48 rounded-full bg-slate-900 border-2 border-brand-500/50 flex items-center justify-center cursor-pointer group hover:scale-110 active:scale-95 transition-all shadow-[0_0_100px_rgba(14,165,233,0.4)]"
          >
            <div className="absolute inset-0 bg-brand-500 rounded-full blur-3xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
            <Power size={72} className="text-brand-400 group-hover:text-white transition-colors animate-pulse" />
          </button>
          <div className="text-center">
            <h2 className="text-white font-display font-black text-4xl tracking-[0.5em] uppercase mb-4 drop-shadow-[0_0_20px_rgba(14,165,233,0.9)]">Connect Grid</h2>
            <p className="text-brand-300 font-mono text-xs tracking-[0.4em] uppercase opacity-60">System Ready for Neural Link</p>
          </div>
        </div>
      )}

      {phase === 'active' && (
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-1000">
          <div className="relative w-[85vw] max-w-[500px] aspect-square rounded-full overflow-hidden border border-brand-500/50 bg-slate-950/40 backdrop-blur-2xl shadow-[0_0_150px_rgba(14,165,233,0.5)]">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover mix-blend-screen filter contrast-125 saturate-150 animate-[hologram-flicker_0.15s_infinite_alternate]"
              playsInline
              muted
              loop
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[4px] bg-brand-400 blur-md animate-[scan_3.5s_linear_infinite] opacity-50"></div>
              <div className="absolute inset-0 border-[30px] border-brand-500/5 rounded-full"></div>
            </div>
          </div>

          <div className="mt-20 animate-in slide-in-from-bottom-12 duration-1000 delay-300">
             <div className="flex items-center gap-8 px-12 py-6 bg-slate-900/90 border border-brand-500/40 rounded-full backdrop-blur-3xl shadow-2xl relative">
                <div className="absolute -inset-4 bg-brand-500/10 blur-3xl rounded-full -z-10"></div>
                <div className="w-14 h-14 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/40">
                   <Zap className="text-brand-400 animate-pulse" size={28} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.5em] mb-1 font-black">Link_Established</span>
                   <span className="text-2xl font-bold text-white tracking-widest font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] uppercase">Syncing Neural Data...</span>
                </div>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-20%); opacity: 0; }
          30% { opacity: 0.8; }
          70% { opacity: 0.8; }
          100% { transform: translateY(450%); opacity: 0; }
        }
        @keyframes hologram-flicker {
          0% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.01); }
        }
      `}</style>
    </div>
  );
};
