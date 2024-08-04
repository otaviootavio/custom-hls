import Hls, { ErrorData, Events } from "hls.js";

interface HlsPaywordProps {
  src: string;
  videoElement: HTMLVideoElement;
  getNextToken: () => { hash: string; index: number } | null;
  onError: (errorMessage: string) => void;
  onSuccess: () => void;
}

export class HlsPayword {
  private hls: Hls | null = null;
  private getNextToken: () => { hash: string; index: number } | null;
  private onError: (errorMessage: string) => void;
  private onSuccess: () => void;

  constructor({
    src,
    videoElement,
    getNextToken,
    onError,
    onSuccess,
  }: HlsPaywordProps) {
    this.getNextToken = getNextToken;
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
      xhrSetup: this.setupXhr.bind(this),
    });

    this.hls.on(Hls.Events.ERROR, this.handleHlsError.bind(this));
    this.hls.on(Hls.Events.MANIFEST_PARSED, this.onSuccess);

    this.hls.loadSource(src);
    this.hls.attachMedia(videoElement);
  }

  private setupXhr(xhr: XMLHttpRequest, url: string) {
    const token = this.getNextToken();
    if (!token) {
      console.warn("Token is not available");
      return;
    }
    xhr.setRequestHeader("payword-header", `${token.hash}:${token.index}`);
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
          errorMessage = `Network error encountered: ${data.details}`;
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
  }

  public destroy() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
  }
}
