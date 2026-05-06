/**
 * Core data models for Forehand PWA.
 * All persistence is client-first (IndexedDB/localStorage); no external APIs required by default.
 */

export type User = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: number;
};

export type Org = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  establishedYear?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: Address;
  createdAt: number;
  ownerId: string;
};

export type Address = {
  street?: string;
  city?: string;
  state?: string;
  pinCode?: string;
};

export type TournamentSummary = {
  id: string;
  name: string;
  orgId: string;
  startDate: string;
  endDate?: string;
  status: "draft" | "upcoming" | "live" | "past";
  registeredCount?: number;
  logoUrl?: string;
  venue?: string;
  location?: string;
};

export type Tournament = TournamentSummary & {
  description?: string;
  venue?: string;
  events: Event[];
  contact?: { name: string; phone?: string; email?: string }[];
};

export type Event = {
  id: string;
  tournamentId: string;
  name: string;
  sport: string;
  format: "singles" | "doubles" | "mixed";
  gender?: string;
  startDate: string;
  regDueDate?: string;
  entryFee?: number;
  paymentOption?: "online" | "venue" | "both";
  participants?: Participant[];
  status: "open" | "closed" | "in_progress" | "ended";
};

export type Participant = {
  id: string;
  eventId: string;
  name: string;
  userId?: string;
  partnerId?: string; // for doubles
  status: "pending" | "confirmed" | "rejected";
  ageCategory?: string;
};

export type Match = {
  id: string;
  eventId: string;
  round: number;
  slotIndex: number;
  player1Id?: string;
  player2Id?: string;
  pair1Ids?: string[];
  pair2Ids?: string[];
  scoreLog: ScoreEvent[];
  status: "upcoming" | "live" | "completed";
  config?: MatchConfig;
  startedAt?: number;
  endedAt?: number;
};

export type MatchConfig = {
  scoringSystem: "sideout" | "rally";
  format: "singles" | "doubles";
  bestOf: number;
  pointsToWin: number;
  winByTwo: boolean;
  initialServer: 1 | 2;
  timeoutPerSet?: number;
  warmupMinutes?: number;
  switchSidesEvery?: number;
};

export type ScoreEvent = {
  seq: number;
  timestamp: number;
  actorId: string;
  type: "rally" | "fault" | "undo" | "set_end" | "match_end" | "server_change";
  details: Record<string, unknown>;
};

export type LiveMatchState = {
  matchId: string;
  currentSet: number;
  setScores: number[][]; // [setIndex][side0, side1]
  serverSide: 0 | 1;
  serverPlayerIndex?: number; // for doubles
  startedAt: number;
  scoreLog: ScoreEvent[];
};

export type ScoreLock = {
  lockedBy?: string;
  expiresAt?: number;
};

// --- App state (client) ---

export type AppState = {
  user: User | null;
  theme: "light" | "dark";
  orgs: Org[];
  activeOrgId?: string;
  tournaments: Record<string, TournamentSummary>;
  liveMatches: Record<string, LiveMatchState>;
  scoreLocks: Record<string, ScoreLock>;
  offlineQueue: ScoreEvent[];
};
