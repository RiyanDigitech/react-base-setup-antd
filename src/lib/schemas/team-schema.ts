// src/lib/schemas/index.ts

import { z } from "zod";

// ... baaki saare schemas waise hi rahenge ...

export const teamSchema = z.object({
    name: z.string().min(3, { message: 'Team name must be at least 3 characters long.' }),
    pokemons: z
        .array(z.string())
        .min(1, { message: 'Please select at least one Pokémon.' })
        .max(6, { message: 'You can select a maximum of 6 Pokémon.' }),
});

// YEH LINE ADD KAREIN: Schema se TypeScript type banayein aur export karein
export type TeamFormData = z.infer<typeof teamSchema>;

export {
    // ... baaki saare schemas ...
    // teamSchema, // Aap chahein to isko yahan se hata sakte hain
};