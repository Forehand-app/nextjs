import { getSupabaseBrowserClient } from "../supabase";

type ApiResponse = {
  message: string;
  success: boolean;
  data?: any | null | undefined;
};

type ParsedRespone = {
  data?: any | null | undefined;
  error?: any | undefined | unknown;
};

export function getApiUrl({
  path,
  param,
}: {
  path: string;
  param?: string;
}): string {
  if (/^https?:\/\//i.test(path)) {
    const cleanPath = path.endsWith("/") ? path.slice(0, -1) : path;
    const cleanParam = param ? `/${param}` : "";
    return `${cleanPath}${cleanParam}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const cleanParam = param ? `/${param}` : "";
  return `${cleanBaseUrl}${cleanPath}${cleanParam}`;
}

export const fetchApi = async (
  path: string,
  {
    method = "GET",
    contentType,
    body,
  }: {
    method?: "POST" | "GET" | "PUT" | "DELETE";
    contentType?: "json";
    body?: any;
  } = {},
): Promise<ParsedRespone> => {
  try {
    const supabaseClient = getSupabaseBrowserClient();
    const session = await supabaseClient.auth.getSession();
    const accessToken = session.data.session?.access_token;

    let headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
    };

    if (contentType) {
      headers["Content-Type"] =
        contentType === "json" ? "application/json" : "";
    }

    const bodyContent =
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined;

    // If it's FormData, let the browser set the Content-Type header with the boundary
    if (body instanceof FormData) {
      delete headers["Content-Type"];
    }

    const res = await fetch(path, {
      headers,
      method,
      body: bodyContent,
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
      // Handle Elysia validation errors or other server errors
      const errorMessage =
        result?.message ||
        result?.summary ||
        (result?.errors ? JSON.stringify(result.errors) : null) ||
        `HTTP ${res.status} ${res.statusText} for ${path}`;
      console.error("[fetchApi] non-2xx response", {
        path,
        method,
        status: res.status,
        statusText: res.statusText,
        response: result,
      });
      throw new Error(errorMessage);
    }

    if (result && typeof result === "object" && "success" in result) {
      if (!result.success) {
        throw new Error(result.message || "Call completed unsuccessfully");
      }
      return {
        data: result.data !== undefined ? result.data : result,
      };
    }

    // If it's not a success/message/data wrapper, return the result directly
    return {
      data: result,
    };
  } catch (e) {
    console.error("[fetchApi] request failed", {
      path,
      method,
      hasBody: Boolean(body),
      error: e instanceof Error ? e.message : e,
    });
    return {
      error: e,
    };
  }
};
