import { useHashChainContext } from "@/context/HashChainContext";
import { HlsHashchain } from "@/lib/HlsHashchain";
import { useEffect, useRef, useState } from "react";

const useHlsHashchain = (src: string) => {
  const { hashChain } = useHashChainContext();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsHashchainRef = useRef<HlsHashchain | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeHlsHashchain = () => {
      const video = videoRef.current;
      if (video) {
        hlsHashchainRef.current = new HlsHashchain({
          src,
          videoElement: video,
          hashChain,
          onError: handleError,
          onSuccess: handleSuccess,
        });
      }
    };

    const destroyHlsPayword = () => {
      if (hlsHashchainRef.current) {
        hlsHashchainRef.current.destroy();
        hlsHashchainRef.current = null;
      }
    };

    const handleError = (errorMessage: string) => setError(errorMessage);
    const handleSuccess = () => setError(null);

    initializeHlsHashchain();
    return destroyHlsPayword;
  }, [src, hashChain]);

  return { videoRef, error };
};

export default useHlsHashchain;
