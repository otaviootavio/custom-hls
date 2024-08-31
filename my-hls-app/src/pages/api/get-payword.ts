// pages/api/get-payword.ts

import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const auth = getAuth(req);
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

    res.status(200).json({
      lastHash: user.lastHash,
      chainSize: user.chainSize,
      mostRecentHash: user.mostRecentHash,
      mostRecentHashIndex: user.mostRecentHashIndex,
      chainId: user.chainId,
      smartContractAddress: user.smartContractAddress,
      amount: user.amount,
    });
  } catch (error) {
    console.error("Error retrieving payword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
