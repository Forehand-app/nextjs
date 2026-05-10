"use client";

import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Dumbbell, 
  Target, 
  Activity, 
  Flame, 
  Zap, 
  Timer,
  Shield,
  Sword
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FloatingIconsProps {
  count?: number;
  page?: 'login' | 'register';
}

const ICONS = [
  Trophy,
  Medal,
  Dumbbell,
  Target,
  Activity,
  Flame,
  Zap,
  Timer,
  Shield,
  Sword
];

export const FloatingIcons: React.FC<FloatingIconsProps> = ({ count = 20, page = 'login' }) => {
  const [icons, setIcons] = useState<any[]>([]);

  useEffect(() => {
    const generated: any[] = [];
    
    let circleCenterY = 32;
    let circleCenterX = 50;
    let keepOutRadius = 48;
    let dyFactor = 3;

    if (page === 'register') {
      circleCenterY = 26;
      keepOutRadius = 26;
      dyFactor = 2;
    }

    let attempts = 0;
    while (generated.length < count && attempts < 500) {
      attempts++;
      
      const left = Math.random() * 100;
      const maxTop = page === 'register' ? 60 : 70; // increased area
      const top = Math.random() * maxTop; 

      const dx = (left - circleCenterX);
      const dy = (top - circleCenterY) * dyFactor;
      const distToCenter = Math.sqrt(dx * dx + dy * dy);

      if (distToCenter < keepOutRadius) continue; 

      const tooClose = generated.some(icon => {
        const ddx = icon.left - left;
        const ddy = (icon.top - top) * 2;
        return Math.sqrt(ddx * ddx + ddy * ddy) < 8;
      });

      if (tooClose) continue;

      let isOnOrange = false;
      if (page === 'register') {
        const boundary = -0.5 * left + 90;
        isOnOrange = top < (boundary * 0.35);
      } else {
        const boundary = -0.9 * left + 90;
        isOnOrange = top < (boundary * 0.55);
      }

      const IconComponent = ICONS[Math.floor(Math.random() * ICONS.length)];
      
      generated.push({
        id: generated.length,
        left,
        top,
        size: 10 + Math.random() * 8,
        opacity: 0.25 + Math.random() * 0.2, // Slightly darker/more opaque
        rotation: Math.random() * 360,
        isOnOrange,
        IconComponent,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5,
        moveX: -20 + Math.random() * 40,
        moveY: -20 + Math.random() * 40,
      });
    }
    setIcons(generated);
  }, [count, page]);

  if (icons.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {icons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute"
          initial={{ 
            left: `${icon.left}%`, 
            top: `${icon.top}vh`, 
            rotate: icon.rotation,
            opacity: 0 
          }}
          animate={{ 
            left: [`${icon.left}%`, `${icon.left + icon.moveX / 10}%`, `${icon.left}%`],
            top: [`${icon.top}vh`, `${icon.top + icon.moveY / 10}vh`, `${icon.top}vh`],
            rotate: [icon.rotation, icon.rotation + 45, icon.rotation],
            opacity: icon.opacity
          }}
          transition={{
            duration: icon.duration,
            repeat: Infinity,
            ease: "linear",
            delay: icon.delay,
            opacity: { duration: 1 }
          }}
        >
          <icon.IconComponent 
            size={icon.size} 
            className={cn(
              icon.isOnOrange ? "text-white" : "text-[#ff7a1a]"
            )}
          />
        </motion.div>
      ))}
    </div>
  );
};
