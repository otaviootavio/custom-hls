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
    const extension = path.extname(segmentPath);
    let contentType = "application/octet-stream";

    switch (extension) {
      case ".ts":
        contentType = "video/MP2T";
        break;
      case ".m3u8":
        contentType = "application/vnd.apple.mpegurl";
        break;
    }

    res.setHeader("Content-Type", contentType);
    res.send(data);
  } catch (error) {
    res.status(404).send("Segment not found");
  }
}
