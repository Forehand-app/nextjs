"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import LiveMatchReplica from "@/components/QuickMatch/LiveMatchReplica";
import { getItem, setItem } from "@/lib/storage";
import type {
  LiveMatchStateData,
  MatchConfigData,
  ScoreEventData,
} from "@/lib/models";
import {
  applyFault,
  applyRally,
  createInitialLiveState,
  maybeAdvanceSet,
} from "@/lib/matchEngine";
import { toQuery } from "@/lib/utils";

type SidePlayer = { name: string; initials: string };

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "P";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function ensurePlayers(players: unknown, format: MatchConfigData["format"]) {
  const fallbackSingles = {
    side0: [{ initials: "P1", name: "Player 1" }],
    side1: [{ initials: "P2", name: "Player 2" }],
  };
  const fallbackDoubles = {
    side0: [
      { initials: "P1", name: "Player 1" },
      { initials: "P3", name: "Player 3" },
    ],
    side1: [
      { initials: "P2", name: "Player 2" },
      { initials: "P4", name: "Player 4" },
    ],
  };

  const p = players as { side0?: SidePlayer[]; side1?: SidePlayer[] } | null;
  if (!p?.side0?.length || !p?.side1?.length) {
    return format === "doubles" ? fallbackDoubles : fallbackSingles;
  }

  if (format === "doubles") {
    const s0a = p.side0[0] ?? fallbackDoubles.side0[0];
    const s0b = p.side0[1] ?? fallbackDoubles.side0[1];
    const s1a = p.side1[0] ?? fallbackDoubles.side1[0];
    const s1b = p.side1[1] ?? fallbackDoubles.side1[1];
    return {
      side0: [
        { ...s0a, initials: s0a.initials || initialsFromName(s0a.name) },
        { ...s0b, initials: s0b.initials || initialsFromName(s0b.name) },
      ],
      side1: [
        { ...s1a, initials: s1a.initials || initialsFromName(s1a.name) },
        { ...s1b, initials: s1b.initials || initialsFromName(s1b.name) },
      ],
    };
  }

  const s0 = p.side0[0] ?? fallbackSingles.side0[0];
  const s1 = p.side1[0] ?? fallbackSingles.side1[0];
  return {
    side0: [{ ...s0, initials: s0.initials || initialsFromName(s0.name) }],
    side1: [{ ...s1, initials: s1.initials || initialsFromName(s1.name) }],
  };
}

export default function OrgLiveMatchPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const tournamentId = searchParams.get("tournamentId") || "1";
  const eventId = searchParams.get("eventId") || "1";
  const matchId = searchParams.get("matchId") || "m-1";

  const config = useMemo<MatchConfigData>(() => {
    const stored = getItem<MatchConfigData>(`match:${matchId}:config`);
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
    [matchId, config.format],
  );

  const [state, setState] = useState<LiveMatchStateData>(() => {
    const stored = getItem<LiveMatchStateData>(`match:${matchId}:state`);
    if (stored) return stored;
    return createInitialLiveState(matchId, config);
  });
  const [history, setHistory] = useState<LiveMatchStateData[]>([]);
  const [seq, setSeq] = useState(0);
  const [showSwitchServe, setShowSwitchServe] = useState(false);
  const [showSwitchSides, setShowSwitchSides] = useState(false);
  const [matchWinner, setMatchWinner] = useState<0 | 1 | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [scorerSide, setScorerSide] = useState<0 | 1>(
    config.initialServer === 2 ? 1 : 0,
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const isDoubles = config.format === "doubles";
  const sideALabel = isDoubles
    ? `${players.side0[0].name} / ${players.side0[1]?.name ?? "Player"}`
    : players.side0[0].name;
  const sideBLabel = isDoubles
    ? `${players.side1[0].name} / ${players.side1[1]?.name ?? "Player"}`
    : players.side1[0].name;
  const sideAActionLabel = isDoubles ? "Team 1" : players.side0[0].name;
  const sideBActionLabel = isDoubles ? "Team 2" : players.side1[0].name;
  const scorerLabel = scorerSide === 0 ? sideAActionLabel : sideBActionLabel;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setScorerSide(config.initialServer === 2 ? 1 : 0);
  }, [config.initialServer]);

  const matchTimer = useMemo(() => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [elapsedSeconds]);

  const emit = useCallback(
    (type: ScoreEventData["type"], details: Record<string, unknown>) => {
      const nextSeq = seq + 1;
      const event: ScoreEventData = {
        seq: nextSeq,
        timestamp: Date.now(),
        actorId: "org",
        type,
        details,
      };
      setSeq(nextSeq);
      const logs = getItem<ScoreEventData[]>(`match:${matchId}:events`) || [];
      setItem(`match:${matchId}:events`, [...logs, event]);
    },
    [matchId, seq],
  );

  const persist = useCallback(
    (next: LiveMatchStateData) => {
      setItem(`match:${matchId}:state`, next);
    },
    [matchId],
  );

  const applyRallyAction = useCallback(
    (winnerSide: 0 | 1) => {
      emit("rally", { side: winnerSide });
      setScorerSide(winnerSide);
      setState((previous) => {
        setHistory((historyPrevious) => [...historyPrevious, previous]);
        const next = applyRally(previous, config, winnerSide);
        const advanced = maybeAdvanceSet(next, config);
        persist(advanced.state);
        setMatchWinner(advanced.matchWinner);
        return advanced.state;
      });
    },
    [config, emit, persist],
  );

  const applyFaultAction = useCallback(
    (faultSide: 0 | 1) => {
      emit("fault", { side: faultSide });
      setScorerSide(faultSide === 0 ? 1 : 0);
      setState((previous) => {
        setHistory((historyPrevious) => [...historyPrevious, previous]);
        const next = applyFault(previous, config, faultSide);
        const advanced = maybeAdvanceSet(next, config);
        persist(advanced.state);
        setMatchWinner(advanced.matchWinner);
        return advanced.state;
      });
    },
    [config, emit, persist],
  );

  const undo = useCallback(() => {
    emit("undo", {});
    setHistory((previous) => {
      const snapshot = previous[previous.length - 1];
      if (snapshot) {
        setState(snapshot);
        setMatchWinner(null);
        persist(snapshot);
      }
      return previous.slice(0, -1);
    });
  }, [emit, persist]);

  const lastSetRef = React.useRef(state.currentSet);
  const lastServerRef = React.useRef(state.serverSide);

  useEffect(() => {
    if (state.currentSet > lastSetRef.current) {
      setShowSwitchSides(true);
      lastSetRef.current = state.currentSet;
    }
    const currentScore = state.setScores[state.currentSet] || [0, 0];
    const isFirstServe =
      currentScore[0] === 0 && currentScore[1] === 0 && state.currentSet === 0;
    if (state.serverSide !== lastServerRef.current && !isFirstServe) {
      setShowSwitchServe(true);
    }
    lastServerRef.current = state.serverSide;
  }, [state.currentSet, state.serverSide, state.setScores]);

  const currentSet: [number, number] = [
    state.setScores[state.currentSet]?.[0] ?? 0,
    state.setScores[state.currentSet]?.[1] ?? 0,
  ];
  const setScores: Array<[number | null, number | null]> = Array.from({
    length: config.bestOf,
  }).map((_, index) => [
    state.setScores[index]?.[0] ?? (index === 0 ? 0 : null),
    state.setScores[index]?.[1] ?? (index === 0 ? 0 : null),
  ]);
  const winnerScore = `${String(currentSet[0] ?? 0).padStart(2, "0")}-${String(currentSet[1] ?? 0).padStart(2, "0")}`;

  return (
    <LiveMatchReplica
      currentSetNumber={Math.min(state.currentSet + 1, config.bestOf)}
      sideAScore={currentSet[0] ?? 0}
      sideBScore={currentSet[1] ?? 0}
      setScores={setScores}
      bestOf={config.bestOf}
      scoringLabel={
        config.scoringSystem === "sideout"
          ? "Side-Out Scoring"
          : "Rally Scoring"
      }
      sideAServing={state.serverSide === 0}
      sideBServing={state.serverSide === 1}
      sideALabel={sideALabel}
      sideBLabel={sideBLabel}
      scorerLabel={scorerLabel}
      matchTimer={matchTimer}
      sideAActionLabel={sideAActionLabel}
      sideBActionLabel={sideBActionLabel}
      showSwitchServe={showSwitchServe}
      showSwitchSides={showSwitchSides}
      showWinnerConfirm={matchWinner != null}
      showExitConfirm={showExitConfirm}
      onBack={() => setShowExitConfirm(true)}
      onConfirmExit={() =>
        router.replace(
          "/org/tournaments/event/match/setup" +
            toQuery({ tournamentId, eventId, matchId }),
        )
      }
      onCloseExitConfirm={() => setShowExitConfirm(false)}
      onUndo={undo}
      onSideARally={() => applyRallyAction(0)}
      onSideBRally={() => applyRallyAction(1)}
      onSideAFault={() => applyFaultAction(0)}
      onSideBFault={() => applyFaultAction(1)}
      onCloseSwitch={() => {
        setShowSwitchServe(false);
        setShowSwitchSides(false);
      }}
      onRestoreWinner={() => {
        undo();
        setMatchWinner(null);
      }}
      onConfirmWinner={() =>
        router.replace(
          "/org/tournaments/event/match/result" +
            toQuery({ tournamentId, eventId, matchId }),
        )
      }
      winnerName={matchWinner === 1 ? sideBActionLabel : sideAActionLabel}
      winnerScore={winnerScore}
    />
  );
}

