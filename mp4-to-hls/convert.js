const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const path = require("path");

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputFilePath = path.join(__dirname, "input.mp4");
const outputDirectory = path.join(__dirname, "hls-output");

function convertToHLS(inputFile, outputDir) {
  ffmpeg(inputFile, { timeout: 432000 })
    .addOptions([
      "-profile:v baseline", // H.264 video codec profile
      "-level 3.0", // H.264 level
      "-start_number 0", // Start segment number
      "-hls_time 10", // Segment length in seconds
      "-hls_list_size 0", // Maximum number of playlist entries (0 = all)
      "-f hls", // Format as HLS
    ])
    .output(path.join(outputDir, "playlist.m3u8"))
    .on("end", () => {
      console.log("HLS conversion finished successfully.");
    })
    .on("error", (err, stdout, stderr) => {
      console.error("Error during conversion:", err.message);
      console.error("ffmpeg stdout:", stdout);
      console.error("ffmpeg stderr:", stderr);
    })
    .run();
}

// Ensure the output directory exists
const fs = require("fs");
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

// Convert the input MP4 file to HLS format
convertToHLS(inputFilePath, outputDirectory);
