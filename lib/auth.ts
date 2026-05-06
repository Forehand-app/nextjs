const REGISTER_ROUTE = "/finalize";
const HOME_ROUTE = "/user/home";
const ORG_HOME_ROUTE = "/org/home";
const ACTIVE_ORG_STORAGE_KEY = "forehand:active-org-id";

function getActiveOrgId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_ORG_STORAGE_KEY);
}

export async function getPostAuthRoute(accessToken: string | null | undefined): Promise<string> {
  if (!accessToken) {
    return REGISTER_ROUTE;
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    return REGISTER_ROUTE;
  }

  const response = await fetch(`${apiBaseUrl}/user/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return REGISTER_ROUTE;
  }

  const result = await response.json().catch(() => null);
  if (result?.success !== true || !result?.data) {
    return REGISTER_ROUTE;
  }

  const activeOrgId = getActiveOrgId();
  if (!activeOrgId) {
    return HOME_ROUTE;
  }

  const orgResponse = await fetch(`${apiBaseUrl}/org/info/${activeOrgId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const orgResult = await orgResponse.json().catch(() => null);

  if (!orgResponse.ok || orgResult?.success === false || !orgResult?.data) {
    localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
    return HOME_ROUTE;
  }

  return ORG_HOME_ROUTE;
}
