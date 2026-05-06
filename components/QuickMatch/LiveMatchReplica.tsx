"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, MoreVertical, RotateCcw, TimerReset, Trophy } from "lucide-react";

type SetScore = [number | null, number | null];

interface LiveMatchReplicaProps {
  currentSetNumber: number;
  sideAScore: number;
  sideBScore: number;
  setScores: SetScore[];
  bestOf: number;
  scoringLabel: string;
  sideAServing: boolean;
  sideBServing: boolean;
  sideALabel?: string;
  sideBLabel?: string;
  showSwitchServe: boolean;
  showWinnerConfirm: boolean;
  showExitConfirm: boolean;
  showSetTransition?: boolean;
  onBack: () => void;
  onConfirmExit: () => void;
  onCloseExitConfirm: () => void;
  onUndo: () => void;
  onSideARally: () => void;
  onSideBRally: () => void;
  onSideAFault: () => void;
  onSideBFault: () => void;
  onCloseSwitch: () => void;
  onRestoreWinner: () => void;
  onConfirmWinner: () => void;
  winnerName?: string;
  winnerScore?: string;
}

function SetScoreText({ value }: { value: SetScore }) {
  if (value[0] == null || value[1] == null) return <>{"--:--"}</>;
  return (
    <>
      {String(value[0]).padStart(2, "0")} - {String(value[1]).padStart(2, "0")}
    </>
  );
}

export default function LiveMatchReplica({
  currentSetNumber,
  sideAScore,
  sideBScore,
  setScores,
  bestOf,
  scoringLabel,
  sideAServing,
  sideBServing,
  sideALabel = "Kunal Verma",
  sideBLabel = "Anil Kumar",
  showSwitchServe,
  showWinnerConfirm,
  showExitConfirm,
  showSetTransition = false,
  onBack,
  onConfirmExit,
  onCloseExitConfirm,
  onUndo,
  onSideARally,
  onSideBRally,
  onSideAFault,
  onSideBFault,
  onCloseSwitch,
  onRestoreWinner,
  onConfirmWinner,
  winnerName = "Kunal Verma",
  winnerScore = "",
}: LiveMatchReplicaProps) {
  const visibleSetScores: SetScore[] = Array.from({ length: bestOf }).map((_, index) => {
    const score = setScores[index];
    return score ? score : [null, null];
  });

  return (
    <div className="min-h-screen bg-background text-text">
      <div className="mx-auto w-full max-w-[390px] px-4 pb-6 pt-4">
        <header className="mb-4 flex items-center justify-between">
          <button type="button" onClick={onBack} className="h-9 w-9 text-text">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[22px] font-semibold leading-none">Live Match</h1>
          <button type="button" className="h-9 w-9 text-text">
            <MoreVertical size={18} />
          </button>
        </header>

        {/* Match Overview */}
        <section className="mb-3 rounded-card border border-border bg-surface p-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold">Match Overview</h2>
            <button type="button" onClick={onUndo} className="inline-flex items-center gap-1 text-[11px] text-primary">
              <RotateCcw size={12} /> Undo
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[8px] border border-border bg-surface-elevated p-1.5 text-center">
              <div className="mb-1.5 flex h-6 items-center justify-between rounded-[6px] border border-border bg-background px-2 text-[10px] text-muted">
                Match Admin
                <ChevronDown size={12} />
              </div>
              <p className="text-[12px] font-semibold">Alex Costa</p>
            </div>

            <div className="rounded-[8px] border border-border bg-surface-elevated p-1.5 text-center">
              <div className="mb-1.5 flex h-6 items-center justify-between rounded-[6px] border border-border bg-background px-2 text-[10px] text-muted">
                Match Timer
                <span className="text-[11px]">?</span>
              </div>
              <p className="text-[12px] font-semibold">00:23:45</p>
            </div>
          </div>
        </section>

        {/* Scoreboard */}
        <section className="mb-4 rounded-card border border-border bg-surface p-3">
          <h3 className="mb-2.5 text-center text-[24px] font-semibold leading-none">
            Current Set: {String(currentSetNumber).padStart(2, "0")}
          </h3>

          <div className="rounded-[10px] border border-border p-2">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
              <div>
                <div className="mx-auto mb-1.5 flex h-12 w-12 items-center justify-center rounded-full border border-border text-[30px] font-semibold">
                  KV
                </div>
                <p className="text-[9px]">{sideALabel}</p>
                <span className={`mt-1 inline-flex rounded-full border px-1.5 py-0.5 text-[8px] ${sideAServing ? "border-[#FF9E63] text-primary" : "border-border text-muted"}`}>
                  {sideAServing ? "Serving" : "Receiving"}
                </span>
              </div>

              <div className="text-[28px] font-semibold text-muted">Vs</div>

              <div>
                <div className="mx-auto mb-1.5 flex h-12 w-12 items-center justify-center rounded-full border border-border text-[30px] font-semibold">
                  AK
                </div>
                <p className="text-[9px]">{sideBLabel}</p>
                <span className={`mt-1 inline-flex rounded-full border px-1.5 py-0.5 text-[8px] ${sideBServing ? "border-[#FF9E63] text-primary" : "border-border text-muted"}`}>
                  {sideBServing ? "Serving" : "Receiving"}
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-2 w-fit rounded-full border border-border px-2 py-0.5 text-[8px]">
            {scoringLabel}
          </div>

          <div
            className={`mt-2 grid overflow-hidden rounded-[9px] border border-border ${
              bestOf === 5 ? "grid-cols-5" : "grid-cols-3"
            }`}
          >
            {visibleSetScores.map((setScore, index) => (
              <div
                key={index}
                className={`p-1.5 text-center ${index < visibleSetScores.length - 1 ? "border-r border-border" : ""}`}
              >
                <p className="text-[10px]">Set {index + 1}</p>
                <p className={`text-[14px] font-semibold ${setScore[0] == null ? "text-muted" : ""}`}>
                  <SetScoreText value={setScore} />
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="grid grid-cols-2 gap-2.5">
          <button type="button" onClick={onSideARally} className="h-10 rounded-[10px] bg-primary text-[13px] font-semibold text-primary-contrast">
            Kunal V. Won Rally
          </button>
          <button type="button" onClick={onSideBRally} className="h-10 rounded-[10px] bg-primary text-[13px] font-semibold text-primary-contrast">
            Anil K. Scored
          </button>
          <button type="button" onClick={onSideAFault} className="surface-row h-10 rounded-[10px] text-[13px] font-semibold">
            Kunal V. Fault
          </button>
          <button type="button" onClick={onSideBFault} className="surface-row h-10 rounded-[10px] text-[13px] font-semibold">
            Anil K. Fault
          </button>
        </section>

        <p className="mt-2 text-center text-[13px] text-muted">
          Set 1: {String(sideAScore).padStart(2, "0")} - {String(sideBScore).padStart(2, "0")}
        </p>
      </div>

      {/* Switch Serve Dialog */}
      {showSwitchServe && (
        <div className="fixed inset-0 z-[280] bg-black/50 backdrop-blur-[3px] flex items-center justify-center">
          <div className="surface-popup w-[90%] max-w-[360px] p-4 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center text-primary">
              <TimerReset size={20} />
            </div>
            <h3 className="text-[28px] font-semibold leading-none">Switch Serve Now</h3>
            <p className="mx-auto mt-1 max-w-[250px] text-[13px] text-muted">
              It&apos;s time for the players to switch serve on the court.
            </p>
            <button
              type="button"
              onClick={onCloseSwitch}
              className="mt-3 h-10 w-full rounded-xl bg-primary text-[16px] font-semibold text-primary-contrast"
            >
              Switch Sides
            </button>
          </div>
        </div>
      )}

      {/* Exit Confirm Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[285] bg-black/50 backdrop-blur-[3px] flex items-center justify-center">
          <div className="surface-popup w-[90%] max-w-[360px] p-4 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center text-primary">
              <TimerReset size={20} />
            </div>
            <h3 className="text-[24px] font-semibold leading-none">Leave Match?</h3>
            <p className="mx-auto mt-1 max-w-[250px] text-[13px] text-muted">
              Are you sure? The match will not be saved and you will return to match setup.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onCloseExitConfirm}
                className="surface-row h-10 rounded-xl text-[14px] font-semibold"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={onConfirmExit}
                className="h-10 rounded-xl bg-primary text-[14px] font-semibold text-primary-contrast"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Winner Confirm Dialog */}
      {showWinnerConfirm && (
        <div className="fixed inset-0 z-[290] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded-[24px] bg-[var(--color-surface)] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-3 flex items-center justify-center text-[#F7B31B]">
              <Trophy size={48} strokeWidth={1.5} />
            </div>
            <p className="text-[16px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
              Winner
            </p>
            <p className="mt-1 text-[26px] font-extrabold leading-tight text-[var(--color-text)]">
              {winnerName}
            </p>
            {winnerScore ? (
              <p className="mt-2 text-[14px] font-medium text-[var(--color-text-secondary)]">
                Final Score: {winnerScore}
              </p>
            ) : null}
            <button
              type="button"
              onClick={onConfirmWinner}
              className="mt-6 h-12 w-full rounded-full bg-primary text-[15px] font-bold text-white shadow-md hover:bg-primary/90 active:scale-[0.98]"
            >
              Confirm Results
            </button>
          </div>
        </div>
      )}

      {/* Set Transition / Intermediate Popup */}
      {showSetTransition && (
        <div className="fixed inset-0 z-[310] flex items-center justify-center bg-black/40 backdrop-blur-md">
          <span className="text-[140px] font-black text-primary drop-shadow-2xl">
            {currentSetNumber}
          </span>
        </div>
      )}
    </div>
  );
}
