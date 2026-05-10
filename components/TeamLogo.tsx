"use client";

import React from "react";
import { PlusIcon } from "@/components/Icons";

interface TeamLogoProps {
  team?: any;
  size?: "sm" | "md" | "lg";
  isSelected?: boolean;
}

export default function TeamLogo({
  team,
  size = "md",
  isSelected = false,
}: TeamLogoProps) {
  const participants = team?.participants || [];
  const isDoubles = participants.length > 1;

  const containerClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  }[size];

  const avatarClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
  }[size];

  const getTeamName = (t: any) => {
    return (
      t.name ||
      t.participants?.map((p: any) => p.user?.name).join(" & ") ||
      "Unknown Team"
    );
  };

  const getTeamInitials = (t: any) => {
    const name = getTeamName(t);
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (!team) {
    return (
      <div
        className={`${containerClasses} rounded-full transition-all flex items-center justify-center shadow-sm ${
          isSelected
            ? "bg-primary/20 text-primary border-2 border-primary ring-4 ring-primary/20 scale-110"
            : "bg-[var(--color-surface-elevated)] text-[var(--color-muted)] border border-[var(--color-border)] hover:bg-primary/10 hover:text-primary hover:border-primary/50"
        }`}
      >
        <PlusIcon size={size === "sm" ? 14 : 20} />
      </div>
    );
  }

  if (!isDoubles) {
    const p = participants[0];
    return (
      <div
        className={`${containerClasses} rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-md overflow-hidden shrink-0 transition-transform ${isSelected ? "scale-110 ring-4 ring-primary/20" : "hover:scale-105"}`}
      >
        {p?.user?.profilePicUrl ? (
          <img
            src={p.user.profilePicUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          getTeamInitials(team)
        )}
      </div>
    );
  }

  // Doubles: Overlapped avatars
  return (
    <div
      className={`${containerClasses} relative flex items-center justify-center shrink-0 transition-transform ${isSelected ? "scale-110" : "hover:scale-105"}`}
    >
      {participants.slice(0, 2).map((p: any, i: number) => (
        <div
          key={p.userId || i}
          className={`${avatarClasses} rounded-full border-2 border-[var(--color-surface)] bg-gradient-to-br ${i === 0 ? "from-orange-400 to-orange-600" : "from-blue-400 to-blue-600"} flex items-center justify-center text-white font-bold shadow-sm overflow-hidden absolute ${i === 0 ? "-translate-x-2 z-10" : "translate-x-2 z-0"}`}
        >
          {p.user?.profilePicUrl ? (
            <img
              src={p.user.profilePicUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            (p.user?.name || "P").charAt(0).toUpperCase()
          )}
        </div>
      ))}
    </div>
  );
}
