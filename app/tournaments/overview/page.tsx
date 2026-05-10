"use client";

import React, { useState } from "react";
import Layout from "@/components/Layout";
import Tabs, { type TabItem } from "@/components/Tabs";
import Link from "next/link";
import {
  GamepadIcon,
  MapPinIcon,
  UsersIcon,
  CalendarIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
} from "@/components/Icons";
import { toQuery } from "@/lib/utils";

const tournamentTabs: TabItem[] = [
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
];

type EventCategory = {
  name: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxParticipants: number;
  registeredCount: number;
  entryFee: string;
};

export default function TournamentOverviewPage() {
  const [activeTab, setActiveTab] = useState("events");

  const events: EventCategory[] = [
    {
      name: "Men's Singles",
      startDate: "13 Dec 20:00",
      endDate: "15 Dec 20:00",
      registrationDeadline: "13/12/2024",
      maxParticipants: 64,
      registeredCount: 4,
      entryFee: "Free Entry",
    },
    {
      name: "Men's Doubles",
      startDate: "13 Dec 20:00",
      endDate: "15 Dec 20:00",
      registrationDeadline: "13/12/2024",
      maxParticipants: 64,
      registeredCount: 8,
      entryFee: "₹1400",
    },
  ];

  return (
    <Layout title="Tournament Overview" showBack>
      <div className="p-4 space-y-6 pb-24">
        {/* Tournament Header */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl overflow-hidden border border-white/40">
              {/* In a real app, we would fetch tournament.logoUrl */}
              <GamepadIcon size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">
                Mumbai Men&apos;s 2025
              </h1>
              <p className="text-sm opacity-90">Badminton • Squash</p>
              <p className="text-sm opacity-90 flex items-center gap-1">
                <MapPinIcon size={14} /> Ghatkopar
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <UsersIcon size={14} /> 64 Players
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CalendarIcon size={14} /> 13-15 Dec 2024
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={tournamentTabs}
          activeId={activeTab}
          onChange={setActiveTab}
          ariaLabel="Tournament sections"
        />

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <section className="bg-[var(--color-surface)] rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
              <h3 className="font-semibold mb-3">Overview</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Join us for an exciting tournament featuring the best players
                from across the region. Multiple categories available for all
                skill levels.
              </p>
            </section>

            <section className="bg-[var(--color-surface)] rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Join the biggest badminton tournament in the city! Amazing
                prizes, professional courts, and top-tier competition await.
              </p>
            </section>

            <section className="bg-[var(--color-surface)] rounded-[var(--radius-card)] border border-[var(--color-border)] p-4">
              <h3 className="font-semibold mb-4">Contact Information</h3>

              <div className="divide-y divide-[var(--color-border)]">
                {/* Contact Item */}
                <div className="py-4 flex gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center font-semibold text-primary shrink-0">
                    RM
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">Rajesh Mehta</h4>

                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        Organizer
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-[var(--color-text-secondary)]">
                      <a
                        href="mailto:rajesh@tournament.com"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <MailIcon size={14} />
                        rajesh@tournament.com
                      </a>

                      <a
                        href="tel:+919876543210"
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <PhoneIcon size={14} />
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Men&apos;s Singles</h3>
            </div>

            {events.map((event, idx) => (
              <div
                key={idx}
                className="bg-[var(--color-surface)] rounded-[var(--radius-card)] border border-[var(--color-border)] overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold mb-1">{event.name}</h4>
                      <p className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                        <CalendarIcon size={10} /> Start: {event.startDate}
                      </p>
                      <p className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                        <CalendarIcon size={10} /> End: {event.endDate}
                      </p>
                    </div>
                    <Link
                      href={`/tournaments/event${toQuery({ id: "1" })}`}
                      className="px-4 py-2 rounded-[var(--radius-button)] text-sm font-semibold text-white"
                      style={{ background: "var(--gradient-orange)" }}
                    >
                      Register
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-[var(--color-surface-elevated)] rounded-lg p-3">
                      <p className="text-xs text-[var(--color-muted)] mb-1">
                        Capacity
                      </p>
                      <p className="font-semibold">
                        {event.registeredCount}/{event.maxParticipants}
                      </p>
                    </div>
                    <div className="bg-[var(--color-surface-elevated)] rounded-lg p-3">
                      <p className="text-xs text-[var(--color-muted)] mb-1">
                        Entry Fee
                      </p>
                      <p className="font-semibold">{event.entryFee}</p>
                    </div>
                  </div>

                  <div className="text-xs text-[var(--color-muted)]">
                    Registration Deadline: {event.registrationDeadline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
