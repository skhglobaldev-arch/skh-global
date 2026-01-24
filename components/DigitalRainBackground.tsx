
import React, { useEffect, useRef } from 'react';

export const DigitalRainBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const baseFontSize = 32; // Even larger bold characters
    const columnWidth = 36; // Wider columns for readability
    
    interface Stream {
      x: number;
      y: number;
      z: number; // Depth 0 to 1
      speed: number;
      chars: string[];
      maxLength: number;
      opacity: number;
    }

    let streams: Stream[] = [];

    const createStream = (x: number): Stream => {
      const z = Math.random(); 
      return {
        x,
        y: Math.random() * -height,
        z,
        speed: (z * 1.2) + 0.8, // Significantly slower falling speed
        chars: [],
        maxLength: Math.floor(Math.random() * 15) + 8,
        opacity: (z * 0.45) + 0.1,
      };
    };

    const initStreams = () => {
      streams = [];
      const cols = Math.ceil(width / columnWidth);
      for (let i = 0; i < cols; i++) {
        streams.push(createStream(i * columnWidth));
      }
    };

    initStreams();

    // Hotspot effect (The glowing nodes in the background)
    const hotspots = Array.from({ length: 6 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 300 + 200,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.002
    }));

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStreams();
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      // Background base
      ctx.fillStyle = '#010413';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Volumetric Glow Hotspots
      hotspots.forEach(h => {
        h.phase += h.speed;
        const currentR = h.r + Math.sin(h.phase) * 50;
        const gradient = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, currentR);
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.1)');
        gradient.addColorStop(1, 'rgba(1, 4, 19, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });

      // 2. Draw Binary Streams
      streams.forEach((s) => {
        // Character update frequency
        if (Math.random() > 0.95) {
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
              // Brighter leading character with glow
              ctx.fillStyle = `rgba(255, 255, 255, ${charOpacity * 2})`;
              ctx.shadowBlur = 20 * scale;
              ctx.shadowColor = '#0ea5e9';
            } else {
              // Dimmer trailing body
              ctx.shadowBlur = 0;
              ctx.fillStyle = `rgba(14, 165, 233, ${charOpacity})`;
            }

            ctx.fillText(char, s.x, yPos);
          }
        });

        s.y += s.speed;

        // Reset
        if (s.y - (s.maxLength * currentFontSize) > height) {
          s.y = -150;
          s.z = Math.random();
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
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};
