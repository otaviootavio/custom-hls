import React, { useEffect, useState } from "react";
import useHlsPayword from "@/hooks/useHlsPayword";
import { useHashChain } from "@/context/HashChainContext";

const VideoPlayer: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const { hashChain } = useHashChain();
  const [isReady, setIsReady] = useState(false);

  // Only initialize HlsPayword when both playlistUrl and hashChain are available
  const { videoRef, error } = useHlsPayword(isReady ? playlistUrl : "", {
    mode: "hashChain",
    hashChain,
  });

  // Only initialize HlsPayword when both playlistUrl and hashChain are available
  // const { videoRef, error } = useHlsPayword(isReady ? playlistUrl : "", {
  //   mode: "tokenProvider",
  //   hashChain,
  //   tokenProvider: () => {
  //     return { hash: "0x0", index: 0 };
  //   },
  // });

  useEffect(() => {
    const updatePlaylistUrl = () => {
      if (typeof window !== "undefined") {
        setPlaylistUrl(`${window.location.origin}/api/playlist`);
      }
    };
    updatePlaylistUrl();
  }, []);

  // Set isReady to true only when both playlistUrl and hashChain are available
  useEffect(() => {
    if (playlistUrl && hashChain.length > 0) {
      console.log("Initial hash chain length:", hashChain.length);

      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [playlistUrl, hashChain]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center bg-gray-900">
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
    </div>
  );
};

export default VideoPlayer;
