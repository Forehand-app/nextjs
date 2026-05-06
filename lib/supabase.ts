"use client";

import { Capacitor } from "@capacitor/core";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const clientSingletons: Partial<Record<"implicit" | "pkce", SupabaseClient>> = {};

export function getSupabaseBrowserClient() {

  const flowType = Capacitor.isNativePlatform() ? "implicit" : "pkce";
  const existingClient = clientSingletons[flowType];
  if (existingClient) return existingClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });

  clientSingletons[flowType] = client;
  return client;
}
