import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from "zod";
import { paymentMiddleware } from '../../middlewares/paymentMiddleware';
import { handleProxy, type HLSErrorResponse } from './utils';

// Schemas
const hlsErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

// File pattern validation for video files
const videoFilePattern = /^.*\.(m3u8|ts)$/;

export const qualityHlsRouter = new OpenAPIHono();

// Quality-specific HLS stream route
const getQualityHLSStreamRoute = createRoute({
  method: "get",
  path: "/stream/{streamId}/{quality}/{filename}",
  tags: ["HLS"],
  summary: "Get quality-specific HLS stream",
  description: "Retrieve video content for a specific quality level of an HLS stream",
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

// Quality-specific route handler
qualityHlsRouter.openapi(getQualityHLSStreamRoute, async (c) => {
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

export default qualityHlsRouter;