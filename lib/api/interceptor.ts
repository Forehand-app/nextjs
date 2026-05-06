import { getSupabaseBrowserClient } from "../supabase"

type ApiResponse = {
    message: string;
    success: boolean;
    data?: any | null | undefined;
}

type ParsedRespone = {
    data?: any | null | undefined;
    error?: any | undefined | unknown;
}

export function getApiUrl({ path, param }: { path: string, param?: string }): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const cleanParam = param ? `/${param}` : "";
    return `${cleanBaseUrl}${cleanPath}${cleanParam}`;
}

export const fetchApi = async (
    path: string,
    { method = "GET", contentType, body }: { method?: "POST" | "GET" | "PUT"; contentType?: "json"; body?: any } = {}
): Promise<ParsedRespone> => {

    try {
        const supabaseClient = getSupabaseBrowserClient();
        const session = await supabaseClient.auth.getSession();
        const accessToken = session.data.session?.access_token;


        let headers: Record<string, string> = { Authorization: `Bearer ${accessToken}` };

        if (contentType) {
            headers["Content-Type"] = contentType === "json" ? "application/json" : "";
        }

        const res = await fetch(path, {
            headers,
            method,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) throw new Error("Failed to fetch! It might be a server problem");

        const result: ApiResponse = await res.json();

        if (!result.success) throw new Error("Call completed unsuccessfully");

        return {
            data: result.data,
        }

    } catch (e) {
        return {
            error: e,
        }
    }

}