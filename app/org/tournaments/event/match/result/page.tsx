"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { getItem, removeItem } from "@/lib/storage";
import type { LiveMatchStateData, MatchConfigData } from "@/lib/models";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { toQuery } from "@/lib/utils";

type SidePlayer = { name: string; initials: string };

function ensurePlayers(players: unknown, format: MatchConfigData["format"]) {
  const fallbackSingles = {
    side0: [{ initials: "A", name: "Side A" }],
    side1: [{ initials: "B", name: "Side B" }],
  };

  const fallbackDoubles = {
    side0: [
      { initials: "KV", name: "Kunal Verma" },
      { initials: "AC", name: "Alex Costa" },
    ],
    side1: [
      { initials: "AK", name: "Anil Kumar" },
      { initials: "TR", name: "The Rock" },
    ],
  };

  const p = players as { side0?: SidePlayer[]; side1?: SidePlayer[] } | null;

  if (!p?.side0?.length || !p?.side1?.length) {
    return format === "doubles" ? fallbackDoubles : fallbackSingles;
  }

  if (format === "doubles") {
    return {
      side0: [
        p.side0[0] ?? fallbackDoubles.side0[0],
        p.side0[1] ?? fallbackDoubles.side0[1],
      ],
      side1: [
        p.side1[0] ?? fallbackDoubles.side1[0],
        p.side1[1] ?? fallbackDoubles.side1[1],
      ],
    };
  }

  return {
    side0: [p.side0[0] ?? fallbackSingles.side0[0]],
    side1: [p.side1[0] ?? fallbackSingles.side1[0]],
  };
}

function computeWinner(setScores: [number, number][]) {
  let winsA = 0;
  let winsB = 0;

  setScores.forEach(([a, b]) => {
    if (a === b) return;
    if (a > b) winsA += 1;
    else winsB += 1;
  });

  if (winsA === winsB) return null;
  return winsA > winsB ? 0 : 1;
}

export default function OrgMatchResultPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  const tournamentId = searchParams.get("tournamentId") || "1";
  const matchId = searchParams.get("matchId") || "m-1";

  const config = useMemo(
    () =>
      getItem<MatchConfigData>(`match:${matchId}:config`) ?? {
        scoringSystem: "sideout",
        format: "doubles",
        bestOf: 3,
        pointsToWin: 11,
        winByTwo: true,
        initialServer: 1,
      },
    [matchId],
  );

  const state = useMemo(
    () => getItem<LiveMatchStateData>(`match:${matchId}:state`),
    [matchId],
  );

  const format =
    config.format === "singles" || config.format === "doubles"
      ? config.format
      : "doubles";

  const players = useMemo(
    () => ensurePlayers(getItem(`match:${matchId}:players`), format),
    [matchId, format],
  );

  const setScores: [number, number][] = (state?.setScores ?? [])
    .map((s): [number, number] => [s?.[0] ?? 0, s?.[1] ?? 0])
    .filter(([a, b]) => a !== 0 || b !== 0);

  const winner = computeWinner(setScores);

  const winnerName =
    winner === null
      ? "Match Complete"
      : winner === 0
        ? format === "doubles"
          ? `${players.side0[0].name} & ${players.side0[1].name}`
          : players.side0[0].name
        : format === "doubles"
          ? `${players.side1[0].name} & ${players.side1[1].name}`
          : players.side1[0].name;

  const scoreLine =
    setScores.length > 0
      ? setScores.map(([a, b]) => `${a}-${b}`).join("   •   ")
      : "No sets recorded";

  return (
    <Layout
      title="Live Match"
      showBack
      showBottomNav={false}
      onBack={() => router.back()}
    >
      <div className="relative min-h-screen">
        {/* 🔵 Blurred Background Overlay */}
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md" />

        {/* 🏆 Center Winner Content */}
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center">
          {/* Trophy */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
            className="mb-4 text-[#F7B31B]"
          >
            <Trophy size={52} strokeWidth={2.3} />
          </motion.div>

          {/* Winner Label */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold text-white/80"
          >
            Winner
          </motion.p>

          {/* Winner Name */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-2xl font-bold text-white"
          >
            {winnerName}
          </motion.p>

          {/* Final Score */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-white/80"
          >
            Final Score: {scoreLine}
          </motion.p>
        </div>

        {/* 🔶 Bottom Confirm Button */}
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          className="fixed inset-x-0 bottom-0 z-50 bg-transparent px-6 pb-6 pt-4"
        >
          <button
            type="button"
            onClick={() => {
              removeItem(`match:${matchId}:state`);
              router.replace(
                "/org/tournaments/detail" + toQuery({ id: tournamentId }),
              );
            }}
            className="w-full rounded-2xl bg-primary py-4 text-base font-semibold text-white shadow-lg active:scale-[0.98] transition"
          >
            Confirm Results
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}
