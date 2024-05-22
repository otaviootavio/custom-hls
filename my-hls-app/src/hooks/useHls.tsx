import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useHashChain } from "@/context/HashChainContext";

const useHls = (src: string) => {
  const { hashChain } = useHashChain();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [localHashChain, setLocalHashChain] = useState<string[]>([]);

  useEffect(() => {
    // Initialize the local hash chain when the component mounts
    setLocalHashChain([...hashChain]);
  }, [hashChain]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          if (localHashChain.length === 0) {
            console.error("Local hash chain is empty");
            return;
          }
          const currentHash = localHashChain.pop();
          setLocalHashChain([...localHashChain]);
          // console.log(
          //   `Sending Payword-Header: ${currentHash}:${
          //     localHashChain.length + 1
          //   }`
          // );
          xhr.setRequestHeader(
            "Payword-Header",
            `${currentHash}:${localHashChain.length + 1}`
          );
        },
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      // hls.on(Hls.Events.MANIFEST_PARSED, () => {
      //   video
      //     .play()
      //     .catch((error) => console.error("Video play failed", error));
      // });

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
      // video.addEventListener("canplay", () => {
      //   video
      //     .play()
      //     .catch((error) => console.error("Video play failed", error));
      // });
    }
  }, [src, localHashChain[0]]);

  return videoRef;
};

export default useHls;
