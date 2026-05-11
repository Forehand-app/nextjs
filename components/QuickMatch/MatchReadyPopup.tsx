"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TimerResetIcon, TrophyIcon } from "@/components/Icons";

interface MatchReadyPopupProps {
  isOpen: boolean;
  variant: "confirm" | "switch" | "winner";
  onClose: () => void;
  onPrimaryAction?: () => void;
  courtName?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  winnerName?: string;
  winnerScore?: string;
}

export default function MatchReadyPopup({
  isOpen,
  variant,
  onClose,
  onPrimaryAction,
  courtName,
  confirmTitle = "Before you begin",
  confirmDescription = "Quick match results are for instant tracking only and will not be saved to your profile or history.",
  winnerName = "Winner",
  winnerScore = "",
}: MatchReadyPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[260] bg-black/60 backdrop-blur-sm"
          onClick={variant === "confirm" ? onClose : undefined}
        >
          {variant === "confirm" && (
            <div className="flex h-full items-center justify-center p-4">
              <motion.div
                initial={{ y: 12, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 12, opacity: 0, scale: 0.98 }}
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-[332px] rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-5 text-center shadow-lg"
              >
                <h3 className="text-[18px] font-semibold">{confirmTitle}</h3>
                <p className="mx-auto mt-2 max-w-[270px] text-sm leading-[1.4] text-[var(--color-muted)]">
                  {confirmDescription}
                </p>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-10 rounded-full border border-[var(--color-border)] text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onPrimaryAction}
                    className="flex-1 h-10 rounded-full bg-primary text-sm font-semibold text-white"
                  >
                    Start Match
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {variant === "switch" && (
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              className="absolute left-1/2 top-1/2 w-[90%] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center shadow-lg"
            >
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center text-primary">
                <TimerResetIcon size={21} />
              </div>
              <h3 className="text-[24px] font-semibold leading-none">
                Switch Serve Now
              </h3>
              <p className="mx-auto mt-2 max-w-[260px] text-sm leading-[1.4] text-[var(--color-muted)]">
                It&apos;s time for the players to switch serve on the court.
              </p>
              <button
                type="button"
                onClick={onPrimaryAction}
                className="mt-4 h-12 w-full rounded-xl bg-primary text-[16px] font-semibold text-white"
              >
                Switch Sides
              </button>
            </motion.div>
          )}

          {variant === "winner" && (
            <motion.div
              initial={{ y: 12, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              className="flex h-full items-center justify-center p-4"
            >
              <div className="w-full max-w-[360px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 text-center shadow-xl">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-[#F7B31B]">
                  <TrophyIcon size={28} strokeWidth={2.2} />
                </div>
                <p className="text-sm font-semibold text-[var(--color-muted)]">
                  Winner
                </p>
                <p className="mt-1 text-[22px] font-semibold text-[var(--color-text)]">
                  {winnerName}
                </p>
                {winnerScore && (
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Final Score: {winnerScore}
                  </p>
                )}
                {courtName && (
                  <p className="mt-1 text-xs text-[var(--color-muted)]">
                    {courtName}
                  </p>
                )}
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  className="mt-5 h-12 w-full rounded-xl bg-primary text-[16px] font-semibold text-white"
                >
                  Confirm Results
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
