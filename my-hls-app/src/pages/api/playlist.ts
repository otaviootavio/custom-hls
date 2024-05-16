import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const playlistPath = path.join(process.cwd(), "hls-output", "playlist.m3u8");

  fs.readFile(playlistPath, (err, data) => {
    if (err) {
      res.status(404).send("File not found");
      return;
    }
    res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
    res.send(data);
  });
}
