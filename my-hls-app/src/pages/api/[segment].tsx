import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs/promises";
import { withPayword } from "@/middlewares/withPayword";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { segment } = req.query;

  try {
    switch (segment) {
      case "playlist":
        const playlistPath = path.join(process.cwd(), "hls", "playlist.m3u8");
        const playlistData = await fs.readFile(playlistPath);
        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        res.send(playlistData);
        break;
      default:
        const segmentPath = path.join(process.cwd(), "hls", segment as string);
        const segmentData = await fs.readFile(segmentPath);
        res.setHeader("Content-Type", "video/MP2T");
        res.send(segmentData);
        break;
    }
  } catch (error) {
    res.status(404).json({ error: "File not found" });
  }
};

export default withPayword(handler);
