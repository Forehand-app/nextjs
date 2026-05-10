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
export async function appendScoreLog<T>(key: string, entry: T): Promise<void> {
  const current = getItem<T[]>(key) ?? [];
  current.push(entry);
  setItem(key, current);
}

/** Push an item onto the offline action queue. */
export async function pushOfflineQueue<T>(entry: T): Promise<void> {
  await appendScoreLog<T>("offline_queue", entry);
}

// ─── Session helpers ──────────────────────────────────────────────────────────

const SESSION_KEY = "app_session";

export function getSession<T>(key: string = SESSION_KEY): T | null {
  return getItem<T>(key);
}

export function saveSession<T>(...args: [T] | [string, T]): void {
  if (args.length === 2) {
    setItem(args[0], args[1]);
  } else {
    setItem(SESSION_KEY, args[0]);
  }
}
