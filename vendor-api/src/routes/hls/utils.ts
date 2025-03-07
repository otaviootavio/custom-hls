// Type for HLS error responses
export type HLSErrorResponse = {
  success: false;
  message: string;
};

// Helper function to get content type based on file extension
export function getContentType(filename: string): string {
  if (filename.endsWith(".m3u8")) return "application/x-mpegURL";
  if (filename.endsWith(".ts")) return "video/MP2T";
  if (filename.match(/\.(jpg|jpeg)$/)) return "image/jpeg";
  if (filename.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

// Helper function to handle the proxy logic
export async function handleProxy(
  c: any,
  streamId: string,
  quality: string | null,
  filename: string
): Promise<Response> {
  try {
    // Construct CDN URL based on whether quality is provided
    const cdnBaseUrl = process.env.CDN_BASE_URL;
    const cdnUrl = quality
      ? `${cdnBaseUrl}/${streamId}/${quality}/${filename}`
      : `${cdnBaseUrl}/${streamId}/${filename}`;

    // Fetch the content from CDN
    const response = await fetch(cdnUrl);

    if (!response.ok) {
      if (response.status === 404) {
        const errorResponse: HLSErrorResponse = {
          success: false,
          message: filename.match(/\.(jpg|jpeg|png)$/)
            ? "Thumbnail not found"
            : "Stream not found",
        };
        return c.json(errorResponse, 404);
      }
      throw new Error(`CDN returned status ${response.status}`);
    }

    // Set content type header
    c.header("Content-Type", getContentType(filename));

    // Set caching headers
    c.header("Cache-Control", "public, max-age=3600");
    c.header("Access-Control-Allow-Origin", "*");
    // Add Cross-Origin-Resource-Policy header
    c.header("Cross-Origin-Resource-Policy", "cross-origin");

    // Stream the response directly to the client
    return new Response(response.body, {
      headers: c.res.headers,
    });
  } catch (error: unknown) {
    console.error("Proxy Error:", error);
    const errorResponse: HLSErrorResponse = {
      success: false,
      message: "Internal server error",
    };
    return c.json(errorResponse, 500);
  }
}
