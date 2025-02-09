import { MiddlewareHandler } from "hono";
import { isHash, keccak256, type Hash } from "viem";
import { PaymentService } from "../services/paymentService";
import { VendorService } from "../services/vendorService";
import { ChannelService } from "../services/channelService";
import { PrismaClient } from "@prisma/client";
import { BlockchainService } from "../services/blockchainService";

const prisma = new PrismaClient();
const paymentService = new PaymentService(prisma);
const vendorService = new VendorService(prisma);
const blokchainService = new BlockchainService();
const channelService = new ChannelService(prisma, blokchainService);

export const paymentMiddleware: MiddlewareHandler = async (c, next) => {
  try {
    const xHash = c.req.header("x-hash");
    const xSmartContractAddress = c.req.header("x-smart-contract-address");

    // Log incoming request details
    console.log(`Incoming request x-hash: ${xHash || "not provided"}`);
    console.log(
      `Incoming request x-smart-contract-address: ${
        xSmartContractAddress || "not provided"
      }`
    );

    // Validate required headers
    if (!xHash || !xSmartContractAddress) {
      return c.json(
        {
          success: false,
          message:
            "Missing required headers: x-hash, x-smart-contract-address",
        },
        400
      );
    }


    // Validate and convert hash format
    if (!isHash(xHash)) {
      return c.json(
        {
          success: false,
          message: "Invalid hash format in x-hash header",
        },
        400
      );
    }

    // The hash is already validated by isHash, so we can safely cast it
    const normalizedHash = xHash as Hash;


    // Verify channel exists and belongs to vendor
    const channel = await channelService.findByContractAddress(
      xSmartContractAddress
    );
    
    if (!channel) {
      return c.json(
        {
          success: false,
          message: "Channel not found",
        },
        404
      );
    }

    // Verify vendor exists
    const vendor = await vendorService.findById(channel.vendor.id);
    if (!vendor) {
      return c.json(
        {
          success: false,
          message: "Vendor not found",
        },
        404
      );
    }

    // Create payment using normalized hash
    const result = await paymentService.create({
      xHash: normalizedHash,
      amount: vendor.amountPerHash,
      index: channel.lastIndex + 1,
      contractAddress: xSmartContractAddress,
      vendorId: channel.vendorId,
    });

    if (!result.success) {
      return c.json(
        {
          success: false,
          message: result.message,
        },
        400
      );
    }

    await next();
  } catch (error) {
    console.error("Payment middleware error:", error);
    return c.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      500
    );
  }
};

// Optional: Export a type for the enhanced context
declare module "hono" {
  interface ContextVariableMap {
    payment: {
      id: string;
      xHash: Hash;
      amount: number;
      index: number;
      channelId: string;
      vendorId: string;
      createdAt: string;
      updatedAt: string;
      channel: {
        id: string;
        contractAddress: `0x${string}`;
        numHashes: number;
        lastIndex: number;
        tail: Hash;
        totalAmount: number;
        vendorId: string;
        createdAt: string;
        updatedAt: string;
      };
      vendor: {
        id: string;
        chainId: number;
        address: `0x${string}`;
        amountPerHash: number;
        createdAt: string;
        updatedAt: string;
      };
    };
  }
}
