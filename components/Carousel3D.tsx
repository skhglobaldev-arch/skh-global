
import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface CarouselItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface Carousel3DProps {
  items: CarouselItem[];
}

export const Carousel3D: React.FC<Carousel3DProps> = ({ items }) => {
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(550);
  const [itemWidth, setItemWidth] = useState(360);
  
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startRotation = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { 
        setItemWidth(280);
        setRadius(320); 
      } else if (width < 1024) { 
        setItemWidth(320);
        setRadius(450);
      } else { 
        setItemWidth(380);
        setRadius(550); 
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    startRotation.current = rotation;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    const delta = clientX - startX.current;
    const newRotation = startRotation.current + (delta * 0.12);
    setRotation(newRotation);
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  const ANGLE_STEP = 360 / items.length;

  return (
    <div 
      className="w-full h-[550px] relative flex items-center justify-center overflow-visible touch-none cursor-grab active:cursor-grabbing perspective-2000"
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
        {/* Floor Shadow - Brightened */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-brand-400/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="scene-3d w-full h-full flex items-center justify-center preserve-3d">
            <div 
                className="carousel-3d preserve-3d transition-transform duration-200 ease-out"
                style={{ 
                    transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {items.map((item, index) => {
                    const angle = index * ANGLE_STEP;
                    return (
                        <div
                            key={index}
                            className="carousel-item-3d absolute preserve-3d"
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                width: `${itemWidth}px`,
                                height: '420px',
                                marginLeft: `-${itemWidth / 2}px`
                            }}
                        >
                            <div className="relative w-full h-full group preserve-3d transition-all duration-700 hover:scale-[1.05]">
                                
                                {/* Slab Depth Layer - Lightened for visibility */}
                                <div className="absolute inset-0 bg-slate-800 rounded-[2.5rem] [transform:translateZ(-30px)] shadow-[0_0_40px_rgba(14,165,233,0.1)] border border-brand-500/20 transition-transform group-hover:[transform:translateZ(-40px)]"></div>

                                {/* Main Card Face - Higher opacity & clearer gradient */}
                                <div className="card-galaxy p-10 rounded-[2.5rem] h-full flex flex-col items-center text-center select-none border-brand-500/40 backdrop-blur-3xl bg-slate-900/95 preserve-3d shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-t border-l border-white/20">
                                    
                                    {/* Icon (High Elevation) */}
                                    <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-brand-500/50 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(14,165,233,0.2)] group-hover:shadow-[0_0_60px_rgba(14,165,233,0.5)] transition-all duration-700 [transform:translateZ(100px)] group-hover:[transform:translateZ(120px)]">
                                        <item.icon size={44} className="text-brand-400 group-hover:text-white transition-colors" />
                                    </div>

                                    {/* Text (Mid Elevation) - Pure White for maximum readability */}
                                    <div className="[transform:translateZ(60px)] px-4 group-hover:[transform:translateZ(80px)] transition-transform duration-700">
                                      <h3 className="text-2xl font-bold text-white mb-4 font-display leading-tight group-hover:text-brand-300 transition-colors drop-shadow-md">
                                        {item.title}
                                      </h3>
                                      
                                      <p className="text-slate-200 text-sm leading-relaxed font-normal mb-6 opacity-100 drop-shadow-sm">
                                        {item.description}
                                      </p>
                                    </div>
                                    
                                    {/* Link (Base Elevation) */}
                                    <div className="mt-auto w-full flex flex-col items-center [transform:translateZ(30px)]">
                                        <div className="h-1 w-14 bg-slate-700 rounded-full group-hover:w-28 group-hover:bg-brand-400 transition-all duration-700 mb-6"></div>
                                        <div className="flex items-center gap-2 text-brand-300 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                                          Analyze Architecture <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* User Interaction Cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-brand-200 uppercase tracking-[0.6em] animate-pulse">Drag_to_Rotate_Systems</span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
            </div>
        </div>
    </div>
  );
};
