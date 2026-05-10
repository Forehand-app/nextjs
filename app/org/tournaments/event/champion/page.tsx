"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, XIcon, TrophyIcon, UserIcon } from "@/components/Icons";
import { toQuery } from "@/lib/utils";

const standings = [
  {
    rank: 1,
    name: "Anil Kumar",
    wins: "12/12",
    label: "Winner",
    labelColor: "text-primary",
  },
  {
    rank: 2,
    name: "Aryan Sharma",
    wins: "10/12",
    label: "Runner Up",
    labelColor: "text-blue-500",
  },
  {
    rank: 3,
    name: "Rohan Deshmukh",
    wins: "8/12",
    label: "Third Place",
    labelColor: "text-green-500",
  },
];

export default function EventChampionPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const tournamentId = searchParams.get("tournamentId") || "1";
  const eventId = searchParams.get("eventId") || "1";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-600">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Link
          href={
            "/org/tournaments/event/matches" +
            toQuery({ tournamentId, eventId })
          }
          className="p-2 text-white"
        >
          <ArrowLeftIcon size={20} />
        </Link>
        <Link
          href={"/org/tournaments/detail" + toQuery({ id: tournamentId })}
          className="p-2 text-white"
        >
          <XIcon size={20} />
        </Link>
      </div>

      {/* Champion Section */}
      <div className="text-center text-white px-6 pb-8">
        <div className="mb-6 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <TrophyIcon size={56} className="text-yellow-300" />
          </div>
          <h1 className="text-4xl font-bold pt-16 mb-2">CHAMPION!</h1>
          <p className="text-lg opacity-90">Monsoon Pickleball Event 2026</p>
        </div>

        {/* Winner Photo */}
        <div className="relative inline-block mb-4">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border-4 border-white/40">
            <UserIcon size={56} className="text-white" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white rounded-full">
            <span className="text-orange-500 text-xs font-bold">1ST PLACE</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-2">Anil Kumar</h2>
      </div>

      {/* Final Standings Card */}
      <div className="bg-[var(--color-surface)] rounded-t-3xl min-h-[50vh] p-6">
        <h3 className="font-semibold text-lg mb-4">Final Standings</h3>

        <div className="space-y-3">
          {standings.map((player) => (
            <div key={player.rank} className="card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                {player.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1">
                <p className="font-medium">{player.name}</p>
                <p className={`text-sm ${player.labelColor}`}>{player.label}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{player.wins}</p>
                <p className="text-xs text-[var(--color-muted)]">Wins</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href={"/org/tournaments/detail" + toQuery({ id: tournamentId })}
          className="block w-full mt-6 py-4 rounded-xl font-semibold text-white text-center"
          style={{ background: "var(--gradient-orange)" }}
        >
          View More Details
        </Link>
      </div>
    </div>
  );
}
