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
};
