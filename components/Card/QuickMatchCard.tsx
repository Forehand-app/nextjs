"use client";

import Link from "next/link";

type QuickMatchCardProps = {
  href: string;
  title?: string;
  description?: string;
};

function ArrowRightIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function QuickMatchCard({
  href,
  title = "Quick Match",
  description = "Start a match quickly without saving data",
}: QuickMatchCardProps) {
  return (
    <Link href={href} className="group block cursor-pointer transition-transform active:scale-[0.98]">
      <section className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition-colors hover:border-orange-500/50">
        <div>
          <h3 className="font-heading text-lg font-bold text-[var(--color-text)] transition-colors group-hover:text-orange-600">
            {title}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-[var(--color-text-secondary)]">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-transform group-hover:scale-110 dark:bg-orange-500/20 dark:text-orange-400">
          <ArrowRightIcon size={20} />
        </div>
      </section>
    </Link>
  );
}
