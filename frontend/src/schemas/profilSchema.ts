import { z } from 'zod';

export const profilSchema = z.object({
    navn: z.string().min(2, "Navn er påkrevd"),
    tittel: z.string().optional(),
    telefonnummer: z.string().min(8, "Må være minst 8 siffer").optional().or(z.literal('')),
});

export type ProfilFormData = z.infer<typeof profilSchema>;