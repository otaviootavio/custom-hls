import { useHashChain } from "@/context/HashChainContext";
import { HlsPayword } from "@/lib/HlsPayword";
import { useEffect, useRef, useState } from "react";

const useHlsPayword = (src: string) => {
  const { hashChain } = useHashChain();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsPaywordRef = useRef<HlsPayword | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      hlsPaywordRef.current = new HlsPayword({
        src,
        videoElement: video,
        hashChain,
        onError: (errorMessage: string) => setError(errorMessage),
        onSuccess: () => setError(null),
      });
    }

    return () => {
      if (hlsPaywordRef.current) {
        hlsPaywordRef.current.destroy();
        hlsPaywordRef.current = null;
      }
    };
  }, [src, hashChain[0], hashChain.length]);

  return { videoRef, error };
};

export default useHlsPayword;
