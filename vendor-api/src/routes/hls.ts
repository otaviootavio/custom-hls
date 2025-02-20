import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import { paymentMiddleware } from '../middlewares/paymentMiddleware';

// Types
type HLSErrorResponse = {
  success: false;
  message: string;
};

// Schemas
const hlsErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

// File pattern validation
// Define allowed file patterns
const videoFilePattern = /^.*\.(m3u8|ts)$/;
const imageFilePattern = /^.*\.(jpg|jpeg|png)$/;
const allFilePattern = /^.*\.(m3u8|ts|jpg|jpeg|png)$/;

export const hlsRouter = new OpenAPIHono();

// Basic HLS stream route
const getHLSStreamRoute = createRoute({
  method: "get",
  path: "/stream/{streamId}/{filename}",
  request: {
    params: z.object({
      streamId: z.string(),
      filename: z.string().regex(allFilePattern),
    }),
  },
  responses: {
    200: {
      content: {
        "application/x-mpegURL": {
          schema: z.any(),
        },
        "video/MP2T": {
          schema: z.any(),
        },
      },
      description: "Stream content",
    },
    400: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Invalid stream ID or filename",
    },
    404: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Stream not found",
    },
    500: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Thumbnail route
const getThumbnailRoute = createRoute({
  method: "get",
  path: "/stream/{streamId}/thumbnail.{ext}",
  request: {
    params: z.object({
      streamId: z.string(),
      ext: z.string().regex(/^(jpg|jpeg|png)$/),
    }),
  },
  responses: {
    200: {
      content: {
        "image/jpeg": {
          schema: z.any(),
        },
        "image/png": {
          schema: z.any(),
        },
      },
      description: "Thumbnail image",
    },
    400: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Invalid stream ID or file extension",
    },
    404: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Thumbnail not found",
    },
    500: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Quality-specific HLS stream route
const getQualityHLSStreamRoute = createRoute({
  method: "get",
  path: "/stream/{streamId}/{quality}/{filename}",
  middleware: [paymentMiddleware],
  request: {
    params: z.object({
      streamId: z.string(),
      quality: z.string(),
      filename: z.string().regex(videoFilePattern),
    }),
  },
  responses: {
    200: {
      content: {
        "application/x-mpegURL": {
          schema: z.any(),
        },
        "video/MP2T": {
          schema: z.any(),
        },
      },
      description: "Quality-specific stream content",
    },
    400: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Invalid stream ID, quality, or filename",
    },
    404: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Stream not found",
    },
    500: {
      content: {
        "application/json": {
          schema: hlsErrorResponse,
        },
      },
      description: "Internal server error",
    },
  },
});

// Helper function to get content type
function getContentType(filename: string): string {
  if (filename.endsWith(".m3u8")) return "application/x-mpegURL";
  if (filename.endsWith(".ts")) return "video/MP2T";
  if (filename.match(/\.(jpg|jpeg)$/)) return "image/jpeg";
  if (filename.endsWith(".png")) return "image/png";
  return "application/octet-stream";
}

// Helper function to handle the proxy logic
async function handleProxy(
  c: any,
  streamId: string,
  quality: string | null,
  filename: string
) {
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
          message: filename.match(imageFilePattern)
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

// Basic route handler
hlsRouter.openapi(getHLSStreamRoute, async (c) => {
  try {
    const { streamId, filename } = c.req.valid("param");
    return await handleProxy(c, streamId, null, filename);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorResponse: HLSErrorResponse = {
        success: false,
        message: "Invalid stream ID or filename",
      };
      return c.json(errorResponse, 400);
    }
    throw error;
  }
});

// Thumbnail route handler
hlsRouter.openapi(getThumbnailRoute, async (c) => {
  try {
    const { streamId, ext } = c.req.valid("param");
    return await handleProxy(c, streamId, null, `thumbnail.${ext}`);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorResponse: HLSErrorResponse = {
        success: false,
        message: "Invalid stream ID or file extension",
      };
      return c.json(errorResponse, 400);
    }
    throw error;
  }
});

// Quality-specific route handler
hlsRouter.openapi(getQualityHLSStreamRoute, async (c) => {
  try {
    const { streamId, quality, filename } = c.req.valid("param");
    return await handleProxy(c, streamId, quality, filename);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorResponse: HLSErrorResponse = {
        success: false,
        message: "Invalid stream ID, quality, or filename",
      };
      return c.json(errorResponse, 400);
    }
    throw error;
  }
});

// Error handling
hlsRouter.notFound((c) => {
  const errorResponse: HLSErrorResponse = {
    success: false,
    message: "Route not found",
  };
  return c.json(errorResponse, 404);
});

hlsRouter.onError((err, c) => {
  console.error("Server error:", err);
  const errorResponse: HLSErrorResponse = {
    success: false,
    message: "Internal server error",
  };
  return c.json(errorResponse, 500);
});

export default hlsRouter;
