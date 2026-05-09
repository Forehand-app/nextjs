import { z } from "zod";

export const eventSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(2, "Event name is too short")
    .max(100, "Event name is too long"),
  sport: z.string().min(1, "Please select a sport"),
  format: z.string().min(1, "Please select a format"),
  regDueDate: z.string().min(1, "Registration due date is required"),
  startDate: z.string().min(1, "Event start date is required"),
  gender: z.string().min(1, "Please select gender"),
  partType: z.string().min(1, "Please select participation type"),
  sets: z.string().min(1, "Please select sets per match"),
  points: z.string().min(1, "Please select points per set"),
  ageRestricted: z.string().optional().nullable(),
  isFree: z.boolean().default(true),
  paymentOption: z.string().optional().nullable(),
  fee: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || "0"),
});

export const tournamentBaseSchema = z.object({
  // Step 1
  name: z
    .string()
    .min(3, "Tournament name must be at least 3 characters")
    .max(100),
  description: z.string().max(1000).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  logo: z.any().optional().nullable(), // File object

  // Step 2
  venueName: z.string().min(2, "Venue name is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  addressLine: z.string().min(5, "Full address is required"),
  zipCode: z.string().regex(/^\d{6}$/, "Zip code must be 6 digits"),
  numCourts: z.number().min(1, "At least 1 court is required"),
  organizerName: z.string().min(2, "Organizer name is required"),
  organizerPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  organizerEmail: z.string().email("Invalid email address"),
  upiId: z.string().optional().nullable(),

  // Step 3
  events: z.array(eventSchema).min(1, "At least one event is required"),
});

export const tournamentFormSchema = tournamentBaseSchema
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "Tournament end date must be after start date",
      path: ["endDate"],
    },
  )
  .superRefine((data, ctx) => {
    // Cross-event date validation and UPI validation
    data.events.forEach((event, index) => {
      // 1. regDueDate < event.startDate
      if (event.regDueDate && event.startDate) {
        if (new Date(event.regDueDate) > new Date(event.startDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Registration due date must be before event start date",
            path: ["events", index, "regDueDate"],
          });
        }
      }

      // 2. event.startDate must be within tournament range (optional but good)
      if (event.startDate && data.startDate) {
        if (new Date(event.startDate) < new Date(data.startDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Event cannot start before tournament starts",
            path: ["events", index, "startDate"],
          });
        }
      }

      if (data.endDate && event.startDate) {
        if (new Date(event.startDate) > new Date(data.endDate)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Event cannot start after tournament ends",
            path: ["events", index, "startDate"],
          });
        }
      }

      // 3. UPI validation
      if (!event.isFree && event.paymentOption === "Pay online (UPI)") {
        if (!data.upiId || data.upiId.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "No UPI ID provided previously. Please add one in Step 2 to use online payment.",
            path: ["events", index, "paymentOption"],
          });
        }
      }

      if (!event.isFree && (!event.fee || Number(event.fee) <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Entry fee must be greater than 0 for paid events",
          path: ["events", index, "fee"],
        });
      }
    });
  });

export type TournamentFormData = z.infer<typeof tournamentFormSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
