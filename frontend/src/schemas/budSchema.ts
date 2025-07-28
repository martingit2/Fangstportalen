import { z } from 'zod';

const numberString = z.string()
    .min(1, { message: 'Pris er påkrevd.' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: 'Må være et gyldig positivt tall.',
    });

export const budLinjeSchema = z.object({
    fangstlinjeId: z.number(),
    budPrisPerKg: numberString,
});

export const budSchema = z.object({
    budLinjer: z.array(budLinjeSchema).min(1, "Du må gi bud på minst én linje."),
});

export type BudFormData = z.infer<typeof budSchema>;