import { OptionsData } from "../models";
import { fetchApi, getApiUrl } from "./interceptor";

/**
 * API client for fetching global configuration and lookup options.
 */
export const optionsApi = {
  /**
   * Retrieves all available sports options (e.g., Badminton, Tennis).
   *
   * @returns A promise resolving to an array of `OptionsData` objects:
   *   - id (string): Unique ID.
   *   - code (string): Internal code (e.g., 'badminton').
   *   - label (string): Display name.
   */
  getSportsOptions: async (): Promise<OptionsData[]> => {
    const { data } = await fetchApi(getApiUrl({ path: "/options/sports" }));
    return data as OptionsData[];
  },

  /**
   * Retrieves all available event format options (e.g., Knockout, Round Robin, League).
   *
   * @returns A promise resolving to an array of `OptionsData` objects.
   */
  getEventFormatOptions: async (): Promise<OptionsData[]> => {
    const { data } = await fetchApi(
      getApiUrl({ path: "/options/eventFormats" }),
    );
    return data as OptionsData[];
  },

  /**
   * Retrieves all available payment mode options (e.g., UPI, Cash, Free).
   *
   * @returns A promise resolving to an array of `OptionsData` objects.
   */
  getPaymentModeOptions: async (): Promise<OptionsData[]> => {
    const { data } = await fetchApi(
      getApiUrl({ path: "/options/paymentModes" }),
    );
    return data as OptionsData[];
  },

  /**
   * Retrieves all available team type options (e.g., Singles, Doubles, Mixed Doubles).
   *
   * @returns A promise resolving to an array of `OptionsData` objects.
   */
  getTeamTypeOptions: async (): Promise<OptionsData[]> => {
    const { data } = await fetchApi(getApiUrl({ path: "/options/teamTypes" }));
    return data as OptionsData[];
  },

  /**
   * Retrieves all available organization type options (e.g., Sports Club, Educational Institute, Corporate).
   *
   * @returns A promise resolving to an array of `OptionsData` objects.
   */
  getOrgTypeOptions: async (): Promise<OptionsData[]> => {
    const { data } = await fetchApi(getApiUrl({ path: "/options/orgTypes" }));
    return data as OptionsData[];
  },
};
