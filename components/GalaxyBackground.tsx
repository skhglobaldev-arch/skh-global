import React, { useEffect, useRef } from 'react';

export const GalaxyBackground: React.FC = () => {
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

    // Star properties
    const stars: { x: number; y: number; z: number; size: number; color: string }[] = [];
    const starCount = window.innerWidth < 768 ? 500 : 1000;
    const colors = ['#ffffff', '#38bdf8', '#818cf8', '#c084fc'];
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 4,
        y: (Math.random() - 0.5) * height * 4,
        z: Math.random() * width,
        size: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - width / 2) * 0.4;
      mouseY = (e.clientY - height / 2) * 0.4;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      targetScrollY += (scrollY - targetScrollY) * 0.1;

      // Dark background fill
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      stars.forEach(star => {
        let dz = star.z - (targetScrollY * 0.3); 
        const depth = width * 1.5;
        dz = ((dz % depth) + depth) % depth;

        if (dz < 1) dz = 1;

        const perspective = 400;
        const scale = perspective / dz;

        const x2d = cx + (star.x - targetX) * scale;
        const y2d = cy + (star.y - targetY) * scale;

        if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
           const alpha = Math.min(1, (depth - dz) / (depth * 0.3));
           const size = star.size * scale;
           
           ctx.beginPath();
           ctx.fillStyle = star.color;
           ctx.globalAlpha = alpha;
           ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
           ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ display: 'block' }}
    />
  );
};