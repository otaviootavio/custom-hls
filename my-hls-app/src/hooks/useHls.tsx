import { useEffect, useRef } from "react";
import Hls from "hls.js";

const useHls = (src: string, password: number) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const keyRef = useRef<number>(password);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    keyRef.current = password;
    const video = videoRef.current;

    if (!video) return;

    // Cleanup existing HLS instance if it exists
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          xhr.setRequestHeader("Password-Header", `${keyRef.current}`);
          keyRef.current += 7;
        },
      });

      hlsRef.current = hls; // Store the Hls instance

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
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Media error encountered:", data);
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
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

    // return () => {
    //   if (hlsRef.current) {
    //     hlsRef.current.destroy();
    //     hlsRef.current = null;
    //   }
    // };
  }, [src, password]);

  return videoRef;
};

export default useHls;
