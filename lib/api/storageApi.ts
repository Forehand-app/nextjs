import { fetchApi, getApiUrl } from "./interceptor";

export const storageApi = {
    uploadProfileAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        const { error } = await fetchApi(getApiUrl({ path: "/storage/upload/profile" }), {
            method: "POST",
            body: formData
        });
        if (error) throw error;
    },

    uploadTournamentLogo: async (file: File, tournamentId: string) => {
        const formData = new FormData();
        formData.append("image", file);

        const { error } = await fetchApi(getApiUrl({ path: `/storage/upload/tournament/${tournamentId}` }), {
            method: "POST",
            body: formData
        });
        if (error) throw error;
    },

    uploadOrganizationLogo: async (file: File, organizationId: string) => {
        const formData = new FormData();
        formData.append("image", file);

        const { error } = await fetchApi(getApiUrl({ path: `/storage/upload/organization/${organizationId}` }), {
            method: "POST",
            body: formData
        });
        if (error) throw error;
    }

}