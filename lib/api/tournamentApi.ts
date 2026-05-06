import { TournamentData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";

export const tournamenApi = {
    getInfo: async (tournamentId: string): Promise<TournamentData> => {
        const { data } = await fetchApi(getApiUrl({ path: "/tournament/info", param: tournamentId }));
        return data as TournamentData;
    },

    getOrganizationTournaments: async (orgId: string): Promise<TournamentData[]> => {
        const { data } = await fetchApi(getApiUrl({ path: "/tournament/list/org", param: orgId }));

        return data as TournamentData[];
    }

}