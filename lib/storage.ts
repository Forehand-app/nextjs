/**
 * Thin localStorage wrapper with JSON serialisation.
 * All functions are safe to call on the server (they no-op when window is unavailable).
 */

function isClient(): boolean {
  return typeof window !== "undefined";
}

/** Read a typed value from localStorage. Returns null when missing or unparseable. */
export function getItem<T>(key: string): T | null {
  if (!isClient()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Write a value to localStorage as JSON. */
export function setItem<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded or private browsing – silently ignore
  }
}

/** Remove a key from localStorage. */
export function removeItem(key: string): void {
  if (!isClient()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/** Append an entry to a JSON array stored at `key`. */
export function appendScoreLog<T>(key: string, entry: T): void {
  const current = getItem<T[]>(key) ?? [];
  current.push(entry);
  setItem(key, current);
}

/** Push an item onto the offline action queue. */
export function pushOfflineQueue<T>(entry: T): void {
  appendScoreLog<T>("offline_queue", entry);
}

// ─── Session helpers ──────────────────────────────────────────────────────────

const SESSION_KEY = "app_session";

export function getSession<T>(): T | null {
  return getItem<T>(SESSION_KEY);
}

export function saveSession<T>(session: T): void {
  setItem(SESSION_KEY, session);
}
