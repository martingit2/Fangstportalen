import { z } from 'zod';

const numberString = z.string()
    .min(1, { message: 'Feltet er påkrevd.' })
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: 'Må være et gyldig positivt tall.',
    });

export const fangstlinjeSchema = z.object({
    fiskeslag: z.string().min(1, { message: 'Fiskeslag er påkrevd.' }),
    estimertKvantum: numberString,
    kvalitet: z.string().optional(),
    storrelse: z.string().optional(),
});

export const fangstmeldingSchema = z.object({
    fartoyNavn: z.string().min(1, { message: 'Fartøynavn er påkrevd.' }),
    leveringssted: z.string().min(1, { message: 'Leveringssted er påkrevd.' }),
    tilgjengeligFraDato: z.string().min(1, { message: 'Dato er påkrevd.' }),
    fangstlinjer: z.array(fangstlinjeSchema).min(1, { message: 'En fangstmelding må ha minst én fangstlinje.' }),
});

export type FangstmeldingFormData = z.infer<typeof fangstmeldingSchema>;