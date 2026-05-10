"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import TournamentWizard from "@/components/Wizard/TournamentWizard";
import { tournamentApi } from "@/lib/api/tournamentApi";
import { storageApi } from "@/lib/api/storageApi";
import type { TournamentFormData } from "@/lib/validators/tournamentSchema";
import type { TournamentData, EventData, TournamentState } from "@/lib/models";

function normalizePhone(value: string) {
  let clean = value.replace(/\D/g, "");
  if (clean.length > 10) {
    if (clean.length === 12 && clean.startsWith("91")) {
      clean = clean.slice(-10);
    } else if (clean.length === 11 && clean.startsWith("0")) {
      clean = clean.slice(-10);
    }
  }
  return clean;
}

// These are now passthrough because the Wizard uses backend codes directly
function mapSportCode(value: string) {
  return value;
}

function mapFormatCode(value: string) {
  return value;
}

function mapGender(value: string): "male" | "female" | null {
  if (value === "male" || value === "female") return value;
  return null;
}

function mapTeamTypeCode(value: string) {
  return value;
}

function mapPaymentModeCode(value: string | null | undefined, isFree: boolean) {
  if (isFree) return null;
  return value || null;
}

function mapSetsPerMatch(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

export default function CreateOrgTournamentPage() {
  const router = useRouter();
  const { activeOrganization } = useApp();
  const activeOrgId = activeOrganization?.id ?? null;
  const [isPublishing, setIsPublishing] = useState(false);

  const handleComplete = async (
    tournament: TournamentFormData,
    state: "created" | "draft",
  ) => {
    if (!activeOrgId) {
      alert("No active organization selected.");
      return;
    }

    try {
      setIsPublishing(true);

      // 1. Create the tournament
      const tournamentData: TournamentData = {
        organizationId: activeOrgId,
        name: tournament.name,
        description: tournament.description || "",
        startDate: tournament.startDate,
        endDate: tournament.endDate || null,
        venueName: tournament.venueName,
        venueAddress: tournament.addressLine || "",
        venueCity: tournament.city,
        venueState: tournament.state,
        venuePostalCode: tournament.zipCode,
        venueCourts: tournament.numCourts,
        contactName: tournament.organizerName,
        contactEmail: tournament.organizerEmail,
        contactPhone: normalizePhone(tournament.organizerPhone),
        upiId: tournament.upiId || null,
        tournamentState: "drafted",
      };

      const tournamentId = await tournamentApi.createTournament(tournamentData);

      // 2. Upload logo if provided
      if (tournament.logo && tournament.logo instanceof File) {
        await storageApi.uploadTournamentLogo(tournament.logo, tournamentId);
      }

      // 3. Create events
      if (tournament.events.length > 0) {
        const eventsData: EventData[] = tournament.events.map((event) => ({
          tournamentId,
          name: event.name.trim(),
          sportsOptionCode: mapSportCode(event.sport),
          eventFormatCode: mapFormatCode(event.format),
          dueDate: event.regDueDate,
          startDate: event.startDate,
          gender: mapGender(event.gender),
          teamTypeCode: mapTeamTypeCode(event.partType),
          setsPerMatch: mapSetsPerMatch(event.sets),
          pointsPerSet: Number(event.points || 0),
          playerBornAfter: event.ageRestricted || null,
          paymentModeCode: mapPaymentModeCode(
            event.paymentOption,
            event.isFree,
          ),
          amount: event.isFree ? 0 : Number(event.fee || 0),
          eventState: "created" as const,
          activeRound: 0,
        }));

        await tournamentApi.createEvents(eventsData);
      }

      // 4. Publish if requested
      if (state === "created") {
        await tournamentApi.updateTournamentState(tournamentId, "published");
      }

      router.push("/org/tournaments");
    } catch (error) {
      console.error("Failed to create tournament", error);
      alert(
        error instanceof Error ? error.message : "Failed to create tournament.",
      );
      setIsPublishing(false);
    }
  };

  const handleClose = () => {
    router.push("/org/tournaments");
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <TournamentWizard
        isPublishing={isPublishing}
        onComplete={handleComplete}
        onClose={handleClose}
      />
    </div>
  );
}
