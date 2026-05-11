import { fetchApi, getApiUrl } from "./interceptor";

/**
 * API client for managing file uploads to storage buckets.
 */
export const storageApi = {
  /**
   * Uploads or updates the current user's profile avatar.
   *
   * @param file - The `File` object (image) to upload.
   * @returns A promise resolving when the upload is complete and the user's profile is updated with the new URL.
   */
  uploadProfileAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const { error } = await fetchApi(
      getApiUrl({ path: "/storage/upload/profile" }),
      {
        method: "POST",
        body: formData,
      },
    );
    if (error) throw error;
  },

  /**
   * Uploads or updates the logo for a specific tournament.
   *
   * @param file - The `File` object (image) to upload.
   * @param tournamentId - The unique ID of the tournament.
   * @returns A promise resolving when the upload is complete and the tournament record is updated.
   */
  uploadTournamentLogo: async (file: File, tournamentId: string) => {
    const formData = new FormData();
    formData.append("image", file);

    const { error } = await fetchApi(
      getApiUrl({ path: `/storage/upload/tournament/${tournamentId}` }),
      {
        method: "POST",
        body: formData,
      },
    );
    if (error) throw error;
  },

  /**
   * Uploads or updates the logo for a specific organization.
   *
   * @param file - The `File` object (image) to upload.
   * @param organizationId - The unique ID of the organization.
   * @returns A promise resolving when the upload is complete and the organization record is updated.
   */
  uploadOrganizationLogo: async (file: File, organizationId: string) => {
    const formData = new FormData();
    formData.append("image", file);

    const { error } = await fetchApi(
      getApiUrl({ path: `/storage/upload/organization/${organizationId}` }),
      {
        method: "POST",
        body: formData,
      },
    );
    if (error) throw error;
  },
};
