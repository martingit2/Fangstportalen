import { z } from 'zod';

const numberString = z.string()
    .min(1, { message: 'Feltet er påkrevd.' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: 'Må være et gyldig positivt tall.',
    });

export const ordrelinjeSchema = z.object({
    fiskeslag: z.string().min(1, { message: 'Fiskeslag er påkrevd.' }),
    kvalitet: z.string().optional(),
    storrelse: z.string().optional(),
    avtaltPrisPerKg: numberString,
    forventetKvantum: numberString,
});

export const ordreSchema = z.object({
    forventetLeveringsdato: z.string().min(1, { message: 'Leveringsdato er påkrevd.' }),
    ordrelinjer: z.array(ordrelinjeSchema).min(1, { message: 'En ordre må ha minst én ordrelinje.' }),
});

export type OrdreFormData = z.infer<typeof ordreSchema>;