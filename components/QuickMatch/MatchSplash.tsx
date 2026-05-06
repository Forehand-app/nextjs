"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface MatchSplashProps {
  onComplete: () => void;
}

function BlurredLiveMock() {
  return (
    <div className="pointer-events-none absolute inset-4 overflow-hidden rounded-[2px] border border-border bg-background">
      <div className="h-11 border-b border-border bg-surface" />
      <div className="space-y-2.5 p-3">
        <div className="h-[60px] rounded-xl border border-border bg-surface-elevated" />
        <div className="h-32 rounded-xl border border-border bg-surface-elevated" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 rounded-xl bg-primary" />
          <div className="h-11 rounded-xl bg-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-11 rounded-xl border border-border bg-surface-elevated" />
          <div className="h-11 rounded-xl border border-border bg-surface-elevated" />
        </div>
      </div>
    </div>
  );
}

export default function MatchSplash({ onComplete }: MatchSplashProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }

    const timer = window.setTimeout(() => {
      setCount((prev) => Math.max(prev - 1, 0));
    }, 700);

    return () => window.clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[250] bg-black/50"
    >
      <div className="relative mx-auto h-full w-full max-w-[430px]">
        <BlurredLiveMock />

        {/* Frosted glass overlay using the bg-background token */}
        <div className="absolute inset-4 rounded-[2px] bg-background/60 backdrop-blur-[5px]" />

        <div className="absolute inset-0 flex items-center justify-center pb-10">
          <motion.span
            key={count}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-[84px] font-bold leading-none text-primary"
          >
            {count}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
