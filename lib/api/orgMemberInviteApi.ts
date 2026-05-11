import { fetchApi, getApiUrl } from "./interceptor";

type InviteState = "pending" | "accepted" | "rejected";

/**
 * Arguments for sending an organization member invite.
 */
type SendOrganizationMemberInviteArgs = {
  phone: string;
  organizationId: string;
  role?: "admin";
};

/**
 * Structure of an organization member invite.
 */
export type OrganizationMemberInvite = {
  id: string;
  name: string;
  role: "Admin";
  status: "Invited" | "Accepted" | "Rejected";
  phone?: string;
};

/**
 * Response structure when an organization invite is sent.
 */
type OrganizationMemberInviteResponse = {
  inviteId?: string;
  receiverName?: string;
  receiverPhone?: string;
  inviteState?: InviteState;
};

const configuredCreatePath =
  process.env.NEXT_PUBLIC_ORG_MEMBER_INVITE_CREATE_PATH;
const configuredListPath = process.env.NEXT_PUBLIC_ORG_MEMBER_INVITE_LIST_PATH;
const configuredRemovePath =
  process.env.NEXT_PUBLIC_ORG_MEMBER_INVITE_REMOVE_PATH;

const createPathCandidates = configuredCreatePath
  ? [configuredCreatePath]
  : [
      "/invite/organization/member/create",
      "/invite/org/member/create",
      "/invite/create",
    ];

const listPathCandidates = configuredListPath
  ? [configuredListPath]
  : ["/invite/organization/member/list", "/invite/org/member/list"];

const removePathCandidates = configuredRemovePath
  ? [configuredRemovePath]
  : ["/invite/organization/member/remove", "/invite/org/member/remove"];

const unavailablePaths = new Set<string>();

/**
 * Maps backend invite state to frontend status label.
 */
function statusFromInviteState(
  state?: InviteState,
): OrganizationMemberInvite["status"] {
  if (state === "accepted") return "Accepted";
  if (state === "rejected") return "Rejected";
  return "Invited";
}

/**
 * Helper to post to the first available endpoint from a list of candidates.
 * Used for handling potential variations in backend route implementation.
 */
async function postToFirstWorkingPath(
  pathCandidates: string[],
  body: unknown,
): Promise<any> {
  let lastError: unknown = null;
  for (const path of pathCandidates) {
    if (unavailablePaths.has(path)) continue;
    const { data, error } = await fetchApi(getApiUrl({ path }), {
      method: "POST",
      contentType: "json",
      body,
    });
    if (!error) return data;
    if (isRouteMissingError(error)) unavailablePaths.add(path);
    lastError = error;
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("No organization invite endpoint is available.");
}

function isRouteMissingError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes("HTTP 404") || error.message.includes("Not Found"))
  );
}

function isTournamentInviteValidationError(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes("tournamentId") ||
      error.message.includes("Expected string"))
  );
}

/**
 * API client for managing invitations to join an organization.
 */
export const orgMemberInviteApi = {
  /**
   * Sends an invitation to a user to join an organization as an administrator.
   *
   * @param args - `SendOrganizationMemberInviteArgs` object:
   *   - phone (string): Recipient's phone number.
   *   - organizationId (string): ID of the organization.
   *   - role (optional): Defaults to 'admin'.
   *
   * @returns A promise resolving to a formatted `OrganizationMemberInvite` object.
   */
  sendOrganizationMemberInvite: async ({
    phone,
    organizationId,
    role = "admin",
  }: SendOrganizationMemberInviteArgs): Promise<OrganizationMemberInvite> => {
    const payload = {
      phone,
      role,
      organizationId,
      contextType: "organization_member",
      notifyReceiver: true,
    };

    let data: OrganizationMemberInviteResponse;
    try {
      data = (await postToFirstWorkingPath(
        createPathCandidates,
        payload,
      )) as OrganizationMemberInviteResponse;
    } catch (error) {
      if (
        isRouteMissingError(error) ||
        isTournamentInviteValidationError(error)
      ) {
        throw new Error(
          "Organization member invite API is not available on backend yet. Please add org invite routes (create/list/remove) and set NEXT_PUBLIC_ORG_MEMBER_INVITE_* paths.",
        );
      }
      throw error;
    }

    return {
      id: data.inviteId || `${Date.now()}`,
      name: data.receiverName || `+91 ${phone}`,
      role: "Admin",
      status: statusFromInviteState(data.inviteState),
      phone: data.receiverPhone || phone,
    };
  },

  /**
   * Retrieves a list of all pending and responded invitations for a specific organization.
   *
   * @param organizationId - The unique ID of the organization.
   * @returns A promise resolving to an array of formatted `OrganizationMemberInvite` objects.
   */
  listOrganizationMemberInvites: async (
    organizationId: string,
  ): Promise<OrganizationMemberInvite[]> => {
    let data: any;
    try {
      data = await postToFirstWorkingPath(listPathCandidates, {
        organizationId,
      });
    } catch (error) {
      if (isRouteMissingError(error)) return [];
      throw error;
    }
    const rows = Array.isArray(data) ? data : [];
    return rows.map((row: any) => ({
      id: String(row.id || row.inviteId || `${Math.random()}`),
      name: row.name || row.receiverName || "Unknown member",
      role: "Admin" as const,
      status: statusFromInviteState(row.inviteState),
      phone: row.phone || row.receiverPhone,
    }));
  },

  /**
   * Removes (deletes) a specific invitation to join an organization.
   *
   * @param inviteId - The unique ID of the invitation.
   * @param organizationId - The unique ID of the organization.
   * @returns A promise resolving when the invitation is removed.
   */
  removeOrganizationMemberInvite: async (
    inviteId: string,
    organizationId: string,
  ) => {
    try {
      await postToFirstWorkingPath(removePathCandidates, {
        inviteId,
        organizationId,
      });
    } catch (error) {
      if (isRouteMissingError(error)) {
        throw new Error(
          "Organization member remove-invite API is not available.",
        );
      }
      throw error;
    }
  },
};
