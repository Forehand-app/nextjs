"use client";

import Link from "next/link";
import { toQuery } from "@/lib/utils";


function MapPinIcon({ size = 12 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export type ColorfulTournamentCardProps = {
    id: string;
    name: string;
    venue: string;
    address: string;
    sport: string;
    category: string;
    modes: string;
    entryFee?: string;
    ctaText?: string;
    colorVariant?: "orange" | "green" | "red" | "blue" | "purple";
    href?: string;
    logoText?: string;
};

export default function ColorfulTournamentCard({
    id,
    name,
    venue,
    address,
    sport,
    category,
    modes,
    entryFee,
    ctaText = "Register",
    colorVariant = "orange",
    href,
    logoText,
}: ColorfulTournamentCardProps) {
    const url = `/tournaments/detail${toQuery({ id })}`

    const bgVariants = {
        orange: "from-orange-500 to-orange-700 dark:from-orange-600 dark:to-orange-800",
        green: "from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800",
        red: "from-rose-500 to-rose-700 dark:from-rose-600 dark:to-rose-800",
        blue: "from-blue-600 to-indigo-800 dark:from-blue-700 dark:to-indigo-900",
        purple: "from-purple-600 to-purple-900 dark:from-purple-700 dark:to-purple-950"
    };

    const btnVariants = {
        orange: "border-orange-500 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-500/10",
        green: "border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10",
        red: "border-rose-500 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10",
        blue: "border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10",
        purple: "border-purple-500 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-500/10"
    };

    const bgClass = bgVariants[colorVariant] || bgVariants.orange;
    const btnClass = btnVariants[colorVariant] || btnVariants.orange;

    return (
        <Link href={url} className="block group w-full active:scale-[0.98] transition-transform">
            {/* Reduced border radius from 24px to 16px */}
            <div className="relative overflow-hidden rounded-[16px] bg-[var(--color-surface)] shadow-sm transition-shadow duration-300 group-hover:shadow-md flex flex-col border border-[var(--color-border)]">

                {/* TOP SECTION - Reduced padding from p-5 to p-3 */}
                <div className={`relative bg-gradient-to-br ${bgClass} p-3 text-white flex-1 overflow-hidden`}>

                    {/* Scaled down geometric accents */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-colors pointer-events-none" />
                    <div className="absolute right-0 bottom-0 opacity-[0.05] pointer-events-none">
                        <svg width="80" height="80" viewBox="0 0 100 100">
                            <polygon points="100,0 100,100 0,100" fill="currentColor" />
                            <circle cx="80" cy="80" r="10" fill="currentColor" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col h-full">

                        {/* Reduced Logo from w-12/h-12 to w-8/h-8, smaller text */}
                        <div className="w-8 h-8 bg-white dark:bg-[var(--color-surface-elevated)] text-gray-900 dark:text-orange-400 rounded-full flex items-center justify-center shadow-sm">
                            {logoText || name.substring(0, 1)}
                        </div>

                        {/* Reduced Title from text-2xl to text-[15px] */}
                        <h3 className="font-heading text-[15px] font-black leading-tight mb-1.5 drop-shadow-sm tracking-tight text-white line-clamp-2">
                            {name}
                        </h3>

                        {/* Reduced Metadata text from 10px to 8px */}
                        <div className="flex items-center flex-wrap gap-1 text-white/90 text-[8px] font-bold uppercase tracking-wider mb-3">
                            <span>{sport}</span>
                            <span className="w-1 h-1 rounded-full bg-white/60" />
                            <span>{category}</span>
                            <span className="w-1 h-1 rounded-full bg-white/60" />
                            <span>{modes}</span>
                        </div>

                        {/* Reduced Venue text */}
                        <div className="flex items-start gap-1.5 text-white/95 mt-auto">
                            <div className="mt-[2px] shrink-0 opacity-80">
                                <MapPinIcon size={12} />
                            </div>
                            <p className="font-medium text-[10px] leading-snug truncate">
                                <span className="font-bold">{venue}</span>, {address}
                            </p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION - Reduced padding from px-5 py-4 to px-3 py-2.5 */}
                <div className="bg-[var(--color-surface)] px-3 py-2.5 flex items-center justify-between">
                    <div>
                        <p className="text-[var(--color-text-secondary)] text-[8px] font-bold uppercase tracking-wider mb-0.5">
                            Entry Fee
                        </p>
                        {/* Reduced Fee text from text-lg to text-sm */}
                        <p className="text-[var(--color-text)] font-black text-sm leading-none">
                            {entryFee ? entryFee : "Free"}
                        </p>
                    </div>

                    {/* Reduced Button padding and text size */}
                    <div className={`px-3 py-1.5 rounded-full border-[1.5px] font-bold text-[10px] transition-colors ${btnClass}`}>
                        {ctaText}
                    </div>
                </div>

            </div>
        </Link>
    );
}

