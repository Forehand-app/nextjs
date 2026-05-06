import { OrganizationData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";



export const organizationApi = {
    getInfo: async (orgId: string): Promise<OrganizationData> => {
        const { data } = await fetchApi(getApiUrl({ path: "/org/info", param: orgId }));

        return data as OrganizationData;
    },

    getUserOrganizations: async (): Promise<OrganizationData[]> => {
        const { data } = await fetchApi(getApiUrl({ path: "/org/list" }));

        return data as OrganizationData[];
    }

}