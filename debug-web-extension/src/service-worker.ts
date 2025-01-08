/// <reference types="vite-plugin-pwa/client" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

self.addEventListener("fetch", (event: FetchEvent) => {
  const url = new URL(event.request.url);
  console.log(`[Service Worker] Fetch event for: ${url.pathname}`);
});
