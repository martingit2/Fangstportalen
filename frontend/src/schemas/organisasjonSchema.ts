import { z } from 'zod';

export const organisasjonSchema = z.object({
    navn: z.string().min(2, "Navn er påkrevd"),
    telefonnummer: z.string().min(8, "Må være minst 8 siffer").optional().or(z.literal('')),
    adresse: z.string().min(2, "Adresse er påkrevd"),
    postnummer: z.string().regex(/^[0-9]{4}$/, "Må være 4 siffer"),
    poststed: z.string().min(2, "Poststed er påkrevd"),
});

export type OrganisasjonFormData = z.infer<typeof organisasjonSchema>;