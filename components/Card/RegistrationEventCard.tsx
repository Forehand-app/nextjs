"use client";

import React from "react";
import { CalendarIcon, PlusIcon } from "@/components/Icons";
import { EventData } from "@/lib/models";

interface RegistrationEventCardProps {
  event: EventData;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
  children?: React.ReactNode;
}

export default function RegistrationEventCard({
  event,
  isSelected,
  onSelect,
  onDeselect,
  children,
}: RegistrationEventCardProps) {
  const toggle = () => (isSelected ? onDeselect() : onSelect());

  return (
    <article className="rounded-2xl border border-border bg-surface p-3 text-text">
      <h3 className="text-lg font-semibold leading-6">{event.name}</h3>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
        <p className="flex items-center gap-1.5">
          <CalendarIcon size={12} className="text-primary" />
          Start Date: {event.startDate}
        </p>
        <p className="flex items-center gap-1.5">
          <CalendarIcon size={12} className="text-primary" />
          Reg. Closes: {event.dueDate ?? "-"}
        </p>
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-semibold leading-8 text-primary">
            {event.amount === 0 ? (
              "Free Entry"
            ) : (
              <>
                <span className="currency-inr">&#8377;</span>
                {event.amount ?? 0}
              </>
            )}
          </p>
          <p className="text-sm text-muted">
            Payment:{" "}
            {event.paymentMode?.label || event.paymentModeCode || "Venue"}
          </p>
        </div>

        <button
          type="button"
          onClick={toggle}
          className={`inline-flex h-9 min-w-[102px] items-center justify-center gap-1 rounded-full border px-4 text-base font-semibold transition-colors ${
            isSelected
              ? "border-primary bg-primary text-white"
              : "border-primary text-primary"
          }`}
        >
          {isSelected ? (
            "Added"
          ) : (
            <>
              <PlusIcon size={12} /> Add
            </>
          )}
        </button>
      </div>

      {children ? <div className="mt-3">{children}</div> : null}
    </article>
  );
}
