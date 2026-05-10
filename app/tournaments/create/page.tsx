"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import TournamentWizard from "@/components/Wizard/TournamentWizard";
import type { TournamentData } from "@/lib/models";
import { tournamentApi } from "@/lib/api/tournamentApi";
import { storageApi } from "@/lib/api/storageApi";
import { useApp } from "@/components/AppProvider";
import { TournamentFormData } from "@/lib/validators/tournamentSchema";

export default function CreateTournamentPage() {
  const router = useRouter();
  const { activeOrganization } = useApp();
  const [isPublishing, setIsPublishing] = useState(false);

  const handleComplete = async (
    form: TournamentFormData,
    state: "created" | "draft",
  ) => {
    if (!activeOrganization?.id) {
      alert("Please select an organization first.");
      return;
    }

    try {
      setIsPublishing(true);

      const tournamentData: TournamentData = {
        organizationId: activeOrganization.id,
        name: form.name,
        description: form.description || "",
        startDate: form.startDate,
        endDate: form.endDate,
        venueName: form.venueName,
        venueAddress: form.addressLine,
        venueCity: form.city,
        venueState: form.state,
        venuePostalCode: form.zipCode,
        venueCourts: form.numCourts,
        contactName: form.organizerName,
        contactEmail: form.organizerEmail,
        contactPhone: form.organizerPhone,
        upiId: form.upiId,
        tournamentState: "drafted",
        events: form.events.map((e) => ({
          tournamentId: "",
          name: e.name,
          startDate: e.startDate,
          dueDate: e.regDueDate,
          sportsOptionCode: e.sport,
          eventFormatCode: e.format,
          gender: e.gender,
          teamTypeCode: e.partType,
          setsPerMatch: Number(e.sets),
          pointsPerSet: Number(e.points),
          paymentModeCode: e.paymentOption,
          amount: Number(e.fee),
        })),
      };

      const tournamentId = await tournamentApi.createTournament(tournamentData);

      if (form.logo instanceof File) {
        await storageApi.uploadTournamentLogo(form.logo, tournamentId);
      }

      if (state === "created") {
        await tournamentApi.publishTournament(tournamentId);
      }

      router.push("/org/tournaments");
    } catch (error) {
      console.error("Failed to create tournament", error);
      alert(
        error instanceof Error ? error.message : "Failed to create tournament",
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const handleClose = () => router.push("/org/tournaments");

  return (
    <Layout showBottomNav={false}>
      <TournamentWizard
        onComplete={handleComplete}
        onClose={handleClose}
        isPublishing={isPublishing}
      />
    </Layout>
  );
}
