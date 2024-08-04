import { useEffect, useRef, useState } from "react";
import { HlsPayword } from "@/lib/HlsPayword";

type TokenProvider = () => { hash: string; index: number } | null;

interface UseHlsPaywordOptions {
  mode: "hashChain" | "tokenProvider";
  hashChain?: string[];
  tokenProvider?: TokenProvider;
}

const useHlsPayword = (src: string, options: UseHlsPaywordOptions) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsPaywordRef = useRef<HlsPayword | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return; // Don't initialize if src is empty

    let getNextToken: TokenProvider;

    if (options.mode === "hashChain" && options.hashChain) {
      let currentIndex = options.hashChain.length - 1;
      console.log("Initial currentIndex:", currentIndex);

      getNextToken = () => {
        if (currentIndex < 0) return null;
        const hash = options.hashChain![currentIndex];
        const index = currentIndex;
        console.log("Returning hash for index:", index);

        currentIndex -= 1;
        return { hash, index };
      };
    } else if (options.mode === "tokenProvider" && options.tokenProvider) {
      getNextToken = options.tokenProvider;
    } else {
      setError("Invalid configuration for HlsPayword");
      return;
    }

    const initializeHlsPayword = () => {
      const video = videoRef.current;
      if (video) {
        hlsPaywordRef.current = new HlsPayword({
          src,
          videoElement: video,
          getNextToken,
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

    destroyHlsPayword();
    initializeHlsPayword();

    return destroyHlsPayword;
  }, [src, options.mode, options.hashChain, options.tokenProvider]);

  return { videoRef, error };
};

export default useHlsPayword;
