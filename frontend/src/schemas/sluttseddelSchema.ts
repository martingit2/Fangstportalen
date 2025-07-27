import { z } from 'zod';

export const sluttseddelSchema = z.object({
    landingsdato: z.string().min(1, { message: 'Landingsdato er påkrevd.' }),
    fartoyNavn: z.string().min(1, { message: 'Fartøynavn kan ikke være tomt.' }),
    leveringssted: z.string().min(1, { message: 'Leveringssted kan ikke være tomt.' }),
    fiskeslag: z.string().min(1, { message: 'Fiskeslag kan ikke være tomt.' }),
    kvantum: z.string()
        .min(1, { message: 'Kvantum er påkrevd.' })
        .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: 'Kvantum må være et gyldig positivt tall.',
        }),
});

export type SluttseddelFormData = z.infer<typeof sluttseddelSchema>;