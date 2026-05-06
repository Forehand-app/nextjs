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
    <div className="min-h-screen bg-[#ECECEC] text-[#1E1E1E] dark:bg-[#3D2B63] dark:text-white">
      <div className="mx-auto w-full max-w-[390px] px-4 pb-6 pt-4">
        <header className="mb-4 flex items-center justify-between">
          <button type="button" onClick={onBack} className="h-9 w-9 text-[#1E1E1E] dark:text-white">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[22px] font-semibold leading-none">Live Match</h1>
          <button type="button" className="h-9 w-9 text-[#1E1E1E] dark:text-white">
            <MoreVertical size={18} />
          </button>
        </header>

        <section className="mb-3 rounded-[12px] border border-[#DBDBDB] bg-[#F6F6F6] p-3 dark:border-[#63528A] dark:bg-[#4D3B75]">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold">Match Overview</h2>
            <button type="button" onClick={onUndo} className="inline-flex items-center gap-1 text-[11px] text-[#FF7A1A]">
              <RotateCcw size={12} /> Undo
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[8px] border border-[#DADADA] bg-[#FAFAFA] p-1.5 text-center dark:border-[#6B5B90] dark:bg-[#56437F]">
              <div className="mb-1.5 flex h-6 items-center justify-between rounded-[6px] border border-[#D9D9D9] bg-white px-2 text-[10px] text-[#666666] dark:border-[#6B5B90] dark:bg-[#4D3B75] dark:text-white/75">
                Match Admin
                <ChevronDown size={12} />
              </div>
              <p className="text-[12px] font-semibold">Alex Costa</p>
            </div>

            <div className="rounded-[8px] border border-[#DADADA] bg-[#FAFAFA] p-1.5 text-center dark:border-[#6B5B90] dark:bg-[#56437F]">
              <div className="mb-1.5 flex h-6 items-center justify-between rounded-[6px] border border-[#D9D9D9] bg-white px-2 text-[10px] text-[#666666] dark:border-[#6B5B90] dark:bg-[#4D3B75] dark:text-white/75">
                Match Timer
                <span className="text-[11px]">?</span>
              </div>
              <p className="text-[12px] font-semibold">00:23:45</p>
            </div>
          </div>
        </section>

        <section className="mb-4 rounded-[12px] border border-[#DBDBDB] bg-[#F6F6F6] p-3 dark:border-[#63528A] dark:bg-[#4D3B75]">
          <h3 className="mb-2.5 text-center text-[24px] font-semibold leading-none">
            Current Set: {String(currentSetNumber).padStart(2, "0")}
          </h3>

          <div className="rounded-[10px] border border-[#D3D3D3] p-2 dark:border-[#7A6A9F]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center">
              <div>
                <div className="mx-auto mb-1.5 flex h-12 w-12 items-center justify-center rounded-full border border-[#D3D3D3] text-[30px] font-semibold dark:border-[#8A7BAC]">
                  KV
                </div>
                <p className="text-[9px]">{sideALabel}</p>
                <span className={`mt-1 inline-flex rounded-full border px-1.5 py-0.5 text-[8px] ${sideAServing ? "border-[#FF9E63] text-[#FF7A1A]" : "border-[#D3D3D3] text-[#777777] dark:border-[#8A7BAC] dark:text-white/70"}`}>
                  {sideAServing ? "Serving" : "Receiving"}
                </span>
              </div>

              <div className="text-[28px] font-semibold text-[#737373] dark:text-white/60">Vs</div>

              <div>
                <div className="mx-auto mb-1.5 flex h-12 w-12 items-center justify-center rounded-full border border-[#D3D3D3] text-[30px] font-semibold dark:border-[#8A7BAC]">
                  AK
                </div>
                <p className="text-[9px]">{sideBLabel}</p>
                <span className={`mt-1 inline-flex rounded-full border px-1.5 py-0.5 text-[8px] ${sideBServing ? "border-[#FF9E63] text-[#FF7A1A]" : "border-[#D3D3D3] text-[#777777] dark:border-[#8A7BAC] dark:text-white/70"}`}>
                  {sideBServing ? "Serving" : "Receiving"}
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-2 w-fit rounded-full border border-[#D5D5D5] px-2 py-0.5 text-[8px] dark:border-[#8A7BAC]">
            {scoringLabel}
          </div>

          <div
            className={`mt-2 grid overflow-hidden rounded-[9px] border border-[#D5D5D5] dark:border-[#8A7BAC] ${
              bestOf === 5 ? "grid-cols-5" : "grid-cols-3"
            }`}
          >
            {visibleSetScores.map((setScore, index) => (
              <div
                key={index}
                className={`p-1.5 text-center ${index < visibleSetScores.length - 1 ? "border-r border-[#D5D5D5] dark:border-[#8A7BAC]" : ""}`}
              >
                <p className="text-[10px]">Set {index + 1}</p>
                <p className={`text-[14px] font-semibold ${setScore[0] == null ? "text-[#7A7A7A] dark:text-white/70" : ""}`}>
                  <SetScoreText value={setScore} />
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onSideARally}
            className="h-10 rounded-[10px] bg-[#FF7A1A] text-[13px] font-semibold text-white"
          >
            Kunal V. Won Rally
          </button>
          <button
            type="button"
            onClick={onSideBRally}
            className="h-10 rounded-[10px] bg-[#FF7A1A] text-[13px] font-semibold text-white"
          >
            Anil K. Scored
          </button>
          <button
            type="button"
            onClick={onSideAFault}
            className="h-10 rounded-[10px] border border-[#D5D5D5] bg-[#F8F8F8] text-[13px] font-semibold dark:border-[#8A7BAC] dark:bg-[#4B3A73]"
          >
            Kunal V. Fault
          </button>
          <button
            type="button"
            onClick={onSideBFault}
            className="h-10 rounded-[10px] border border-[#D5D5D5] bg-[#F8F8F8] text-[13px] font-semibold dark:border-[#8A7BAC] dark:bg-[#4B3A73]"
          >
            Anil K. Fault
          </button>
        </section>

        <p className="mt-2 text-center text-[13px] text-[#6B6B6B] dark:text-white/70">
          Set 1: {String(sideAScore).padStart(2, "0")} - {String(sideBScore).padStart(2, "0")}
        </p>
      </div>

      {showSwitchServe && (
        <div className="fixed inset-0 z-[280] bg-black/50 backdrop-blur-[3px]">
          <div className="absolute inset-0 bg-[#FFFFFF80] dark:bg-[#3D2B6390]" />
          <div className="absolute left-1/2 top-1/2 w-[90%] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#D7D7D7] bg-white p-4 text-center dark:border-[#68588D] dark:bg-[#3F2D67]">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center text-[#FF7A1A]">
              <TimerReset size={20} />
            </div>
            <h3 className="text-[28px] font-semibold leading-none">Switch Serve Now</h3>
            <p className="mx-auto mt-1 max-w-[250px] text-[13px] text-[#656565] dark:text-white/75">
              It&apos;s time for the players to switch serve on the court.
            </p>
            <button
              type="button"
              onClick={onCloseSwitch}
              className="mt-3 h-10 w-full rounded-xl bg-[#FF7A1A] text-[16px] font-semibold text-white"
            >
              Switch Sides
            </button>
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-[285] bg-black/50 backdrop-blur-[3px]">
          <div className="absolute inset-0 bg-[#FFFFFF80] dark:bg-[#3D2B6390]" />
          <div className="absolute left-1/2 top-1/2 w-[90%] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#D7D7D7] bg-white p-4 text-center dark:border-[#68588D] dark:bg-[#3F2D67]">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center text-[#FF7A1A]">
              <TimerReset size={20} />
            </div>
            <h3 className="text-[24px] font-semibold leading-none">Leave Match?</h3>
            <p className="mx-auto mt-1 max-w-[250px] text-[13px] text-[#656565] dark:text-white/75">
              Are you sure? The match will not be saved and you will return to match setup.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onCloseExitConfirm}
                className="h-10 rounded-xl border border-[#D5D5D5] bg-[#F8F8F8] text-[14px] font-semibold dark:border-[#8A7BAC] dark:bg-[#4B3A73]"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={onConfirmExit}
                className="h-10 rounded-xl bg-[#FF7A1A] text-[14px] font-semibold text-white"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {showWinnerConfirm && (
        <div className="fixed inset-0 z-[290] bg-black/50 backdrop-blur-[3px]">
          <div className="absolute inset-0 bg-[#FFFFFF80] dark:bg-[#3D2B6390]" />
          <div className="absolute left-1/2 top-1/2 w-[90%] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#D7D7D7] bg-white p-4 text-center dark:border-[#68588D] dark:bg-[#3F2D67]">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center text-[#F7B31B]">
              <Trophy size={28} strokeWidth={2.2} />
            </div>
            <p className="text-[24px] font-semibold">Winner Ready</p>
            <p className="mt-1 text-[28px] font-bold leading-none">{winnerName}</p>
            {winnerScore ? <p className="mt-2 text-[14px] text-[#656565] dark:text-white/75">Final Score: {winnerScore}</p> : null}
            <button
              type="button"
              onClick={onRestoreWinner}
              className="mt-4 h-10 w-full rounded-xl border border-[#D5D5D5] bg-[#F8F8F8] text-[14px] font-semibold dark:border-[#8A7BAC] dark:bg-[#4B3A73]"
            >
              Restore Match
            </button>
            <button
              type="button"
              onClick={onConfirmWinner}
              className="mt-2 h-12 w-full rounded-xl bg-[#FF7A1A] text-[16px] font-semibold text-white"
            >
              Confirm Winner
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

