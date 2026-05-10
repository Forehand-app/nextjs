import { literal, z } from "zod";
import { userApi } from "../api/userApi";

export const registrationSchema = z
  .object({
    name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name is too long")
      .trim(),
    contactNumber: z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        "Invalid phone number (10 digits starting with 6-9)",
      ),
    gender: z.enum(["male", "female"]),
    dob: z.string().min(1, "Date of birth is required"),
    playingHand: z.enum(["right", "left"]).optional(),
    primarySport: z.string().max(30, "Sport name is too long").optional(),
  })
  .superRefine(async (data, ctx) => {
    if (data.contactNumber && data.contactNumber.length >= 10) {
      // Basic format check to avoid unnecessary API calls
      const isFormatValid =
        /^[0-9+\-\s()]*$/.test(data.contactNumber) &&
        data.contactNumber.length <= 15;
      if (isFormatValid) {
        try {
          const isUnique = await userApi.validateContact(data.contactNumber);
          if (!isUnique) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["contactNumber"],
              message: "This contact number is already registered",
            });
          }
        } catch (err) {
          console.error("Uniqueness check failed:", err);
        }
      }
    }
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;
