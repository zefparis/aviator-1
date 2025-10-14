'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { formatMultiplier } from '@/lib/utils';

// Types pour les nuages
type Cloud = {
  x: number;
  y: number;
  speed: number;
  size: number;
};

export function GameCanvas() {
  const { status, currentMultiplier, crashPoint } = useGameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const cloudsRef = useRef<Cloud[]>([]);
  const planeImageRef = useRef<HTMLImageElement | null>(null);
  const [planeLoaded, setPlaneLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Réinitialiser les nuages lors du resize
      if (cloudsRef.current.length === 0) {
        cloudsRef.current = Array.from({ length: 6 }).map(() => ({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 2),
          speed: 0.3 + Math.random() * 0.4,
          size: 80 + Math.random() * 60,
        }));
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Charger l'image de l'avion
    if (!planeImageRef.current) {
      const planeImg = new Image();
      planeImg.src = '/assets/plane.svg';
      planeImg.onload = () => {
        planeImageRef.current = planeImg;
        setPlaneLoaded(true);
      };
      planeImg.onerror = () => {
        console.warn('Failed to load plane.svg, will use fallback');
        setPlaneLoaded(true);
      };
    }

    // Fonction pour dessiner le ciel avec dégradé
    const drawSky = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#74b9ff');
      gradient.addColorStop(0.5, '#4a90e2');
      gradient.addColorStop(1, '#0a3d62');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Fonction pour dessiner les nuages
    const drawClouds = () => {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = '#ffffff';
      
      cloudsRef.current.forEach((cloud) => {
        // Dessiner un nuage avec plusieurs ellipses
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(cloud.x + cloud.size * 0.5, cloud.y - cloud.size * 0.2, cloud.size * 0.7, cloud.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(cloud.x - cloud.size * 0.4, cloud.y - cloud.size * 0.1, cloud.size * 0.6, cloud.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Déplacer le nuage
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.size < 0) {
          cloud.x = canvas.width + cloud.size;
          cloud.y = Math.random() * (canvas.height / 2);
        }
      });
      
      ctx.globalAlpha = 1;
    };

    // Fonction pour dessiner la courbe de vol
    const drawCurve = () => {
      if (status !== 'FLYING' && status !== 'CRASHED') return;

      const multiplier = status === 'CRASHED' ? (crashPoint || currentMultiplier) : currentMultiplier;
      
      ctx.strokeStyle = '#00a8ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00a8ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      
      let firstPoint = true;
      const maxT = Math.min(multiplier, 20); // Limiter pour éviter overflow
      
      for (let t = 0; t <= maxT; t += 0.05) {
        const progress = t / Math.max(maxT, 1);
        const x = progress * canvas.width * 0.9; // 90% de la largeur max
        const expValue = Math.exp(t / 6);
        const y = canvas.height - Math.min(expValue * 10, canvas.height * 0.95);
        
        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    // Fonction pour dessiner l'avion
    const drawPlane = () => {
      if (status !== 'FLYING') return;

      const multiplier = currentMultiplier;
      const maxT = Math.min(multiplier, 20);
      const progress = multiplier / Math.max(maxT, 1);
      const x = progress * canvas.width * 0.9;
      const expValue = Math.exp(multiplier / 6);
      const y = canvas.height - Math.min(expValue * 10, canvas.height * 0.95);
      
      ctx.save();
      ctx.translate(x, y);
      
      // Calculer l'angle de rotation basé sur la pente
      const deltaT = 0.1;
      const nextExpValue = Math.exp((multiplier + deltaT) / 6);
      const nextY = canvas.height - Math.min(nextExpValue * 10, canvas.height * 0.95);
      const angle = Math.atan2(y - nextY, canvas.width * 0.9 * deltaT / Math.max(maxT, 1));
      
      ctx.rotate(-angle);
      
      // Dessiner l'avion (image ou fallback)
      if (planeImageRef.current && planeImageRef.current.complete) {
        ctx.drawImage(planeImageRef.current, -25, -25, 50, 50);
      } else {
        // Fallback: dessiner un avion simple
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-20, -5);
        ctx.lineTo(-20, 5);
        ctx.closePath();
        ctx.fill();
        
        // Ailes
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, -15);
        ctx.lineTo(-5, 0);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, 15);
        ctx.lineTo(-5, 0);
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.restore();
    };

    // Fonction pour l'effet de crash
    const drawCrashEffect = () => {
      if (status !== 'CRASHED') return;
      
      ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Boucle d'animation principale
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawSky();
      drawClouds();
      drawCurve();
      drawPlane();
      drawCrashEffect();
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status, currentMultiplier, crashPoint, planeLoaded]);

  return (
    <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden border border-border shadow-2xl">
      {/* Canvas for immersive game rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Multiplier Display Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {status === 'WAITING' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <p className="text-2xl text-white font-semibold mb-4 drop-shadow-lg">
                En attente du prochain round...
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200" />
              </div>
            </motion.div>
          )}

          {status === 'FLYING' && (
            <motion.div
              key="flying"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-7xl font-bold text-white drop-shadow-2xl multiplier-text">
                {formatMultiplier(currentMultiplier)}
              </p>
            </motion.div>
          )}

          {status === 'CRASHED' && (
            <motion.div
              key="crashed"
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-5xl font-bold text-red-500 crashed-text mb-4 drop-shadow-2xl">
                CRASHED!
              </p>
              <p className="text-3xl text-white font-semibold drop-shadow-lg">
                @ {formatMultiplier(crashPoint || 0)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
          status === 'WAITING' ? 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50' :
          status === 'FLYING' ? 'bg-green-500/30 text-green-100 border border-green-400/50' :
          'bg-red-500/30 text-red-100 border border-red-400/50'
        }`}>
          {status === 'WAITING' ? 'En attente' :
           status === 'FLYING' ? 'En vol' :
           'Crashé'}
        </div>
      </div>
    </div>
  );
}
