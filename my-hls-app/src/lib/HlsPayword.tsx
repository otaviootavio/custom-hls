import Hls from "hls.js";
import keccak from "keccak";

interface HlsPaywordProps {
  src: string;
  videoElement: HTMLVideoElement;
  hashChain: string[];
  onError: (errorMessage: string) => void;
  onSuccess: () => void;
}

export class HlsPayword {
  private hls: Hls | null = null;
  private currentHashIndex: number;
  private hashChain: string[];
  private onError: (errorMessage: string) => void;
  private onSuccess: () => void;

  constructor({
    src,
    videoElement,
    hashChain,
    onError,
    onSuccess,
  }: HlsPaywordProps) {
    this.currentHashIndex = hashChain.length - 1;
    this.hashChain = hashChain;
    this.onError = onError;
    this.onSuccess = onSuccess;

    if (Hls.isSupported()) {
      this.hls = new Hls({
        debug: true,
        xhrSetup: (xhr, url) => {
          xhr.withCredentials = true;

          xhr.open("GET", url, true);
          const computedHash = this.getNextHash();

          if (!computedHash) {
            console.error("Hash chain is exhausted");
            this.onError("Hash chain is exhausted");
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
          let errorMessage = "An unrecoverable error occurred";
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              errorMessage = `Network error encountered: ${data.error}`;
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              errorMessage = `Media error encountered: ${data.details}`;
              break;
            default:
              errorMessage = `An unknown error occurred: ${data.details}`;
              break;
          }
          console.error(errorMessage, data);
          this.onError(errorMessage);
        } else {
          console.warn("Non-fatal error encountered:", data);
        }
      });

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.onSuccess();
      });

      this.hls.loadSource(src);
      this.hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = src;
      videoElement.addEventListener("loadedmetadata", () => {
        this.onSuccess();
      });
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

  public destroy() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }
}
