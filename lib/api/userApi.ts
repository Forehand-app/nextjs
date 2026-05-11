import { ProfileData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";

/**
 * API client for user profile and notification management.
 */
export const userApi = {
  /**
   * Retrieves the current authenticated user's profile information.
   *
   * @returns A promise resolving to a `ProfileData` object:
   *   - id (string): User's unique ID.
   *   - name (string): Full name.
   *   - phone (string): Contact number.
   *   - gender (string): 'male' or 'female'.
   *   - dob (string): ISO date of birth.
   *   - playingHand (string): 'left' or 'right'.
   *   - primarySport (string): Main sport of interest.
   *   - profilePicUrl (optional string): URL to avatar image.
   */
  getInfo: async (): Promise<ProfileData> => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/user/profile" }),
    );
    if (error) throw error;
    return data as ProfileData;
  },

  /**
   * Registers a new user profile. Should be called after first-time login.
   *
   * @param profileData - `ProfileData` object containing initial profile details.
   * @returns A promise resolving when the profile is created.
   */
  registerUser: async (profileData: ProfileData) => {
    await fetchApi(getApiUrl({ path: "/user/register" }), {
      method: "POST",
      contentType: "json",
      body: profileData,
    });
  },

  /**
   * Updates the current user's profile details.
   *
   * @param profileData - Updated `ProfileData` object.
   * @returns A promise resolving when the update is successful.
   */
  updateProfile: async (profileData: ProfileData) => {
    const { error } = await fetchApi(getApiUrl({ path: "/user/update" }), {
      method: "PUT",
      contentType: "json",
      body: profileData,
    });
    if (error) throw error;
  },

  /**
   * Validates if a phone number is already registered by another user.
   *
   * @param contact - The phone number string to validate.
   * @returns A promise resolving to a boolean: `true` if valid (available), `false` if already in use.
   */
  validateContact: async (contact: string): Promise<boolean> => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/user/validate-contact" }),
      {
        method: "POST",
        contentType: "json",
        body: {
          data: contact,
        },
      },
    );

    if (error) throw error;

    return data as boolean;
  },

  /**
   * Retrieves all pending invitations (tournaments, organizations) for the current user.
   *
   * @returns A promise resolving to an array of formatted notification/invite objects.
   */
  getUserNotifications: async () => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/user/notifications" }),
    );
    if (error) throw error;
    return data;
  },
};
