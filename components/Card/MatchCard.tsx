"use client";

import React from "react";
import Link from "next/link";
import { toQuery } from "@/lib/utils";

type Player = {
  name: string;
  avatar?: string;
  initials?: string;
};

type Team = {
  players: Player[];
  score: number;
};

export type MatchCardProps = {
  id: string;
  tournament: string;
  location?: string;
  stage?: string;
  team1: Team;
  team2: Team;
  status?: "live" | "upcoming" | "completed";
  isFollowing?: boolean;
  onFollow?: () => void;
  progress?: number; // 0-100 for match progress
  href?: string;
};

export default function MatchCard({
  id,
  tournament,
  location,
  stage,
  team1,
  team2,
  status = "live",
  isFollowing = false,
  onFollow,
  progress = 50,
  href,
}: MatchCardProps) {
  const url = href ?? "/match/live" + toQuery({ matchId: id });

  const statusConfig = {
    live: {
      bg: "var(--badge-live-bg)",
      text: "var(--badge-live-text)",
      label: "LIVE",
    },
    upcoming: {
      bg: "var(--badge-info-bg)",
      text: "var(--badge-info-text)",
      label: "Upcoming",
    },
    completed: {
      bg: "var(--badge-success-bg)",
      text: "var(--badge-success-text)",
      label: "Completed",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-[var(--color-border)] overflow-hidden transition-shadow duration-[var(--transition-base)] hover:shadow-[var(--shadow-card-hover)]">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">{tournament}</h3>
            {location && (
              <p className="text-xs text-[var(--color-muted)] mt-0.5">
                {location}
              </p>
            )}
          </div>
          <span
            className="px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap"
            style={{
              background: currentStatus.bg,
              color: currentStatus.text,
            }}
          >
            {currentStatus.label}
          </span>
        </div>
        {stage && (
          <p className="text-xs text-[var(--color-muted)]">Stage: {stage}</p>
        )}
      </div>

      {/* Match Content */}
      <Link href={url} className="block">
        <div className="p-4">
          {/* Team 1 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex -space-x-2">
                {team1.players.slice(0, 2).map((player, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white border-2 border-[var(--color-surface)]"
                    style={{
                      background: "var(--gradient-orange)",
                    }}
                    title={player.name}
                  >
                    {player.initials || player.name.charAt(0)}
                  </div>
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {team1.players.map((p) => p.name).join(" & ")}
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--color-text)] ml-3">
              {team1.score}
            </div>
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center mb-3">
            <div className="h-px bg-[var(--color-border)] flex-1" />
            <span className="px-3 text-xs text-[var(--color-muted)] font-medium">
              VS
            </span>
            <div className="h-px bg-[var(--color-border)] flex-1" />
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex -space-x-2">
                {team2.players.slice(0, 2).map((player, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-[var(--avatar-bg)] border-2 border-[var(--color-surface)] text-[var(--color-text)]"
                    title={player.name}
                  >
                    {player.initials || player.name.charAt(0)}
                  </div>
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {team2.players.map((p) => p.name).join(" & ")}
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold text-[var(--color-text)] ml-3">
              {team2.score}
            </div>
          </div>
        </div>
      </Link>

      {/* Footer */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background:
                  dot === 1 ? "var(--color-primary)" : "var(--color-border)",
              }}
            />
          ))}
        </div>
        {onFollow && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onFollow();
            }}
            className={`px-4 py-1.5 rounded-[var(--radius-button)] text-sm font-medium transition-colors duration-[var(--transition-base)] ${
              isFollowing
                ? "bg-[var(--color-surface-elevated)] text-[var(--color-text)]"
                : "bg-primary text-white"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
}
