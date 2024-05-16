const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to check custom header
function checkCustomHeader(req, res, next) {
  if (req.headers["custom-header"] !== "secretWord") {
    res.status(403).send("Forbidden");
  } else {
    next();
  }
}

// Serve HLS segments with custom header check
app.get("/:segment", checkCustomHeader, (req, res) => {
  const segmentPath = path.join(
    __dirname,
    "mp4-to-hls",
    "hls-output",
    req.params.segment
  );
  res.sendFile(segmentPath);
});

// Serve the master playlist
app.get("/playlist.m3u8", (req, res) => {
  const playlistPath = path.join(
    __dirname,
    "mp4-to-hls",
    "hls-output",
    "playlist.m3u8"
  );
  res.sendFile(playlistPath);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
