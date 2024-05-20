"use client";
import React, { useEffect, useState } from "react";
import useHls from "@/hooks/useHls";

const VideoPlayer: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const videoRef = useHls(playlistUrl);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPlaylistUrl(`${window.location.origin}/api/playlist`);
    }
  }, []);

  return (
    <div className="flex items-center bg-gray-900">
      {playlistUrl && (
        <video
          ref={videoRef}
          controls
          className="w-full max-w-2xl border-4 border-gray-700"
        ></video>
      )}
    </div>
  );
};

export default VideoPlayer;
