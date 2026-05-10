"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FilterIcon,
  SearchIcon,
} from "@/components/Icons";
import BottomNav from "@/components/BottomNav";
import NotificationsSlideOver, { type NotificationItem } from "@/components/NotificationsSlideOver";
import TournamentListCard, { type TournamentListItem } from "@/components/TournamentListCard";
import { useApp } from "@/components/AppProvider";
import { notificationApi } from "@/lib/api/notificationApi";
import PageHeader from "@/components/PageHeader";
import TournamentFilterDrawer from "@/components/TournamentFilterDrawer";
import { SlidersIcon } from "@/components/Icons";

function BellIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

type TopTab = "browse" | "joined" | "history";
type FormatTab = "all" | "singles" | "doubles";

const baseSubtitle = "Pickle ball | Men's | Multiple Modes";

const browseItems: TournamentListItem[] = [
  {
    id: "1",
    name: "Monsoon Singles Open",
    subtitle: "Pickle ball | Men's | Singles",
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    format: "singles",
    cta: "Register",
  },
  {
    id: "2",
    name: "Winter Doubles Cup",
    subtitle: "Pickle ball | Mixed | Doubles",
    start: "20/01/2024",
    end: "22/01/2024",
    entry: "800 Entry",
    location: "Raipur | Chattisgarh",
    format: "doubles",
    cta: "Register",
  },
  {
    id: "3",
    name: "Bhilai Singles Classic",
    subtitle: "Pickle ball | Women's | Singles",
    start: "05/02/2024",
    end: "05/02/2024",
    entry: "400 Entry",
    location: "Bhilai | Chattisgarh",
    format: "singles",
    cta: "Register",
  },
];

const joinedItems: TournamentListItem[] = [
  {
    id: "4",
    name: "City Pickleball League",
    subtitle: "Pickle ball | Men's | Singles",
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    format: "singles",
    cta: "View",
  },
  {
    id: "5",
    name: "Weekend Doubles Blast",
    subtitle: "Pickle ball | Men's | Doubles",
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    format: "doubles",
    cta: "View",
  },
  {
    id: "6",
    name: "Monsoon Pro Series",
    subtitle: "Pickle ball | Men's | Singles",
    start: "15/01/2024",
    end: "15/01/2024",
    entry: "500 Entry",
    location: "Raipur | Chattisgarh",
    format: "singles",
    cta: "View",
  },
];

const historyItems: TournamentListItem[] = [
  {
    id: "7",
    name: "Champions league",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    location: "Raipur | Chattisgarh",
    cta: "Chevron",
    joinedStatus: "Eliminated - Round 4",
  },
  {
    id: "8",
    name: "Champions league",
    subtitle: baseSubtitle,
    start: "15/01/2024",
    end: "15/01/2024",
    location: "Raipur | Chattisgarh",
    cta: "Chevron",
    joinedStatus: "Eliminated - Round 4",
  },
];

export default function TournamentsPage() {
  const { userProfile } = useApp();
  const [activeTab, setActiveTab] = useState<TopTab>("browse");
  const [format, setFormat] = useState<FormatTab>("all");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const attachActions = (items: NotificationItem[]) =>
    items.map((item) => ({
      ...item,
      unread: item.unread && !readIds.has(item.id),
      onAccept:
        item.type === "invite"
          ? async () => {
            await notificationApi.respondToInvite(item.id, "accept");
            setNotifications((prev) => prev.filter((n) => n.id !== item.id));
          }
          : undefined,
      onReject:
        item.type === "invite"
          ? async () => {
            await notificationApi.respondToInvite(item.id, "reject");
            setNotifications((prev) => prev.filter((n) => n.id !== item.id));
          }
          : undefined,
    }));

  useEffect(() => {
    let active = true;
    const loadNotifications = async () => {
      try {
        const items = await notificationApi.getUserNotifications();
        if (!active) return;
        setNotifications(attachActions(items));
      } catch (error) {
        if (!active) return;
        console.error("Failed to load notifications", error);
        setNotifications([]);
      }
    };
    void loadNotifications();
    return () => {
      active = false;
    };
  }, [readIds]);

  const list = useMemo(() => {
    let items: TournamentListItem[] = [];
    if (activeTab === "joined") items = joinedItems;
    else if (activeTab === "history") items = historyItems;
    else items = browseItems;

    if (format === "all") return items;
    return items.filter((item) => item.format === format);
  }, [activeTab, format]);

  const unreadCount = notifications.filter((item) => item.unread).length;
  const userInitial = userProfile?.name?.trim().charAt(0).toUpperCase() || "P";
  const profilePicUrl = userProfile?.profilePicUrl;

  return (
    <>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <div className="bg-primary rounded-b-[32px] px-5 pt-10 pb-6 shadow-lg relative z-10 overflow-hidden">
          {/* Header Row */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/user/settings" className="shrink-0">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 bg-white/20 overflow-hidden flex items-center justify-center shadow-md transition-transform active:scale-95">
                {userProfile?.profilePicUrl ? (
                  <img
                    src={userProfile.profilePicUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {userInitial}
                  </span>
                )}
              </div>
            </Link>

            <div className="flex flex-col min-w-0">
              <h1 className="text-[24px] font-bold leading-tight tracking-tight truncate text-white">
                Tournaments
              </h1>
              <p className="text-[14px] text-white/80 font-medium tracking-wide truncate">
                Browse and join tournaments
              </p>
            </div>

            <div className="ml-auto">
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all active:scale-95 shadow-sm text-white"
                aria-label="Notifications"
              >
                <BellIcon size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-primary text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-primary">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <label className="flex h-14 items-center gap-3 rounded-[20px] bg-white px-4 text-gray-400 shadow-md focus-within:ring-2 focus-within:ring-white/20 transition-all">
              <SearchIcon size={22} className="opacity-60 text-gray-500" />
              <input
                type="text"
                placeholder="Search tournaments, cities..."
                className="w-full bg-transparent text-[16px] text-gray-800 outline-none placeholder:text-gray-400 font-medium"
              />
            </label>
          </div>

          {/* Centered Tabs */}
          <div className="flex items-center justify-center gap-10">
            {(["browse", "joined", "history"] as TopTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 text-[16px] font-bold capitalize transition-all ${
                  activeTab === tab
                    ? "text-white"
                    : "text-white/60 hover:text-white/80"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute -bottom-1 left-0 right-0 h-[3px] bg-white rounded-t-full shadow-[0_-2px_10px_rgba(255,255,255,0.4)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <NotificationsSlideOver
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          items={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={() =>
            setReadIds(new Set(notifications.map((n) => n.id)))
          }
          onClearAll={() => setNotifications([])}
        />

        <div className="px-5 py-5 flex items-center gap-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-primary shadow-sm active:scale-95 transition-transform"
          >
            <FilterIcon size={20} />
          </button>
          <div className="hide-scrollbar flex items-center gap-3 overflow-x-auto">
            {([
              { id: "all", label: "All Formats" },
              { id: "singles", label: "Singles" },
              { id: "doubles", label: "Doubles" },
            ] as { id: FormatTab; label: string }[]).map((tab) => {
              const active = format === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFormat(tab.id)}
                  className={`h-11 shrink-0 rounded-[18px] border px-6 text-[15px] font-bold transition-all ${
                    active
                      ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                      : "border-[var(--color-border)] bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] opacity-70 hover:opacity-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 px-4 pb-24 pt-4">
          {activeTab === "browse" ? (
            <>
              <h2 className="text-[18px] font-semibold text-[var(--color-text)]">Trending Tournaments</h2>
              {list.map((item) => (
                <TournamentListCard key={item.id} item={item} />
              ))}
            </>
          ) : (
            list.map((item) => <TournamentListCard key={item.id} item={item} />)
          )}
        </div>

        <BottomNav />
      </div>

      <TournamentFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => console.log("Applying filters:", filters)}
        onReset={() => console.log("Filters reset")}
      />
    </>
  );
}

