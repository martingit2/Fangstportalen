import { z } from 'zod';

const numberString = z.string()
    .min(1, { message: 'Feltet er påkrevd.' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: 'Må være et gyldig positivt tall.',
    });

const timeString = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Ugyldig tid. Bruk HH:MM format.' });

export const ordrelinjeSchema = z.object({
    fiskeslag: z.string().min(1, { message: 'Fiskeslag er påkrevd.' }),
    kvalitet: z.string().optional(),
    storrelse: z.string().optional(),
    avtaltPrisPerKg: numberString,
    forventetKvantum: numberString,
});

export const ordreSchema = z.object({
    leveringssted: z.string().min(1, { message: 'Leveringssted er påkrevd.' }),
    forventetLeveringsdato: z.string().min(1, { message: 'Leveringsdato er påkrevd.' }),
    forventetLeveringstidFra: timeString,
    forventetLeveringstidTil: timeString,
    ordrelinjer: z.array(ordrelinjeSchema).min(1, { message: 'En ordre må ha minst én ordrelinje.' }),
}).refine(data => data.forventetLeveringstidFra < data.forventetLeveringstidTil, {
    message: "Starttid må være før sluttid.",
    path: ["forventetLeveringstidFra"],
});

export type OrdreFormData = z.infer<typeof ordreSchema>;