import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { verifyHashChain } from "@/utils/HashChainUtils";
import { z } from "zod";
import {
  HashChainVerificationError,
  InvalidHashFormatError,
  InvalidHashIndexError,
  InvalidHashPositionError,
  InvalidPaywordHeaderError,
  InvalidUserHashChainError,
  MissingPaywordHeaderError,
  NegativeHashIndexError,
  UserNotAuthenticatedError,
  UserNotFoundError,
} from "@/errors";

const prisma = new PrismaClient();

const PaywordHeaderSchema = z.object({
  incomingHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  incomingHashIndex: z.number().int().nonnegative(),
});

const MostRecentPaywordSchema = z.object({
  mostRecentHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  mostRecentHashIndex: z.number().int().nonnegative(),
});

export const withPayword = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const customHeader = req.headers["payword-header"];
      if (!customHeader) throw new MissingPaywordHeaderError();

      const [incomingHash, incomingHashIndexHeader] = (
        customHeader as string
      ).split(":");
      const incomingHashIndex = parseInt(incomingHashIndexHeader);

      if (!incomingHash || isNaN(incomingHashIndex))
        throw new InvalidPaywordHeaderError();

      const validatedHeader = PaywordHeaderSchema.parse({
        incomingHash,
        incomingHashIndex,
      });

      const auth = getAuth(req);
      const userId = auth.userId;
      if (!userId) throw new UserNotAuthenticatedError();

      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
      });
      if (!user) throw new UserNotFoundError();

      const { mostRecentHash, mostRecentHashIndex } =
        MostRecentPaywordSchema.parse({
          mostRecentHash: user.mostRecentHash,
          mostRecentHashIndex: user.mostRecentHashIndex,
        });

      if (mostRecentHash === "" || mostRecentHashIndex === 0)
        throw new InvalidUserHashChainError();
      if (validatedHeader.incomingHashIndex === mostRecentHashIndex)
        throw new InvalidHashPositionError();

      const isValid = verifyHashChain(
        validatedHeader.incomingHash as `0x${string}`,
        validatedHeader.incomingHashIndex,
        mostRecentHash as `0x${string}`,
        mostRecentHashIndex
      );

      if (!isValid) throw new HashChainVerificationError("Invalid hash chain");

      await prisma.user.update({
        where: { clerkUserId: userId },
        data: {
          mostRecentHash: validatedHeader.incomingHash,
          mostRecentHashIndex: validatedHeader.incomingHashIndex,
        },
      });

      await handler(req, res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid Payword header" });
      }

      if (error instanceof Error) {
        switch (error.constructor) {
          case MissingPaywordHeaderError:
            return res.status(400).json({ error: "Missing payword header" });
          case InvalidPaywordHeaderError:
            return res
              .status(400)
              .json({ error: "Invalid payword header format" });
          case UserNotAuthenticatedError:
            return res.status(401).json({ error: "User not authenticated" });
          case InvalidUserHashChainError:
            return res.status(400).json({ error: "Invalid user hash chain" });
          case InvalidHashPositionError:
            return res.status(400).json({ error: "Invalid hash position" });
          case InvalidHashIndexError:
            return res.status(400).json({
              error: "Provided hash index must be less than target hash index",
            });
          case NegativeHashIndexError:
            return res
              .status(400)
              .json({ error: "Hash indices must be non-negative" });
          case InvalidHashFormatError:
            return res
              .status(400)
              .json({ error: "Hashes must be in 0x-prefixed hex format" });
          case HashChainVerificationError:
            return res.status(400).json({ error: error.message });
          case UserNotFoundError:
            return res.status(404).json({ error: "User not found" });
          default:
            console.error("Unhandled error in payword middleware:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};
