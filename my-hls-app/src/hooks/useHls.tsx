// src/hooks/useHls.ts

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { useHashChain } from "@/context/HashChainContext";

const useHls = (src: string) => {
  const { hashChain, popHash } = useHashChain();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          console.log(`hashChainRef: ${JSON.stringify(hashChain)}`);
          if (hashChain.length === 0) {
            console.error("Hash chain is empty");
            return;
          }
          const currentHash = popHash();
          console.log(
            `Sending Payword-Header: ${currentHash}:${hashChain.length + 1}`
          );
          xhr.setRequestHeader(
            "Payword-Header",
            `${currentHash}:${hashChain.length + 1}`
          );
        },
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video
          .play()
          .catch((error) => console.error("Video play failed", error));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Network error encountered:", data);
              // hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error encountered:", data);
              // hls.recoverMediaError();
              break;
            default:
              // hls.destroy();
              console.error("Unrecoverable error encountered:", data);
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("canplay", () => {
        video
          .play()
          .catch((error) => console.error("Video play failed", error));
      });
    }
  }, [src, hashChain[0]]);

  return videoRef;
};

export default useHls;
