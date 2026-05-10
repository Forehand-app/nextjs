"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import CourtSlider from "./CourtSlider";
import MatchSplash from "./MatchSplash";
import MatchReadyPopup from "./MatchReadyPopup";
import { toQuery } from "@/lib/utils";

type FlowStep = "select" | "confirm" | "loading";
type SetupPayload = {
  courtId: string;
  format: "singles" | "doubles";
  scoring: "sideout" | "rally";
  bestOf: 3 | 5;
  points: 11 | 15 | 21;
  winByTwo: boolean;
  initialServer: 1 | 2;
  players: {
    leftTop: string | null;
    leftBottom: string | null;
    rightTop: string | null;
    rightBottom: string | null;
  };
};

export default function QuickMatchFlow() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<FlowStep>("select");
  const [setup, setSetup] = useState<SetupPayload | null>(null);

  const closeAll = () => {
    setIsOpen(false);
    setStep("select");
    setSetup(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface p-4 text-left shadow-card transition-transform active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-semibold text-text">Quick Match</h3>
            <p className="mt-0.5 text-sm text-muted">
              Invite players and score
            </p>
          </div>
        </div>
        <ChevronRight className="text-muted" size={20} />
      </button>

      <AnimatePresence>
        {isOpen && step === "select" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/55"
              onClick={closeAll}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="fixed inset-x-0 bottom-0 z-[210] max-h-[96vh] overflow-y-auto bg-background pb-4"
            >
              <CourtSlider
                onBack={closeAll}
                onStart={(payload) => {
                  setSetup(payload);
                  setStep("confirm");
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MatchReadyPopup
        isOpen={isOpen && step === "confirm"}
        variant="confirm"
        onClose={closeAll}
        onPrimaryAction={() => setStep("loading")}
      />

      <AnimatePresence>
        {isOpen && step === "loading" && (
          <MatchSplash
            onComplete={() => {
              if (!setup) {
                closeAll();
                return;
              }
              const matchId = `quick-${Date.now()}`;
              closeAll();
              router.push(
                "/match/live" +
                  toQuery({
                    matchId,
                    format: setup.format,
                    scoring: setup.scoring,
                    bestOf: setup.bestOf,
                    points: setup.points,
                    winByTwo: setup.winByTwo,
                    server: setup.initialServer,
                    p1: setup.players.leftTop ?? "Kunal Verma",
                    p2: setup.players.rightBottom ?? "Anil Kumar",
                    p3: setup.players.leftBottom ?? "",
                    p4: setup.players.rightTop ?? "",
                    court: setup.courtId,
                    quick: "1",
                  }),
              );
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
