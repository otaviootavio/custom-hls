import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import keccak from "keccak";

const prisma = new PrismaClient();

const hashKeccak = (input: string): string => {
  return keccak("keccak256").update(Buffer.from(input, "hex")).digest("hex");
};

const verifyHashChain = (
  incomingHash: string,
  lastHash: string,
  chainSize: number,
  position: number
): boolean => {
  let currentHash = incomingHash;
  for (let i = position; i < chainSize; i++) {
    currentHash = hashKeccak(currentHash);
  }
  return currentHash === lastHash;
};

export const withPayword = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const customHeader = req.headers["payword-header"];
    const auth = getAuth(req);

    if (!customHeader) {
      res.status(403).json({ error: "Missing payword header" });
      return;
    }

    const [hash, position] = (customHeader as string).split(":");
    const positionNumber = parseInt(position);

    if (!hash || isNaN(positionNumber)) {
      res.status(403).json({ error: "Invalid payword header" });
      return;
    }

    const userId = auth.userId;

    if (!userId) {
      res.status(403).json({ error: "User not authenticated" });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          clerkUserId: userId,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const mostRecentHash = user.mostRecentHash ?? "";
      const mostRecentHashIndex = user.mostRecentHashIndex ?? 0;

      if (mostRecentHash === "" || mostRecentHashIndex === 0) {
        res.status(403).json({ error: "Invalid user hash chain" });
        return;
      }

      if (
        !verifyHashChain(
          hash,
          mostRecentHash,
          mostRecentHashIndex,
          positionNumber
        )
      ) {
        res.status(403).json({ error: "Invalid hash" });
        return;
      }

      // Update the most recent hash and its index
      await prisma.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          mostRecentHash: hash,
          mostRecentHashIndex: positionNumber,
        },
      });

      await handler(req, res);
    } catch (error) {
      console.error("Error verifying payword:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
