import { fetchApi, getApiUrl } from "./interceptor";

/**
 * Payload for registering a new team for an event.
 */
export interface CreateTeamPayload {
  eventId: string;
  participantIds: string[];
}

/**
 * Valid states for a team.
 */
export type TeamState =
  | "created"
  | "registered"
  | "participating"
  | "rejected"
  | "disqualified";

/**
 * API client for team management and event registration.
 */
export const teamApi = {
  /**
   * Registers a new team for a specific event.
   *
   * @param payload - `CreateTeamPayload` object:
   *   - eventId (string): The unique ID of the event.
   *   - participantIds (string[]): Array of user IDs to include in the team (max 2 for doubles, 1 for singles).
   *
   * @returns A promise resolving to the created team's ID: { teamId: string }.
   */
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

  /**
   * Approves a registered team for participation in an event (Admin only).
   * Changes team status from 'registered' to 'participating'.
   *
   * @param teamId - The unique ID of the team.
   * @returns A promise resolving when the team is approved.
   */
  approveTeam: async (teamId: string) => {
    const { error } = await fetchApi(getApiUrl({ path: "/team/approve" }), {
      method: "POST",
      contentType: "json",
      body: { teamId },
    });
    if (error) throw error;
  },

  /**
   * Rejects a registered team's application (Admin only).
   *
   * @param teamId - The unique ID of the team.
   * @param reason - String explaining why the team was rejected.
   * @returns A promise resolving when the team is rejected.
   */
  rejectTeam: async (teamId: string, reason: string) => {
    const { error } = await fetchApi(getApiUrl({ path: "/team/reject" }), {
      method: "POST",
      contentType: "json",
      body: { teamId, reason },
    });
    if (error) throw error;
  },

  /**
   * Manually updates the state of a team (Admin only).
   *
   * @param teamId - The unique ID of the team.
   * @param state - The new state: 'created', 'registered', 'participating', 'rejected', 'disqualified'.
   * @returns A promise resolving when the team state is updated.
   */
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

  /**
   * Adds a user to an existing team, if capacity allows.
   *
   * @param teamId - The unique ID of the team.
   * @param userId - The unique ID of the user to add.
   * @returns A promise resolving when the participant is added.
   */
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

  /**
   * Removes a participant from a team.
   * If the participant being removed is the last one, the team itself will be deleted.
   *
   * @param teamId - The unique ID of the team.
   * @param userId - The unique ID of the user to remove.
   * @returns A promise resolving when the participant is removed.
   */
  removeParticipant: async (teamId: string, userId: string) => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/team/remove-participant" }),
      {
        method: "POST",
        contentType: "json",
        body: { teamId, userId },
      },
    );
    if (error) throw error;
  },

  /**
   * Retrieves all teams registered for a specific event, including their participants.

   *
   * @param eventId - The unique ID of the event.
   * @returns A promise resolving to an array of team objects with nested `participants` (and their `user` profiles).
   */
  getTeamsByEvent: async (eventId: string) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/team/list", param: eventId }),
    );
    if (error) throw error;
    return data;
  },

  /**
   * Retrieves the current user's team for a specific event.
   *
   * @param eventId - The unique ID of the event.
   * @returns A promise resolving to the user's team object, or an error if not in a team.
   */
  getMyTeam: async (eventId: string) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/team/my-team", param: eventId }),
    );
    if (error) throw error;
    return data;
  },

  /**
   * Fetches full details for a specific team, including participants, team type, and event/tournament context.
   *
   * @param teamId - The unique ID of the team.
   * @returns A promise resolving to a detailed team object.
   */
  getTeamInfo: async (teamId: string) => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/team/info", param: teamId }),
    );
    if (error) throw error;
    return data;
  },

  /**
   * Deletes a team and its associated participant entries and logs (Admin only).
   * Cannot delete if the team is already part of a match.
   *
   * @param teamId - The unique ID of the team to delete.
   * @returns A promise resolving when the team is deleted.
   */
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
