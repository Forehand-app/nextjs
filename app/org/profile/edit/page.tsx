"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { useAppSession } from "@/components/AppSessionProvider";
import { ArrowLeftIcon } from "@/components/Icons";

export default function OrgProfileEditPage() {
  const router = useRouter();
  const { organization } = useAppSession();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    establishedYear: "",
  });
  const orgInitial = (formData.name || "O").trim().charAt(0).toUpperCase();

  useEffect(() => {
    setFormData({
      name: typeof organization?.name === "string" ? organization.name : "",
      description:
        typeof organization?.description === "string"
          ? organization.description
          : "",
      contactEmail:
        typeof organization?.contactEmail === "string"
          ? organization.contactEmail
          : "",
      contactPhone:
        typeof organization?.contactPhone === "string"
          ? organization.contactPhone
          : "",
      website:
        typeof organization?.website === "string" ? organization.website : "",
      address:
        typeof organization?.address === "string" ? organization.address : "",
      city: typeof organization?.city === "string" ? organization.city : "",
      state: typeof organization?.state === "string" ? organization.state : "",
      postalCode:
        typeof organization?.postalCode === "string"
          ? organization.postalCode
          : "",
      establishedYear:
        typeof organization?.establishedYear === "number"
          ? String(organization.establishedYear)
          : typeof organization?.establishedYear === "string"
            ? organization.establishedYear
            : "",
    });
  }, [organization]);

  return (
    <Layout showBottomNav={false} title="Edit Profile">
      <div className="p-4 space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] min-h-[44px] flex items-center gap-2"
          aria-label="Back"
        >
          <ArrowLeftIcon size={20} />
          <span className="font-medium">Back</span>
        </button>

        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
            {orgInitial}
          </div>
        </div>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            router.back();
          }}
        >
          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Organization Name</span>
            <input
              type="text"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          </label>

          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Description</span>
            <textarea
              value={formData.description}
              onChange={(event) =>
                setFormData({ ...formData, description: event.target.value })
              }
              rows={3}
              className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)] resize-none"
            />
          </label>

          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Contact Email</span>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(event) =>
                setFormData({ ...formData, contactEmail: event.target.value })
              }
              className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          </label>

          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Contact Phone</span>
            <input
              type="tel"
              value={formData.contactPhone}
              onChange={(event) =>
                setFormData({ ...formData, contactPhone: event.target.value })
              }
              className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          </label>

          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Website</span>
            <input
              type="url"
              value={formData.website}
              onChange={(event) =>
                setFormData({ ...formData, website: event.target.value })
              }
              className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          </label>

          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Established Year</span>
            <input
              type="text"
              value={formData.establishedYear}
              onChange={(event) =>
                setFormData({ ...formData, establishedYear: event.target.value })
              }
              className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          </label>

          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Address</span>
            <input
              type="text"
              value={formData.address}
              onChange={(event) =>
                setFormData({ ...formData, address: event.target.value })
              }
              className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm text-[var(--color-muted)]">City</span>
              <input
                type="text"
                value={formData.city}
                onChange={(event) =>
                  setFormData({ ...formData, city: event.target.value })
                }
                className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
              />
            </label>

            <label className="block">
              <span className="text-sm text-[var(--color-muted)]">State</span>
              <input
                type="text"
                value={formData.state}
                onChange={(event) =>
                  setFormData({ ...formData, state: event.target.value })
                }
                className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-[var(--color-muted)]">Postal Code</span>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(event) =>
                setFormData({ ...formData, postalCode: event.target.value })
              }
              className="mt-1 w-full p-3 rounded-[var(--radius-input)] border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          </label>

          <button
            type="submit"
            className="w-full min-h-[44px] rounded-[var(--radius-button)] bg-primary text-[var(--color-primary-contrast)] font-medium"
          >
            Continue
          </button>
        </form>
      </div>
    </Layout>
  );
}

