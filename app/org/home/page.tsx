"use client";

import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import HomeHeader from "@/components/HomeHeader";
import { useApp } from "@/components/AppProvider";
import { CalendarIcon, CircleIcon, TimerIcon, TrophyIcon } from "@/components/Icons";
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { tournamentApi } from "@/lib/api/tournamentApi";
import { TournamentData } from "@/lib/models";

const liveMatches = [
  {
    id: "lm-1",
    score: "04 - 01",
    label: "Premier League - Men's Doubles Raipur..",
  },
  {
    id: "lm-2",
    score: "03 - 03",
    label: "Premier League - Men's Doubles Raipur..",
  },
  {
    id: "lm-3",
    score: "02 - 01",
    label: "Premier League - Men's Doubles Raipur..",
  },
];

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

type LiveTournamentCardData = {
  id: string;
  name: string;
  stage: string;
  participants: string;
  subtitle: string;
};

const AnimatedCard = ({
  children,
  containerRef,
  className,
}: {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) => {
  const cardRef = useRef(null);

  const { scrollXProgress } = useScroll({
    target: cardRef,
    container: containerRef,
    axis: "x",
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.article ref={cardRef} variants={cardVariants} style={{ scale }} className={className}>
      {children}
    </motion.article>
  );
};

const Dot = ({
  index,
  itemCount,
  scrollXProgress,
}: {
  index: number;
  itemCount: number;
  scrollXProgress: MotionValue<number>;
}) => {
  const step = 1 / (itemCount - 1);
  const target = index * step;

  let inputRange = [target - step, target, target + step];
  let widthOutput = [6, 24, 6];
  let opacityOutput = [0.2, 1, 0.2];

  if (inputRange[0] < 0) {
    inputRange = [0, target, target + step];
    widthOutput = [24, 24, 6];
    opacityOutput = [1, 1, 0.2];
  } else if (inputRange[inputRange.length - 1] > 1) {
    inputRange = [target - step, target, 1];
    widthOutput = [6, 24, 24];
    opacityOutput = [0.2, 1, 1];
  }

  const width = useTransform(scrollXProgress, inputRange, widthOutput);
  const opacity = useTransform(scrollXProgress, inputRange, opacityOutput);

  return <motion.div style={{ width, opacity }} className="h-1.5 rounded-full bg-primary" />;
};

const ScrollIndicator = ({
  itemCount,
  containerRef,
}: {
  itemCount: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { scrollXProgress } = useScroll({ container: containerRef });

  if (itemCount <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 h-3">
      {Array.from({ length: itemCount }).map((_, i) => (
        <Dot key={i} index={i} itemCount={itemCount} scrollXProgress={scrollXProgress} />
      ))}
    </div>
  );
};

function isLiveTournament(t: TournamentData) {
  if (t.tournamentState === "in_progress") return true;
  if (!t.startDate) return false;
  const now = new Date();
  const start = new Date(t.startDate);
  const end = t.endDate ? new Date(t.endDate) : null;
  return start <= now && (!end || end >= now);
}

function isCompletedTournament(t: TournamentData) {
  if (t.tournamentState === "completed") return true;
  if (!t.endDate) return false;
  return new Date(t.endDate) < new Date();
}

function isUpcomingTournament(t: TournamentData) {
  if (isLiveTournament(t) || isCompletedTournament(t)) return false;
  if (t.tournamentState === "drafted" || t.tournamentState === "published") return true;
  if (!t.startDate) return false;
  return new Date(t.startDate) > new Date();
}

function formatLiveStage(t: TournamentData) {
  if (!t.startDate || !t.endDate) return "Live";

  const start = new Date(t.startDate);
  const end = new Date(t.endDate);
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  const totalMs = end.getTime() - start.getTime();
  if (totalMs <= 0) return "Live";

  const totalDays = Math.max(1, Math.ceil(totalMs / dayMs) + 1);
  const elapsedDays = Math.max(1, Math.ceil((now.getTime() - start.getTime()) / dayMs) + 1);
  const day = Math.min(totalDays, elapsedDays);

  return `Day ${day} of ${totalDays}`;
}

function toLiveCard(t: TournamentData): LiveTournamentCardData {
  const primarySport = t.events?.[0]?.sportsOption?.label || "Tournament";
  const category = t.events?.[0]?.gender || "Open";
  const format = t.events?.[0]?.teamType?.label || "Mixed";

  return {
    id: t.id || `t-${Date.now()}`,
    name: t.name,
    stage: formatLiveStage(t),
    participants: `${t.events?.length || 0} events`,
    subtitle: `${primarySport} - ${category} - ${format}`,
  };
}

export default function OrgHomePage() {
  const tournamentContainerRef = useRef<HTMLDivElement>(null);
  const matchContainerRef = useRef<HTMLDivElement>(null);
  const { activeOrganization: organization } = useApp();
  const [tournaments, setTournaments] = useState<TournamentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const orgId = organization?.id;

    if (!orgId) {
      setTournaments([]);
      setIsLoading(false);
      return;
    }

    const load = async () => {
      try {
        const rows = await tournamentApi.getOrganizationTournaments(orgId);
        if (!active) return;
        setTournaments(Array.isArray(rows) ? rows : []);
      } catch (error) {
        if (!active) return;
        console.error("Failed to load org tournaments", error);
        setTournaments([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    const timer = setInterval(() => {
      void load();
    }, 30000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [organization?.id]);

  const overview = useMemo(() => {
    const live = tournaments.filter(isLiveTournament).length;
    const completed = tournaments.filter(isCompletedTournament).length;
    const upcoming = tournaments.filter(isUpcomingTournament).length;
    return { live, completed, upcoming };
  }, [tournaments]);

  const liveTournaments = useMemo(
    () => tournaments.filter(isLiveTournament).map(toLiveCard),
    [tournaments],
  );

  return (
    <Layout hideTopNav>
      <HomeHeader />
      <div className="font-body mx-auto w-full max-w-md space-y-6 px-4 pb-24 pt-6">
        <section className="space-y-4">
          <h2 className="px-1 text-lg font-bold tracking-tight">Tournament Overview</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Upcoming",
                count: String(overview.upcoming).padStart(2, "0"),
                icon: CalendarIcon,
              },
              {
                label: "Completed",
                count: String(overview.completed).padStart(2, "0"),
                icon: TrophyIcon,
              },
              { label: "Live", count: String(overview.live).padStart(2, "0"), icon: TimerIcon },
            ].map((item) => (
              <article
                key={item.label}
                className="flex flex-col items-center justify-center gap-2 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] py-6 px-3 shadow-sm transition-transform active:scale-95"
              >
                <item.icon size={28} className="text-[#ff7a1a]" />
                <p className="text-3xl font-bold leading-none tracking-tight text-[var(--color-text)]">{item.count}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] opacity-70">{item.label}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-xl font-semibold">Live Tournaments</h3>
            <Link href="/org/tournaments" className="text-xs font-medium uppercase text-primary">
              See All
            </Link>
          </div>

          {isLoading ? (
            <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-4">
              {[1, 2].map((i) => (
                <div key={i} className="card min-w-[85%] p-4 animate-pulse">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="h-3 w-12 rounded-full bg-[var(--color-surface-elevated)]" />
                    <div className="h-3 w-16 rounded-full bg-[var(--color-surface-elevated)]" />
                  </div>
                  <div className="h-5 w-3/4 rounded-md bg-[var(--color-surface-elevated)] mb-2" />
                  <div className="h-3 w-1/2 rounded-md bg-[var(--color-surface-elevated)]" />
                  <div className="mt-4 border-t border-[var(--color-border)] pt-3 flex justify-between">
                    <div className="h-3 w-16 rounded-md bg-[var(--color-surface-elevated)]" />
                    <div className="h-3 w-12 rounded-md bg-[var(--color-surface-elevated)]" />
                  </div>
                </div>
              ))}
            </div>
          ) : liveTournaments.length === 0 ? (
            <div className="card flex flex-col items-center justify-center p-8 text-center bg-[var(--color-surface)] border-dashed border-2">
              <div className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center mb-3">
                <TimerIcon size={24} className="text-[var(--color-muted)] opacity-50" />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-secondary)]">No live tournaments</p>
              <p className="text-xs text-[var(--color-muted)] mt-1">When you start a tournament, it will appear here.</p>
            </div>
          ) : (
            <>
              <motion.div
                ref={tournamentContainerRef}
                className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {liveTournaments.map((item) => (
                  <AnimatedCard key={item.id} containerRef={tournamentContainerRef} className="card min-w-[85%] snap-center p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-success)]">
                        <CircleIcon size={6} className="text-[var(--color-success)] fill-current" />
                        Live
                      </span>
                      <span className="text-xs text-[var(--color-muted)]">{item.stage}</span>
                    </div>
                    <h4 className="font-heading text-lg font-bold leading-tight">{item.name}</h4>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">{item.subtitle}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-2">
                      <span className="text-xs text-[var(--color-text-secondary)]">Participants</span>
                      <span className="text-sm font-semibold">{item.participants}</span>
                    </div>
                  </AnimatedCard>
                ))}
              </motion.div>

              <div className="mt-1">
                <ScrollIndicator itemCount={liveTournaments.length} containerRef={tournamentContainerRef} />
              </div>
            </>
          )}
        </section>

        <section>
          <h3 className="mb-3 font-heading text-xl font-semibold">Live Matches</h3>

          <motion.div
            ref={matchContainerRef}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {liveMatches.map((match) => (
              <AnimatedCard
                key={match.id}
                containerRef={matchContainerRef}
                className="card min-w-[85%] snap-center p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-success)]">
                    <CircleIcon
                      size={6}
                      className="text-[var(--color-success)] fill-current"
                    />
                    Live
                  </span>
                  <p className="truncate text-xs text-[var(--color-text-secondary)] max-w-[150px]">
                    {match.label}
                  </p>
                </div>

                <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] bg-white shadow-sm">
                      <Image
                        src="/pwa-icons/icon-192.png"
                        alt="Team logo"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <p className="text-xs font-medium">Chelsea</p>
                  </div>

                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 font-heading text-2xl font-bold tracking-tight">
                    {match.score}
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <div className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-border)] bg-white shadow-sm">
                      <Image
                        src="/pwa-icons/icon-192.png"
                        alt="Team logo"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                    <p className="text-xs font-medium">Man City</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mx-auto mt-1 block w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Update Score
                </button>
              </AnimatedCard>
            ))}
          </motion.div>

          <div className="mt-1">
            <ScrollIndicator
              itemCount={liveMatches.length}
              containerRef={matchContainerRef}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
