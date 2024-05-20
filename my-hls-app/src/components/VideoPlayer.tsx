import React from "react";
import useHls from "@/hooks/useHls";

const VideoPlayer: React.FC = () => {
  const videoRef = useHls("http://localhost:3000/api/playlist");

  return (
    <div className="flex items-center bg-gray-900">
      <video
        ref={videoRef}
        controls
        className="w-full max-w-2xl border-4 border-gray-700"
      ></video>
    </div>
  );
};

export default VideoPlayer;
