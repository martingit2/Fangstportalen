import { z } from 'zod';

export type OrgType = 'REDERI' | 'FISKEBRUK';

export const createOnboardingSchema = (orgType: OrgType) => z.object({
    navn: z.string().min(2, "Organisasjonsnavn er påkrevd"),
    organisasjonsnummer: z.string().regex(/^[0-9]{9}$/, "Organisasjonsnummer må være 9 siffer"),
    telefonnummer: z.string().min(8, "Telefonnummer må være minst 8 siffer").optional().or(z.literal('')),
    adresse: z.string().min(2, "Adresse er påkrevd"),
    postnummer: z.string().regex(/^[0-9]{4}$/, "Postnummer må være 4 siffer"),
    poststed: z.string().min(2, "Poststed er påkrevd"),
    adminNavn: z.string().min(2, "Ditt fulle navn er påkrevd"),
    adminTittel: z.string().optional(),
    adminTelefonnummer: z.string().min(8, "Ditt telefonnummer må være minst 8 siffer").optional().or(z.literal('')),
    fartoyNavn: z.string().optional(),
    fiskerimerke: z.string().optional(),
    kallesignal: z.string().optional(),
}).refine(data => {
    if (orgType === 'REDERI') {
        return data.fartoyNavn && data.fartoyNavn.length > 1 &&
               data.fiskerimerke && data.fiskerimerke.length > 1 &&
               data.kallesignal && data.kallesignal.length > 1;
    }
    return true;
}, {
    message: "Alle fartøyfelter er påkrevd for et rederi",
    path: ["fartoyNavn"],
});

export type OnboardingFormData = z.infer<ReturnType<typeof createOnboardingSchema>>;