import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        DATABASE_URL: z.string().url(),
        DIRECT_URL: z.string().url(),
        CLERK_SECRET_KEY: z.string(),
        CLERK_WEBHOOK_SECRET: z.string(),
    },
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL,
        DIRECT_URL: process.env.DIRECT_URL,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
     * This is especially useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
