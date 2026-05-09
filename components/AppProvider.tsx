"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { App, type URLOpenListenerEvent } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { OrganizationData, ProfileData } from "@/lib/models";
import { organizationApi } from "@/lib/api/orgaizationApi";
import { userApi } from "@/lib/api/userApi";

type AppContextValue = {
  session: Session | null;
  isLoading: boolean; // Supabase session restoring

  isAuthenticated: boolean;

  userProfile: ProfileData | null;
  activeOrganization: OrganizationData | null;

  login: () => Promise<void>;
  logout: () => Promise<void>;
  register: (data: ProfileData) => Promise<void>;
  setOrganization: (orgId?: string | null) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

const ACTIVE_ORG_STORAGE_KEY = "forehand:active-org-id";
const NATIVE_CALLBACK_URL = "forehand://auth/callback";

function getBaseUrl(): string {
  if (typeof window === "undefined") return "http://localhost:3000";
  return window.location.origin;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [session, setSession] = useState<Session | null>(null);

  // --- Backend profile ---
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Active organisation ---
  const [activeOrganization, setActiveOrganization] =
    useState<OrganizationData | null>(null);
  const activeOrgIdRef = useRef<string | null>(null);

  /* ---- helpers --------------------------------------------------- */

  /* ---- refreshProfile (public) ----------------------------------- */

  const refreshProfile = useCallback(async () => {
    const accessToken = session?.access_token;
    if (!accessToken) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await userApi.getInfo();
      setUserProfile(profile);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setUserProfile(null);
    }
  }, [session]);

  /* ---- Native deep-link handler ---------------------------------- */

  const finishNativeAuth = useCallback(
    async (url: string) => {
      const parsed = new URL(url);
      const hashParams = new URLSearchParams(
        parsed.hash.startsWith("#") ? parsed.hash.slice(1) : parsed.hash,
      );

      const code = parsed.searchParams.get("code");
      const accessToken =
        parsed.searchParams.get("access_token") ??
        hashParams.get("access_token");
      const refreshToken =
        parsed.searchParams.get("refresh_token") ??
        hashParams.get("refresh_token");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
      } else {
        throw new Error("Unable to complete sign-in.");
      }
    },
    [supabase],
  );

  /* ================================================================ */
  /*  Public actions                                                   */
  /* ================================================================ */

  /** Initiates Google OAuth login via Supabase. */
  const login = useCallback(async () => {
    const isNative = Capacitor.isNativePlatform();
    const redirectTo = isNative
      ? NATIVE_CALLBACK_URL
      : `${getBaseUrl()}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: isNative,
      },
    });

    if (error) throw error;

    if (isNative && data?.url) {
      await Browser.open({ url: data.url, presentationStyle: "popover" });
    }
  }, [supabase]);

  /** Signs out, clears all local state & storage. */
  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUserProfile(null);
    setActiveOrganization(null);
    activeOrgIdRef.current = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
    }
  }, [supabase]);

  /** Registers the user via the backend and re-fetches the profile. */
  const register = useCallback(
    async (profileData: ProfileData) => {
      try {
        await userApi.registerUser(profileData);
      } catch (e) {
        console.log(e);
      }

      // Re-fetch profile so userProfile is populated
      const profile = await userApi.getInfo();
      setUserProfile(profile);
    },
    [session],
  );

  /** Sets or clears the active organisation. Persists in localStorage. */
  const setOrganization = useCallback(
    async (orgId?: string | null) => {
      activeOrgIdRef.current = orgId || "";

      if (typeof window !== "undefined") {
        if (orgId) localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, orgId);
        else localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
      }

      if (!orgId) {
        setActiveOrganization(null);
        return;
      }

      const accessToken = session?.access_token;
      if (!accessToken) {
        setActiveOrganization(null);
        return;
      }

      const org = await organizationApi.getInfo(orgId);
      setActiveOrganization(org);
    },
    [session],
  );

  /* ================================================================ */
  /*  Effects                                                          */
  /* ================================================================ */

  // 1. Restore Supabase session on mount + listen for auth changes
  useEffect(() => {
    let appUrlOpenListener: { remove: () => Promise<void> } | null = null;

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        setSession(data.session);
      })
      .catch((err) => console.error("Failed to restore session", err))
      .finally(() => setIsLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    // Native deep-link handler
    if (Capacitor.isNativePlatform()) {
      void App.addListener(
        "appUrlOpen",
        async (event: URLOpenListenerEvent) => {
          if (!event.url.startsWith(NATIVE_CALLBACK_URL)) return;
          try {
            await finishNativeAuth(event.url);
            await Browser.close();
          } catch (err) {
            console.error("Failed to complete native login", err);
          }
        },
      ).then((listener) => {
        appUrlOpenListener = listener;
      });
    }

    return () => {
      subscription.unsubscribe();
      if (appUrlOpenListener) void appUrlOpenListener.remove();
    };
  }, [supabase, finishNativeAuth]);

  // 2. When session changes → fetch profile & restore active org
  useEffect(() => {
    const accessToken = session?.access_token;

    if (!accessToken) {
      setUserProfile(null);
      setActiveOrganization(null);
      activeOrgIdRef.current = null;
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    (async () => {
      try {
        // Fetch user profile
        const profile = await userApi.getInfo();
        setUserProfile(profile);

        // Restore active org from localStorage
        if (typeof window !== "undefined") {
          const storedOrgId = localStorage.getItem(ACTIVE_ORG_STORAGE_KEY);
          activeOrgIdRef.current = storedOrgId;

          if (storedOrgId) {
            const org = await organizationApi.getInfo(storedOrgId);
            setActiveOrganization(org);
          }
        }
      } catch (err) {
        console.error("Failed to resolve app session:", err);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session]);

  /* ---- context value --------------------------------------------- */

  const value = useMemo<AppContextValue>(
    () => ({
      isLoading,
      isAuthenticated: Boolean(session?.user),
      userProfile,
      activeOrganization,
      login,
      logout,
      register,
      session,
      setOrganization,
      refreshProfile,
    }),
    [
      isLoading,
      userProfile,
      activeOrganization,
      login,
      logout,
      register,
      session,
      setOrganization,
      refreshProfile,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within an <AppProvider>");
  return ctx;
}
