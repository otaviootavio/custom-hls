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
    // console.log(`i:${i} currentHash:${currentHash}`);
  }
  // console.log(`position: ${position}`);
  // console.log(`incomingHash: ${incomingHash}`);
  // console.log(`lastHash: ${lastHash}`);
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
          clerkUserId: userId ?? undefined,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (
        !verifyHashChain(hash, user.lastHash, user.chainSize, positionNumber)
      ) {
        res.status(403).json({ error: "Invalid hash" });
        return;
      }

      // Update the last hash and chain size
      // await prisma.user.update({
      //   where: {
      //     clerkUserId: userId ?? undefined,
      //   },
      //   data: {
      //     lastHash: hash,
      //     chainSize: positionNumber - 1,
      //   },
      // });

      await handler(req, res);
    } catch (error) {
      console.error("Error verifying payword:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
