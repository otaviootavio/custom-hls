import { z } from "zod";

export const HashChainElementSchema = z.object({
  data: z.string(),
  index: z.number(),
});

export const HashObjectSchema = z.object({
  address_contract: z.string(),
  address_to: z.string(),
  length: z.number(),
  hashchain: z.array(z.string().regex(/^0x[a-fA-F0-9]+$/)),
  isValid: z.boolean(),
  key: z.string(),
  tail: z.string().regex(/^0x[a-fA-F0-9]+$/),
  secret: z.string(),
});

export const StorageDataSchema = z.object({
  selectedKey: z.string().optional(),
  hashChains: z.array(HashObjectSchema).optional(),
});

export const SecretLengthSchema = z.object({
  secret: z.string(),
  length: z.number(),
});

export const HashChainContextSchema = z.object({
  hashChainElements: z.array(HashChainElementSchema),
  h100: z.string(),
  fullHashChain: z.array(z.string()),
  secret: z.string(),
  length: z.number(),
  fetchHashChain: z.function().returns(z.promise(HashChainElementSchema)),
  sendH100Once: z.function().returns(z.promise(z.string())),
  fetchFullHashChain: z.function().returns(z.promise(z.array(z.string()))),
  fetchSecretLength: z.function().returns(z.promise(SecretLengthSchema)),
  fetchPaywordFromExtension: z.function().returns(
    z.promise(
      z.object({
        secret: z.string(),
        length: z.number(),
        tail: z.string(),
      })
    )
  ),
});
