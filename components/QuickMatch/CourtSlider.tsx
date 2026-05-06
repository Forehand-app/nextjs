"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Info, RotateCcw, X } from "lucide-react";

interface CourtSliderProps {
  onBack: () => void;
  onStart: (payload: {
    courtId: string;
    format: "singles" | "doubles";
    scoring: "sideout" | "rally";
    bestOf: 3 | 5;
    points: 11 | 15 | 21;
    winByTwo: boolean;
    initialServer: 1 | 2;
    players: Record<SlotId, string | null>;
  }) => void;
}

type SlotId = "leftTop" | "leftBottom" | "rightTop" | "rightBottom";

type MatchFormState = {
  doubles: boolean;
  initialServer: 1 | 2;
  scoringSystem: "sideout" | "rally";
  bestOf: "3" | "5";
  pointsToWin: "11" | "15" | "21";
  timeoutPerSet: boolean;
  winByTwo: boolean;
  warmup: boolean;
  serveRotation: "set" | "point" | "none";
};

const SLOT_ORDER: SlotId[] = ["leftTop", "leftBottom", "rightTop", "rightBottom"];

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function SelectLine({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-[10px] border border-[#DCDCDC] bg-[#F7F7F7] px-3 text-[12px] text-[#3C3C3C] outline-none dark:border-[#67588B] dark:bg-[#5A467E] dark:text-white/90"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
  );
}

function CheckLine({
  text,
  checked,
  onChange,
}: {
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex h-10 w-full items-center justify-between rounded-[10px] border border-[#E1E1E1] bg-[#F7F7F7] px-3 text-[12px] text-[#3C3C3C] dark:border-[#67588B] dark:bg-[#5A467E] dark:text-white/90"
    >
      <span>{text}</span>
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center rounded-[2px] border ${
          checked
            ? "border-[#FF7A1A] bg-[#FF7A1A] text-white"
            : "border-[#BDBDBD] dark:border-white/50"
        }`}
      >
        {checked && <Check size={10} />}
      </span>
    </button>
  );
}

export default function CourtSlider({ onBack, onStart }: CourtSliderProps) {
  const [form, setForm] = useState<MatchFormState>({
    doubles: false,
    initialServer: 1,
    scoringSystem: "sideout",
    bestOf: "3",
    pointsToWin: "11",
    timeoutPerSet: true,
    winByTwo: true,
    warmup: false,
    serveRotation: "set",
  });

  const [slots, setSlots] = useState<Record<SlotId, string | null>>({
    leftTop: null,
    leftBottom: null,
    rightTop: null,
    rightBottom: null,
  });
const handleRef = useRef<HTMLSpanElement>(null);

  const [pickerSlot, setPickerSlot] = useState<SlotId | null>(null);
  const [playerDraft, setPlayerDraft] = useState("");

  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxDrag, setMaxDrag] = useState(180);

  useEffect(() => {
  const update = () => {
    const trackWidth = trackRef.current?.offsetWidth ?? 240;
    const handleWidth = handleRef.current?.offsetWidth ?? 36;

    setMaxDrag(Math.max(0, trackWidth - handleWidth - 6));
  };

  update();
  window.addEventListener("resize", update);
  return () => window.removeEventListener("resize", update);
}, []);

  const visibleSlots = form.doubles
    ? SLOT_ORDER
    : (["leftTop", "rightBottom"] as SlotId[]);

  const canStart = visibleSlots.every((slot) => Boolean(slots[slot]));

  const handleReset = () => {
    setForm((previous) => ({ ...previous, doubles: false, initialServer: 1, scoringSystem: "sideout", bestOf: "3", pointsToWin: "11", timeoutPerSet: true, winByTwo: true, warmup: false, serveRotation: "set" }));
    setSlots({ leftTop: null, leftBottom: null, rightTop: null, rightBottom: null });
    x.set(0);
  };

  const handleSwipeEnd = () => {
    const current = x.get();
    if (current >= maxDrag - 6 && canStart) {
      animate(x, maxDrag, { duration: 0.15 });
      window.setTimeout(() => {
        onStart({
          courtId: form.doubles ? "c2" : "c1",
          format: form.doubles ? "doubles" : "singles",
          scoring: form.scoringSystem,
          bestOf: Number(form.bestOf) as 3 | 5,
          points: Number(form.pointsToWin) as 11 | 15 | 21,
          winByTwo: form.winByTwo,
          initialServer: form.initialServer,
          players: slots,
        });
        x.set(0);
      }, 170);
      return;
    }
    animate(x, 0, { type: "spring", stiffness: 360, damping: 24 });
  };

  const handleOpenPlayerPrompt = (slot: SlotId) => {
    setPickerSlot(slot);
    setPlayerDraft(slots[slot] ?? "");
  };

  const handleSavePlayer = () => {
    if (!pickerSlot) return;
    const trimmed = playerDraft.trim();
    if (!trimmed) return;
    setSlots((previous) => ({ ...previous, [pickerSlot]: trimmed }));
    setPickerSlot(null);
    setPlayerDraft("");
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[390px] px-4 pb-4 pt-3 text-[#262626] dark:text-white">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={onBack} className="h-8 w-8" aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-[22px] font-semibold leading-none">Match Setup</h2>
          <button type="button" onClick={handleReset} className="h-8 w-8 text-[#FF7A1A]" aria-label="Reset">
            <RotateCcw size={18} />
          </button>
        </div>

        <section className="mb-4">
          <p className="mb-2 text-[13px] font-semibold">Select Player Sides</p>
          <div className="grid h-8 grid-cols-2 rounded-[9px] border border-[#DEDEDE] p-0.5 dark:border-[#695A8F] dark:bg-[#4D3B75]">
            <button
              type="button"
              onClick={() => setForm((previous) => ({ ...previous, doubles: false }))}
              className={`rounded-[7px] text-[11px] ${
                !form.doubles
                  ? "bg-[#EFEFEF] text-[#1D1D1D] dark:bg-[#5A467E] dark:text-white"
                  : "text-[#888888] dark:text-white/70"
              }`}
            >
              Singles
            </button>
            <button
              type="button"
              onClick={() => setForm((previous) => ({ ...previous, doubles: true }))}
              className={`rounded-[7px] text-[11px] ${
                form.doubles
                  ? "bg-[#EFEFEF] text-[#1D1D1D] dark:bg-[#5A467E] dark:text-white"
                  : "text-[#888888] dark:text-white/70"
              }`}
            >
              Doubles
            </button>
          </div>

          <div className="relative mt-2 h-[150px] w-full border-2 border-white/95 bg-[#2EC15B]">
            <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white/95" />
            <span className="absolute inset-y-0 left-[34%] w-[2px] -translate-x-1/2 bg-white/75" />
            <span className="absolute inset-y-0 left-[66%] w-[2px] -translate-x-1/2 bg-white/75" />
            <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/95" />
            <span className="absolute left-0 top-1/4 h-[2px] w-[23%] bg-white/95" />
            <span className="absolute right-0 top-1/4 h-[2px] w-[23%] bg-white/95" />
            <span className="absolute left-0 top-3/4 h-[2px] w-[23%] -translate-y-1/2 bg-white/95" />
            <span className="absolute right-0 top-3/4 h-[2px] w-[23%] -translate-y-1/2 bg-white/95" />

            {SLOT_ORDER.map((slot) => {
              if (!visibleSlots.includes(slot)) return null;
              const positionClass: Record<SlotId, string> = {
                leftTop: "left-[10%] top-[12%]",
                leftBottom: "left-[10%] top-[58%]",
                rightTop: "right-[10%] top-[12%]",
                rightBottom: "right-[10%] top-[58%]",
              };
              const name = slots[slot];
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => handleOpenPlayerPrompt(slot)}
                  className={`absolute ${positionClass[slot]} flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#1E1F23] text-[10px] font-bold text-white shadow-md`}
                  title={name ?? "Assign player"}
                >
                  {name ? initialsFromName(name) : "+"}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center gap-1 text-[10px] text-[#666666] dark:text-white/70">
            <Info size={12} />
            <span>Side may switch during the match per rules.</span>
          </div>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-[13px] font-semibold">Initial Server</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setForm((previous) => ({ ...previous, initialServer: 1 }))}
              className={`h-10 rounded-full border px-3 text-[12px] font-medium ${
                form.initialServer === 1
                  ? "border-[#DDDDDD] bg-[#F6F6F6] text-[#292929] dark:border-[#6D5A94] dark:bg-[#5A467E] dark:text-white"
                  : "border-[#DFDFDF] bg-[#F6F6F6] text-[#747474] dark:border-[#68578D] dark:bg-transparent dark:text-white/86"
              }`}
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#FF7A1A] align-middle" />
              Player 1
            </button>
            <button
              type="button"
              onClick={() => setForm((previous) => ({ ...previous, initialServer: 2 }))}
              className={`h-10 rounded-full border px-3 text-[12px] font-medium ${
                form.initialServer === 2
                  ? "border-[#DDDDDD] bg-[#F6F6F6] text-[#292929] dark:border-[#6D5A94] dark:bg-[#5A467E] dark:text-white"
                  : "border-[#DFDFDF] bg-[#F6F6F6] text-[#747474] dark:border-[#68578D] dark:bg-transparent dark:text-white/86"
              }`}
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full border border-current align-middle" />
              Player 2
            </button>
          </div>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-[13px] font-semibold">Scoring System</h3>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setForm((previous) => ({ ...previous, scoringSystem: "sideout" }))}
              className={`h-10 rounded-full border px-3 text-[12px] font-medium ${
                form.scoringSystem === "sideout"
                  ? "border-[#DDDDDD] bg-[#F6F6F6] text-[#292929] dark:border-[#6D5A94] dark:bg-[#5A467E] dark:text-white"
                  : "border-[#DFDFDF] bg-[#F6F6F6] text-[#747474] dark:border-[#68578D] dark:bg-transparent dark:text-white/86"
              }`}
            >
              Side-out Scoring
            </button>
            <button
              type="button"
              onClick={() => setForm((previous) => ({ ...previous, scoringSystem: "rally" }))}
              className={`h-10 rounded-full border px-3 text-[12px] font-medium ${
                form.scoringSystem === "rally"
                  ? "border-[#DDDDDD] bg-[#F6F6F6] text-[#292929] dark:border-[#6D5A94] dark:bg-[#5A467E] dark:text-white"
                  : "border-[#DFDFDF] bg-[#F6F6F6] text-[#747474] dark:border-[#68578D] dark:bg-transparent dark:text-white/86"
              }`}
            >
              Rally Scoring
            </button>
          </div>
        </section>

        <section className="mb-4">
          <h3 className="mb-2 text-[22px] font-semibold leading-none tracking-tight">Match Format</h3>
          <div className="rounded-2xl border border-[#E9E9E9] p-2 dark:border-[#655588] dark:bg-[#4D3B75]">
            <SelectLine
              value={form.bestOf}
              onChange={(value) => setForm((previous) => ({ ...previous, bestOf: value as MatchFormState["bestOf"] }))}
              options={[
                { label: "Best of 3", value: "3" },
                { label: "Best of 5", value: "5" },
              ]}
            />
            <div className="mt-2">
              <SelectLine
                value={form.pointsToWin}
                onChange={(value) => setForm((previous) => ({ ...previous, pointsToWin: value as MatchFormState["pointsToWin"] }))}
                options={[
                  { label: "11 points to win", value: "11" },
                  { label: "15 points to win", value: "15" },
                  { label: "21 points to win", value: "21" },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[22px] font-semibold leading-none tracking-tight">Time out Rules</h3>
            <ChevronDown size={18} />
          </div>
          <div className="rounded-2xl border border-[#E9E9E9] p-2 dark:border-[#655588] dark:bg-[#4D3B75]">
            <CheckLine
              text="1 Timeout per set"
              checked={form.timeoutPerSet}
              onChange={(checked) => setForm((previous) => ({ ...previous, timeoutPerSet: checked }))}
            />
            <div className="mt-2">
              <CheckLine
                text="Win by 2 points"
                checked={form.winByTwo}
                onChange={(checked) => setForm((previous) => ({ ...previous, winByTwo: checked }))}
              />
            </div>
            <p className="mt-2 text-[11px] font-semibold">Warm-up Time</p>
            <div className="mt-1.5">
              <CheckLine
                text="No warm-up"
                checked={!form.warmup}
                onChange={(checked) => setForm((previous) => ({ ...previous, warmup: !checked }))}
              />
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="mb-2 text-[22px] font-semibold leading-none tracking-tight">Serve Rotation</h3>
          <SelectLine
            value={form.serveRotation}
            onChange={(value) => setForm((previous) => ({ ...previous, serveRotation: value as MatchFormState["serveRotation"] }))}
            options={[
              { label: "Switch side every set", value: "set" },
              { label: "Switch side every point", value: "point" },
              { label: "No switch", value: "none" },
            ]}
          />
        </section>

        <div
          ref={trackRef}
          className="relative flex h-14 w-full items-center overflow-hidden rounded-full bg-[#FF7A1A] px-2 text-white shadow-[0_10px_22px_rgba(255,122,26,0.28)]"
        >
          <motion.span
            ref={handleRef}
            drag="x"
            dragConstraints={{ left: 0, right: maxDrag }}
            dragElastic={0}
            dragMomentum={false}
            style={{ x }}
            onDragEnd={handleSwipeEnd}
            className="z-10 flex h-10 w-10 cursor-grab items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(120,49,0,0.22)] active:cursor-grabbing"
          >
            <ArrowRight className="text-[#FF7A1A]" size={18} />
          </motion.span>

          <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-14 text-center text-[15px] font-bold">
            {canStart ? "Swipe to start match" : "Enter players to start"}
          </span>
        </div>
      </div>

      {pickerSlot && (
        <div
          className="fixed inset-0 z-[240] bg-black/45 backdrop-blur-[2px]"
          onClick={() => setPickerSlot(null)}
        >
          <div
            className="absolute inset-x-4 bottom-4 mx-auto max-w-[390px] rounded-2xl border border-white/15 bg-white p-3 dark:bg-[#4A3872]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[#222] dark:text-white">Enter Player Name</h4>
              <button type="button" onClick={() => setPickerSlot(null)} className="h-7 w-7">
                <X size={16} />
              </button>
            </div>

            <input
              value={playerDraft}
              onChange={(event) => setPlayerDraft(event.target.value)}
              placeholder="Type player name"
              className="h-11 w-full rounded-xl border border-[#E6E6E6] px-3 text-sm outline-none dark:border-white/20 dark:bg-[#5A467E] dark:text-white"
              autoFocus
            />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSlots((previous) => ({ ...previous, [pickerSlot]: null }));
                  setPickerSlot(null);
                  setPlayerDraft("");
                }}
                className="rounded-xl border border-[#E6E6E6] px-3 py-2.5 text-sm text-[#6C6C6C] dark:border-white/20 dark:text-white/80"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleSavePlayer}
                className="rounded-xl bg-[#FF7A1A] px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                disabled={!playerDraft.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

