"use client";
import React, { useEffect, useState } from "react";
import useHlsPayword from "@/hooks/useHlsPayword";

const VideoPlayer: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const { videoRef, error } = useHlsPayword(playlistUrl);

  useEffect(() => {
    const updatePlaylistUrl = () => {
      if (typeof window !== "undefined") {
        setPlaylistUrl(`${window.location.origin}/api/playlist`);
      }
    };

    updatePlaylistUrl();
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-900 ">
      {playlistUrl && (
        <div className="relative w-full max-w-4xl">
          <video ref={videoRef} controls className="w-full h-full" />
          {error && (
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 text-white p-4">
              <div>
                <h2 className="text-xl font-bold mb-4">Error</h2>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
