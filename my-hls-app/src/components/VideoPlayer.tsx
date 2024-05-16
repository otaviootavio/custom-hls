import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  secretWord: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ secretWord }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        const hls = new Hls({
          xhrSetup: (xhr, url) => {
            xhr.setRequestHeader("Custom-Header", secretWord);
          },
        });
        hls.loadSource("http://localhost:3000/api/playlist");
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = "http://localhost:3000/playlist.m3u8";
        video.addEventListener("canplay", () => {
          video.play();
        });
      }
    }
  }, [secretWord]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <video
        ref={videoRef}
        controls
        className="w-full max-w-2xl border-4 border-gray-700"
      ></video>
    </div>
  );
};

export default VideoPlayer;
