import { ChevronRightIcon, MapPinIcon, TimerIcon } from "@/components/Icons";

type UpcomingMatch = {
  id: string;
  month: string;
  day: string;
  title: string;
  sport: string;
  category: string;
  time: string;
  venue: string;
  accentColor: string;
};

const upcomingMatches: UpcomingMatch[] = [
  {
    id: "upcoming-1",
    month: "Dec",
    day: "18",
    title: "Regional Semi - Final",
    sport: "Singles",
    category: "Men's Open",
    time: "10:00 AM",
    venue: "City Court",
    accentColor: "bg-lime-300",
  },
  {
    id: "upcoming-2",
    month: "Dec",
    day: "18",
    title: "Pickleball Quarter Final",
    sport: "Singles",
    category: "Singles",
    time: "10:00 AM",
    venue: "City Court",
    accentColor: "bg-orange-500",
  },
  {
    id: "upcoming-3",
    month: "Dec",
    day: "18",
    title: "Regional Semi - Final",
    sport: "Singles",
    category: "Men's Open",
    time: "10:00 AM",
    venue: "City Court",
    accentColor: "bg-lime-300",
  },
];

function UpcomingCourtCard({ match }: { match: UpcomingMatch }) {
  return (
    <div className="flex overflow-hidden border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-transform duration-200 hover:-translate-y-0.5">
      <div className={`flex min-w-[48px] shrink-0 flex-col items-center justify-center px-2 py-3 text-center text-black ${match.accentColor}`}>
        <span className="text-[11px] font-medium leading-none">
          {match.month}
        </span>
        <span className="mt-1 text-[16px] font-bold leading-none">
          {match.day}
        </span>
      </div>

      <div className="flex flex-1 items-start justify-between gap-3 px-3 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-[var(--color-text)]">
            {match.title}
          </p>
          <p className="mt-1 truncate text-[11px] text-[var(--color-text-secondary)]">
            {match.sport} {"\u2022"} {match.category}
          </p>

          <div className="pt-3 text-[10px] text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <TimerIcon size={11} className="text-neutral-500" />
                {match.time}
              </span>
              <span className="text-neutral-300">{"\u2022"}</span>
              <span className="flex items-center gap-1">
                <MapPinIcon size={11} className="text-neutral-500" />
                {match.venue}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-1 text-neutral-800">
          <ChevronRightIcon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function NextOnCourtSection() {
  return (
    <section className="space-y-3">
      <h3 className="px-1 text-lg font-bold text-[var(--color-text)]">Next On Court</h3>

      {upcomingMatches.map((match) => (
        <UpcomingCourtCard key={match.id} match={match} />
      ))}
    </section>
  );
}
