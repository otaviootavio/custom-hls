import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { useHashChain } from "@/context/HashChainContext";
import keccak from "keccak";

const useHls = (src: string) => {
  const { hashChain } = useHashChain();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    let currentHashIndex = hashChain.length - 1;

    // Function to compute the hash based on the index and initial hash
    const computeHash = (hashIndex: number, hashZero: string): string => {
      let currentHash = hashZero;
      for (let i = 0; i < hashIndex; i++) {
        currentHash = keccak("keccak256")
          .update(Buffer.from(currentHash, "utf-8"))
          .digest("hex");
      }
      return currentHash;
    };

    // Function to get the next hash from the hash chain
    const getNextHash = (): string | null => {
      if (currentHashIndex < 0) {
        return null;
      }
      const computedHash = computeHash(currentHashIndex, hashChain[0]);
      currentHashIndex -= 1;
      return computedHash;
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          const computedHash = getNextHash();

          if (!computedHash) {
            console.error("Hash chain is exhausted");
            return;
          }
          xhr.setRequestHeader(
            "Payword-Header",
            `${computedHash}:${currentHashIndex + 2}`
          );
        },
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error encountered:", data);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error encountered:", data);
              break;
            default:
              console.error("Unrecoverable error encountered:", data);
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [src, hashChain]);

  return videoRef;
};

export default useHls;
