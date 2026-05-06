"use client";

import Link from "next/link";
import { TrophyIcon } from "@/components/Icons";

type UserTournamentCardProps = {
  href: string;
  title: string;
  sport: string;
  category: string;
  format: string;
  ctaLabel?: string;
};

function ArrowUpRightIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export default function UserTournamentCard({
  href,
  title,
  sport,
  category,
  format,
  ctaLabel = "View Tournament Events",
}: UserTournamentCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[18px] border border-neutral-200 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.05)] transition-all hover:border-orange-300 hover:shadow-[0_10px_24px_rgba(249,115,22,0.1)] active:scale-[0.98]"
    >
      <div className="flex min-h-[102px]">
        <div className="w-1.5 shrink-0 rounded-l-[18px] bg-gradient-to-b from-amber-300 via-orange-400 to-orange-500" />

        <div className="flex flex-1 flex-col justify-between px-3.5 py-3.5">
          <div className="flex items-start gap-2.5">
            <div className="grid h-10 w-10 shrink-0 place-content-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700">
              <TrophyIcon size={18} />
            </div>

            <div className="min-w-0 pt-0.5">
              <h4 className="truncate text-[16px] font-semibold leading-tight text-neutral-900">
                {title}
              </h4>
              <p className="mt-1 text-xs font-medium text-neutral-500">
                {sport} {"\u2022"} {category} {"\u2022"} {format}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-100 pt-2.5">
            <span className="text-[13px] font-medium text-orange-600 transition-colors group-hover:text-orange-700">
              {ctaLabel}
            </span>
            <span className="shrink-0 text-orange-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRightIcon size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
