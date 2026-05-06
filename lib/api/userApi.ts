import { ProfileData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";

export const userApi = {
    getInfo: async (): Promise<ProfileData> => {
        const { data, error } = await fetchApi(getApiUrl({ path: '/user/profile' }));
        if (error) throw error;
        return data as ProfileData;
    },
    registerUser: async (profileData: ProfileData) => {
        await fetchApi(getApiUrl({ path: '/user/register' }), {
            method: "POST",
            contentType: "json",
            body: profileData
        })
    }
}