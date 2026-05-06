"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useAppSession } from "@/components/AppSessionProvider";
import TournamentWizard from "@/components/Wizard/TournamentWizard";

type TournamentFormData = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  logo: File | null;
  venueName: string;
  city: string;
  state: string;
  addressLine: string;
  zipCode: string;
  numCourts: number;
  organizerName: string;
  organizerPhone: string;
  organizerEmail: string;
  events: Array<{
    name: string;
    sport: string;
    format: string;
    regDueDate: string;
    startDate: string;
    gender: string;
    partType: string;
    sets: string;
    points: string;
    ageRestricted: string;
    isFree: boolean;
    paymentOption: string;
    upiId: string;
    fee: string;
  }>;
};

type ApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
};

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function mapSportCode(value: string) {
  const codes: Record<string, string> = {
    Pickleball: "pickleball",
    Tennis: "tennis",
    Badminton: "badminton",
    Padel: "padel",
  };
  return codes[value] ?? value.toLowerCase();
}

function mapFormatCode(value: string) {
  const codes: Record<string, string> = {
    Knockout: "single-elimination",
    "Round Robin": "round-robin",
    League: "league",
    "Groups + Knockout": "groups-knockout",
  };
  return codes[value] ?? value.toLowerCase().replace(/\s+/g, "-");
}

function mapGender(value: string): "male" | "female" | null {
  if (value === "Men's") return "male";
  if (value === "Women's") return "female";
  return null;
}

function mapTeamTypeCode(value: string) {
  return value.toLowerCase();
}

function mapPaymentModeCode(value: string, isFree: boolean) {
  if (isFree) return null;
  if (value === "Pay online (UPI)") return "pay-online";
  if (value === "Pay at venue") return "pay-at-venue";
  return value || null;
}

function mapSetsPerMatch(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

export default function CreateOrgTournamentPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { activeOrgId, organization } = useAppSession();
  const [isPublishing, setIsPublishing] = useState(false);

  const handleComplete = async (tournament: TournamentFormData) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const organizationId =
      activeOrgId ||
      (typeof organization?.id === "string" ? organization.id : null);

    if (!apiBaseUrl) {
      alert("Tournament service is not configured.");
      return;
    }

    if (!session?.access_token) {
      alert("Please sign in again before publishing.");
      return;
    }

    if (!organizationId) {
      alert("No active organization selected.");
      return;
    }

    try {
      setIsPublishing(true);
      const onlinePaymentEvent = tournament.events.find(
        (event) => !event.isFree && event.paymentOption === "Pay online (UPI)",
      );

      const tournamentResponse = await fetch(`${apiBaseUrl}/tournament/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          organizationId,
          name: tournament.name.trim(),
          description: tournament.description.trim(),
          startDate: tournament.startDate,
          endDate: tournament.endDate || undefined,
          venueName: tournament.venueName.trim(),
          venueAddress: tournament.addressLine.trim(),
          venueCity: tournament.city.trim(),
          venueState: tournament.state.trim(),
          venuePostalCode: tournament.zipCode.trim(),
          venueCourts: Number(tournament.numCourts),
          contactName: tournament.organizerName.trim(),
          contactEmail: tournament.organizerEmail.trim(),
          contactPhone: normalizePhone(tournament.organizerPhone),
          upiId: onlinePaymentEvent?.upiId?.trim() || null,
        }),
      });

      const tournamentJson =
        (await tournamentResponse.json().catch(() => null)) as
          | ApiResponse<string>
          | null;

      if (!tournamentResponse.ok || !tournamentJson?.success || !tournamentJson.data) {
        throw new Error(tournamentJson?.message || "Tournament creation failed.");
      }

      const tournamentId = tournamentJson.data;

      if (tournament.logo) {
        const logoForm = new FormData();
        logoForm.append("image", tournament.logo);

        const uploadResponse = await fetch(
          `${apiBaseUrl}/storage/upload/tournament/${tournamentId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: logoForm,
          },
        );
        const uploadJson =
          (await uploadResponse.json().catch(() => null)) as ApiResponse | null;

        if (!uploadResponse.ok || uploadJson?.success === false) {
          throw new Error(uploadJson?.message || "Tournament logo upload failed.");
        }
      }

      if (tournament.events.length > 0) {
        const eventsResponse = await fetch(
          `${apiBaseUrl}/tournament/events/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify(
              tournament.events.map((event) => ({
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
              })),
            ),
          },
        );

        const eventsJson =
          (await eventsResponse.json().catch(() => null)) as ApiResponse | null;

        if (!eventsResponse.ok || eventsJson?.success === false) {
          throw new Error(eventsJson?.message || "Tournament events creation failed.");
        }
      }

      router.push("/org/tournaments");
    } catch (error) {
      console.error("Failed to publish tournament", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to publish tournament.",
      );
      setIsPublishing(false);
    }
  };

  const handleClose = () => {
    // Redirect back if the user clicks the "X" button
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
