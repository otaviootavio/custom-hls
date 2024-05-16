import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const playlistPath = path.join(process.cwd(), "hls", "playlist.m3u8");

  try {
    const data = await fs.readFile(playlistPath);
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(data);
  } catch (error) {
    res.status(404).send("File not found");
  }
}
