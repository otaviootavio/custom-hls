import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import { handleProxy, type HLSErrorResponse } from './utils';

// Schemas
const hlsErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

export const thumbnailRouter = new OpenAPIHono();

// Thumbnail route
const getThumbnailRoute = createRoute({
  method: "get",
  path: "/stream/{streamId}/thumbnail.{ext}",
  tags: ["HLS"],
  summary: "Get stream thumbnail",
  description: "Retrieve the thumbnail image for a specific stream",
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

// Thumbnail route handler
thumbnailRouter.openapi(getThumbnailRoute, async (c) => {
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

export default thumbnailRouter;