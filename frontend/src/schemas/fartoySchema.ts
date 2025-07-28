import { z } from 'zod';

export const fartoySchema = z.object({
    navn: z.string().min(1, { message: 'Navn på fartøy er påkrevd.' }),
    fiskerimerke: z.string().min(1, { message: 'Fiskerimerke er påkrevd.' }),
    kallesignal: z.string().min(1, { message: 'Kallesignal er påkrevd.' }),
});

export type FartoyFormData = z.infer<typeof fartoySchema>;