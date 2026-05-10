import { fetchApi, getApiUrl } from "./interceptor";

export interface CreateTeamPayload {
  eventId: string;
  participantIds: string[];
}

export type TeamState =
  | "created"
  | "registered"
  | "participating"
  | "rejected"
  | "disqualified";

export const teamApi = {
  createTeam: async (payload: CreateTeamPayload) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/team/create" }),
      {
        method: "POST",
        contentType: "json",
        body: payload,
      },
    );
    if (error) throw error;
    return data;
  },

  approveTeam: async (teamId: string) => {
    const { error } = await fetchApi(getApiUrl({ path: "/team/approve" }), {
      method: "POST",
      contentType: "json",
      body: { teamId },
    });
    if (error) throw error;
  },

  rejectTeam: async (teamId: string, reason: string) => {
    const { error } = await fetchApi(getApiUrl({ path: "/team/reject" }), {
      method: "POST",
      contentType: "json",
      body: { teamId, reason },
    });
    if (error) throw error;
  },

  updateTeamState: async (teamId: string, state: TeamState) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/team/update-state", param: teamId }),
      {
        method: "POST",
        contentType: "json",
        body: { state },
      },
    );
    if (error) throw error;
  },

  addParticipant: async (teamId: string, userId: string) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/team/add-participant" }),
      {
        method: "POST",
        contentType: "json",
        body: { teamId, userId },
      },
    );
    if (error) throw error;
  },

  getTeamsByEvent: async (eventId: string) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/team/list", param: eventId }),
    );
    if (error) throw error;
    return data;
  },

  getTeamInfo: async (teamId: string) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/team/info", param: teamId }),
    );
    if (error) throw error;
    return data;
  },

  deleteTeam: async (teamId: string) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/team/delete", param: teamId }),
      {
        method: "DELETE",
      },
    );
    if (error) throw error;
  },
};
