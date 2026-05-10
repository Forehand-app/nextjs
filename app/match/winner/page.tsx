"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import { TrophyIcon } from "@/components/Icons";

export default function MatchWinnerPage() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const winnerName = searchParams.get("winner") || "Kunal Verma";
  const finalScore = searchParams.get("score") || "15-08";
  const playerA = searchParams.get("player_a") || "Kunal Verma";
  const playerB = searchParams.get("player_b") || "Akshay Kumar";
  return (
    <Layout title="Match Complete" showBack showBottomNav={false}>
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-6">
        {/* Trophy/Winner Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
            <TrophyIcon size={56} className="text-white" />
          </div>
          <div className="absolute inset-0 -z-10">
            <div className="w-40 h-40 bg-primary/10 rounded-full blur-3xl mx-auto" />
          </div>
        </div>

        {/* Winner Announcement */}
        <h1 className="text-3xl font-bold text-center mb-2">Winner</h1>
        <h2 className="text-4xl font-bold text-primary text-center mb-6">
          {winnerName}
        </h2>
        <p className="text-lg text-[var(--color-muted)] text-center mb-8">
          Final Score: {finalScore}
        </p>

        {/* Match Stats */}
        <div className="w-full max-w-md card p-6 mb-8">
          <h3 className="font-semibold mb-4 text-center">Match Info</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Team KV</span>
              <span className="font-semibold">{playerA}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Team AK</span>
              <span className="font-semibold">{playerB}</span>
            </div>
            <div className="h-px bg-[var(--color-border)]" />
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Set 1</span>
              <span className="font-semibold">
                {finalScore.replace("-", " - ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Set 2</span>
              <span className="font-semibold">- -</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Set 3</span>
              <span className="font-semibold">- -</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md space-y-3">
          <Link href="/match/setup" className="btn-primary w-full text-center">
            Start New Match
          </Link>
          <Link
            href="/home"
            className="block w-full py-3 rounded-xl text-center font-semibold border-2 border-[var(--color-border)] hover:border-primary transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
