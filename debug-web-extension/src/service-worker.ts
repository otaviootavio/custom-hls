/// <reference types="vite-plugin-pwa/client" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const channel = new BroadcastChannel("fetch-intercept-channel");

self.addEventListener("install", (event) => {
  console.log("SW: Installing...", event);
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("SW: Activated", event);
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);
  const baseUrl = new URL(import.meta.env.VITE_CDN_BASE_URL);

  
  if (url.href.startsWith(baseUrl.href)) {
    console.log(
      "[Page Service Worker]: Intercepting request",
      event.request.url
    );

    event.respondWith(
      (async () => {
        try {
          const message = {
            type: "GET_NEXT_REQUEST_HEADER_FROM_BACKGROUND",
            timestamp: Date.now(),
          };

          channel.postMessage(message);
          console.log("[Page Service Worker]: Sent intercept request", message);

          const response = await new Promise<{
            hashchainId: string;
            nextHash: string;
          }>((resolve) => {
            channel.onmessage = (event) => {
              const { type, data } = event.data;
              if (type === "INTERCEPT_RESPONSE") {
                resolve(data); // This resolves to { hashchainId, nextHash }
              }
            };
          });

          if (!response.nextHash) {
            console.error("SW: No next hash received from background");
            return new Response(
              JSON.stringify({ error: "No next hash received" }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }

          const existingHeaders = Object.fromEntries(
            event.request.headers.entries()
          );
          const fetchResponse = await fetch(event.request, {
            headers: {
              ...existingHeaders,
              "X-Hash": response.nextHash
            },
          });

          // Get content type from response
          const contentType = fetchResponse.headers.get("Content-Type") || "";

          // Handle different content types
          if (contentType.includes("application/json")) {
            // For JSON responses
            const jsonData = await fetchResponse.json();
            return new Response(JSON.stringify(jsonData), {
              status: fetchResponse.status,
              statusText: fetchResponse.statusText,
              headers: fetchResponse.headers,
            });
          } else if (
            url.pathname.endsWith(".m3u8") ||
            contentType.includes("application/vnd.apple.mpegurl")
          ) {
            // For M3U8 files
            const playlist = await fetchResponse.text();
            return new Response(playlist, {
              status: fetchResponse.status,
              statusText: fetchResponse.statusText,
              headers: new Headers({
                ...Object.fromEntries(fetchResponse.headers.entries()),
                "Content-Type": "application/vnd.apple.mpegurl",
              }),
            });
          } else {
            // For other content types (binary data, etc.)
            return fetchResponse;
          }
        } catch (error) {
          console.error("SW: Error intercepting request", error);
          return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      })()
    );
  }
});
