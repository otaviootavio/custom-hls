import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_VENDOR_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    NEXT_PUBLIC_VENDOR_CHAIN_ID: z.coerce.number().int().positive(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_VENDOR_ADDRESS: process.env.NEXT_PUBLIC_VENDOR_ADDRESS,
    NEXT_PUBLIC_VENDOR_CHAIN_ID: process.env.NEXT_PUBLIC_VENDOR_CHAIN_ID,
  },
});
