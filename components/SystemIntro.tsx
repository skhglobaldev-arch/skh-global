
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

  // New Video Link provided by user (Converted to raw for direct playback)
  const videoUrl = "https://dl.dropboxusercontent.com/scl/fi/ryxm1c2utu1zu0fwmmpew/grok-video-4de00c75-f0d7-4b70-9048-0b9124eccd31-1.mp4?rlkey=b3fuw8m0gqj8izz4cccrrtvrl&raw=1";
  const welcomeMessage = "Welcome to the future of programming. SKH Global is here to assist you.";

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const handleInitialize = async () => {
    if (!mountedRef.current) return;
    
    // Resume/Start Audio Context (Essential for sound on click)
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const ctx = audioContextRef.current;
    await ctx.resume();

    setPhase('active');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: welcomeMessage }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { 
              // Using Zephyr for a more masculine, clear AI tone
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

      // Play video with audio sync
      if (videoRef.current) {
        videoRef.current.play().catch(console.warn);
      }

      source.start();
      
      // Auto-transition when audio finishes
      source.onended = () => {
        if (mountedRef.current) {
          setPhase('exiting');
          setTimeout(() => onComplete(), 1000);
        }
      };
    } catch (err) {
      console.error("Intro Error:", err);
      // Fallback: Transition anyway if AI fails after a reasonable delay
      setTimeout(() => {
        if (mountedRef.current && phase === 'active') {
          setPhase('exiting');
          setTimeout(onComplete, 1000);
        }
      }, 5000);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 pointer-events-none ${phase === 'exiting' ? 'opacity-0 scale-110 blur-3xl' : 'opacity-100'}`}>
      
      {/* Background Ambience (Transparent enough to see digital rain behind) */}
      <div className={`absolute inset-0 bg-[#020617]/40 backdrop-blur-[2px] transition-opacity duration-1000 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Phase: Ready (Launch Button) */}
      {phase === 'ready' && (
        <div className="relative z-10 flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-700 pointer-events-auto">
          <button 
            onClick={handleInitialize}
            className="w-40 h-40 rounded-full bg-slate-900 border-2 border-brand-500/50 flex items-center justify-center cursor-pointer group hover:scale-110 active:scale-95 transition-all shadow-[0_0_80px_rgba(14,165,233,0.3)]"
          >
            <div className="absolute inset-0 bg-brand-500 rounded-full blur-3xl opacity-10 group-hover:opacity-40 transition-opacity"></div>
            <Power size={64} className="text-brand-400 group-hover:text-white transition-colors animate-pulse" />
          </button>
          <div className="text-center">
            <h2 className="text-white font-display font-black text-3xl tracking-[0.6em] uppercase mb-4 drop-shadow-[0_0_15px_rgba(14,165,233,0.8)]">Establish Link</h2>
            <p className="text-brand-300 font-mono text-xs tracking-[0.4em] uppercase opacity-60">Initialize Neural Bridge</p>
          </div>
        </div>
      )}

      {/* Phase: Active (3D Avatar Cinematic) */}
      {phase === 'active' && (
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-1000">
          
          {/* Avatar Projection */}
          <div className="relative w-[85vw] max-w-[480px] aspect-square rounded-full overflow-hidden border border-brand-500/40 bg-slate-950/20 backdrop-blur-md shadow-[0_0_120px_rgba(14,165,233,0.4)] transition-all duration-700">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover mix-blend-screen filter brightness-110 contrast-125 saturate-125 animate-[hologram-flicker_0.15s_infinite_alternate]"
              playsInline
              muted
              loop
            />
            
            {/* Scanners & HUDs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-400 blur-md animate-[scan_3s_linear_infinite] opacity-40"></div>
              <div className="absolute inset-0 border-[20px] border-brand-500/5 rounded-full pointer-events-none"></div>
            </div>
          </div>

          {/* Assistant Metadata */}
          <div className="mt-16 animate-in slide-in-from-bottom-12 duration-1000 delay-300">
             <div className="flex items-center gap-6 px-10 py-5 bg-slate-900/80 border border-brand-500/30 rounded-full backdrop-blur-3xl shadow-2xl relative">
                <div className="absolute -inset-2 bg-brand-500/10 blur-3xl rounded-full -z-10"></div>
                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                   <Zap className="text-brand-400 animate-pulse" size={24} />
                </div>
                <div className="flex flex-col">
                   <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em] mb-1 font-black">Secure_Audio_Uplink</span>
                   <span className="text-xl font-bold text-white tracking-widest font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Establishing Secure Connection...</span>
                </div>
             </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-10%); opacity: 0; }
          20% { opacity: 0.6; }
          80% { opacity: 0.6; }
          100% { transform: translateY(400%); opacity: 0; }
        }
        @keyframes hologram-flicker {
          0% { opacity: 0.95; transform: scale(1); filter: brightness(1); }
          100% { opacity: 1; transform: scale(1.005); filter: brightness(1.2); }
        }
      `}</style>
    </div>
  );
};
