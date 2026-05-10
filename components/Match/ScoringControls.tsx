"use client";

import React from "react";
import { ArrowLeftIcon } from "@/components/Icons";

type ScoringControlsProps = {
  sideOutMode: boolean;
  onSide0Rally: () => void;
  onSide1Rally: () => void;
  onSide0Fault: () => void;
  onSide1Fault: () => void;
  onUndo: () => void;
  side0Label: string;
  side1Label: string;
  canUndo: boolean;
};

export default function ScoringControls({
  sideOutMode,
  onSide0Rally,
  onSide1Rally,
  onSide0Fault,
  onSide1Fault,
  onUndo,
  side0Label,
  side1Label,
  canUndo,
}: ScoringControlsProps) {
  return (
    <div className="space-y-3" role="group" aria-label="Scoring actions">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onSide0Rally}
          className="min-h-[48px] rounded-[var(--radius-button)] bg-primary text-white font-medium py-3 px-4"
          aria-label={`${side0Label} won rally`}
        >
          {side0Label} {sideOutMode ? "Won Rally" : "Scored"}
        </button>
        <button
          type="button"
          onClick={onSide1Rally}
          className="min-h-[48px] rounded-[var(--radius-button)] bg-primary text-white font-medium py-3 px-4"
          aria-label={`${side1Label} won rally`}
        >
          {side1Label} {sideOutMode ? "Won Rally" : "Scored"}
        </button>
        <button
          type="button"
          onClick={onSide0Fault}
          className="min-h-[44px] rounded-[var(--radius-button)] border border-[var(--color-error)] text-[var(--color-error)] text-sm py-2"
          aria-label={`${side0Label} fault`}
        >
          {side0Label} Fault
        </button>
        <button
          type="button"
          onClick={onSide1Fault}
          className="min-h-[44px] rounded-[var(--radius-button)] border border-[var(--color-error)] text-[var(--color-error)] text-sm py-2"
          aria-label={`${side1Label} fault`}
        >
          {side1Label} Fault
        </button>
      </div>
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="w-full min-h-[44px] rounded-[var(--radius-button)] border border-[var(--color-border)] text-primary disabled:opacity-50"
        aria-label="Undo last action"
      >
        <span className="inline-flex items-center justify-center gap-2">
          <ArrowLeftIcon size={18} className="text-primary" />
          Undo
        </span>
      </button>
    </div>
  );
}

