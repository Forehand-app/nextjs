"use client";

/**
 * AppSessionProvider — Manages the user's backend profile and active org.
 * This is a clean rebuild. It reads the Supabase session from AuthProvider
 * and fetches the backend profile once on login. No routing logic lives here.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "@/components/AuthProvider";

const ACTIVE_ORG_STORAGE_KEY = "forehand:active-org-id";

export type UserProfile = {
  id?: string;
  name?: string | null;
  phone?: string | null;
  gender?: string | null;
  dob?: string | null;
  playingHand?: string | null;
  primarySport?: string | null;
};

export type OrganizationInfo = {
  id?: string;
  name?: string | null;
  [key: string]: unknown;
};

type AppSessionContextValue = {
  profile: UserProfile | null;
  isResolving: boolean;
  activeOrgId: string | null;
  organization: OrganizationInfo | null;
  setActiveOrgId: (orgId: string | null) => void;
  refreshProfile: () => Promise<void>;
};

const AppSessionContext = createContext<AppSessionContextValue | null>(null);

export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  const { session, isAuthenticated, isLoading } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isResolving, setIsResolving] = useState(true);
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);
  const [organization, setOrganization] = useState<OrganizationInfo | null>(null);

  const setActiveOrgId = useCallback((orgId: string | null) => {
    setActiveOrgIdState(orgId);
    if (typeof window === "undefined") return;
    if (orgId) localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, orgId);
    else localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
  }, []);

  const refreshProfile = useCallback(async () => {
    const accessToken = session?.access_token;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!accessToken || !apiBaseUrl) {
      setProfile(null);
      return;
    }

    try {
      const res = await fetch(`${apiBaseUrl}/user/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const result = await res.json().catch(() => null);

      if (res.ok && result?.success && result?.data) {
        setProfile(result.data as UserProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Failed to fetch profile (backend might be offline):", err);
      setProfile(null);
    }
  }, [session]);

  // Fetch profile whenever the session changes
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setProfile(null);
      setOrganization(null);
      setActiveOrgIdState(null);
      setIsResolving(false);
      return;
    }

    setIsResolving(true);
    refreshProfile().finally(() => setIsResolving(false));

    // Restore active org from storage
    if (typeof window !== "undefined") {
      setActiveOrgIdState(localStorage.getItem(ACTIVE_ORG_STORAGE_KEY));
    }
  }, [isAuthenticated, isLoading, refreshProfile]);

  const value = useMemo<AppSessionContextValue>(
    () => ({
      profile,
      isResolving,
      activeOrgId,
      organization,
      setActiveOrgId,
      refreshProfile,
    }),
    [profile, isResolving, activeOrgId, organization, setActiveOrgId, refreshProfile]
  );

  return (
    <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const ctx = useContext(AppSessionContext);
  if (!ctx) throw new Error("useAppSession must be used within an <AppSessionProvider>");
  return ctx;
}
