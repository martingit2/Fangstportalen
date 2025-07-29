import { z } from 'zod';

export const invitasjonSchema = z.object({
    email: z.string().email("Ugyldig e-postadresse."),
    roller: z.array(z.string()).min(1, "Brukeren må ha minst én rolle."),
});

export type InvitasjonFormData = z.infer<typeof invitasjonSchema>;