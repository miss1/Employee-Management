import * as z from "zod";

export const parseToken = <T>(token: string): T | null => {
  if (token) {
    try {
      const tokenParts = token.split('.');
      const encodedPayload = tokenParts[1];
      const decodedPayload = atob(encodedPayload);
      return JSON.parse(decodedPayload) as T;
    } catch (e) {
      console.error(String(e));
      return null;
    }
  }
  return null;
};

export const getCurrentOnboardingStep = (): number => {
  const status = localStorage.getItem('onboarding') || 'never';
  const all = ['never', 'pending', 'rejected'];
  return all.findIndex((item) => item === status);
};

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
  phone: z.string().regex(/^1?\s*\d{3}\s*-?\s*\d{3}\s*-?\s*\d{4}$/, { message: "Invalid US phone number"}).optional(),
  email: z.string().email("Invalid email address").optional(),
  relationship: z.string().optional(),
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
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, {message: "Invalid US postal code"}),
  cellPhone: z.string().regex(/^1?\s*\d{3}\s*-?\s*\d{3}\s*-?\s*\d{4}$/, { message: "Invalid US phone number"}),
  workPhone: z.string()
    .regex(/^1?\s*\d{3}\s*-?\s*\d{3}\s*-?\s*\d{4}$/, { message: "Invalid US phone number"}).optional(),
  email: z.string().email("Invalid email address"),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, {message: "Invalid SSN"}),
  birthDate: z.string().min(1, { message: "Required" }),
  gender: z.string().min(1, { message: "Required" }),
  workAuth: z.string().min(1, { message: "Required" }),
  workAuthOther: z.string(),
  workAuthStart: z.string().min(1, { message: "Required" }),
  workAuthEnd: z.string().min(1, { message: "Required" }),
  reference: personSchema,
  emergencyContacts: z.array(personSchema),
});
