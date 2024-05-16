import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const segmentPath = path.join(
    process.cwd(),
    "hls-output",
    req.query.segment as string
  );

  fs.readFile(segmentPath, (err, data) => {
    if (err) {
      res.status(404).send("Segment not found");
      return;
    }
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
  });
}
