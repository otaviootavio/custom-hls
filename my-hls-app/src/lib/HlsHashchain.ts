import Hls, { ErrorData, Events } from "hls.js";

interface HlsHashchainProps {
  src: string;
  videoElement: HTMLVideoElement;
  hashChain: string[];
  onError: (errorMessage: string) => void;
  onSuccess: () => void;
}

export class HlsHashchain {
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
  }: HlsHashchainProps) {
    this.currentHashIndex = hashChain.length - 1;
    this.hashChain = hashChain;
    this.onError = onError;
    this.onSuccess = onSuccess;

    if (Hls.isSupported()) {
      this.initializeHls(src, videoElement);
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      this.setupNativeHls(src, videoElement);
    } else {
      this.onError("HLS is not supported by this browser.");
    }
  }

  private initializeHls(src: string, videoElement: HTMLVideoElement) {
    this.hls = new Hls({
      debug: true,
      xhrSetup: (xhr, url) => {
        this.setupXhr(xhr, url);
      },
    });

    this.hls.on(Hls.Events.ERROR, this.handleHlsError.bind(this));
    this.hls.on(Hls.Events.MANIFEST_PARSED, this.onSuccess);

    this.hls.loadSource(src);
    this.hls.attachMedia(videoElement);
  }

  private setupXhr(xhr: XMLHttpRequest, url: string) {
    xhr.withCredentials = true;
    xhr.open("GET", url, true);
    const computedHash = this.getNextHash();

    if (!computedHash) {
      // this.onError("Hash chain is exhausted");
      return;
    }

    xhr.setRequestHeader(
      "Payword-Header",
      `${computedHash}:${this.currentHashIndex + 1}`
    );
  }

  private setupNativeHls(src: string, videoElement: HTMLVideoElement) {
    videoElement.src = src;
    videoElement.addEventListener("loadedmetadata", this.onSuccess);
  }

  private handleHlsError(event: Events, data: ErrorData) {
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
      // this.onError(errorMessage);
    } else {
      console.warn("Non-fatal error encountered:", data);
    }
  }

  private getNextHash(): string | null {
    if (this.currentHashIndex < 0) {
      return null;
    }
    const computedHash = this.hashChain[this.currentHashIndex];
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
