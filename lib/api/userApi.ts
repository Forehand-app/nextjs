import { ProfileData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";

export const userApi = {
  getInfo: async (): Promise<ProfileData> => {
    const { data, error } = await fetchApi(
      getApiUrl({ path: "/user/profile" }),
    );
    if (error) throw error;
    return data as ProfileData;
  },
  registerUser: async (profileData: ProfileData) => {
    await fetchApi(getApiUrl({ path: "/user/register" }), {
      method: "POST",
      contentType: "json",
      body: profileData,
    });
  },
  updateProfile: async (profileData: ProfileData) => {
    const { error } = await fetchApi(getApiUrl({ path: "/user/update" }), {
      method: "PUT",
      contentType: "json",
      body: profileData,
    });
    if (error) throw error;
  },
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
};
