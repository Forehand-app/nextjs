import { toQuery } from "./utils";

export const routes = {
  // ─── Org Tournament ───────────────────────────────────────────────────────
  orgTournaments: () => "/org/tournaments",
  orgTournamentDetail: (tournamentId: string) =>
    `/org/tournaments/detail${toQuery({ t: tournamentId })}`,

  // ─── Org Event sub-pages ──────────────────────────────────────────────────
  orgEventParticipants: (tournamentId: string, eventId: string) =>
    `/org/tournaments/event/participants${toQuery({ tournamentId, eventId })}`,

  orgEventFixture: (tournamentId: string, eventId: string) =>
    `/org/tournaments/event/fixture${toQuery({ tournamentId, eventId })}`,

  orgEventMatches: (tournamentId: string, eventId: string) =>
    `/org/tournaments/event/matches${toQuery({ tournamentId, eventId })}`,

  orgEventChampion: (tournamentId: string, eventId: string) =>
    `/org/tournaments/event/champion${toQuery({ tournamentId, eventId })}`,

  // ─── Org Match sub-pages ──────────────────────────────────────────────────
  orgMatchSetup: (tournamentId: string, eventId: string, matchId: string) =>
    `/org/tournaments/event/match/setup${toQuery({ tournamentId, eventId, matchId })}`,

  orgMatchLive: (tournamentId: string, eventId: string, matchId: string) =>
    `/org/tournaments/event/match/live${toQuery({ tournamentId, eventId, matchId })}`,

  orgMatchResult: (tournamentId: string, eventId: string, matchId: string) =>
    `/org/tournaments/event/match/result${toQuery({ tournamentId, eventId, matchId })}`,
};
