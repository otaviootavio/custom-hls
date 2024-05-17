import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const segmentPath = path.join(
    process.cwd(),
    "hls",
    req.query.segment as string
  );

  try {
    const data = await fs.readFile(segmentPath);
    res.setHeader("Content-Type", "video/MP2T");
    res.send(data);
  } catch (error) {
    res.status(404).send("Segment not found");
  }
}
