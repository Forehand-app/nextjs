import type { LiveMatchStateData, MatchConfigData } from "@/lib/models";

export function createInitialLiveState(
  matchId: string,
  config: MatchConfigData,
): LiveMatchStateData {
  return {
    matchId,
    currentSet: 0,
    setScores: [[0, 0]],
    serverSide: config.initialServer === 1 ? 0 : 1,
    serverPlayerIndex: config.format === "doubles" ? 0 : undefined,
    startedAt: Date.now(),
    scoreLog: [],
  };
}

function isSetWon(score: number, other: number, config: MatchConfigData) {
  if (score < config.pointsToWin) return false;
  if (!config.winByTwo) return true;
  return score - other >= 2;
}

export function getSetsWon(
  state: LiveMatchStateData,
  config: MatchConfigData,
): [number, number] {
  // Completed sets are all sets before currentSet. currentSet may be complete but not advanced yet.
  let won0 = 0;
  let won1 = 0;
  state.setScores.forEach((s, idx) => {
    if (idx === state.currentSet) return;
    if (!s) return;
    if (isSetWon(s[0] ?? 0, s[1] ?? 0, config)) won0 += 1;
    if (isSetWon(s[1] ?? 0, s[0] ?? 0, config)) won1 += 1;
  });
  return [won0, won1];
}

export function getMatchWinner(
  state: LiveMatchStateData,
  config: MatchConfigData,
): 0 | 1 | null {
  const [won0, won1] = getSetsWon(state, config);
  const needed = Math.ceil(config.bestOf / 2);
  if (won0 >= needed) return 0;
  if (won1 >= needed) return 1;
  return null;
}

function rotateServeAfterLoss(
  state: LiveMatchStateData,
  config: MatchConfigData,
): LiveMatchStateData {
  if (config.format === "singles") {
    return { ...state, serverSide: state.serverSide === 0 ? 1 : 0 };
  }

  const currentIndex = state.serverPlayerIndex ?? 0;
  if (currentIndex === 0) {
    return { ...state, serverPlayerIndex: 1 };
  }
  return {
    ...state,
    serverSide: state.serverSide === 0 ? 1 : 0,
    serverPlayerIndex: 0,
  };
}

function withPoint(
  state: LiveMatchStateData,
  scoringSide: 0 | 1,
): LiveMatchStateData {
  const setScores = state.setScores.map((s, i) =>
    i === state.currentSet ? [...s] : s,
  );
  const current = setScores[state.currentSet];
  if (!current) return state;
  current[scoringSide] += 1;
  return { ...state, setScores };
}

export function applyRally(
  state: LiveMatchStateData,
  config: MatchConfigData,
  rallyWinner: 0 | 1,
) {
  if (config.scoringSystem === "rally") {
    return withPoint(state, rallyWinner);
  }

  // side-out scoring
  if (rallyWinner === state.serverSide) {
    return withPoint(state, rallyWinner);
  }
  return rotateServeAfterLoss(state, config);
}

export function applyFault(
  state: LiveMatchStateData,
  config: MatchConfigData,
  faultSide: 0 | 1,
) {
  const rallyWinner = faultSide === 0 ? 1 : 0;
  return applyRally(state, config, rallyWinner);
}

export function maybeAdvanceSet(
  state: LiveMatchStateData,
  config: MatchConfigData,
) {
  const current = state.setScores[state.currentSet] ?? [0, 0];
  const [s0, s1] = current;
  const setWinner: 0 | 1 | null = isSetWon(s0, s1, config)
    ? 0
    : isSetWon(s1, s0, config)
      ? 1
      : null;

  if (setWinner == null)
    return {
      state,
      setWinner: null as null,
      matchWinner: getMatchWinner(state, config),
    };

  // Mark set as complete by moving to a new set row (unless match is already won).
  const completed = {
    ...state,
    currentSet: state.currentSet + 1,
    setScores: [...state.setScores, [0, 0]],
  };
  const matchWinner = getMatchWinner(completed, config);

  return { state: completed, setWinner, matchWinner };
}
