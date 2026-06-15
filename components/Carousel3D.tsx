
import React, { useState, useEffect, useRef } from 'react';
import { LucideIcon, ArrowRight, MoveHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CarouselItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface Carousel3DProps {
  items: CarouselItem[];
}

export const Carousel3D: React.FC<Carousel3DProps> = ({ items }) => {
  const { t } = useTranslation();
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
      className="relative flex h-[500px] w-full touch-none items-center justify-center overflow-visible cursor-grab perspective-2000 active:cursor-grabbing md:h-[540px]"
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
    >
        <div className="pointer-events-none absolute bottom-8 left-1/2 -z-10 h-24 w-[82%] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#7C3AED]/10 via-[#2563EB]/12 to-[#38D8FF]/10 blur-[90px]"></div>

        <div className="scene-3d flex h-full w-full items-center justify-center preserve-3d">
            <div 
                className="carousel-3d preserve-3d transition-transform duration-300 ease-out"
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
                                height: '390px',
                                marginLeft: `-${itemWidth / 2}px`
                            }}
                        >
                            <div className="group relative h-full w-full preserve-3d transition-all duration-700 hover:scale-[1.025]">
                                <div className="absolute inset-3 rounded-[2rem] border border-violet-400/10 bg-[#070A16]/80 shadow-[0_26px_90px_rgba(5,7,19,0.65)] [transform:translateZ(-24px)] transition-transform duration-700 group-hover:[transform:translateZ(-32px)]"></div>

                                <div className="relative flex h-full select-none flex-col items-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#101827]/78 p-8 text-center shadow-[0_28px_90px_rgba(5,7,19,0.62)] backdrop-blur-3xl preserve-3d transition-all duration-700 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_0%,rgba(168,85,247,0.18),transparent_34%),radial-gradient(circle_at_90%_16%,rgba(56,216,255,0.12),transparent_34%)] hover:border-cyan-300/24 hover:bg-[#101827]/88 md:p-9">
                                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/35 to-transparent" />
                                    
                                    <div className="relative z-10 mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/18 bg-[#050713]/70 shadow-[0_18px_60px_rgba(37,99,235,0.20)] transition-all duration-700 [transform:translateZ(82px)] group-hover:border-violet-300/35 group-hover:shadow-[0_18px_70px_rgba(168,85,247,0.22)] group-hover:[transform:translateZ(96px)]">
                                        <item.icon size={34} className="text-cyan-200 transition-colors group-hover:text-white" />
                                    </div>

                                    <div className="relative z-10 px-2 transition-transform duration-700 [transform:translateZ(54px)] group-hover:[transform:translateZ(66px)]">
                                      <h3 className="mb-4 text-xl font-black leading-tight text-white transition-colors group-hover:text-cyan-100 md:text-2xl">
                                        {item.title}
                                      </h3>
                                      
                                      <p className="mb-6 text-sm font-light leading-relaxed text-slate-300">
                                        {item.description}
                                      </p>
                                    </div>
                                    
                                    <div className="relative z-10 mt-auto flex w-full flex-col items-center [transform:translateZ(28px)]">
                                        <div className="mb-6 h-px w-16 rounded-full bg-gradient-to-r from-violet-400/30 via-cyan-300/70 to-blue-400/30 transition-all duration-700 group-hover:w-28"></div>
                                        <div className="flex translate-y-2 items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-200 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                                          {t('carousel_view_solution', 'View Solution')} <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
            <div className="flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/14 bg-[#050713]/74 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100 shadow-[0_16px_55px_rgba(5,7,19,0.55)] backdrop-blur-xl">
                <MoveHorizontal size={14} className="text-violet-200" />
                <span>{t('carousel_drag_hint', 'Drag to rotate the cards')}</span>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent"></div>
            </div>
        </div>
    </div>
  );
};
