import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DATABASE: z.string().min(1),
    POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),
    CLERK_SECRET_KEY: z.string().min(1),
    NODE_ENV: z.enum(["development", "test", "production"]),
    VENDOR_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    VENDOR_CHAIN_ID: z.coerce.number().int().positive(),
  },
  runtimeEnv: {
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VENDOR_ADDRESS: process.env.NEXT_PUBLIC_VENDOR_ADDRESS,
    VENDOR_CHAIN_ID: process.env.NEXT_PUBLIC_VENDOR_CHAIN_ID,
  },
});
