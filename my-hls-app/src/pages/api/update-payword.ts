import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    res.status(403).json({ error: "User not authenticated" });
    return;
  }

  const { hash, position } = req.body;

  if (!hash || typeof position !== "number") {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  try {
    // Try to find the user in the database
    let user = await prisma.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    // If the user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          lastHash: hash,
          chainSize: position,
        },
      });
    } else {
      // If the user exists, update the user record
      user = await prisma.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          lastHash: hash,
          chainSize: position,
        },
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating or creating payword:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
