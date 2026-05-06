import React from "react";
import Link from "next/link";

interface OngoingTournamentCardProps {
  id: string;
  name: string;
  sport: string;
  category: string;
  modes: string;
  venue: string;
  logoText: string;
  href: string;
}

export default function OngoingTournamentCard({
  name,
  sport,
  category,
  modes,
  venue,
  logoText,
  href,
}: OngoingTournamentCardProps) {
  return (
    <Link href={""} className="block w-full active:scale-[0.98] transition-transform group">
      <div className="flex flex-col rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] bg-[var(--color-surface)]">

        {/* --- TOP SECTION (Orange) --- */}
        <div className="bg-orange-500 dark:bg-[#c2410c] p-4 flex items-center gap-4 relative overflow-hidden">
          {/* Decorative highlight */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          {/* Logo Badge */}
          <div className="w-14 h-14 shrink-0 rounded-full bg-white dark:bg-[var(--color-surface-elevated)] flex items-center justify-center shadow-sm relative z-10">
            <span className="text-orange-600 dark:text-orange-400 font-black text-xl tracking-tighter">
              {logoText}
            </span>
          </div>

          {/* Event Details */}
          <div className="relative z-10">
            <h3 className="text-white font-bold text-lg leading-tight mb-1 truncate">
              {name}
            </h3>
            <p className="text-white/90 text-[11px] sm:text-xs font-semibold tracking-wide">
              {sport} &bull; {category} &bull; {modes}
            </p>
          </div>
        </div>

        {/* --- BOTTOM SECTION (Light) --- */}
        <div className="p-4 flex items-center justify-between gap-4">
          {/* Venue Info */}
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium text-[var(--color-text-secondary)] truncate">
              {venue}
            </span>
          </div>

          {/* Action Button */}
          <button className="shrink-0 px-4 py-1.5 rounded-full border-2 border-orange-500 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider group-hover:bg-orange-500 group-hover:text-white dark:group-hover:bg-orange-500/10 dark:group-hover:text-orange-300 transition-colors duration-200">
            View More
          </button>
        </div>

      </div>
    </Link>
  );
}

