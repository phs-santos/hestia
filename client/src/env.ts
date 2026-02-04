import { z } from "zod";

const envSchema = z.object({
    VITE_API_CLIENT_PORT: z.string().min(1),
    VITE_API_SERVER_PORT: z.string().min(1),
});

export const env = envSchema.parse(import.meta.env);
