"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CourtSlider from "@/components/QuickMatch/CourtSlider";
import MatchSplash from "@/components/QuickMatch/MatchSplash";
import { toQuery } from "@/lib/utils";

type PageState = "setup" | "loading";

export default function QuickMatchSetupPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);
  const [pageState, setPageState] = useState<PageState>("setup");
  const [pendingParams, setPendingParams] = useState<string | null>(null);
  const returnToHome = searchParams.get("returnToHome") === "1";

  const handleStart = (payload: {
    courtId: string;
    format: "singles" | "doubles";
    scoring: "sideout" | "rally";
    bestOf: 3 | 5;
    points: 11 | 15 | 21;
    winByTwo: boolean;
    initialServer: 1 | 2;
    players: Record<string, string | null>;
  }) => {
    const matchId = `quick-${Date.now()}`;
    setPendingParams(
      `/match/live${toQuery({
        matchId,
        format: payload.format,
        scoring: payload.scoring,
        bestOf: payload.bestOf,
        points: payload.points,
        winByTwo: payload.winByTwo,
        server: payload.initialServer,
        p1: payload.players.leftTop ?? "Player 1",
        p2: payload.players.rightBottom ?? "Player 2",
        p3: payload.players.leftBottom ?? "",
        p4: payload.players.rightTop ?? "",
        court: payload.courtId,
        quick: "1",
      })}`,
    );
    setPageState("loading");
  };

  if (pageState === "loading" && pendingParams) {
    return (
      <MatchSplash
        onComplete={() => {
          router.push(pendingParams);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CourtSlider
        onBack={() => {
          if (returnToHome) {
            router.replace("/user/home");
            return;
          }
          router.back();
        }}
        onStart={handleStart}
      />
    </div>
  );
}
