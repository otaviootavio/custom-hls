const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const path = require("path");
const fs = require("fs");

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

function convertToHLS(inputFile, outputDir) {
  ffmpeg(inputFile, { timeout: 432000 })
    .addOptions([
      "-profile:v baseline", // H.264 video codec profile
      "-level 3.0", // H.264 level
      "-start_number 0", // Start segment number
      "-hls_time 2", // Segment length in seconds
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

// Get the input and output paths from the command line arguments
const args = process.argv.slice(2);
const inputFilePath = args[0];
const outputDirectory = args[1];

if (!inputFilePath || !outputDirectory) {
  console.error(
    "Please provide both the input file path and output directory."
  );
  process.exit(1);
}

// Ensure the output directory exists
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

// Convert the input MP4 file to HLS format
convertToHLS(inputFilePath, outputDirectory);
