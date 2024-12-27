// contentScript.ts - Content Script Context
window.addEventListener("message", async (event) => {
  if (event.data && event.data.source === "WEBSITE") {
    const { type, payload } = event.data;

    // Forward to background script
    const response = await chrome.runtime.sendMessage({
      type,
      payload,
    });

    // Send response back to website
    window.postMessage(
      {
        source: "CONTENT_SCRIPT",
        type: `${type}_RESPONSE`,
        payload: response,
      },
      window.location.origin
    );
  }
});
