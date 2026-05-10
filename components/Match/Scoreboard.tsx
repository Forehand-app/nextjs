"use client";

import React from "react";
import { LiveMatchStateData } from "@/lib/models";

type SidePlayer = {
  name: string;
  initials: string;
};

type ScoreboardProps = {
  state: LiveMatchStateData;
  player1Name: string;
  player2Name: string;
  player1Initials?: string;
  player2Initials?: string;
  servingSide: 0 | 1;
  scoringMode: "sideout" | "rally";
  format: "singles" | "doubles";
  side0Players?: readonly [SidePlayer, SidePlayer];
  side1Players?: readonly [SidePlayer, SidePlayer];
};

export default function Scoreboard({
  state,
  player1Name,
  player2Name,
  player1Initials = "P1",
  player2Initials = "P2",
  servingSide,
  scoringMode,
  format,
  side0Players,
  side1Players,
}: ScoreboardProps) {
  const currentSet = state.setScores[state.currentSet] ?? [0, 0];
  const [score0, score1] = currentSet;

  return (
    <div
      className="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border)] p-4"
      role="region"
      aria-live="polite"
      aria-label="Match scoreboard"
    >
      <div className="text-center text-sm text-[var(--color-muted)] mb-3">
        Current Set: {state.currentSet + 1} ·{" "}
        {scoringMode === "sideout" ? "Side-out" : "Rally"} · {format}
      </div>

      {format === "doubles" && side0Players && side1Players ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="text-2xl font-bold" aria-label="Pair A score">
              {score0}
            </div>
            <div className="text-[var(--color-muted)] font-medium">Vs</div>
            <div className="text-2xl font-bold" aria-label="Pair B score">
              {score1}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  Pair A
                </p>
                {servingSide === 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    Serving
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {side0Players.map((p, idx) => {
                  const isServer =
                    servingSide === 0 && (state.serverPlayerIndex ?? 0) === idx;
                  return (
                    <div
                      key={p.initials + idx}
                      className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-center ${isServer ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="text-lg font-semibold">{p.initials}</div>
                      <div className="text-[11px] text-[var(--color-muted)] truncate">
                        {p.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-[var(--color-muted)]">
                  Pair B
                </p>
                {servingSide === 1 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    Serving
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {side1Players.map((p, idx) => {
                  const isServer =
                    servingSide === 1 && (state.serverPlayerIndex ?? 0) === idx;
                  return (
                    <div
                      key={p.initials + idx}
                      className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-center ${isServer ? "ring-2 ring-primary" : ""}`}
                    >
                      <div className="text-lg font-semibold">{p.initials}</div>
                      <div className="text-[11px] text-[var(--color-muted)] truncate">
                        {p.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div
            className={`flex-1 text-center p-3 rounded-lg ${servingSide === 0 ? "ring-2 ring-primary" : ""}`}
          >
            <div
              className="text-2xl font-bold"
              aria-label={`${player1Name} score`}
            >
              {score0}
            </div>
            <div className="text-sm font-medium">{player1Initials}</div>
            <div className="text-xs text-[var(--color-muted)] truncate">
              {player1Name}
            </div>
            {servingSide === 0 && (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                Serving
              </span>
            )}
          </div>
          <div className="text-[var(--color-muted)] font-medium">Vs</div>
          <div
            className={`flex-1 text-center p-3 rounded-lg ${servingSide === 1 ? "ring-2 ring-primary" : ""}`}
          >
            <div
              className="text-2xl font-bold"
              aria-label={`${player2Name} score`}
            >
              {score1}
            </div>
            <div className="text-sm font-medium">{player2Initials}</div>
            <div className="text-xs text-[var(--color-muted)] truncate">
              {player2Name}
            </div>
            {servingSide === 1 && (
              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                Serving
              </span>
            )}
          </div>
        </div>
      )}
      {state.setScores.length > 0 && (
        <div className="mt-3 flex justify-center gap-4 text-sm text-[var(--color-muted)]">
          {state.setScores.map((s, i) => (
            <span key={i}>
              Set {i + 1}: {s[0]}-{s[1]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
