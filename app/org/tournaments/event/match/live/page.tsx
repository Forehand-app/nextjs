"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, EllipsisIcon, ChevronDownIcon, XIcon } from "@/components/Icons";
import Scoreboard from "@/components/Match/Scoreboard";
import ScoringControls from "@/components/Match/ScoringControls";
import { getItem, setItem } from "@/lib/storage";
import type { LiveMatchState, MatchConfig } from "@/types/models";
import { applyFault, applyRally, createInitialLiveState, maybeAdvanceSet } from "@/lib/matchEngine";
import { routes } from "@/lib/routes";
import { useClientSearchParams } from "@/lib/useClientSearchParams";

type SidePlayer = { name: string; initials: string };

function ensurePlayers(players: unknown, format: MatchConfig["format"]) {
  const fallbackSingles = {
    side0: [{ initials: "KV", name: "Kunal Verma" }],
    side1: [{ initials: "AK", name: "Anil Kumar" }],
  };
  const fallbackDoubles = {
    side0: [
      { initials: "KV", name: "Kunal Verma" },
      { initials: "AC", name: "Alex Costa" },
    ],
    side1: [
      { initials: "AK", name: "Anil Kumar" },
      { initials: "TR", name: "The Rock" },
    ],
  };

  const p = players as { side0?: SidePlayer[]; side1?: SidePlayer[] } | null;
  if (!p?.side0?.length || !p?.side1?.length)
    return format === "doubles" ? fallbackDoubles : fallbackSingles;

  if (format === "doubles") {
    return {
      side0: [p.side0[0] ?? fallbackDoubles.side0[0], p.side0[1] ?? fallbackDoubles.side0[1]],
      side1: [p.side1[0] ?? fallbackDoubles.side1[0], p.side1[1] ?? fallbackDoubles.side1[1]],
    };
  }

  return {
    side0: [p.side0[0] ?? fallbackSingles.side0[0]],
    side1: [p.side1[0] ?? fallbackSingles.side1[0]],
  };
}

// ─── Exit Popup ───────────────────────────────────────────────────────────────
function ExitPopup({
  onLeave,
  onContinue,
}: {
  onLeave: () => void;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onContinue} />
      <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[88%] max-w-sm bg-white dark:bg-[var(--color-surface)] rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <h2 className="text-center font-black text-lg text-[var(--color-text)] mb-1">Exit Live Match?</h2>
        <div className="text-center text-sm text-[var(--color-muted)] mb-5 flex items-start gap-2 justify-center px-2">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth={2.5} className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span>You&apos;re currently scoring a live match. Changes won&apos;t be saved.</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onLeave}
            className="flex-1 py-3 rounded-full bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            Leave Anyways
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 rounded-full bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
          >
            Continue Scoring
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Unified Popup ─────────────────────────────────────────────────────────────
function LiveMatchActionPopup({
  title,
  description,
  buttonLabel,
  onAction,
  onDismiss,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onAction: () => void;
  onDismiss?: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[100]" onClick={onDismiss} />
      <div className="fixed top-1/2 left-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[340px] bg-white dark:bg-[var(--color-surface)] rounded-[28px] shadow-2xl p-8 animate-in zoom-in-95 duration-200 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4Z" />
              <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
              <path d="M16 11l2 2 2-2" />
            </svg>
          </div>
        </div>
        <h3 className="font-bold text-2xl text-[var(--color-text)] mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-[var(--color-muted)] mb-8 leading-relaxed px-2">
          {description}
        </p>
        <button
          onClick={onAction}
          className="w-full py-4 rounded-[20px] font-bold text-white text-base transition-all active:scale-[0.98] shadow-lg shadow-orange-500/25"
          style={{ background: "linear-gradient(135deg,#ff8c00,#f97316)" }}
        >
          {buttonLabel}
        </button>
      </div>
    </>
  );
}

// ─── Match Timer ──────────────────────────────────────────────────────────────
function useMatchTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OrgLiveMatchPage() {
  const router = useRouter();
  const searchParams = useClientSearchParams();
  const tournamentId = searchParams.get("tournamentId") || "1";
  const eventId = searchParams.get("eventId") || "1";
  const matchId = searchParams.get("matchId") || "m-1";

  const [showExitPopup, setShowExitPopup] = useState(false);
  const [activePopup, setActivePopup] = useState<"serve" | "sides" | null>(null);
  const timer = useMatchTimer();

  const config = useMemo<MatchConfig>(() => {
    const stored = getItem<MatchConfig>(`match:${matchId}:config`);
    return (
      stored ?? {
        scoringSystem: "sideout",
        format: "doubles",
        bestOf: 3,
        pointsToWin: 11,
        winByTwo: true,
        initialServer: 1,
      }
    );
  }, [matchId]);

  const players = useMemo(
    () => ensurePlayers(getItem(`match:${matchId}:players`), config.format),
    [matchId, config.format]
  );

  const [state, setState] = useState<LiveMatchState>(() => {
    const stored = getItem<LiveMatchState>(`match:${matchId}:state`);
    if (stored) return stored;
    return createInitialLiveState(matchId, config);
  });

  const [matchWinner, setMatchWinner] = useState<0 | 1 | null>(null);
  const redirectedRef = useRef(false);

  const persist = useCallback(
    (next: LiveMatchState) => {
      setItem(`match:${matchId}:state`, next);
    },
    [matchId]
  );

  const onRally = useCallback(
    (winnerSide: 0 | 1) => {
      setState((s) => {
        const next = applyRally(s, config, winnerSide);
        const advanced = maybeAdvanceSet(next, config);
        persist(advanced.state);
        setMatchWinner(advanced.matchWinner);
        return advanced.state;
      });
    },
    [config, persist]
  );

  const onFault = useCallback(
    (faultSide: 0 | 1) => {
      setState((s) => {
        const next = applyFault(s, config, faultSide);
        const advanced = maybeAdvanceSet(next, config);
        persist(advanced.state);
        setMatchWinner(advanced.matchWinner);
        return advanced.state;
      });
    },
    [config, persist]
  );

  useEffect(() => {
    if (matchWinner === null || redirectedRef.current) return;
    redirectedRef.current = true;
    router.replace(routes.orgMatchResult(tournamentId, eventId, matchId));
  }, [eventId, matchId, matchWinner, router, tournamentId]);

  // Automated Popups
  const lastSetRef = useRef(state.currentSet);
  const lastServerRef = useRef(state.serverSide);

  useEffect(() => {
    // Set changed -> Switch Sides
    if (state.currentSet > lastSetRef.current) {
      setActivePopup("sides");
      lastSetRef.current = state.currentSet;
    }
    // Server changed -> Switch Serve
    // We only trigger this if the match has actually started (score is not 0-0 in the current set)
    // or if it's explicitly a serve change after the first serve.
    const currentScore = state.setScores[state.currentSet] || [0, 0];
    const isFirstServe = currentScore[0] === 0 && currentScore[1] === 0 && state.currentSet === 0;

    if (state.serverSide !== lastServerRef.current && !isFirstServe) {
      setActivePopup("serve");
    }
    lastServerRef.current = state.serverSide;
  }, [state.currentSet, state.serverSide, state.setScores]);

  const handleBackPress = () => setShowExitPopup(true);
  const handleLeave = () => {
    setShowExitPopup(false);
    router.back();
  };

  const side0Name =
    config.format === "doubles"
      ? `${players.side0[0].initials} / ${players.side0[1]?.initials ?? ""}`
      : players.side0[0].name;
  const side1Name =
    config.format === "doubles"
      ? `${players.side1[0].initials} / ${players.side1[1]?.initials ?? ""}`
      : players.side1[0].name;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col">

      {/* ── Popups ── */}
      {showExitPopup && (
        <ExitPopup
          onLeave={handleLeave}
          onContinue={() => setShowExitPopup(false)}
        />
      )}
      {activePopup === "serve" && (
        <LiveMatchActionPopup
          title="Switch Serve Now"
          description="It's time for the players to switch serve on the court."
          buttonLabel="Switch Serve"
          onAction={() => setActivePopup(null)}
        />
      )}
      {activePopup === "sides" && (
        <LiveMatchActionPopup
          title="Switch Sides Now"
          description="The set has ended. Players must switch sides of the court."
          buttonLabel="Switch Sides"
          onAction={() => setActivePopup(null)}
        />
      )}

      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleBackPress}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--color-surface-elevated)] transition-colors text-[var(--color-text)]"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="font-bold text-base text-[var(--color-text)]">Live Match</h1>
        <button className="p-2 -mr-2 text-[var(--color-muted)]">
          <EllipsisIcon size={20} />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 pb-6">

        {/* ── Match Overview Card ── */}
        <div className="bg-white dark:bg-[var(--color-surface)] rounded-[24px] border border-[var(--color-border)] shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-[15px] text-[var(--color-text)]">Match Overview</span>
            <button className="text-xs font-bold text-orange-500 flex items-center gap-1.5 active:scale-95 transition-transform">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 14L4 9l5-5" />
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
              </svg>
              Undo
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Change Scorer */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-[var(--color-border)] p-1.5">
              <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider">Change Scorer</span>
                <ChevronDownIcon size={12} className="text-[var(--color-muted)]" />
              </div>
              <p className="py-1 text-sm font-bold text-center text-[var(--color-text)]">Alex Costa</p>
            </div>

            {/* Match Timer */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-[var(--color-border)] p-1.5">
              <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-muted)] font-bold uppercase tracking-wider">Match Timer</span>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="text-[var(--color-muted)]">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                  <path d="M12 2v2" />
                </svg>
              </div>
              <p className="py-1 text-sm font-bold text-center text-[var(--color-text)] tabular-nums">{timer}</p>
            </div>
          </div>
        </div>

        {/* ── Scoreboard ── */}
        <Scoreboard
          state={state}
          player1Name={config.format === "doubles" ? "Kunal Verma" : players.side0[0].name}
          player2Name={config.format === "doubles" ? "Anil Kumar" : players.side1[0].name}
          player1Initials={players.side0[0].initials}
          player2Initials={players.side1[0].initials}
          servingSide={state.serverSide}
          scoringMode={config.scoringSystem}
          format={config.format}
          side0Players={config.format === "doubles" ? (players.side0 as [SidePlayer, SidePlayer]) : undefined}
          side1Players={config.format === "doubles" ? (players.side1 as [SidePlayer, SidePlayer]) : undefined}
        />


        {/* ── Scoring Controls ── */}
        <ScoringControls
          sideOutMode={config.scoringSystem === "sideout"}
          onSide0Rally={() => onRally(0)}
          onSide1Rally={() => onRally(1)}
          onSide0Fault={() => onFault(0)}
          onSide1Fault={() => onFault(1)}
          onUndo={() => {}}
          side0Label={config.format === "doubles" ? "Kunal V." : players.side0[0].initials}
          side1Label={config.format === "doubles" ? "Anil K." : players.side1[0].initials}
          canUndo={false}
        />

      </div>
    </div>
  );
}
