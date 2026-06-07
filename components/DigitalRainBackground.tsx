
import React, { useEffect, useRef } from 'react';

export const DigitalRainBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = Math.min(window.innerHeight * 0.88, 820);
    canvas.width = width;
    canvas.height = height;

    const baseFontSize = 16;
    
    interface Stream {
      x: number;
      y: number;
      z: number;
      speed: number;
      chars: string[];
      maxLength: number;
      opacity: number;
      hue: 'cyan' | 'purple';
    }

    let streams: Stream[] = [];

    const createStream = (x: number): Stream => {
      const z = Math.random(); 
      const duration = 18 + Math.random() * 14;
      return {
        x,
        y: Math.random() * -height,
        z,
        speed: (height + 220) / (duration * 60),
        chars: [],
        maxLength: Math.floor(Math.random() * 5) + 3,
        opacity: 0.08 + Math.random() * 0.06,
        hue: Math.random() > 0.45 ? 'cyan' : 'purple',
      };
    };

    const initStreams = () => {
      streams = [];
      const count = Math.max(4, Math.min(9, Math.floor(width / 180)));
      const spacing = width / count;
      for (let i = 0; i < count; i++) {
        streams.push(createStream((i * spacing) + (Math.random() * spacing * 0.35)));
      }
    };

    initStreams();

    // Hotspot effect (The glowing nodes in the background)
    const hotspots = Array.from({ length: 4 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 360 + 220,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.001 + 0.00035
    }));

    const handleResize = () => {
      width = window.innerWidth;
      height = Math.min(window.innerHeight * 0.88, 820);
      canvas.width = width;
      canvas.height = height;
      initStreams();
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      hotspots.forEach(h => {
        h.phase += h.speed;
        const currentR = h.r + Math.sin(h.phase) * 28;
        const gradient = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, currentR);
        gradient.addColorStop(0, h.phase % 2 > 1 ? 'rgba(124, 58, 237, 0.045)' : 'rgba(56, 216, 255, 0.04)');
        gradient.addColorStop(1, 'rgba(5, 7, 19, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      streams.forEach((s) => {
        if (Math.random() > 0.992) {
          s.chars.unshift(Math.random() > 0.5 ? "1" : "0");
          if (s.chars.length > s.maxLength) s.chars.pop();
        }

        const scale = (s.z * 0.6) + 0.4;
        const currentFontSize = baseFontSize * scale;
        ctx.font = `900 ${currentFontSize}px "Fira Code", monospace`;

        s.chars.forEach((char, index) => {
          const charOpacity = s.opacity * (1 - index / s.maxLength);
          const yPos = s.y - (index * (currentFontSize * 0.9));

          if (yPos > -100 && yPos < height + 100) {
            if (index === 0) {
              ctx.fillStyle = s.hue === 'cyan'
                ? `rgba(56, 216, 255, ${Math.min(charOpacity * 1.12, 0.14)})`
                : `rgba(168, 85, 247, ${Math.min(charOpacity, 0.12)})`;
              ctx.shadowBlur = 4 * scale;
              ctx.shadowColor = s.hue === 'cyan' ? '#38D8FF' : '#A855F7';
            } else {
              ctx.shadowBlur = 0;
              ctx.fillStyle = s.hue === 'cyan'
                ? `rgba(56, 216, 255, ${charOpacity})`
                : `rgba(168, 85, 247, ${charOpacity * 0.9})`;
            }

            ctx.fillText(char, s.x, yPos);
          }
        });

        s.y += s.speed;

        if (s.y - (s.maxLength * currentFontSize) > height) {
          Object.assign(s, createStream(s.x));
          s.y = -150;
        }
      });

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute left-0 right-0 top-0 z-0 h-[88vh] min-h-[620px] pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        style={{ display: 'block' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,7,19,0.35),rgba(5,7,19,0.9))]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050713]" />
    </div>
  );
};
