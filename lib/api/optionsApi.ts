import { OptionsData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";

export const optionsApi = {
    getSportsOptions: async (): Promise<OptionsData[]> => {
        const { data } = await fetchApi(getApiUrl({ path: "/options/sports" }));
        return data as OptionsData[];
    },

    getEventFormatOptions: async (): Promise<OptionsData[]> => {
        const { data } = await fetchApi(getApiUrl({ path: "/options/eventFormats" }));
        return data as OptionsData[];
    },

    getPaymentModeOptions: async (): Promise<OptionsData[]> => {
        const { data } = await fetchApi(getApiUrl({ path: "/options/paymentModes" }));
        return data as OptionsData[];
    },
    getTeamTypeOptions: async (): Promise<OptionsData[]> => {
        const { data } = await fetchApi(getApiUrl({ path: "/options/teamTypes" }));
        return data as OptionsData[];
    },
    getOrgTypeOptions: async (): Promise<OptionsData[]> => {
        const { data } = await fetchApi(getApiUrl({ path: "/options/orgTypes" }));
        return data as OptionsData[];
    }
}
