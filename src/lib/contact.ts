import { z } from "zod";

export const projectTypes = [
  "Editorial",
  "Campaign",
  "Portrait",
  "Travel & landscape",
  "Print or licensing",
  "Something else",
] as const;

export const budgetOptions = [
  "Under €2,500",
  "€2,500–€5,000",
  "€5,000–€10,000",
  "€10,000+",
  "Let's discuss",
] as const;

export const contactLimits = {
  name: 100,
  email: 254,
  message: 4000,
} as const;

export const contactSchema = z.strictObject({
  name: z.string().trim().min(2, "Enter your name.").max(contactLimits.name),
  email: z.string().trim().max(contactLimits.email).pipe(z.email("Enter a valid email address.")),
  projectType: z.string().refine(
    (value) => projectTypes.some((project) => project === value),
    "Choose a project type.",
  ),
  budget: z.union([z.enum(budgetOptions), z.literal("")]).optional(),
  message: z.string().trim().min(10, "Tell me a little more about the project.").max(contactLimits.message),
  website: z.string().max(1024).optional(),
});

export type ContactValues = z.input<typeof contactSchema>;
