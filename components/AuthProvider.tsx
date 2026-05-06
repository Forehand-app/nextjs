"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { App, type URLOpenListenerEvent } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import type { Session, User } from "@supabase/supabase-js";
import { getPostAuthRoute } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  finishAuthFromUrl: (url: string) => Promise<string>;
  getPostLoginRoute: () => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const NATIVE_CALLBACK_URL = "forehand://auth/callback";

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return "http://localhost:3000";
  }

  return window.location.origin;
}

function parseAuthCallback(url: string) {
  const parsedUrl = new URL(url);
  const hashParams = new URLSearchParams(
    parsedUrl.hash.startsWith("#") ? parsedUrl.hash.slice(1) : parsedUrl.hash,
  );

  return {
    code: parsedUrl.searchParams.get("code"),
    accessToken:
      parsedUrl.searchParams.get("access_token") ??
      hashParams.get("access_token"),
    refreshToken:
      parsedUrl.searchParams.get("refresh_token") ??
      hashParams.get("refresh_token"),
    error:
      parsedUrl.searchParams.get("error_description") ??
      hashParams.get("error_description"),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateSession = async (nextSession: Session | null) => {
    setSession(nextSession);
    setIsLoading(false);
  };

  const finishAuthFromUrl = async (url: string) => {
    const { code, accessToken, refreshToken, error } = parseAuthCallback(url);

    if (error) {
      throw new Error(error);
    }

    if (code) {
      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) throw exchangeError;
    } else if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) throw sessionError;
    } else {
      throw new Error("Unable to complete sign-in.");
    }

    const {
      data: { session: currentSession },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    await hydrateSession(currentSession);
    return getPostAuthRoute(currentSession?.access_token);
  };

  const signInWithGoogle = async () => {
    const isNative = Capacitor.isNativePlatform();
    const redirectTo = isNative
      ? NATIVE_CALLBACK_URL
      : `${getBaseUrl()}/auth/callback/`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: isNative,
      },
    });

    if (error) {
      throw error;
    }

    if (isNative && data?.url) {
      await Browser.open({ url: data.url, presentationStyle: "popover" });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
  };

  const getPostLoginRoute = async () => {
    const {
      data: { session: currentSession },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    return getPostAuthRoute(currentSession?.access_token);
  };

  useEffect(() => {
    let appUrlOpenListener: { remove: () => Promise<void> } | null = null;

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error) throw error;
        return hydrateSession(data.session);
      })
      .catch((error) => {
        console.error("Failed to restore session", error);
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void hydrateSession(nextSession);
    });

    if (Capacitor.isNativePlatform()) {
      void App.addListener(
        "appUrlOpen",
        async (event: URLOpenListenerEvent) => {
          if (!event.url.startsWith(NATIVE_CALLBACK_URL)) return;

          try {
            const target = await finishAuthFromUrl(event.url);
            await Browser.close();
            window.location.replace(target);
          } catch (error) {
            console.error("Failed to complete native login", error);
          }
        },
      ).then((listener) => {
        appUrlOpenListener = listener;
      });
    }

    return () => {
      subscription.unsubscribe();
      if (appUrlOpenListener) {
        void appUrlOpenListener.remove();
      }
    };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      isAuthenticated: Boolean(session?.user),
      signInWithGoogle,
      signOut,
      finishAuthFromUrl,
      getPostLoginRoute,
    }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
