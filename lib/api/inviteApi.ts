import { fetchApi, getApiUrl } from "./interceptor";

type CrewRole = "admin" | "scorer";

type SendInviteArgs = {
  phone: string;
  role: CrewRole;
  tournamentId: string;
  organizationId?: string;
};

type InviteResponse = {
  inviteId?: string;
  receiverName?: string;
  receiverProfilePicUrl?: string | null;
  inviteState?: "pending" | "accepted" | "rejected";
};

type CrewMemberResponse = {
  id: string;
  role: CrewRole;
  name: string;
  phone?: string;
  avatarUrl?: string | null;
  status?: "invite_sent" | "accepted" | "rejected" | "idle";
};

const inviteCreatePath =
  process.env.NEXT_PUBLIC_TOURNAMENT_CREW_INVITE_PATH || "/invite/create";
const crewListPath =
  process.env.NEXT_PUBLIC_TOURNAMENT_CREW_LIST_PATH || "/invite/tournament/crew";

export const inviteApi = {
  sendTournamentCrewInvite: async ({
    phone,
    role,
    tournamentId,
    organizationId,
  }: SendInviteArgs): Promise<InviteResponse> => {
    const payload = {
      phone,
      role,
      tournamentId,
      organizationId,
      contextType: "tournament_crew",
      notifyReceiver: true,
    };
    const url = getApiUrl({ path: inviteCreatePath });
    console.log("[inviteApi] sendTournamentCrewInvite:start", {
      url,
      payload,
    });

    const { data, error } = await fetchApi(url, {
      method: "POST",
      contentType: "json",
      body: payload,
    });
    if (error) {
      console.error("[inviteApi] sendTournamentCrewInvite:error", {
        url,
        payload,
        error,
      });
      throw error;
    }
    console.log("[inviteApi] sendTournamentCrewInvite:success", { url, data });

    return (data || {}) as InviteResponse;
  },

  getTournamentCrew: async (tournamentId: string): Promise<CrewMemberResponse[]> => {
    const url = getApiUrl({ path: crewListPath });
    const payload = { tournamentId };
    console.log("[inviteApi] getTournamentCrew:start", { url, payload });
    const { data, error } = await fetchApi(url, {
      method: "POST",
      contentType: "json",
      body: payload,
    });
    if (error) {
      console.error("[inviteApi] getTournamentCrew:error", {
        url,
        payload,
        error,
      });
      throw error;
    }
    console.log("[inviteApi] getTournamentCrew:success", {
      url,
      count: Array.isArray(data) ? data.length : 0,
      data,
    });
    return Array.isArray(data) ? (data as CrewMemberResponse[]) : [];
  },

  removeTournamentCrewInvite: async (inviteId: string, tournamentId: string) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/invite/tournament/crew/remove" }),
      {
        method: "POST",
        contentType: "json",
        body: { inviteId, tournamentId },
      },
    );
    if (error) throw error;
  },
};
