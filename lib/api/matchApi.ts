import { fetchApi, getApiUrl } from "./interceptor";

export interface CreateMatchPayload {
  eventId: string;
  roundNumber: number;
  teamA: string;
  teamB: string;
  scorer?: string;
  winnerId?: string | null;
  matchState?:
    | "scheduled"
    | "in_progress"
    | "completed"
    | "abandoned"
    | "walkover";
  setsPerMatch?: number;
  pointsPerSet?: number;
  sideSwitching?: "per_set" | "half_set" | "no_switch";
}

export interface UpdateScorePayload {
  matchId: string;
  setNumber: number;
  teamAScore: number;
  teamBScore: number;
  setStatus: "not_started" | "in_progress" | "completed";
  winnerId?: string | null;
  matchFinished?: boolean;
  matchWinnerId?: string | null;
}

export const matchApi = {
  createMatches: async (matches: CreateMatchPayload[]) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/match/create" }),
      {
        method: "POST",
        contentType: "json",
        body: matches,
      },
    );
    if (error) throw error;
    return data;
  },

  updateMatchState: async (
    matchId: string,
    state: "scheduled" | "in_progress" | "completed" | "abandoned" | "walkover",
    winnerId?: string | null,
  ) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/match/update-state", param: matchId }),
      {
        method: "POST",
        contentType: "json",
        body: { state, winnerId },
      },
    );
    if (error) throw error;
  },

  updateScore: async (payload: UpdateScorePayload) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/match/update-score" }),
      {
        method: "POST",
        contentType: "json",
        body: payload,
      },
    );
    if (error) throw error;
  },

  getMatchesByEvent: async (eventId: string) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/match/list", param: eventId }),
    );
    if (error) throw error;
    return data;
  },

  getMatchesByEventAndRound: async (eventId: string, roundNumber: number) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/match/list", param: eventId }),
      {
        method: "POST",
        contentType: "json",
        body: { roundNumber },
      },
    );
    if (error) throw error;
    return data;
  },

  getMatchInfo: async (matchId: string) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/match/info", param: matchId }),
    );
    if (error) throw error;
    return data;
  },

  getSetInfo: async (setId: string) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/match/set/info", param: setId }),
    );
    if (error) throw error;
    return data;
  },

  updateSetState: async (
    setId: string,
    state: "not_started" | "in_progress" | "completed",
  ) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/match/set/update-state", param: setId }),
      {
        method: "POST",
        contentType: "json",
        body: { state },
      },
    );
    if (error) throw error;
  },
};
