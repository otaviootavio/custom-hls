import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import keccak from "keccak";

const prisma = new PrismaClient();

const hashKeccak = (input: string): string => {
  return keccak("keccak256").update(Buffer.from(input, "utf-8")).digest("hex");
};

const verifyHashChain = (
  incomingHash: string,
  incommingHashIndex: number,
  lastHashReceived: string,
  lastHashReceivedIndex: number
): boolean => {
  let calculatedHash = incomingHash;
  let numberOfInterations = lastHashReceivedIndex - incommingHashIndex;

  for (let i = 0; i < numberOfInterations; i++) {
    calculatedHash = hashKeccak(calculatedHash);
  }
  console.log("calculatedHash", calculatedHash);
  console.log("incomingHash", incomingHash);
  console.log("incommingHashIndex", incommingHashIndex);
  console.log("lastHashReceived", lastHashReceived);
  console.log("lastHashReceivedIndex", lastHashReceivedIndex);

  return calculatedHash === lastHashReceived;
};

export const withPayword = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const customHeader = req.headers["payword-header"];
    const auth = getAuth(req);

    if (!customHeader) {
      res.status(403).json({ error: "Missing payword header" });
      return;
    }

    const [incomingHash, incomingHashIndexHeader] = (
      customHeader as string
    ).split(":");

    const incomingHashIndex = parseInt(incomingHashIndexHeader);

    if (!incomingHash || isNaN(incomingHashIndex)) {
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

      const lastHashReceived = user.mostRecentHash ?? "";
      const lastHashReceivedIndex = user.mostRecentHashIndex ?? 0;

      if (lastHashReceived === "" || lastHashReceivedIndex === 0) {
        res.status(403).json({ error: "Invalid user hash chain" });
        return;
      }

      if (incomingHashIndex === lastHashReceivedIndex) {
        res.status(403).json({
          error: "Incoming hash index cannot be the last hash index received",
        });
        return;
      }

      if (
        !verifyHashChain(
          incomingHash,
          incomingHashIndex,
          lastHashReceived,
          lastHashReceivedIndex
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
          mostRecentHash: incomingHash,
          mostRecentHashIndex: incomingHashIndex,
        },
      });

      await handler(req, res);
    } catch (error) {
      console.error("Error verifying payword:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};
