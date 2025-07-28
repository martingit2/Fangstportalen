import { z } from 'zod';

const numberString = z.string()
    .min(1, { message: 'Pris er påkrevd.' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: 'Må være et gyldig positivt tall.',
    });

export const budSchema = z.object({
    budPrisPerKg: numberString,
});

export type BudFormData = z.infer<typeof budSchema>;