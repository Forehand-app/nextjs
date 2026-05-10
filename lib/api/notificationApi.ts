import { fetchApi, getApiUrl } from "./interceptor";
import { NotificationItem } from "@/components/NotificationsSlideOver";

type InviteNotificationArgs = {
  phone: string;
  tournamentId: string;
  tournamentName?: string;
  role: "admin" | "scorer";
};

async function postBestEffort(pathCandidates: string[], body: unknown) {
  for (const path of pathCandidates) {
    const { error } = await fetchApi(getApiUrl({ path }), {
      method: "POST",
      contentType: "json",
      body,
    });
    if (!error) return;
  }
}

export const notificationApi = {
  getUserNotifications: async (): Promise<NotificationItem[]> => {
    const { data, error } = await fetchApi(getApiUrl({ path: "/user/notifications" }));
    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    return rows.map((row: any) => {
      const createdAt = row.createdAt ? new Date(row.createdAt) : null;
      const timeAgo = createdAt
        ? `${Math.max(
            1,
            Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60)),
          )} min ago`
        : "Just now";

      return {
        id: String(row.id),
        type: "invite",
        title: row.title || "Notification",
        body: row.body || "",
        source: row.source || "",
        timeAgo,
        unread: Boolean(row.unread),
      } as NotificationItem;
    });
  },

  respondToInvite: async (inviteId: string, action: "accept" | "reject") => {
    const { error } = await fetchApi(getApiUrl({ path: "/invite/respond" }), {
      method: "POST",
      contentType: "json",
      body: { inviteId, action },
    });
    if (error) throw error;
  },

  rejectAllPendingInvites: async () => {
    const { error } = await fetchApi(
      getApiUrl({ path: "/invite/reject-all-pending" }),
      {
        method: "POST",
        contentType: "json",
        body: {},
      },
    );
    if (error) throw error;
  },

  sendInviteNotification: async ({
    phone,
    tournamentId,
    tournamentName,
    role,
  }: InviteNotificationArgs) => {
    await postBestEffort(
      ["/notifications/invite", "/notification/invite", "/notification/create"],
      {
        phone,
        type: "invite",
        role,
        tournamentId,
        title: "Tournament Crew Invite",
        body: `You have been invited as ${role} for ${tournamentName || "a tournament"}.`,
      },
    );
  },

  sendOrgInviteNotification: async ({
    phone,
    organizationId,
    organizationName,
    role,
  }: {
    phone: string;
    organizationId: string;
    organizationName?: string;
    role: string;
  }) => {
    await postBestEffort(
      ["/notifications/invite", "/notification/invite", "/notification/create"],
      {
        phone,
        type: "invite",
        role,
        organizationId,
        title: "Organization Invite",
        body: `You have been invited as ${role} for ${organizationName || "an organization"}.`,
      },
    );
  },
};
