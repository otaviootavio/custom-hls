import { z } from "zod";
import { isAddress, isHash } from "viem";

// Helper function to convert address to 0x prefixed string
const toHexAddress = (address: string): `0x${string}` => {
  return `0x${address.replace("0x", "")}` as `0x${string}`;
};

// Helper function to convert hash to 0x prefixed string
const toHexHash = (hash: string): `0x${string}` => {
  return `0x${hash.replace("0x", "")}` as `0x${string}`;
};

// Generic error response schema
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

// Base schemas
const PaginationResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  pages: z.number(),
});

// Vendor Schemas
export const VendorCreateRequestSchema = z.object({
  chainId: z.number().int().min(1).describe("Chain ID for the vendor"),
  address: z
    .string()
    .trim()
    .refine((addr) => isAddress(addr), {
      message: "Invalid Ethereum address",
    })
    .transform(toHexAddress)
    .describe("Ethereum address of the vendor"),
  amountPerHash: z.number().min(0).describe("Amount per hash in ETH"),
});

export const VendorUpdateRequestSchema = VendorCreateRequestSchema.partial();

export const VendorDataSchema = z.object({
  id: z.string().uuid(),
  chainId: z.number(),
  address: z.string().transform(toHexAddress),
  amountPerHash: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const VendorResponseSchema = z.object({
  success: z.literal(true),
  data: VendorDataSchema,
});

export const VendorListResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(VendorDataSchema),
  pagination: PaginationResponseSchema,
});

// Channel status enum
export const ChannelStatus = z.enum(["OPEN", "CLOSED"]);
export type ChannelStatus = z.infer<typeof ChannelStatus>;

// Channel Schemas
export const ChannelCreateRequestSchema = z.object({
  contractAddress: z
    .string()
    .trim()
    .refine((addr) => isAddress(addr), {
      message: "Invalid contract address",
    })
    .transform(toHexAddress)
    .describe("Contract address for the channel"),
  numHashes: z.number().int().min(1).describe("Number of hashes"),
  lastIndex: z.number().int().min(0).describe("Last index processed"),
  lastHash: z
    .string()
    .trim()
    .refine((hash) => isHash(hash), {
      message: "Invalid hash format",
    })
    .transform(toHexHash)
    .describe("Last hash processed"),
  totalAmount: z.number().min(0).describe("Total amount in ETH"),
  vendorId: z.string().uuid().describe("UUID of the associated vendor"),
});

export const ChannelUpdateRequestSchema = ChannelCreateRequestSchema.partial();

export const CloseChannelRequestSchema = z.object({
  settlementTx: z
    .string()
    .trim()
    .refine((hash) => isHash(hash), {
      message: "Invalid settlement transaction hash",
    })
    .transform(toHexHash)
    .optional()
    .describe("Optional settlement transaction hash"),
});

export const ChannelDataSchema = z.object({
  id: z.string().uuid(),
  contractAddress: z.string().transform(toHexAddress),
  numHashes: z.number(),
  lastIndex: z.number(),
  lastHash: z.string().transform(toHexHash),
  totalAmount: z.number(),
  vendorId: z.string(),
  status: ChannelStatus.default("OPEN"),
  closedAt: z.string().nullable(),
  settlementTx: z.string().transform(toHexHash).nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  vendor: VendorDataSchema,
});

export const ChannelResponseSchema = z.object({
  success: z.literal(true),
  data: ChannelDataSchema,
});

export const ChannelListResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(ChannelDataSchema),
  pagination: PaginationResponseSchema,
});

export const ChannelDeleteResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

// Type exports
export type VendorCreateRequest = z.infer<typeof VendorCreateRequestSchema>;
export type VendorUpdateRequest = z.infer<typeof VendorUpdateRequestSchema>;
export type VendorResponse = z.infer<typeof VendorResponseSchema>;
export type VendorListResponse = z.infer<typeof VendorListResponseSchema>;

export type ChannelCreateRequest = z.infer<typeof ChannelCreateRequestSchema>;
export type ChannelUpdateRequest = z.infer<typeof ChannelUpdateRequestSchema>;
export type CloseChannelRequest = z.infer<typeof CloseChannelRequestSchema>;
export type ChannelResponse = z.infer<typeof ChannelResponseSchema>;
export type ChannelListResponse = z.infer<typeof ChannelListResponseSchema>;
export type ChannelDeleteResponse = z.infer<typeof ChannelDeleteResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
