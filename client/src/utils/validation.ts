import * as z from "zod";

const phoneRegex = /^1?\s*\d{3}\s*-?\s*\d{3}\s*-?\s*\d{4}$/;
const zipCodeRegex = /^\d{5}(-\d{4})?$/;
const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const personSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Required" })
    .max(10, { message: "FirstName should be less than 10 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Required" })
    .max(10, { message: "LastName should be less than 10 characters" }),
  middleName: z.string().optional(),
  phone: z.string().optional()
    .refine(val => !val || phoneRegex.test(val), {message: "Invalid US phone number"}),
  email: z.string().optional().refine(val => !val || emailRegex.test(val), {
    message: 'Invalid email address'
  }),
  relationship: z.string().min(1, { message: "Required" }),
});

export const addOnboardingSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Required" })
    .max(10, { message: "FirstName should be less than 10 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Required" })
    .max(10, { message: "LastName should be less than 10 characters" }),
  middleName: z.string().optional(),
  preferredName: z.string().optional(),
  addressLine: z
    .string()
    .min(1, { message: "Required" })
    .max(100, { message: "Address should be less than 100 characters" }),
  city: z
    .string()
    .min(1, { message: "Required" })
    .max(30, { message: "City should be less than 30 characters" }),
  state: z
    .string()
    .min(1, { message: "Required" })
    .max(30, { message: "State should be less than 30 characters" }),
  postalCode: z.string().regex(zipCodeRegex, {message: "Invalid US postal code"}),
  cellPhone: z.string().regex(phoneRegex, { message: "Invalid US phone number"}),
  workPhone: z.string().optional()
    .refine(val => !val || phoneRegex.test(val), {message: "Invalid US phone number"}),
  email: z.string().email("Invalid email address"),
  ssn: z.string().regex(ssnRegex, {message: "Invalid SSN"}),
  birthDate: z.object({}).required(),
  gender: z.string().min(1, { message: "Required" }),
  workAuth: z.string().min(1, { message: "Required" }),
  workAuthOther: z.string().optional(),
  reference: personSchema,
  emergencyContacts: z.array(personSchema),
}).refine(data => data.workAuth !== 'Other' || (data.workAuth === 'Other' && data.workAuthOther), {
  message: "Required",
  path: ["workAuthOther"],
});
