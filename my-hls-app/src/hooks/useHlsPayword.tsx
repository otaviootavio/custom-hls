import { useHashChain } from "@/context/HashChainContext";
import { HlsPayword } from "@/lib/HlsPayword";
import { useEffect, useRef, useState } from "react";

const useHlsPayword = (src: string) => {
  const { hashChain } = useHashChain();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsPaywordRef = useRef<HlsPayword | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeHlsPayword = () => {
      const video = videoRef.current;
      if (video) {
        hlsPaywordRef.current = new HlsPayword({
          src,
          videoElement: video,
          hashChain,
          onError: handleError,
          onSuccess: handleSuccess,
        });
      }
    };

    const destroyHlsPayword = () => {
      if (hlsPaywordRef.current) {
        hlsPaywordRef.current.destroy();
        hlsPaywordRef.current = null;
      }
    };

    const handleError = (errorMessage: string) => setError(errorMessage);
    const handleSuccess = () => setError(null);

    initializeHlsPayword();
    return destroyHlsPayword;
  }, [src, hashChain]);

  return { videoRef, error };
};

export default useHlsPayword;
