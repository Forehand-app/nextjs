"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import {
  GamepadIcon,
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
} from "@/components/Icons";
import { toQuery } from "@/lib/utils";

const events = [
  {
    name: "Mumbai Men's 2025",
    players: 64,
    registered: 4,
    dates: "13-15 Dec",
  },
];

const matches = [
  {
    id: 1,
    team1: { name: "Kunal Verma", players: ["K"], score: "3-1" },
    team2: { name: "Akshay Kumar", players: ["A"], score: "1-3" },
    status: "Match 1",
    result: "01 - 00",
  },
  {
    id: 2,
    team1: { name: "Kumar Saini", players: ["K"], score: "2-1" },
    team2: { name: "Kamal Verma", players: ["K"], score: "1-3" },
    status: "Match 2",
    result: "01 - 00",
  },
  {
    id: 3,
    team1: { name: "Kumar Saini", players: ["K"], score: "2-1" },
    team2: { name: "Kamal Verma", players: ["K"], score: "1-3" },
    status: "Match 3",
    result: "01 - 00",
  },
];

export default function TournamentEventListPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const id = searchParams.get("id");

  if (!id && searchParams.size > 0) {
    return (
      <Layout title="Tournament Matches" showBack>
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
          <p className="text-[var(--color-muted)]">Tournament not found.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 rounded-full bg-primary px-6 py-2 font-semibold text-white"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Men's Singles 2025" showBack>
      <div className="pb-24">
        {/* Tournament Header */}
        <div
          className="p-6 text-white"
          style={{ background: "var(--gradient-orange)" }}
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
              <GamepadIcon size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1">Mumbai Men&apos;s 2025</h1>
              <p className="text-sm opacity-90 flex items-center gap-1">
                <MapPinIcon size={14} /> Badminton • Squash
              </p>
              <p className="text-sm opacity-90 flex items-center gap-1">
                <UsersIcon size={14} /> 64 Players • <CalendarIcon size={14} />{" "}
                13-15 Dec
              </p>
            </div>
            <Link
              href={"/tournaments/event" + toQuery({ id })}
              className="px-4 py-2 rounded-lg bg-white/20 text-sm font-semibold hover:bg-white/30 transition-colors"
            >
              Registration
            </Link>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* About and Events Tabs */}
          <div className="flex gap-2 border-b border-[var(--color-border)]">
            <button className="px-4 py-2 font-medium text-[var(--color-muted)]">
              About
            </button>
            <button className="px-4 py-2 font-medium text-primary border-b-2 border-primary">
              Events
            </button>
          </div>

          {/* Match List */}
          <div className="space-y-3">
            {matches.map((match) => (
              <Link
                key={match.id}
                href={"/match/live" + toQuery({ matchId: String(match.id) })}
                className="card p-4 block hover:border-primary/30 transition-colors"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[var(--color-muted)]">
                    {match.status}
                  </span>
                  <span className="badge badge-success">Completed</span>
                </div>

                {/* Team 1 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                      {match.team1.players[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{match.team1.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">
                        Final Score: {match.team1.score}
                      </p>
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    {match.result.split(" - ")[0]}
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex items-center justify-center gap-2 my-2">
                  <div className="h-px bg-[var(--color-border)] flex-1" />
                  <span className="text-xs text-[var(--color-muted)]">VS</span>
                  <div className="h-px bg-[var(--color-border)] flex-1" />
                </div>

                {/* Team 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[var(--avatar-bg)] border-2 border-[var(--avatar-border)] flex items-center justify-center font-bold">
                      {match.team2.players[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{match.team2.name}</p>
                      <p className="text-xs text-[var(--color-muted)]">
                        Final Score: {match.team2.score}
                      </p>
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    {match.result.split(" - ")[1]}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
