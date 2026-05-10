import { EventData, TournamentData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";

export const tournamentApi = {
  createTournament: async (tournament: TournamentData): Promise<string> => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/tournament/create" }),
      {
        method: "POST",
        contentType: "json",
        body: tournament,
      },
    );
    if (error) throw error;

    return data as string;
  },

  createEvents: async (events: EventData[]) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/tournament/events/create" }),
      {
        method: "POST",
        contentType: "json",
        body: events,
      },
    );
    if (error) throw error;
  },

  getInfo: async (tournamentId: string): Promise<TournamentData> => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/tournament/info", param: tournamentId }),
    );
    if (error) throw error;

    return data as TournamentData;
  },

  getOrganizationTournaments: async (
    orgId: string,
  ): Promise<TournamentData[]> => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/tournament/list/org", param: orgId }),
    );
    if (error) throw error;

    return data as TournamentData[];
  },

  getBrowseTournaments: async (): Promise<TournamentData[]> => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/tournament/list/user/browse" }),
    );
    if (error) throw error;

    return data as TournamentData[];
  },

  getJoinedTournaments: async (): Promise<TournamentData[]> => {
    const { data, error = null } = await fetchApi(
      getApiUrl({ path: "/tournament/list/user/joined" }),
    );
    if (error) throw error;

    return data as TournamentData[];
  },

  getHistoryTournaments: async (): Promise<TournamentData[]> => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/tournament/list/user/history" }),
    );
    if (error) throw error;

    return data as TournamentData[];
  },

  publishTournament: async (tournamentId: string) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/tournament/publish", param: tournamentId }),
      {
        method: "POST",
      },
    );
    if (error) throw error;
  },

  deleteTournament: async (tournamentId: string) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/tournament/delete", param: tournamentId }),
      {
        method: "DELETE",
      },
    );
    if (error) throw error;
  },
};
