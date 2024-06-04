import Hls from "hls.js";
import keccak from "keccak";

interface HlsPaywordProps {
  src: string;
  videoElement: HTMLVideoElement;
  hashChain: string[];
}

export class HlsPayword {
  private hls: Hls | null = null;
  private currentHashIndex: number;
  private hashChain: string[];

  constructor({ src, videoElement, hashChain }: HlsPaywordProps) {
    this.currentHashIndex = hashChain.length - 1;
    this.hashChain = hashChain;

    if (Hls.isSupported()) {
      this.hls = new Hls({
        debug: true,
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = true;

          xhr.open("GET", url, true);
          const computedHash = this.getNextHash();

          if (!computedHash) {
            console.error("Hash chain is exhausted");
            return;
          }
          xhr.setRequestHeader(
            "Payword-Header",
            `${computedHash}:${this.currentHashIndex + 2}`
          );
        },
      });

      this.hls.on(Hls.Events.ERROR, (event, data) => {
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

      this.hls.loadSource(src);
      this.hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = src;
    }
  }

  private computeHash(hashIndex: number, hashZero: string): string {
    let currentHash = hashZero;
    for (let i = 0; i < hashIndex; i++) {
      currentHash = keccak("keccak256")
        .update(Buffer.from(currentHash, "utf-8"))
        .digest("hex");
    }
    return currentHash;
  }

  private getNextHash(): string | null {
    if (this.currentHashIndex < 0) {
      return null;
    }
    const computedHash = this.computeHash(
      this.currentHashIndex,
      this.hashChain[0]
    );
    this.currentHashIndex -= 1;
    return computedHash;
  }

  // public destroy() {
  //   if (this.hls) {
  //     this.hls.destroy();
  //     this.hls = null;
  //   }
  // }
}
