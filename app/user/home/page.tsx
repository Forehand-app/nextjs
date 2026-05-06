"use client";

import { useState, UIEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import BottomNav from "@/components/BottomNav";
import LiveMatchCard from "@/components/Card/LiveMatchCard";
import NextOnCourtSection from "@/components/Card/NextOnCourtSection";
import PastMatchesSection from "@/components/Card/PastMatchesSection";
import QuickMatchCard from "@/components/Card/QuickMatchCard";
import QuickStatsSection from "@/components/Card/QuickStatsSection";
import UserTournamentCard from "@/components/Card/UserTournamentCard";
import ColorfulTournamentCard from "@/components/Card/ColorfulTournamentCard";
import OngoingTournamentCard from "@/components/Card/OngoingTournamentCard";
import NotificationsSlideOver, { NotificationItem } from "@/components/NotificationsSlideOver";


// --- TYPE DEFINITIONS ---


// --- CUSTOM ICONS ---
function BellIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function LightningIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// --- MOCK DATA FOR SPLIT CARDS ---
const upcomingTournaments: Array<{
  id: string;
  name: string;
  venue: string;
  address: string;
  sport: string;
  category: string;
  modes: string;
  colorVariant: "orange" | "blue" | "green" | "red" | "purple";
  logoText: string;
  entryFee: string;
  ctaText: string;
}> = [
  {
    id: "101",
    name: "Monsoon Pickleball Raipur Open",
    venue: "Sports Arena",
    address: "24 Block Street, Raipur",
    sport: "Pickleball",
    category: "Men's",
    modes: "Multiple Modes",
    colorVariant: "orange",
    logoText: "MP",
    entryFee: "₹500",
    ctaText: "Register"
  },
  {
    id: "102",
    name: "National Tennis Championship",
    venue: "Delhi Sports Complex",
    address: "Sector 14, New Delhi",
    sport: "Tennis",
    category: "Men's & Women's",
    modes: "Singles & Doubles",
    colorVariant: "blue",
    logoText: "NT",
    entryFee: "₹1200",
    ctaText: "Register"
  }
];

const ongoingTournaments = [
  {
    id: "103",
    name: "Winter Badminton League",
    venue: "Raipur City Club, Civil Lines",
    sport: "Badminton",
    category: "Mixed",
    modes: "League",
    logoText: "WB",
  },
  {
    id: "104",
    name: "Summer Squash Series",
    venue: "Elite Squash Courts, Downtown",
    sport: "Squash",
    category: "Women's",
    modes: "Knockout",
    logoText: "SS",
  }
];

const liveMatches = [
  {
    id: "l1",
    tournamentName: "Raipur Racket Sports League",
    matchTitle: "Men's Doubles · Match #42",
    teamA: {
      players: ["S. Williams", "A. Lee"],
    },
    teamB: {
      players: ["J. Brown", "K. Patel"],
    },
    score: {
      teamA: 11,
      teamB: 9,
      currentSet: 2,
    },
    court: "Court 3",
    isLive: true,
  },
];

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "match_start",
    title: "Tennis match Started",
    body: "Raipur Sports Academy",
    timeAgo: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    type: "match_start",
    title: "Pickleball Singles Started",
    body: "Court 3",
    timeAgo: "3 hours ago",
    unread: true,
  }
];

export default function UserHomePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("explore");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // --- CAROUSEL PAGINATION STATES ---
  const [activeUpcomingIndex, setActiveUpcomingIndex] = useState(0);
  const [activeOngoingIndex, setActiveOngoingIndex] = useState(0);

  const unreadCount = mockNotifications.filter((n) => n.unread).length;
  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Player";
  const displayName = userName.split(" ")[0] || userName;
  const userInitial = userName.trim().charAt(0).toUpperCase() || "P";

  const homeTabs = [
    { id: "explore", label: "Explore" },
    { id: "live", label: "Live Feed" },
    { id: "myspace", label: "My Space" },
  ];

  // Scroll handlers to calculate which card is currently centered
  const handleUpcomingScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const itemWidth = (target.firstChild as HTMLElement)?.offsetWidth || target.clientWidth;
    const scrollPosition = target.scrollLeft;
    setActiveUpcomingIndex(Math.round(scrollPosition / itemWidth));
  };

  const handleOngoingScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const itemWidth = (target.firstChild as HTMLElement)?.offsetWidth || target.clientWidth;
    const scrollPosition = target.scrollLeft;
    setActiveOngoingIndex(Math.round(scrollPosition / itemWidth));
  };

  return (
    <div className="font-body flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text)]">
      
      {/* ========================================= */}
      {/* UNIFIED ORANGE HERO CONTAINER             */}
      {/* ========================================= */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-b-[32px] px-4 pt-10 pb-12 shadow-md relative z-10 overflow-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="mx-auto w-full max-w-md relative z-10">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0">
                {userInitial}
              </div>
              <div>
                <h1 className="text-white font-bold text-xl leading-tight tracking-tight">Hey {displayName}!</h1>
                <p className="text-white/90 text-sm font-medium">Ready to dominate the court?</p>
              </div>
            </div>
            
            <button 
              onClick={() => setNotificationsOpen(true)}
              className="relative w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-white hover:bg-black/20 active:scale-95 transition-all shrink-0 cursor-pointer"
              aria-label="Open notifications"
            >
              <BellIcon size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 ring-2 ring-orange-500 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-2">
            {homeTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`snap-center shrink-0 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-orange-600 shadow-md dark:bg-[var(--color-surface)] dark:text-[var(--color-text)] dark:shadow-sm dark:border dark:border-[var(--color-border)]"
                    : "bg-white/20 text-white hover:bg-white/30 dark:bg-[var(--color-surface-elevated)] dark:text-[var(--color-text-secondary)] dark:border dark:border-[var(--color-border)] dark:hover:bg-[var(--color-surface)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "explore" && (
            <div className="animate-fade-in mt-6">
              <h2 className="text-[10px] font-extrabold tracking-widest text-orange-200 uppercase mb-2">
                Browse & Join
              </h2>
              <h3 className="font-heading text-[28px] font-black uppercase leading-[1.1] text-white mb-2">
                Upcoming Tournaments<br />Near You
              </h3>
              <p className="text-sm text-white/90 font-medium mb-6">
                Compete. Track. Rise.
              </p>
              
              <div className="flex gap-3">
                <Link
                  href="/user/tournaments"
                  className="flex-1 bg-white text-gray-900 rounded-full h-12 flex items-center justify-center gap-1.5 font-bold shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                  <LightningIcon size={16} /> Register Now
                </Link>
                <Link
                  href="/user/tournaments"
                  className="flex-1 border-2 border-white/40 text-white rounded-full h-12 flex items-center justify-center font-bold hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  Explore All
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ========================================= */}

      {/* MAIN CONTENT AREA */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 overflow-x-hidden overflow-y-auto px-4 pb-28 pt-8">
        
        {/* ======================= */}
        {/* EXPLORE TAB             */}
        {/* ======================= */}
        {activeTab === "explore" && (
          <div className="space-y-8 animate-fade-in mt-2">
            
            <QuickMatchCard href="/match/setup" />

            {/* UPCOMING TOURNAMENTS */}
            <section>
              <div className="flex items-end justify-between mb-3 px-1">
                <h3 className="font-heading text-xl font-bold tracking-tight">Upcoming Tournaments</h3>
                <Link href="/user/tournaments" className="text-xs font-bold uppercase tracking-wider text-orange-600 hover:underline pb-1">
                  View All
                </Link>
              </div>
              <div 
                className="flex overflow-x-auto gap-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 pb-2"
                onScroll={handleUpcomingScroll}
              >
                {upcomingTournaments.map((t) => (
                  <div key={t.id} className="min-w-[74vw] sm:min-w-[280px] snap-center shrink-0">
                    <ColorfulTournamentCard
                    id={t.id}
                    name={t.name}
                    venue={t.venue}
                    address={t.address}
                    sport={t.sport}
                    category={t.category}
                    modes={t.modes}
                    colorVariant={t.colorVariant}
                    logoText={t.logoText}
                    entryFee={t.entryFee}
                    ctaText={t.ctaText}
                      />
                  </div>
                ))}
              </div>
              {/* Upcoming Dots Indicator */}
              {upcomingTournaments.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {upcomingTournaments.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeUpcomingIndex === idx
                          ? "w-4 bg-orange-500"
                          : "w-1.5 bg-neutral-300 dark:bg-neutral-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ONGOING TOURNAMENTS */}
            <section>
              <div className="flex items-end justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl font-bold tracking-tight">Ongoing Tournaments</h3>
                  {/* ORANGE LIVE PING ANIMATION */}
                  <div className="relative flex h-3 w-3 items-center justify-center mb-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                  </div>
                </div>
                <Link href="/user/tournaments" className="text-xs font-bold uppercase tracking-wider text-orange-600 hover:underline pb-1">
                  View All
                </Link>
              </div>
              <div 
                className="flex overflow-x-auto gap-4 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 pb-2"
                onScroll={handleOngoingScroll}
              >
                {ongoingTournaments.map((t) => (
                  <div key={t.id} className="min-w-[74vw] sm:min-w-[280px] snap-center shrink-0">
                    <OngoingTournamentCard 
                      id={t.id}
                      name={t.name}
                      sport={t.sport}
                      category={t.category}
                      modes={t.modes}
                      venue={t.venue}
                      logoText={t.logoText}
                    />
                  </div>
                ))}
              </div>
              {/* Ongoing Dots Indicator */}
              {ongoingTournaments.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  {ongoingTournaments.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeOngoingIndex === idx
                          ? "w-4 bg-orange-500"
                          : "w-1.5 bg-neutral-300 dark:bg-neutral-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ======================= */}
        {/* LIVE FEED TAB           */}
        {/* ======================= */}
        {activeTab === "live" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-center py-1 mb-2">
              <span className="mr-2 h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
                Ongoing Matches
              </h3>
            </div>
            {liveMatches.map((match) => (
            <LiveMatchCard
              key={match.id}
              tournamentName={match.tournamentName}
              matchTitle={match.matchTitle}
              teamA={match.teamA}
              teamB={match.teamB}
              score={match.score}
              court={match.court}
              isLive={match.isLive}
              size="spacious"
            />
          ))}
          </div>
        )}

        {/* ======================= */}
        {/* MY SPACE TAB            */}
        {/* ======================= */}
{activeTab === "myspace" && (
  <div className="space-y-8 animate-fade-in">
    
    {/* Quick Stats */}
    <section>
      <QuickStatsSection won={28} played={38} lost={12} />
    </section>

    {/* Your Live Match */}
    <section>
      <h3 className="mb-3 font-heading text-lg font-semibold tracking-tight flex items-center gap-2 px-1">
        <span className="h-2 w-2 rounded-full bg-[var(--color-error)] animate-pulse" />
        Your Live Match
      </h3>

      <LiveMatchCard
        tournamentName="Badminton Championship"
        matchTitle="Men's Doubles - Round 3"
        teamA={{ players: ["S. Verma", "A. Mehta"] }}
        teamB={{ players: ["J. Brown", "K. Patel"] }}
        score={{ teamA: 11, teamB: 9, currentSet: 2 }}
        court="Sports Arena, 24 block street, Raipur"
        isLive={true}
      />
    </section>

    {/* Your Tournaments */}
    <section>
      <h3 className="mb-3 font-heading text-lg font-semibold tracking-tight px-1">
        Your Tournaments
      </h3>

      <div className="px-1">
        <UserTournamentCard
          href="/user/tournaments"
          title="Raipur League 2025"
          sport="Pickle ball"
          category="Men's"
          format="Doubles"
          ctaLabel="View Tournament Events"
        />
      </div>
    </section>

    {/* Next On Court */}
    <NextOnCourtSection />

    {/* Past Matches */}
    <PastMatchesSection />

  </div>
)}
      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNav />
      </div>

      {/* NOTIFICATIONS SLIDEOVER */}
      <NotificationsSlideOver
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        items={mockNotifications}
        unreadCount={unreadCount}
        onMarkAllRead={() => console.log("Mark all read")}
        onClearAll={() => console.log("Clear all")}
      />
    </div>
  );
}

