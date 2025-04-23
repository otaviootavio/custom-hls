import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import { handleProxy, type HLSErrorResponse } from './utils';

// Schemas
const hlsErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

// File pattern validation
const allFilePattern = /^.*\.(m3u8|ts|jpg|jpeg|png)$/;

export const basicHlsRouter = new OpenAPIHono();

// Basic HLS stream route
const getHLSStreamRoute = createRoute({
  method: "get",
  path: "/stream/{streamId}/{filename}",
  tags: ["HLS"],
  summary: "Get basic HLS stream",
  description: "Retrieve basic HLS stream content without quality specification",
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

// Basic route handler
basicHlsRouter.openapi(getHLSStreamRoute, async (c) => {
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

export default basicHlsRouter;