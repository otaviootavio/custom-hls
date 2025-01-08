/// <reference types="vite-plugin-pwa/client" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope & typeof globalThis;

const channel = new BroadcastChannel("fetch-intercept-channel");

// Listen for fetch events
self.addEventListener("fetch", async (event) => {
  const url = new URL(event.request.url);

  // TODO
  // CHANGE WITH YOUR OWN URL
  // Check if this is the specific request we want to intercept
  if (url.pathname.startsWith("/todos/1")) {
    event.respondWith(
      (async () => {
        try {
          const message = {
            type: "GET_NEXT_REQUEST_HEADER_FROM_BACKGROUND",
            timestamp: Date.now(),
          };

          channel.postMessage(message);
          console.log("SW: Sent intercept request", message);

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

          const existingHeaders = Object.fromEntries(
            event.request.headers.entries()
          );
          const fetchResponse = await fetch(event.request, {
            headers: {
              ...existingHeaders,
              "X-Hash": response.nextHash, // Changed from nextHeader.nextHash
            },
          });

          const responseData = await fetchResponse.clone().json();
          
          return new Response(JSON.stringify(responseData), {
            headers: { "Content-Type": "application/json" },
          });
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
