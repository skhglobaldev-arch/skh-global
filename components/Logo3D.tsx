import React from 'react';
    import { Hexagon, Globe, Code2, Cpu } from 'lucide-react';

    export const Logo3D: React.FC = () => {
      return (
        <div className="logo-scene mb-8 scale-[1.8]">
          <div className="logo-cube animate-spin-slow">
            {/* Front */}
            <div className="logo-face border-brand-500/60 bg-brand-500/5">
              <span className="font-display font-black tracking-tighter text-brand-400 text-lg">SKH</span>
            </div>
            {/* Back */}
            <div className="logo-face border-indigo-500/60 bg-indigo-500/5 [transform:rotateY(180deg)_translateZ(40px)]">
               <Globe size={30} className="text-indigo-400" />
            </div>
            {/* Right */}
            <div className="logo-face border-cyan-500/60 bg-cyan-500/5 [transform:rotateY(90deg)_translateZ(40px)]">
               <Cpu size={30} className="text-cyan-400" />
            </div>
            {/* Left */}
            <div className="logo-face border-purple-500/60 bg-purple-500/5 [transform:rotateY(-90deg)_translateZ(40px)]">
               <Code2 size={30} className="text-purple-400" />
            </div>
            {/* Top */}
            <div className="logo-face border-white/20 bg-slate-800/20 [transform:rotateX(90deg)_translateZ(40px)]">
               <Hexagon size={30} className="text-white fill-white/10" />
            </div>
            {/* Bottom */}
            <div className="logo-face border-slate-700/60 [transform:rotateX(-90deg)_translateZ(40px)]">
               <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse shadow-[0_0_20px_#0ea5e9]"></div>
            </div>
          </div>
          
          <style>{`
            .logo-scene {
              width: 80px;
              height: 80px;
              perspective: 1000px;
              position: relative;
            }
            .logo-cube {
              width: 100%;
              height: 100%;
              position: absolute;
              transform-style: preserve-3d;
            }
            .logo-face {
              position: absolute;
              width: 80px;
              height: 80px;
              border: 1px solid;
              display: flex;
              align-items: center;
              justify-content: center;
              backdrop-filter: blur(4px);
              transform: translateZ(40px);
              box-shadow: inset 0 0 15px rgba(255,255,255,0.05);
            }
          `}</style>
          
          {/* Central Halo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-500/10 blur-[50px] -z-10 animate-pulse-slow"></div>
        </div>
      );
    };