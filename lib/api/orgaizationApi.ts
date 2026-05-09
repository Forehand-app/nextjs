import { OrganizationData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";



export const organizationApi = {
    createOrganization: async (organizationData: OrganizationData): Promise<string> => {
        const { data, error } = await fetchApi(getApiUrl({ path: "/org/register" }), {
            method: "POST",
            contentType: "json",
            body: organizationData
        });
        if (error) throw error;

        return data as string;
    },

    getInfo: async (orgId: string): Promise<OrganizationData> => {
        const { data, error } = await fetchApi(getApiUrl({ path: "/org/info", param: orgId }));
        if (error) throw error;

        return data as OrganizationData;
    },

    getUserOrganizations: async (): Promise<OrganizationData[]> => {
        const { data } = await fetchApi(getApiUrl({ path: "/org/list" }));

        return data as OrganizationData[];
    }

}