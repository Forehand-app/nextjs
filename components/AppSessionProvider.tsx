"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { fetchUserProfile, type UserProfile } from "@/lib/userProfile";

const ACTIVE_ORG_STORAGE_KEY = "forehand:active-org-id";

type OrganizationInfo = {
  id?: string;
  name?: string | null;
  [key: string]: unknown;
};

type AppSessionContextValue = {
  activeOrgId: string | null;
  isResolving: boolean;
  organization: OrganizationInfo | null;
  profile: UserProfile | null;
  refreshAppSession: () => Promise<string>;
  setActiveOrgId: (orgId: string | null) => void;
};

const AppSessionContext = createContext<AppSessionContextValue | null>(null);

function getStoredActiveOrgId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_ORG_STORAGE_KEY);
}

function isEntryRoute(pathname: string) {
  return pathname === "/" || pathname === "/home" || pathname === "/splash";
}

async function fetchOrganizationInfo(accessToken: string, orgId: string) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    throw new Error("Organization service is not configured.");
  }

  const response = await fetch(`${apiBaseUrl}/org/info/${orgId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false || !result?.data) {
    throw new Error(result?.message || "Unable to load organization.");
  }

  return result.data as OrganizationInfo;
}

export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, session } = useAuth();
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(true);
  const [organization, setOrganization] = useState<OrganizationInfo | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const setActiveOrgId = useCallback((orgId: string | null) => {
    setActiveOrgIdState(orgId);
    if (typeof window === "undefined") return;

    if (orgId) {
      localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, orgId);
    } else {
      localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
    }
  }, []);

  const refreshAppSession = useCallback(async () => {
    if (!session?.access_token) {
      setProfile(null);
      setOrganization(null);
      return "/splash";
    }

    const userProfile = await fetchUserProfile(session);
    setProfile(userProfile);

    if (!userProfile) {
      setOrganization(null);
      return "/finalize";
    }

    const nextActiveOrgId = getStoredActiveOrgId();
    setActiveOrgIdState(nextActiveOrgId);

    if (!nextActiveOrgId) {
      setOrganization(null);
      return "/user/home";
    }

    try {
      const orgInfo = await fetchOrganizationInfo(
        session.access_token,
        nextActiveOrgId,
      );
      setOrganization(orgInfo);
      return "/org/home";
    } catch (error) {
      console.error("Failed to load active organization", error);
      setActiveOrgId(null);
      setOrganization(null);
      return "/user/home";
    }
  }, [session, setActiveOrgId]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const orgIdFromUrl = new URLSearchParams(window.location.search).get("orgId");
    if (orgIdFromUrl) {
      setActiveOrgId(orgIdFromUrl);
    }
  }, [pathname, setActiveOrgId]);

  useEffect(() => {
    let isActive = true;

    const resolveSession = async () => {
      if (isLoading) return;

      if (pathname.startsWith("/auth/callback")) {
        setIsResolving(false);
        return;
      }

      if (!isAuthenticated) {
        setProfile(null);
        setActiveOrgId(null);
        setOrganization(null);
        setIsResolving(false);
        if (pathname !== "/splash") {
          router.replace("/splash");
        }
        return;
      }

      try {
        setIsResolving(true);
        const target = await refreshAppSession();
        if (!isActive) return;

        if (target === "/finalize") {
          if (pathname !== "/finalize") {
            router.replace(target);
          }
          return;
        }

        if (isEntryRoute(pathname)) {
          router.replace(target);
          return;
        }

        if (target === "/user/home" && pathname.startsWith("/org/")) {
          router.replace(target);
          return;
        }

        if (target === "/org/home" && pathname.startsWith("/user/")) {
          router.replace(target);
        }
      } catch (error) {
        console.error("Failed to resolve app session", error);
        if (isActive && pathname !== "/finalize") {
          router.replace("/finalize");
        }
      } finally {
        if (isActive) {
          setIsResolving(false);
        }
      }
    };

    void resolveSession();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, isLoading, pathname, refreshAppSession, router]);

  const value = useMemo<AppSessionContextValue>(
    () => ({
      activeOrgId,
      isResolving,
      organization,
      profile,
      refreshAppSession,
      setActiveOrgId,
    }),
    [
      activeOrgId,
      isResolving,
      organization,
      profile,
      refreshAppSession,
      setActiveOrgId,
    ],
  );

  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error("useAppSession must be used within an AppSessionProvider.");
  }

  return context;
}
